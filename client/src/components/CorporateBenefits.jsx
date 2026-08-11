import { useEffect, useRef, useState } from 'react';
import { useContent } from '../content/contentHooks';
import styles from './CorporateBenefits.module.css';

const FALLBACK_ITEMS = [
  {
    label: 'АТМОСФЕРА',
    title: 'Довольных сотрудников',
    text: 'Никого ни к чему не принуждаю и даю всем пространство для отдыха. Кроме самых активных, конечно — к ним другой разговор.',
  },
  {
    label: 'ПОДГОТОВКА',
    title: 'Внимание к деталям',
    text: 'Заранее узнаю всё про Вашу компанию, коллег и использую это на мероприятии. Гости чувствуют разницу.',
  },
  {
    label: 'КОМАНДНАЯ РАБОТА',
    title: 'Командная организация',
    text: 'Мы вместе создадим праздник для Ваших сотрудников: я предложу идеи, а Вы выберете, что нравится.',
  },
  {
    label: 'НАДЁЖНОСТЬ',
    title: 'Спокойствие до и после',
    text: 'Многолетний опыт позволяет предугадывать любые ситуации. Расслабитесь не только на корпоративе, но и задолго до него.',
  },
];

export default function CorporateBenefits() {
  const heading = useContent('corporate.benefits.heading', 'ЧТО ВЫ\nПОЛУЧИТЕ');
  const ITEMS = useContent('corporate.benefits.items', FALLBACK_ITEMS);
  const [openIndex, setOpenIndex] = useState(null);
  // видимость (reveal-on-scroll) держим в state, а не через classList.add —
  // иначе клик по пункту (React ре-рендерит className с itemOpen) стирает
  // класс, добавленный напрямую в DOM мимо React.
  const [revealed, setRevealed] = useState(() => new Set());
  const itemsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = itemsRef.current.indexOf(entry.target);
            if (idx !== -1) {
              setRevealed((prev) => new Set(prev).add(idx));
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    itemsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const lines = heading.split('\n');

  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.titleCol}>
          <p className={styles.title}>
            {lines.map((line, i) => (
              <span key={i} className={i === lines.length - 1 ? styles.titleAccent : undefined}>
                {line}
                {i < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>

        <div className={styles.listCol}>
          <div className={styles.list}>
            {ITEMS.map((item, i) => {
              const isOpen = openIndex === i;
              const isVisible = revealed.has(i);
              return (
                <div
                  key={i}
                  className={`${styles.item} ${isVisible ? styles.visible : ''} ${isOpen ? styles.itemOpen : ''}`}
                  style={{ transitionDelay: `${i * 90}ms` }}
                  ref={(el) => (itemsRef.current[i] = el)}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.content}>
                    {item.label && <span className={styles.label}>{item.label}</span>}
                    <p className={styles.itemHeading}>{item.title}</p>
                    <p className={styles.body}>{item.text}</p>
                  </div>
                  <span className={styles.arrow}>›</span>
                  <span className={styles.bar} />
                </div>
              );
            })}
          </div>

          <div className={styles.footer}>
            <span className={styles.dot} />
            Нажмите на пункт, чтобы узнать подробнее
          </div>
        </div>
      </div>
    </section>
  );
}
