import useReveal from '../hooks/useReveal';
import styles from './VideoBlock.module.css';

const VIDEOS = [
  '14iWwYhYJ8-TrPIXyO6cFwCCpNRBFtBnS',
  '1fwZAhNBt_2_umFNwx4RIFoGHNS5iatMt',
];

export default function VideoBlock() {
  const ref = useReveal();
  return (
    <section className={styles.section}>
      <div className={`${styles.track} reveal-up`} ref={ref}>
        {VIDEOS.map((id, i) => (
          <div
            key={id}
            className={styles.videoWrap}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            <iframe
              className={styles.iframe}
              src={`https://drive.google.com/file/d/${id}/preview`}
              allow="autoplay"
              allowFullScreen
            />
          </div>
        ))}
      </div>
    </section>
  );
}
