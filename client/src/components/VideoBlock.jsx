import useReveal from '../hooks/useReveal';
import { useContent, useVideos } from '../content/contentHooks';
import { videoEmbedUrl } from '../content/videoEmbed';
import styles from './VideoBlock.module.css';

const FALLBACK_VIDEOS = [
  { id: 1, provider: 'youtube', external_id: 'nmjFyDe8vcw' },
  { id: 2, provider: 'youtube', external_id: 'e3RR05vjtUI' },
  { id: 3, provider: 'youtube', external_id: '3rP4H7U-AYk' },
];

export default function VideoBlock() {
  const introRef = useReveal();
  const ref = useReveal();
  const videos = useVideos('weddings_reel', FALLBACK_VIDEOS);
  const heading = useContent('weddings.videoIntro.heading', 'ВСЁ БУДЕТ ЛЕГКО\nИ\nНЕПРИНУЖДЕННО');
  const text = useContent('weddings.videoIntro.text', 'Никакой банальщины, пошлостей и «испанского стыда». Можете убедиться сами:');

  return (
    <section className={styles.section}>
      <div className={`${styles.introWrap} reveal-up`} ref={introRef}>
        <h2 className={styles.introHeading}>
          {heading.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
        </h2>
        <p className={styles.introText}>{text}</p>
      </div>

      <div className={`${styles.track} reveal-up`} ref={ref}>
        {videos.map((v, i) => (
          <div
            key={v.id}
            className={styles.videoWrap}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            <iframe
              className={styles.iframe}
              src={videoEmbedUrl(v)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        ))}
      </div>
    </section>
  );
}
