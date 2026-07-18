import { useVideos } from '../content/contentHooks';
import { videoEmbedUrl } from '../content/videoEmbed';
import styles from './CorporateVideoBlock.module.css';

const FALLBACK_VIDEOS = [
  { id: 1, provider: 'youtube', external_id: '680OIw2WA1A', title: 'КОРПОРАТИВ\nДЛЯ BCC' },
];

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

export default function CorporateVideoBlock() {
  const videos = useVideos('corporate_reel', FALLBACK_VIDEOS);
  return (
    <section className={styles.section}>
      <div className={styles.track}>
        {videos.map((v) => (
          <VideoCard key={v.id} {...v} />
        ))}
      </div>
    </section>
  );
}
