import styles from './ScrollArrows.module.css';

// Кнопки скролла для горизонтальных видео-треков — показываются только
// устройствам с мышью/трекпадом (см. media (hover) в CSS) и только пока
// есть куда скроллить.
export default function ScrollArrows({ canLeft, canRight, onLeft, onRight, dark }) {
  if (!canLeft && !canRight) return null;

  return (
    <>
      <button
        type="button"
        className={`${styles.arrow} ${styles.left} ${dark ? styles.dark : ''}`}
        onClick={onLeft}
        disabled={!canLeft}
        aria-label="Прокрутить влево"
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        className={`${styles.arrow} ${styles.right} ${dark ? styles.dark : ''}`}
        onClick={onRight}
        disabled={!canRight}
        aria-label="Прокрутить вправо"
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );
}
