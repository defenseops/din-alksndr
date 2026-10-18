import { useEffect, useState } from 'react';
import { adminApi } from './adminApi';
import { youtubeThumbnail } from '../content/videoEmbed';
import { SortableBoard, SortableList, SortableItem } from './sortable';
import { stopDrag, moveItem } from './sortableUtils';
import styles from './Admin.module.css';

const SECTIONS = [
  { key: 'weddings_reel', label: 'Свадьбы — видео-лента (первое видео = hero на /weddings)' },
  { key: 'weddings_reviews', label: 'Свадьбы — отзывы' },
  { key: 'corporate_reel', label: 'Корпоративы — видео' },
];

function AddVideoForm({ section, onAdded }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const video = await adminApi.addVideo(section, url, title || undefined);
      onAdded(video);
      setUrl('');
      setTitle('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.addForm} onSubmit={submit}>
      <input
        type="url"
        placeholder="Вставьте ссылку (YouTube / Yandex.Disk / Google Drive)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Подпись (не обязательно)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit" disabled={loading}>{loading ? 'Добавляю...' : 'Добавить'}</button>
      {error && <p className={styles.formError}>{error}</p>}
    </form>
  );
}

export default function VideosTab() {
  const [videos, setVideos] = useState({});
  const [loading, setLoading] = useState(true);

  const reload = () => adminApi.getVideos().then((data) => {
    setVideos(data);
    setLoading(false);
  });

  useEffect(() => { reload(); }, []);

  const list = (section) => videos[section] || [];

  const saveOrder = async (next, sections, before) => {
    try {
      for (const s of sections) {
        await adminApi.saveVideoOrder(s, (next[s] || []).map((v) => v.id));
      }
    } catch (err) {
      alert(`Не удалось сохранить порядок: ${err.message}`);
      setVideos(before);
      reload();
    }
  };

  const handleMove = (section, id, toIndex) => {
    const before = videos;
    const next = moveItem(videos, id, section, toIndex);
    setVideos(next);
    saveOrder(next, [section], before);
  };

  const handleAdded = (section, video) => {
    setVideos((v) => ({ ...v, [section]: [...(v[section] || []), video] }));
  };

  const handleDelete = async (section, id) => {
    if (!confirm('Удалить это видео?')) return;
    try {
      await adminApi.deleteVideo(id);
      setVideos((v) => ({ ...v, [section]: v[section].filter((x) => x.id !== id) }));
    } catch (err) {
      alert(`Не удалось удалить видео: ${err.message}`);
    }
  };

  const handleRename = async (section, id, currentTitle) => {
    const title = prompt('Подпись видео (показывается на карточках корпоративов):', currentTitle || '');
    if (title === null) return;
    try {
      await adminApi.renameVideo(id, title);
      setVideos((v) => ({
        ...v,
        [section]: v[section].map((x) => (x.id === id ? { ...x, title } : x)),
      }));
    } catch (err) {
      alert(`Не удалось сохранить название: ${err.message}`);
    }
  };

  if (loading) return <p>Загрузка...</p>;

  const thumb = (v) => {
    const src = youtubeThumbnail(v);
    return (
      <div className={styles.thumbWrap}>
        {src ? <img src={src} alt="" draggable={false} /> : <span className={styles.thumbFallback}>{v.provider}</span>}
      </div>
    );
  };

  return (
    <SortableBoard
      lists={videos}
      setLists={setVideos}
      onCommit={saveOrder}
      renderOverlay={(v) => <div className={styles.videoCard}>{thumb(v)}</div>}
    >
      <p className={styles.hint}>
        Перетащите видео мышкой или долгим нажатием пальца, чтобы поменять порядок.
      </p>
      {SECTIONS.map((s) => (
        <div className={styles.sectionBlock} key={s.key}>
          <h2 className={styles.sectionHeading}>{s.label}</h2>
          <SortableList id={s.key} items={list(s.key)} className={styles.videoGrid}>
            {list(s.key).map((v, i, arr) => (
              <SortableItem key={v.id} id={v.id} className={styles.videoCard}>
                {thumb(v)}
                <span className={styles.orderBadge}>{i + 1}</span>
                <div className={styles.cardBody} {...stopDrag}>
                  <p className={styles.cardTitle}>{v.title || '—'}</p>
                  <div className={styles.cardActions}>
                    <button className={styles.iconBtn} onClick={() => handleMove(s.key, v.id, 0)} disabled={i === 0} title="В начало">⇤</button>
                    <button className={styles.iconBtn} onClick={() => handleMove(s.key, v.id, 'end')} disabled={i === arr.length - 1} title="В конец">⇥</button>
                    <button className={styles.iconBtn} onClick={() => handleRename(s.key, v.id, v.title)}>Название</button>
                    <button className={styles.iconBtnDanger} onClick={() => handleDelete(s.key, v.id)}>Удалить</button>
                  </div>
                </div>
              </SortableItem>
            ))}
          </SortableList>
          <AddVideoForm section={s.key} onAdded={(v) => handleAdded(s.key, v)} />
        </div>
      ))}
    </SortableBoard>
  );
}
