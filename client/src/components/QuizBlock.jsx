import { useState } from 'react';
import useReveal from '../hooks/useReveal';
import styles from './QuizBlock.module.css';

const TOTAL = 3;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function sendToTelegram(data, source) {
  const res = await fetch(`${API_URL}/api/lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, source }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Ошибка сервера');
  }
}

export default function QuizBlock({ dark = false, source = 'Свадьбы' }) {
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    date: '', city: '', guests: '', name: '', phone: '', contact: '', consent: false,
  });

  const set = (field, value) => setData(prev => ({ ...prev, [field]: value }));
  const next = () => setStep(s => Math.min(s + 1, TOTAL));
  const prev = () => setStep(s => Math.max(s - 1, 1));
  const cardRef = useReveal();

  const handleSubmit = async () => {
    setLoading(true);
    setError(false);
    try {
      await sendToTelegram(data, source);
      setSent(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section} style={dark ? { background: '#0a0a0a' } : {}}>
      <div className={`${styles.card} reveal-scale`} ref={cardRef}>
        <h2 className={styles.title}>РАССЧИТАЙТЕ СТОИМОСТЬ, ОТВЕТИВ НА ВОПРОСЫ НИЖЕ</h2>

        {sent ? (
          <div className={styles.successMsg}>
            <p className={styles.successTitle}>Заявка отправлена!</p>
            <p className={styles.successText}>Я свяжусь с вами в ближайшее время.</p>
          </div>
        ) : (
          <>
            <div className={styles.progressWrap}>
              <div className={styles.progressBar} style={{ width: `${(step / TOTAL) * 100}%` }} />
            </div>

            <div className={styles.body}>
              {step === 1 && (
                <>
                  <div className={styles.row}>
                    <div className={styles.label}>
                      <span className={styles.labelMain}>Дата</span>
                    </div>
                    <div className={styles.inputWrap}>
                      <input
                        type="date"
                        className={styles.input}
                        value={data.date}
                        onChange={e => set('date', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.label}>
                      <span className={styles.labelMain}>Место проведения</span>
                      <span className={styles.labelSub}>Ответьте по желанию</span>
                    </div>
                    <div className={styles.inputWrap}>
                      <input
                        type="text"
                        className={styles.input}
                        value={data.city}
                        onChange={e => set('city', e.target.value)}
                        placeholder="Укажите город"
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <div className={styles.row}>
                  <div className={styles.label}>
                    <span className={styles.labelMain}>Кол-во гостей (примерно)</span>
                    <span className={styles.labelSub}>Ответьте по желанию</span>
                  </div>
                  <div className={styles.radioGrid}>
                    {['10-30', '30-50', '50-100', '>100'].map(val => (
                      <label key={val} className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="guests"
                          value={val}
                          checked={data.guests === val}
                          onChange={() => set('guests', val)}
                          className={styles.radioInput}
                        />
                        <span className={styles.radioCustom} />
                        {val}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className={styles.row}>
                  <div className={styles.label}>
                    <span className={styles.labelMain}>Кому сообщить результат?</span>
                  </div>
                  <div className={styles.contactFields}>
                    <input
                      type="text"
                      className={styles.input}
                      value={data.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder="Ваше имя"
                    />
                    <div className={styles.phoneWrap}>
                      <span className={styles.phonePrefix}>🇰🇿 +7</span>
                      <input
                        type="tel"
                        className={`${styles.input} ${styles.phoneInput}`}
                        value={data.phone}
                        onChange={e => set('phone', e.target.value)}
                        placeholder="(000) 000-00-00"
                      />
                    </div>
                    <div className={styles.radioGrid}>
                      {['Отправить в Telegram', 'Отправить в WhatsApp', 'Позвонить лично'].map(val => (
                        <label key={val} className={styles.radioLabel}>
                          <input
                            type="radio"
                            name="contact"
                            value={val}
                            checked={data.contact === val}
                            onChange={() => set('contact', val)}
                            className={styles.radioInput}
                          />
                          <span className={styles.radioCustom} />
                          {val}
                        </label>
                      ))}
                    </div>
                    <label className={styles.checkLabel}>
                      <input
                        type="checkbox"
                        checked={data.consent}
                        onChange={e => set('consent', e.target.checked)}
                        className={styles.checkInput}
                      />
                      <span className={styles.checkCustom} />
                      <span className={styles.checkText}>
                        Я даю согласие на обработку персональных данных
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <p className={styles.errorMsg}>Ошибка отправки. Попробуйте ещё раз.</p>
            )}

            <div className={styles.footer}>
              <span className={styles.stepLabel}>Шаг: {step}/{TOTAL}</span>
              <div className={styles.footerActions}>
                {step > 1 && (
                  <button className={styles.backBtn} onClick={prev}>←</button>
                )}
                {step < TOTAL ? (
                  <button className={styles.nextBtn} onClick={next}>
                    Следующий вопрос →
                  </button>
                ) : (
                  <button
                    className={styles.nextBtn}
                    onClick={handleSubmit}
                    disabled={loading || !data.consent}
                  >
                    {loading ? 'Отправка...' : 'Отправить заявку →'}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
