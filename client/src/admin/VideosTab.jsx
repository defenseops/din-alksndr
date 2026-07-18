import { useEffect, useState } from 'react';
import { adminApi } from './adminApi';
import { youtubeThumbnail } from '../content/videoEmbed';
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

  useEffect(() => {
    adminApi.getVideos().then((data) => {
      setVideos(data);
      setLoading(false);
    });
  }, []);

  const handleAdded = (section, video) => {
    setVideos((v) => ({ ...v, [section]: [...(v[section] || []), video] }));
  };

  const handleDelete = async (section, id) => {
    if (!confirm('Удалить это видео?')) return;
    await adminApi.deleteVideo(id);
    setVideos((v) => ({ ...v, [section]: v[section].filter((x) => x.id !== id) }));
  };

  const handleReorder = async (section, id, direction) => {
    await adminApi.reorderVideo(id, direction);
    const data = await adminApi.getVideos();
    setVideos(data);
  };

  const handleRename = async (section, id, currentTitle) => {
    const title = prompt('Подпись видео (показывается на карточках корпоративов):', currentTitle || '');
    if (title === null) return;
    await adminApi.renameVideo(id, title);
    setVideos((v) => ({
      ...v,
      [section]: v[section].map((x) => (x.id === id ? { ...x, title } : x)),
    }));
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div>
      {SECTIONS.map((s) => (
        <div className={styles.sectionBlock} key={s.key}>
          <h2 className={styles.sectionHeading}>{s.label}</h2>
          <div className={styles.videoGrid}>
            {(videos[s.key] || []).map((v) => {
              const thumb = youtubeThumbnail(v);
              return (
                <div className={styles.videoCard} key={v.id}>
                  <div className={styles.thumbWrap}>
                    {thumb ? <img src={thumb} alt="" /> : <span className={styles.thumbFallback}>{v.provider}</span>}
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardTitle}>{v.title || '—'}</p>
                    <div className={styles.cardActions}>
                      <button className={styles.iconBtn} onClick={() => handleReorder(s.key, v.id, 'up')}>↑</button>
                      <button className={styles.iconBtn} onClick={() => handleReorder(s.key, v.id, 'down')}>↓</button>
                      <button className={styles.iconBtn} onClick={() => handleRename(s.key, v.id, v.title)}>Название</button>
                      <button className={styles.iconBtnDanger} onClick={() => handleDelete(s.key, v.id)}>Удалить</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <AddVideoForm section={s.key} onAdded={(v) => handleAdded(s.key, v)} />
        </div>
      ))}
    </div>
  );
}
