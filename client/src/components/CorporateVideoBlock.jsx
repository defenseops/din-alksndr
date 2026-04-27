import styles from './CorporateVideoBlock.module.css';

const VIDEOS = [
  {
    id: 'KIxyo6xL3pTT4Q',
    title: 'КОРПОРАТИВ\nДЛЯ BCC',
    type: 'yandex',
  },
];

function VideoCard({ id, title, type }) {
  const embedUrl = type === 'youtube'
    ? `https://www.youtube.com/embed/${id}`
    : `https://disk.yandex.ru/video/embed/${id}`;

  return (
    <div className={styles.card}>
      <div className={styles.videoWrap}>
        <iframe
          className={styles.iframe}
          src={embedUrl}
          allow="autoplay; fullscreen"
          allowFullScreen
        />
        <div className={styles.overlay}>
          <span className={styles.watermark}>ВЕДУЩИЙ<br />АЛЕКСАНДР ДИН</span>
        </div>
      </div>
      <p className={styles.cardTitle}>
        {title.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
      </p>
    </div>
  );
}

export default function CorporateVideoBlock() {
  return (
    <section className={styles.section}>
      <div className={styles.track}>
        {VIDEOS.map((v) => (
          <VideoCard key={v.id} {...v} />
        ))}
      </div>
    </section>
  );
}
