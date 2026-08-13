import useReveal from '../hooks/useReveal';
import useHorizontalScroll from '../hooks/useHorizontalScroll';
import { useVideos } from '../content/contentHooks';
import { videoEmbedUrl } from '../content/videoEmbed';
import ScrollArrows from './ScrollArrows';
import SwipeHint from './SwipeHint';
import styles from './ReviewsBlock.module.css';

const FALLBACK_REVIEWS = [
  { id: 1, provider: 'youtube', external_id: '-PDJKWq5DOg' },
  { id: 2, provider: 'youtube', external_id: 'nlG_xhiEUQo' },
  { id: 3, provider: 'youtube', external_id: 'WVYk-Mvg7uI' },
  { id: 4, provider: 'youtube', external_id: 'Uh6pa5nj3zo' },
];

export default function ReviewsBlock() {
  const titleRef = useReveal();
  const REVIEWS = useVideos('weddings_reviews', FALLBACK_REVIEWS);
  const { trackRef, canLeft, canRight, scrollLeft, scrollRight } = useHorizontalScroll();

  return (
    <section className={styles.section}>
      <div className={`${styles.titleWrap} reveal-up`} ref={titleRef}>
        <h2 className={styles.title}>ОТЗЫВЫ</h2>
        <p className={styles.subtitle}>что говорят молодожёны</p>
      </div>

      <div className={styles.gridWrap}>
        <div className={styles.grid} ref={trackRef}>
          {REVIEWS.map((r, i) => (
            <div
              key={r.id}
              className={styles.card}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className={styles.iframeWrap}>
                <iframe
                  src={videoEmbedUrl(r)}
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
        <ScrollArrows canLeft={canLeft} canRight={canRight} onLeft={scrollLeft} onRight={scrollRight} />
      </div>
      <SwipeHint show={canRight} />
    </section>
  );
}
