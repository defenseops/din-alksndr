import { useEffect, useRef, useState } from 'react';
import { useContent } from '../content/contentHooks';
import styles from './CorporateBenefits.module.css';

const FALLBACK_ITEMS = [
  {
    title: 'ДОВОЛЬНЫХ СОТРУДНИКОВ',
    text: 'Никого ни к чему не принуждаю и даю всем пространство для отдыха. Кроме самых активных, конечно же. К ним другой разговор.',
  },
  {
    title: 'ВНИМАНИЕ К ДЕТАЛЯМ',
    text: 'Заранее узнаю всё про Вашу компанию, коллег и использую это на мероприятии.',
  },
  {
    title: 'КОМАНДНАЯ ОРГАНИЗАЦИЯ',
    text: 'Мы вместе создадим праздник для Ваших сотрудников: я предложу идеи, а Вы выберите, что нравится.',
  },
  {
    title: 'СПОКОЙСТВИЕ',
    text: 'Многолетний опыт позволяет мне предугадывать любые ситуации, а тщательная подготовка даст Вам возможность расслабиться не только на корпоративе, но и задолго до него.',
  },
];

export default function CorporateBenefits() {
  const heading = useContent('corporate.benefits.heading', 'ЧТО ВЫ\nПОЛУЧИТЕ');
  const ITEMS = useContent('corporate.benefits.items', FALLBACK_ITEMS);
  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState(null);
  const [dir, setDir] = useState('down'); // 'down' | 'up'
  const [animating, setAnimating] = useState(false);
  const itemRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = itemRefs.current.indexOf(entry.target);
            if (idx !== -1 && idx !== active) {
              setDir(idx > active ? 'down' : 'up');
              setPrevActive(active);
              setActive(idx);
              setAnimating(true);
              setTimeout(() => {
                setPrevActive(null);
                setAnimating(false);
              }, 350);
            }
          }
        });
      },
      { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [active]);

  return (
    <section className={styles.section}>
      <div className={styles.left}>
        <h2 className={styles.heading}>{heading.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</h2>
      </div>

      <div className={styles.center}>
        <div className={styles.counterWrap}>
          <div key={active} className={styles.counterNum}>
            {active + 1}
          </div>
        </div>
      </div>

      <div className={styles.right}>
        {ITEMS.map((item, i) => (
          <div
            key={i}
            className={`${styles.card} ${active === i ? styles.cardActive : ''}`}
            ref={(el) => (itemRefs.current[i] = el)}
          >
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardText}>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
