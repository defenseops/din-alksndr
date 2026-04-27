import { useState } from 'react';
import styles from './CorporateGallery.module.css';
import Lightbox from './Lightbox';

const ROW1 = [
  { src: '/gallery-corp/img3.jpg', wide: false },
  { src: '/gallery-corp/img2.jpg', wide: true  },
  { src: '/gallery-corp/img1.jpg', wide: false },
];

const ROW2 = [
  { src: '/gallery-corp/img4.jpg'  },
  { src: '/gallery-corp/img5.jpg'  },
  { src: '/gallery-corp/img6.jpg'  },
  { src: '/gallery-corp/img7.webp' },
  { src: '/gallery-corp/img8.jpg'  },
];

const ALL_PHOTOS = [...ROW1, ...ROW2].map(i => i.src);

export default function CorporateGallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

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
