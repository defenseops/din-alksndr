import { useEffect, useRef } from 'react';
import useReveal from '../hooks/useReveal';
import { useContent } from '../content/contentHooks';
import styles from './BenefitsBlock.module.css';

const FALLBACK_CARDS = [
  {
    title: 'ВНИМАНИЕ К ГОСТЯМ',
    text: 'Я общаюсь с гостями, а не прячусь за конкурсами. Запоминаю всех гостей по именам и фактам.',
  },
  {
    title: 'ИНТЕРАКТИВЫ О ВАС',
    text: 'Использую информацию о вас и гостях. Этот уникальный контент будет только на вашей свадьбе.',
  },
  {
    title: 'ЦЕРЕМОНИЮ',
    text: 'Создаю трогательные церемонии с элементами юмора на основании вашей истории.',
  },
  {
    title: 'ВАРИАНТЫ ПРОГРАММЫ',
    text: 'Мы вместе решим, чем наполнить свадьбу: я предложу идеи, а вы выберете то, что понравится.',
  },
];

export default function BenefitsBlock() {
  const headingRef = useReveal();
  const cardsRef = useRef([]);
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

    cardsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={`${styles.heading} reveal-up`} ref={headingRef}>{heading}</h2>
      <div className={styles.grid}>
        {CARDS.map((card, i) => (
          <div
            key={i}
            className={styles.card}
            style={{ transitionDelay: `${i * 120}ms` }}
            ref={(el) => (cardsRef.current[i] = el)}
          >
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.cardText}>{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
