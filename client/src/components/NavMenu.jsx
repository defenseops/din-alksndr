import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/contentHooks';
import styles from './NavMenu.module.css';

const FALLBACK_LINKS = [
  { label: 'ГЛАВНАЯ', to: '/' },
  { label: 'СВАДЬБЫ', to: '/weddings' },
  { label: 'КОРПОРАТИВЫ', to: '/corporate' },
];

export default function NavMenu({ open, onClose }) {
  const LINKS = useContent('nav.links', FALLBACK_LINKS);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div className={`${styles.backdrop} ${open ? styles.backdropOpen : ''}`} onClick={onClose} />
      <nav className={`${styles.menu} ${open ? styles.menuOpen : ''}`}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <ul className={styles.list}>
          {LINKS.map(({ label, to }) => (
            <li key={to}>
              <Link to={to} className={styles.link} onClick={onClose}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
