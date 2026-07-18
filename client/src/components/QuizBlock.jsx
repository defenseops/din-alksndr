import { useState, useRef, useEffect } from 'react';
import useReveal from '../hooks/useReveal';
import { useContent } from '../content/contentHooks';
import styles from './QuizBlock.module.css';

const TOTAL = 3;
const API_URL = import.meta.env.VITE_API_URL || '';

const FALLBACK_CITIES = [
  'Алматы', 'Астана', 'Шымкент', 'Актобе', 'Тараз', 'Павлодар', 'Усть-Каменогорск',
  'Семей', 'Атырау', 'Костанай', 'Кызылорда', 'Уральск', 'Петропавловск', 'Актау',
  'Темиртау', 'Туркестан', 'Кокшетау', 'Талдыкорган', 'Экибастуз', 'Рудный',
  'Жезказган', 'Балхаш', 'Сатпаев', 'Кентау', 'Жанаозен', 'Байконур',
];
const FALLBACK_GUEST_OPTIONS = ['10-30', '30-50', '50-100', '>100'];
const FALLBACK_CONTACT_OPTIONS = ['Отправить в Telegram', 'Отправить в WhatsApp', 'Позвонить лично'];

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
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    date: '', city: '', guests: '', name: '', phone: '', contact: '', consent: false,
  });
  const [cityInput, setCityInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const cityRef = useRef(null);

  const title = useContent('quiz.title', 'РАССЧИТАЙТЕ СТОИМОСТЬ, ОТВЕТИВ НА ВОПРОСЫ НИЖЕ');
  const dateLabel = useContent('quiz.step1.dateLabel', 'Дата');
  const cityLabel = useContent('quiz.step1.cityLabel', 'Место проведения');
  const citySubLabel = useContent('quiz.step1.citySubLabel', 'Ответьте по желанию');
  const cityPlaceholder = useContent('quiz.step1.cityPlaceholder', 'Укажите город');
  const KZ_CITIES = useContent('quiz.cities', FALLBACK_CITIES);
  const step2Label = useContent('quiz.step2.label', 'Кол-во гостей (примерно)');
  const step2SubLabel = useContent('quiz.step2.subLabel', 'Ответьте по желанию');
  const guestOptions = useContent('quiz.step2.options', FALLBACK_GUEST_OPTIONS);
  const step3Label = useContent('quiz.step3.label', 'Кому сообщить результат?');
  const namePlaceholder = useContent('quiz.step3.namePlaceholder', 'Ваше имя *');
  const phonePlaceholder = useContent('quiz.step3.phonePlaceholder', '(000) 000-00-00 *');
  const phoneErrorText = useContent('quiz.step3.phoneError', 'Введите полный номер: (000) 000-00-00');
  const contactOptions = useContent('quiz.step3.contactOptions', FALLBACK_CONTACT_OPTIONS);
  const contactErrorText = useContent('quiz.step3.contactError', 'Выберите способ связи');
  const consentText = useContent('quiz.step3.consentText', 'Я даю согласие на обработку персональных данных *');
  const nextBtnText = useContent('quiz.nextBtn', 'Следующий вопрос →');
  const submitBtnText = useContent('quiz.submitBtn', 'Отправить заявку →');
  const submitBtnLoadingText = useContent('quiz.submitBtnLoading', 'Отправка...');
  const errorMsgText = useContent('quiz.errorMsg', 'Ошибка отправки. Попробуйте ещё раз.');
  const successTitle = useContent('quiz.successTitle', 'Заявка отправлена!');
  const successText = useContent('quiz.successText', 'Я свяжусь с вами в ближайшее время.');

  const filteredCities = KZ_CITIES.filter(c =>
    c.toLowerCase().includes(cityInput.toLowerCase()) && cityInput.length > 0
  );

  useEffect(() => {
    const onClickOutside = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const set = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: false }));
  };

  const validate3 = () => {
    const e = {};
    if (!data.name.trim()) e.name = true;
    if (data.phone.replace(/\D/g, '').length !== 10) e.phone = true;
    if (!data.contact) e.contact = true;
    if (!data.consent) e.consent = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => setStep(s => Math.min(s + 1, TOTAL));
  const prev = () => setStep(s => Math.max(s - 1, 1));
  const cardRef = useReveal();

  const handleSubmit = async () => {
    if (!validate3()) return;
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
        <h2 className={styles.title}>{title}</h2>

        {sent ? (
          <div className={styles.successMsg}>
            <p className={styles.successTitle}>{successTitle}</p>
            <p className={styles.successText}>{successText}</p>
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
                      <span className={styles.labelMain}>{dateLabel}</span>
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
                      <span className={styles.labelMain}>{cityLabel}</span>
                      <span className={styles.labelSub}>{citySubLabel}</span>
                    </div>
                    <div className={styles.inputWrap} ref={cityRef} style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className={styles.input}
                        value={cityInput}
                        onChange={e => {
                          setCityInput(e.target.value);
                          set('city', e.target.value);
                          setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        placeholder={cityPlaceholder}
                        autoComplete="off"
                      />
                      {showDropdown && filteredCities.length > 0 && (
                        <ul className={styles.dropdown}>
                          {filteredCities.map(city => (
                            <li
                              key={city}
                              className={styles.dropdownItem}
                              onMouseDown={() => {
                                setCityInput(city);
                                set('city', city);
                                setShowDropdown(false);
                              }}
                            >
                              {city}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <div className={styles.row}>
                  <div className={styles.label}>
                    <span className={styles.labelMain}>{step2Label}</span>
                    <span className={styles.labelSub}>{step2SubLabel}</span>
                  </div>
                  <div className={styles.radioGrid}>
                    {guestOptions.map(val => (
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
                    <span className={styles.labelMain}>{step3Label}</span>
                  </div>
                  <div className={styles.contactFields}>
                    <input
                      type="text"
                      className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                      value={data.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder={namePlaceholder}
                    />
                    <div className={`${styles.phoneWrap} ${errors.phone ? styles.inputError : ''}`}>
                      <span className={styles.phonePrefix}>🇰🇿 +7</span>
                      <input
                        type="tel"
                        className={`${styles.input} ${styles.phoneInput}`}
                        value={data.phone}
                        onChange={e => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                          let masked = '';
                          if (digits.length > 0) masked = '(' + digits.slice(0, 3);
                          if (digits.length >= 4) masked += ') ' + digits.slice(3, 6);
                          if (digits.length >= 7) masked += '-' + digits.slice(6, 8);
                          if (digits.length >= 9) masked += '-' + digits.slice(8, 10);
                          set('phone', masked);
                        }}
                        placeholder={phonePlaceholder}
                        maxLength={15}
                      />
                    </div>
                    {errors.phone && <span className={styles.fieldError}>{phoneErrorText}</span>}
                    <div className={`${styles.radioGrid} ${errors.contact ? styles.radioError : ''}`}>
                      {contactOptions.map(val => (
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
                    {errors.contact && <span className={styles.fieldError}>{contactErrorText}</span>}
                    <label className={styles.checkLabel}>
                      <input
                        type="checkbox"
                        checked={data.consent}
                        onChange={e => set('consent', e.target.checked)}
                        className={styles.checkInput}
                      />
                      <span className={`${styles.checkCustom} ${errors.consent ? styles.checkError : ''}`} />
                      <span className={styles.checkText}>
                        {consentText}
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <p className={styles.errorMsg}>{errorMsgText}</p>
            )}

            <div className={styles.footer}>
              <span className={styles.stepLabel}>Шаг: {step}/{TOTAL}</span>
              <div className={styles.footerActions}>
                {step > 1 && (
                  <button className={styles.backBtn} onClick={prev}>←</button>
                )}
                {step < TOTAL ? (
                  <button className={styles.nextBtn} onClick={next}>
                    {nextBtnText}
                  </button>
                ) : (
                  <button
                    className={styles.nextBtn}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? submitBtnLoadingText : submitBtnText}
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
