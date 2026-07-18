import { useEffect, useRef, useState } from 'react';
import { usePhotos } from '../content/contentHooks';
import { resolvePhotoUrl } from '../content/photoUrl';
import styles from './GalleryBlock.module.css';
import Lightbox from './Lightbox';

const FALLBACK_PHOTOS = [
  '/gallery/00342.jpg',
  '/gallery/00524.jpg',
  '/gallery/00749.jpg',
  '/gallery/00755.jpg',
  '/gallery/00763.jpg',
  '/gallery/00825.jpg',
  '/gallery/01106.jpg',
  '/gallery/01110.jpg',
  '/gallery/WhatsApp Image 2025-11-04 at 15.39.28.jpeg',
  '/gallery/ruban-108.jpg',
  '/gallery/ruban-127.jpg',
  '/gallery/ALEX-95.jpg',
].map((src) => ({ src, wide: false }));

export default function GalleryBlock() {
  const itemsRef = useRef([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const items = usePhotos('weddings_gallery', FALLBACK_PHOTOS);
  const PHOTOS = items.map((item) => resolvePhotoUrl(item.src));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    itemsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className={styles.section}>
        <div className={styles.grid}>
          {PHOTOS.map((src, i) => (
            <div
              key={i}
              className={styles.item}
              style={{ transitionDelay: `${(i % 4) * 100}ms` }}
              ref={(el) => (itemsRef.current[i] = el)}
              onClick={() => setLightboxIndex(i)}
            >
              <img src={src} alt="" className={styles.img} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          photos={PHOTOS}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNav={setLightboxIndex}
        />
      )}
    </>
  );
}
