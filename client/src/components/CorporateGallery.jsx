import { useState } from 'react';
import { usePhotos } from '../content/contentHooks';
import { resolvePhotoUrl } from '../content/photoUrl';
import styles from './CorporateGallery.module.css';
import Lightbox from './Lightbox';

const FALLBACK_ROW1 = [
  { src: '/gallery-corp/img3.jpg', wide: false },
  { src: '/gallery-corp/img2.jpg', wide: true  },
  { src: '/gallery-corp/img1.jpg', wide: false },
];

const FALLBACK_ROW2 = [
  { src: '/gallery-corp/img4.jpg'  },
  { src: '/gallery-corp/img5.jpg'  },
  { src: '/gallery-corp/img6.jpg'  },
  { src: '/gallery-corp/img7.webp' },
  { src: '/gallery-corp/img8.jpg'  },
];

export default function CorporateGallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const items1 = usePhotos('corporate_gallery_row1', FALLBACK_ROW1);
  const items2 = usePhotos('corporate_gallery_row2', FALLBACK_ROW2);
  const ROW1 = items1.map((i) => ({ src: resolvePhotoUrl(i.src), wide: i.wide }));
  const ROW2 = items2.map((i) => ({ src: resolvePhotoUrl(i.src) }));
  const ALL_PHOTOS = [...ROW1, ...ROW2].map((i) => i.src);

  return (
    <>
      <section className={styles.section}>
        <div className={styles.row1}>
          {ROW1.map((item, i) => (
            <div
              key={i}
              className={`${styles.cell} ${item.wide ? styles.wide : ''}`}
              onClick={() => setLightboxIndex(i)}
            >
              <img src={item.src} alt="" className={styles.img} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
        <div className={styles.row2}>
          {ROW2.map((item, i) => (
            <div
              key={i}
              className={styles.cell}
              onClick={() => setLightboxIndex(ROW1.length + i)}
            >
              <img src={item.src} alt="" className={styles.img} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          photos={ALL_PHOTOS}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNav={setLightboxIndex}
        />
      )}
    </>
  );
}
