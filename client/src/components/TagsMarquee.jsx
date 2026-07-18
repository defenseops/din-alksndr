import useReveal from '../hooks/useReveal';
import { useContent } from '../content/contentHooks';
import styles from './TagsMarquee.module.css';

const FALLBACK_ROW1 = ['Интеллигентно', 'Весело', 'Комфортно'];
const FALLBACK_ROW2 = ['Индивидуально', 'С душой', 'Современно'];

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
  const row1 = useContent('weddings.tags.row1', FALLBACK_ROW1);
  const row2 = useContent('weddings.tags.row2', FALLBACK_ROW2);
  return (
    <div className={`${styles.marquee} reveal-fade`} ref={ref}>
      <Row items={row1} direction="left" />
      <Row items={row2} direction="right" />
    </div>
  );
}
