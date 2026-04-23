import useReveal from '../hooks/useReveal';
import styles from './VideoBlock.module.css';

const VIDEOS = [
  { type: 'youtube', id: 'nmjFyDe8vcw' },
  { type: 'youtube', id: 'e3RR05vjtUI' },
  { type: 'youtube', id: '3rP4H7U-AYk' },
];

export default function VideoBlock() {
  const ref = useReveal();
  return (
    <section className={styles.section}>
      <div className={`${styles.track} reveal-up`} ref={ref}>
        {VIDEOS.map((v, i) => (
          <div
            key={v.id}
            className={styles.videoWrap}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            <iframe
              className={styles.iframe}
              src={
                v.type === 'youtube'
                  ? `https://www.youtube.com/embed/${v.id}`
                  : `https://drive.google.com/file/d/${v.id}/preview`
              }
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        ))}
      </div>
    </section>
  );
}
