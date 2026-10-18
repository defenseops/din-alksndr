import { useEffect, useRef, useState } from 'react';
import { adminApi } from './adminApi';
import { resolvePhotoUrl } from '../content/photoUrl';
import { SortableBoard, SortableList, SortableItem } from './sortable';
import { stopDrag, moveItem } from './sortableUtils';
import styles from './Admin.module.css';
// Раскладка превью берётся из стилей самих галерей сайта — админка показывает фото
// ровно так, как они встанут на странице, на том же устройстве (те же медиа-запросы).
import weddingsGallery from '../components/GalleryBlock.module.css';
import corporateGallery from '../components/CorporateGallery.module.css';

const ROW1 = 'corporate_gallery_row1';
const ROW2 = 'corporate_gallery_row2';

// Между разделами переносить можно только ряды корпоративов друг в друга.
const isCorpRow = (s) => s === ROW1 || s === ROW2;
const canMove = (from, to) => from === to || (isCorpRow(from) && isCorpRow(to));

function UploadButton({ section, label = '+ загрузить фото', onUploaded }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFiles = async (files) => {
    setError('');
    setLoading(true);
    try {
      for (const file of files) {
        const photo = await adminApi.uploadPhoto(section, file);
        onUploaded(photo);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className={styles.uploadLabel}>
        {loading ? 'Загружаю...' : label}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={loading}
          onChange={(e) => e.target.files.length && handleFiles(e.target.files)}
        />
      </label>
      {error && <p className={styles.formError}>{error}</p>}
    </div>
  );
}

// Номер и кнопки поверх фото.
function PhotoControls({ photo, index, count, section, onMove, onToggleWide, onDelete }) {
  return (
    <>
      <span className={styles.orderBadge}>{index + 1}</span>
      <div className={styles.photoToolbar} {...stopDrag}>
        <button className={styles.toolBtn} onClick={() => onMove(photo.id, section, 0)} disabled={index === 0} title="В начало">⇤</button>
        <button className={styles.toolBtn} onClick={() => onMove(photo.id, section, 'end')} disabled={index === count - 1} title="В конец">⇥</button>
        {(section === ROW1 || section === ROW2) && (
          <button
            className={styles.toolBtn}
            onClick={() => onMove(photo.id, section === ROW1 ? ROW2 : ROW1, 'end')}
            title={section === ROW1 ? 'Перенести в нижний ряд' : 'Перенести в верхний ряд'}
          >
            {section === ROW1 ? '↓ ряд' : '↑ ряд'}
          </button>
        )}
        {section === ROW1 && (
          <button
            className={`${styles.toolBtn} ${photo.wide ? styles.toolBtnOn : ''}`}
            onClick={() => onToggleWide(photo.id, !photo.wide)}
            title="Широкое фото"
          >
            wide
          </button>
        )}
        <button className={styles.toolBtnDanger} onClick={() => onDelete(photo.id)} title="Удалить">✕</button>
      </div>
    </>
  );
}

export default function PhotosTab() {
  const [photos, setPhotos] = useState({});
  const [loading, setLoading] = useState(true);

  const reload = () => adminApi.getPhotos().then((data) => {
    setPhotos(data);
    setLoading(false);
  });

  useEffect(() => { reload(); }, []);

  const list = (section) => photos[section] || [];

  const saveOrder = async (next, sections, before) => {
    try {
      const payload = {};
      sections.forEach((s) => { payload[s] = (next[s] || []).map((p) => p.id); });
      await adminApi.savePhotoOrder(payload);
    } catch (err) {
      alert(`Не удалось сохранить порядок: ${err.message}`);
      setPhotos(before);
      reload();
    }
  };

  const handleMove = (id, toSection, toIndex) => {
    const before = photos;
    const fromSection = Object.keys(photos).find((k) => photos[k].some((p) => p.id === id));
    const next = moveItem(photos, id, toSection, toIndex);
    setPhotos(next);
    saveOrder(next, [...new Set([fromSection, toSection])], before);
  };

  const handleUploaded = (section, photo) => {
    setPhotos((p) => ({ ...p, [section]: [...(p[section] || []), photo] }));
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить это фото?')) return;
    try {
      await adminApi.deletePhoto(id);
      setPhotos((p) => Object.fromEntries(Object.entries(p).map(([k, v]) => [k, v.filter((x) => x.id !== id)])));
    } catch (err) {
      alert(`Не удалось удалить фото: ${err.message}`);
    }
  };

  const handleToggleWide = async (id, wide) => {
    try {
      await adminApi.toggleWidePhoto(id, wide);
      setPhotos((p) => ({ ...p, [ROW1]: list(ROW1).map((x) => (x.id === id ? { ...x, wide } : x)) }));
    } catch (err) {
      alert(`Не удалось сохранить: ${err.message}`);
    }
  };

  if (loading) return <p>Загрузка...</p>;

  const controls = (photo, i, section) => (
    <PhotoControls
      photo={photo}
      index={i}
      count={list(section).length}
      section={section}
      onMove={handleMove}
      onToggleWide={handleToggleWide}
      onDelete={handleDelete}
    />
  );

  const img = (photo, className) => (
    <img src={resolvePhotoUrl(photo.file_path)} alt="" className={className} draggable={false} />
  );

  return (
    <SortableBoard
      lists={photos}
      setLists={setPhotos}
      canMove={canMove}
      onCommit={saveOrder}
      renderOverlay={(photo) => img(photo, styles.overlayImg)}
    >
      <p className={styles.hint}>
        Перетащите фото мышкой или долгим нажатием пальца, чтобы поменять порядок.
        Галерея показана так, как она выглядит на сайте на этом устройстве.
      </p>

      <div className={styles.sectionBlock}>
        <h2 className={styles.sectionHeading}>Свадьбы — галерея</h2>
        <div className={`${styles.preview} ${styles.previewLight}`}>
          <SortableList id="weddings_gallery" items={list('weddings_gallery')} className={weddingsGallery.grid}>
            {list('weddings_gallery').map((p, i) => (
              <SortableItem key={p.id} id={p.id} className={`${weddingsGallery.item} ${weddingsGallery.visible}`}>
                {img(p, weddingsGallery.img)}
                {controls(p, i, 'weddings_gallery')}
              </SortableItem>
            ))}
          </SortableList>
        </div>
        <UploadButton section="weddings_gallery" onUploaded={(p) => handleUploaded('weddings_gallery', p)} />
      </div>

      <div className={styles.sectionBlock}>
        <h2 className={styles.sectionHeading}>Корпоративы — галерея</h2>
        <p className={styles.hint}>
          Верхний ряд рассчитан на 3 фото (среднее — wide), нижний на 5. Фото можно перетаскивать между рядами.
        </p>
        <div className={`${styles.preview} ${styles.previewDark}`}>
          <p className={styles.rowLabel}>Верхний ряд</p>
          <SortableList id={ROW1} items={list(ROW1)} className={corporateGallery.row1}>
            {list(ROW1).map((p, i) => (
              <SortableItem
                key={p.id}
                id={p.id}
                className={`${corporateGallery.cell} ${p.wide ? corporateGallery.wide : ''}`}
              >
                {img(p, corporateGallery.img)}
                {controls(p, i, ROW1)}
              </SortableItem>
            ))}
          </SortableList>
          <p className={styles.rowLabel}>Нижний ряд</p>
          <SortableList id={ROW2} items={list(ROW2)} className={corporateGallery.row2}>
            {list(ROW2).map((p, i) => (
              <SortableItem key={p.id} id={p.id} className={corporateGallery.cell}>
                {img(p, corporateGallery.img)}
                {controls(p, i, ROW2)}
              </SortableItem>
            ))}
          </SortableList>
        </div>
        <div className={styles.uploadRow}>
          <UploadButton section={ROW1} label="+ фото в верхний ряд" onUploaded={(p) => handleUploaded(ROW1, p)} />
          <UploadButton section={ROW2} label="+ фото в нижний ряд" onUploaded={(p) => handleUploaded(ROW2, p)} />
        </div>
      </div>
    </SortableBoard>
  );
}
