import styles from './CorporateVideoBlock.module.css';

const VIDEOS = [
  {
    id: '680OIw2WA1A',
    title: 'КОРПОРАТИВ\nДЛЯ BCC',
    type: 'youtube',
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
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
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
