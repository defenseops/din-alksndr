import styles from './SwipeHint.module.css';

// Подсказка «пролистните» для тач-устройств — стрелка, покачивающаяся
// вправо, видна только пока в треке есть непросмотренные карточки справа.
export default function SwipeHint({ show, dark }) {
  if (!show) return null;

  return (
    <div className={`${styles.hint} ${dark ? styles.dark : ''}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
