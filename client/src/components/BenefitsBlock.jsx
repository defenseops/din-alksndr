import { useEffect, useRef } from 'react';
import useReveal from '../hooks/useReveal';
import { useContent } from '../content/contentHooks';
import styles from './BenefitsBlock.module.css';

const FALLBACK_CARDS = [
  {
    label: 'ГОСТИ',
    title: 'Внимание к каждому гостю',
    text: 'Я общаюсь с гостями, а не прячусь за конкурсами. Запоминаю всех по именам и фактам.',
  },
  {
    label: 'ПРОГРАММА',
    title: 'Интерактивы именно о вас',
    text: 'Использую информацию о вас и ваших гостей. Этот контент будет только на вашей свадьбе — нигде больше.',
    badge: 'Уникально для каждой пары',
  },
  {
    label: 'ЦЕРЕМОНИЯ',
    title: 'Трогательный момент на всю жизнь',
    text: 'Создаю церемонии с элементами юмора на основании вашей истории. Никаких шаблонных текстов.',
  },
  {
    label: 'ФОРМАТ',
    title: 'Варианты программы на ваш вкус',
    text: 'Мы вместе решим, чем наполнить свадьбу: я предложу идеи, а вы выберете то, что понравится.',
  },
];

export default function BenefitsBlock() {
  const headingRef = useReveal();
  const itemsRef = useRef([]);
  const heading = useContent('weddings.benefits.heading', 'ЧТО ВЫ ПОЛУЧИТЕ?');
  const CARDS = useContent('weddings.benefits.cards', FALLBACK_CARDS);

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
      { threshold: 0.15 }
    );

    itemsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={`${styles.heading} reveal-up`} ref={headingRef}>{heading}</h2>
      <div className={styles.list}>
        {CARDS.map((card, i) => (
          <div
            key={i}
            className={styles.item}
            style={{ transitionDelay: `${i * 100}ms` }}
            ref={(el) => (itemsRef.current[i] = el)}
          >
            <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
            <div className={styles.itemContent}>
              {card.label && <span className={styles.itemLabel}>{card.label}</span>}
              <h3 className={styles.itemTitle}>{card.title}</h3>
              <p className={styles.itemText}>{card.text}</p>
              {card.badge && <span className={styles.itemBadge}>{card.badge}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
