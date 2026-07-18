import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from './useAdminAuth';
import VideosTab from './VideosTab';
import PhotosTab from './PhotosTab';
import TextTab from './TextTab';
import styles from './Admin.module.css';

const TABS = [
  { key: 'videos', label: 'Видео' },
  { key: 'photos', label: 'Фото' },
  { key: 'text', label: 'Тексты' },
];

export default function AdminDashboard() {
  const { checked, username, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('videos');

  useEffect(() => {
    if (checked && !username) navigate('/admin/login', { replace: true });
  }, [checked, username, navigate]);

  if (!checked || !username) return null;

  return (
    <div className={styles.dashboard}>
      <div className={styles.topbar}>
        <span className={styles.topbarTitle}>Админка din-aleksndr.kz</span>
        <button
          className={styles.logoutBtn}
          onClick={async () => {
            await logout();
            navigate('/admin/login', { replace: true });
          }}
        >
          Выйти ({username})
        </button>
      </div>

      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {tab === 'videos' && <VideosTab />}
        {tab === 'photos' && <PhotosTab />}
        {tab === 'text' && <TextTab />}
      </div>
    </div>
  );
}
