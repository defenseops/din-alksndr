import useReveal from '../hooks/useReveal';
import styles from './ReviewsBlock.module.css';

const REVIEWS = [
  { id: '-PDJKWq5DOg', name: 'Отзыв 1' },
  { id: 'nlG_xhiEUQo', name: 'Отзыв 2' },
  { id: 'WVYk-Mvg7uI', name: 'Отзыв 3' },
];

export default function ReviewsBlock() {
  const titleRef = useReveal();

  return (
    <section className={styles.section}>
      <div className={`${styles.titleWrap} reveal-up`} ref={titleRef}>
        <h2 className={styles.title}>ОТЗЫВЫ</h2>
        <p className={styles.subtitle}>что говорят молодожёны</p>
      </div>

      <div className={styles.grid}>
        {REVIEWS.map((r, i) => (
          <div
            key={r.id}
            className={styles.card}
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className={styles.iframeWrap}>
              <iframe
                src={`https://www.youtube.com/embed/${r.id}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className={styles.iframe}
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
