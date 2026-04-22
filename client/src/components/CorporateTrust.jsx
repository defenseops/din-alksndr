import styles from './CorporateTrust.module.css';

const ALL_LOGOS = [
  '/logos/logo1.jpg',
  '/logos/logo2.png',
  '/logos/logo3.png',
  '/logos/logo4.jpg',
  '/logos/logo5.png',
  '/logos/logo6.png',
  '/logos/logo7.png',
  '/logos/logo8.png',
  '/logos/logo9.png',
  '/logos/logo10.jpg',
];

const ROW1 = ALL_LOGOS.slice(0, 5);
const ROW2 = ALL_LOGOS.slice(5);

function LogoRow({ logos, direction }) {
  const repeated = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos];
  return (
    <div className={styles.rowWrap}>
      <div className={`${styles.track} ${direction === 'right' ? styles.trackRight : styles.trackLeft}`}>
        {repeated.map((src, i) => (
          <div key={i} className={styles.logoCell}>
            <img src={src} alt="" className={styles.logoImg} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CorporateTrust() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>МНЕ ДОВЕРЯЮТ</h2>
      <div className={styles.rows}>
        <LogoRow logos={ROW1} direction="left" />
        <LogoRow logos={ROW2} direction="right" />
      </div>
    </section>
  );
}
