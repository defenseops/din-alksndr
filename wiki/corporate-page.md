# Страница «Корпоративы» (Corporate)

Маршрут `/corporate` (`client/src/pages/Corporate.jsx`) — аналог
[[weddings-page]] для B2B-аудитории (корпоративные мероприятия), с более
деловым тоном и упором на доверие брендов-клиентов.

## Ключевые факты
- Секции: [[shared-ui-components|CorporateIntro]] → гамбургер + NavMenu →
  hero (заголовок, расширяющийся при скролле круг-маска вокруг фото
  `/alex-corp.png`, реализовано вручную через `getBoundingClientRect` +
  слушатель `scroll`, без библиотек) → [[video-system|CorporateVideoBlock]]
  → CorporateAbout (стилизация под пост в Instagram: лайк/коммент/шер/
  сохранить с локальным state и текстом благодарности после лайка) →
  [[photo-gallery-system|CorporateGallery]] (два ряда фото) →
  [[lead-form-quiz|QuizBlock]] (вариант `dark`, `source="Корпоративы"`) →
  CorporateBenefits (интерактивный список из 4 пунктов; активный пункт
  переключается через `IntersectionObserver` с
  `rootMargin: '-40% 0px -40% 0px'`) → CorporateTrust (бегущие ряды из 10
  логотипов компаний-клиентов, `client/public/logos`) → CorporateCTA →
  CorporateContacts.
- Текст редактируем через ключи `corporate.*` — см.
  [[content-management-system]].
- SEO: ключи `corporate.seo.*`, canonical `https://din-aleksndr.kz/corporate`.

## Cross-references
- [[site-overview]]
- [[weddings-page]]
- [[content-management-system]]
- [[video-system]]
- [[photo-gallery-system]]
- [[lead-form-quiz]]
- [[seo-content]]

## Sources
- client/src/pages/Corporate.jsx
- client/src/components/CorporateIntro.jsx
- client/src/components/CorporateVideoBlock.jsx
- client/src/components/CorporateAbout.jsx
- client/src/components/CorporateGallery.jsx
- client/src/components/CorporateBenefits.jsx
- client/src/components/CorporateTrust.jsx
- client/src/components/CorporateCTA.jsx
- client/src/components/CorporateContacts.jsx
