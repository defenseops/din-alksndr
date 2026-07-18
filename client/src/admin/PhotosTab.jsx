import { useEffect, useRef, useState } from 'react';
import { adminApi } from './adminApi';
import { resolvePhotoUrl } from '../content/photoUrl';
import styles from './Admin.module.css';

const SECTIONS = [
  { key: 'weddings_gallery', label: 'Свадьбы — галерея' },
  { key: 'corporate_gallery_row1', label: 'Корпоративы — верхний ряд', hasWide: true },
  { key: 'corporate_gallery_row2', label: 'Корпоративы — нижний ряд' },
];

function UploadButton({ section, onUploaded }) {
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
        {loading ? 'Загружаю...' : '+ загрузить фото'}
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

export default function PhotosTab() {
  const [photos, setPhotos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getPhotos().then((data) => {
      setPhotos(data);
      setLoading(false);
    });
  }, []);

  const handleUploaded = (section, photo) => {
    setPhotos((p) => ({ ...p, [section]: [...(p[section] || []), photo] }));
  };

  const handleDelete = async (section, id) => {
    if (!confirm('Удалить это фото?')) return;
    await adminApi.deletePhoto(id);
    setPhotos((p) => ({ ...p, [section]: p[section].filter((x) => x.id !== id) }));
  };

  const handleReorder = async (section, id, direction) => {
    await adminApi.reorderPhoto(id, direction);
    const data = await adminApi.getPhotos();
    setPhotos(data);
  };

  const handleToggleWide = async (section, id, wide) => {
    await adminApi.toggleWidePhoto(id, wide);
    setPhotos((p) => ({
      ...p,
      [section]: p[section].map((x) => (x.id === id ? { ...x, wide } : x)),
    }));
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div>
      {SECTIONS.map((s) => (
        <div className={styles.sectionBlock} key={s.key}>
          <h2 className={styles.sectionHeading}>{s.label}</h2>
          <div className={styles.photoGrid}>
            {(photos[s.key] || []).map((p) => (
              <div className={styles.photoCard} key={p.id}>
                <div className={styles.thumbWrap}>
                  <img src={resolvePhotoUrl(p.file_path)} alt="" />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardActions}>
                    <button className={styles.iconBtn} onClick={() => handleReorder(s.key, p.id, 'up')}>↑</button>
                    <button className={styles.iconBtn} onClick={() => handleReorder(s.key, p.id, 'down')}>↓</button>
                    {s.hasWide && (
                      <button className={styles.iconBtn} onClick={() => handleToggleWide(s.key, p.id, !p.wide)}>
                        {p.wide ? 'wide ✓' : 'wide'}
                      </button>
                    )}
                    <button className={styles.iconBtnDanger} onClick={() => handleDelete(s.key, p.id)}>Удалить</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <UploadButton section={s.key} onUploaded={(p) => handleUploaded(s.key, p)} />
        </div>
      ))}
    </div>
  );
}
