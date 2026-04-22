import useReveal from '../hooks/useReveal';
import styles from './TagsMarquee.module.css';

const ROW1 = ['Интеллигентно', 'Весело', 'Комфортно'];
const ROW2 = ['Индивидуально', 'С душой', 'Современно'];

function Row({ items, direction }) {
  const repeated = [...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items];
  return (
    <div className={styles.rowWrap}>
      <div className={`${styles.track} ${direction === 'right' ? styles.trackRight : styles.trackLeft}`}>
        {repeated.map((word, i) => (
          <span key={i} className={styles.tag}>{word}</span>
        ))}
      </div>
    </div>
  );
}

export default function TagsMarquee() {
  const ref = useReveal();
  return (
    <div className={`${styles.marquee} reveal-fade`} ref={ref}>
      <Row items={ROW1} direction="left" />
      <Row items={ROW2} direction="right" />
    </div>
  );
}
