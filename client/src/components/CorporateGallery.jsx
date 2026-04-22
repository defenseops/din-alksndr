import styles from './CorporateGallery.module.css';

const ROW1 = [
  { src: '/gallery-corp/img1.jpg', wide: false },
  { src: '/gallery-corp/img2.jpg', wide: true  },
  { src: '/gallery-corp/img3.jpg', wide: false },
];

const ROW2 = [
  { src: '/gallery-corp/img4.jpg'  },
  { src: '/gallery-corp/img5.jpg'  },
  { src: '/gallery-corp/img6.jpg'  },
  { src: '/gallery-corp/img7.webp' },
  { src: '/gallery-corp/img8.jpg'  },
];

export default function CorporateGallery() {
  return (
    <section className={styles.section}>
      <div className={styles.row1}>
        {ROW1.map((item, i) => (
          <div key={i} className={`${styles.cell} ${item.wide ? styles.wide : ''}`}>
            <img src={item.src} alt="" className={styles.img} />
          </div>
        ))}
      </div>
      <div className={styles.row2}>
        {ROW2.map((item, i) => (
          <div key={i} className={styles.cell}>
            <img src={item.src} alt="" className={styles.img} />
          </div>
        ))}
      </div>
    </section>
  );
}
