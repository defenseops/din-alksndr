import { useEffect, useCallback, useRef } from 'react';
import styles from './Lightbox.module.css';

export default function Lightbox({ photos, index, onClose, onNav }) {
  const touchStartX = useRef(null);

  const prev = useCallback(() => onNav((index - 1 + photos.length) % photos.length), [index, photos.length, onNav]);
  const next = useCallback(() => onNav((index + 1) % photos.length), [index, photos.length, onNav]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [prev, next, onClose]);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button className={styles.close} onClick={onClose}>✕</button>
      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={e => { e.stopPropagation(); prev(); }}>‹</button>
      <div className={styles.imgWrap} onClick={e => e.stopPropagation()}>
        <img src={photos[index]} alt="" className={styles.img} />
      </div>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={e => { e.stopPropagation(); next(); }}>›</button>
      <div className={styles.counter}>{index + 1} / {photos.length}</div>
    </div>
  );
}
