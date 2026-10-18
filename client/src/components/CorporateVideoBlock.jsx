import useHorizontalScroll from '../hooks/useHorizontalScroll';
import { useVideos } from '../content/contentHooks';
import { videoEmbedUrl } from '../content/videoEmbed';
import ScrollArrows from './ScrollArrows';
import SwipeHint from './SwipeHint';
import styles from './CorporateVideoBlock.module.css';

function VideoCard({ title, ...video }) {
  return (
    <div className={styles.card}>
      <div className={styles.videoWrap}>
        <iframe
          className={styles.iframe}
          src={videoEmbedUrl(video)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
        <div className={styles.overlay}>
          <span className={styles.watermark}>ВЕДУЩИЙ<br />АЛЕКСАНДР ДИН</span>
        </div>
      </div>
      <p className={styles.cardTitle}>
        {(title || '').split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
      </p>
    </div>
  );
}

// Блок показывается только когда в админке есть видео — без них он не рендерится вовсе
// (и до ответа API тоже, чтобы не мелькал).
export default function CorporateVideoBlock() {
  const videos = useVideos('corporate_reel', []);
  if (!videos.length) return null;
  return <VideoTrack videos={videos} />;
}

function VideoTrack({ videos }) {
  const { trackRef, canLeft, canRight, scrollLeft, scrollRight } = useHorizontalScroll();
  // если видео помещаются целиком (скроллить некуда) — центрируем, а не жмём к левому краю;
  // как только видео станет больше и появится реальный скролл, снова уходим к flex-start
  // (сохраняет базовое позиционирование от начала — центрирование overflow-контента
  // прыгает в некоторых браузерах).
  const centered = !canLeft && !canRight;

  return (
    <section className={styles.section}>
      <div className={styles.trackWrap}>
        <div className={`${styles.track} ${centered ? styles.trackCentered : ''}`} ref={trackRef}>
          {videos.map((v) => (
            <VideoCard key={v.id} {...v} />
          ))}
        </div>
        <ScrollArrows canLeft={canLeft} canRight={canRight} onLeft={scrollLeft} onRight={scrollRight} dark />
      </div>
      <SwipeHint show={canRight} dark />
    </section>
  );
}
