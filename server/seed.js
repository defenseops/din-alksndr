// Заливает в SQLite текущие захардкоженные значения сайта (видео/фото/тексты),
// чтобы после подключения админки сайт выглядел ровно как сейчас.
// Запуск: node server/seed.js  (безопасно перезапускать — работает по upsert/insert-if-empty).
const db = require('./db');

function seedVideos() {
  const { c } = db.prepare('SELECT COUNT(*) AS c FROM videos').get();
  if (c > 0) {
    console.log('videos: уже заполнено, пропускаю.');
    return;
  }

  const rows = [
    // weddings_reel — первый элемент также используется как hero-видео на /weddings
    { section: 'weddings_reel', provider: 'youtube', external_id: 'nmjFyDe8vcw', title: null, sort_order: 0 },
    { section: 'weddings_reel', provider: 'youtube', external_id: 'e3RR05vjtUI', title: null, sort_order: 1 },
    { section: 'weddings_reel', provider: 'youtube', external_id: '3rP4H7U-AYk', title: null, sort_order: 2 },

    { section: 'weddings_reviews', provider: 'youtube', external_id: '-PDJKWq5DOg', title: 'Отзыв 1', sort_order: 0 },
    { section: 'weddings_reviews', provider: 'youtube', external_id: 'nlG_xhiEUQo', title: 'Отзыв 2', sort_order: 1 },
    { section: 'weddings_reviews', provider: 'youtube', external_id: 'WVYk-Mvg7uI', title: 'Отзыв 3', sort_order: 2 },
    { section: 'weddings_reviews', provider: 'youtube', external_id: 'Uh6pa5nj3zo', title: 'Отзыв 4', sort_order: 3 },

    { section: 'corporate_reel', provider: 'youtube', external_id: '680OIw2WA1A', title: 'КОРПОРАТИВ\nДЛЯ BCC', sort_order: 0 },
  ];

  const insert = db.prepare(
    'INSERT INTO videos (section, provider, external_id, title, sort_order) VALUES (@section, @provider, @external_id, @title, @sort_order)'
  );
  const insertMany = db.transaction((items) => items.forEach((item) => insert.run(item)));
  insertMany(rows);
  console.log(`videos: добавлено ${rows.length} записей.`);
}

function seedPhotos() {
  const { c } = db.prepare('SELECT COUNT(*) AS c FROM photos').get();
  if (c > 0) {
    console.log('photos: уже заполнено, пропускаю.');
    return;
  }

  const weddingsGallery = [
    '/gallery/00342.jpg',
    '/gallery/00524.jpg',
    '/gallery/00749.jpg',
    '/gallery/00755.jpg',
    '/gallery/00763.jpg',
    '/gallery/00825.jpg',
    '/gallery/01106.jpg',
    '/gallery/01110.jpg',
    '/gallery/WhatsApp Image 2025-11-04 at 15.39.28.jpeg',
    '/gallery/ruban-108.jpg',
    '/gallery/ruban-127.jpg',
    '/gallery/ALEX-95.jpg',
  ];

  const corporateRow1 = [
    { src: '/gallery-corp/img3.jpg', wide: 0 },
    { src: '/gallery-corp/img2.jpg', wide: 1 },
    { src: '/gallery-corp/img1.jpg', wide: 0 },
  ];

  const corporateRow2 = [
    '/gallery-corp/img4.jpg',
    '/gallery-corp/img5.jpg',
    '/gallery-corp/img6.jpg',
    '/gallery-corp/img7.webp',
    '/gallery-corp/img8.jpg',
  ];

  const rows = [
    ...weddingsGallery.map((src, i) => ({ section: 'weddings_gallery', file_path: src, wide: 0, sort_order: i })),
    ...corporateRow1.map((item, i) => ({ section: 'corporate_gallery_row1', file_path: item.src, wide: item.wide, sort_order: i })),
    ...corporateRow2.map((src, i) => ({ section: 'corporate_gallery_row2', file_path: src, wide: 0, sort_order: i })),
  ];

  const insert = db.prepare(
    'INSERT INTO photos (section, file_path, wide, sort_order) VALUES (@section, @file_path, @wide, @sort_order)'
  );
  const insertMany = db.transaction((items) => items.forEach((item) => insert.run(item)));
  insertMany(rows);
  console.log(`photos: добавлено ${rows.length} записей. Файлы этих путей остаются в client/public — их админка не удаляет, удалить можно только фото, загруженные позже через саму админку.`);
}

function seedContent() {
  const items = [
    // --- Главная (Home.jsx) ---
    ['home.seo.title', 'group.home', 'Александр Дин — Ведущий мероприятий в Казахстане'],
    ['home.seo.description', 'group.home', 'Александр Дин — профессиональный ведущий свадеб и корпоративных мероприятий в Казахстане. Яркие эмоции, безупречная организация.'],
    ['home.hero.subtitle', 'group.home', 'Ведущий мероприятий'],
    ['home.hero.name', 'group.home', 'АЛЕКСАНДР\nДИН'],
    ['home.hero.chooseLabel', 'group.home', 'Выберите раздел'],
    ['home.hero.btnWeddings', 'group.home', 'Свадьбы'],
    ['home.hero.btnCorporate', 'group.home', 'Корпоративы'],

    // --- Навигация (общая) ---
    ['nav.links', 'group.nav', [
      { label: 'ГЛАВНАЯ', to: '/' },
      { label: 'СВАДЬБЫ', to: '/weddings' },
      { label: 'КОРПОРАТИВЫ', to: '/corporate' },
    ]],

    // --- Интро-заставки (WeddingsIntro / CorporateIntro) ---
    ['weddings.intro.name', 'group.weddings', 'АЛЕКСАНДР ДИН'],
    ['weddings.intro.subtitle', 'group.weddings', 'Ведущий мероприятий'],
    ['corporate.intro.name', 'group.corporate', 'АЛЕКСАНДР ДИН'],
    ['corporate.intro.subtitle', 'group.corporate', 'Ведущий мероприятий'],

    // --- Weddings hero + SEO ---
    ['weddings.seo.title', 'group.weddings', 'Свадебный ведущий Александр Дин — Казахстан'],
    ['weddings.seo.description', 'group.weddings', 'Александр Дин — ведущий свадеб в Казахстане. Тёплая атмосфера, живые эмоции и безупречный сценарий вашего торжества.'],
    ['weddings.hero.name', 'group.weddings', 'АЛЕКСАНДР\nДИН'],
    ['weddings.hero.subtitle', 'group.weddings', 'Ведущий мероприятий'],
    ['weddings.hero.applyBtn', 'group.weddings', 'Подать заявку'],

    // --- Weddings: Обо мне ---
    ['weddings.about.heading', 'group.weddings', 'ОБО МНЕ'],
    ['weddings.about.text', 'group.weddings', `Привет!
Если в двух словах:
Я — ведущий.
Ещё в двух:
Хороший ведущий.
Чуть побольше слов:
Я самый «свойский» ведущий в мире.
У меня нет громких званий, императорских регалий и 100500 лет опыта.
Я просто искренне люблю свою работу и людей, с которыми она происходит.
Искренность — мой принцип.
— Именно поэтому на моих свадьбах всего два состояния — очень весело и очень трогательно. И чаще всего этого вполне достаточно, чтобы назвать свадьбу — лучшей.
— Именно поэтому гости часто уверены, что я давний друг молодожёнов. Хотя видимся мы с ними впервые в жизни.
— Именно поэтому мы потом действительно становимся друзьями с теми, кто доверяет мне свой праздник. И не один.
И, может быть, именно поэтому вы сейчас читаете этот текст :)
Если после прочтения у вас что-то откликнулось в сердечке — возможно, стоит провериться у кардиолога.`],

    // --- Weddings: Что вы получите ---
    ['weddings.benefits.heading', 'group.weddings', 'ЧТО ВЫ ПОЛУЧИТЕ?'],
    ['weddings.benefits.cards', 'group.weddings', [
      { title: 'ВНИМАНИЕ К ГОСТЯМ', text: 'Я общаюсь с гостями, а не прячусь за конкурсами. Запоминаю всех гостей по именам и фактам.' },
      { title: 'ИНТЕРАКТИВЫ О ВАС', text: 'Использую информацию о вас и гостях. Этот уникальный контент будет только на вашей свадьбе.' },
      { title: 'ЦЕРЕМОНИЮ', text: 'Создаю трогательные церемонии с элементами юмора на основании вашей истории.' },
      { title: 'ВАРИАНТЫ ПРОГРАММЫ', text: 'Мы вместе решим, чем наполнить свадьбу: я предложу идеи, а вы выберете то, что понравится.' },
    ]],

    // --- Теги (бегущая строка) ---
    ['weddings.tags.row1', 'group.weddings', ['Интеллигентно', 'Весело', 'Комфортно']],
    ['weddings.tags.row2', 'group.weddings', ['Индивидуально', 'С душой', 'Современно']],

    // --- Weddings CTA / Контакты ---
    ['weddings.cta.heading', 'group.weddings', 'СДЕЛАЕМ ЛУЧШУЮ СВАДЬБУ ВМЕСТЕ'],
    ['weddings.cta.btn', 'group.weddings', 'Подать заявку'],
    ['weddings.contacts.heading', 'group.weddings', 'КОНТАКТЫ'],
    ['weddings.contacts.phoneDisplay', 'group.weddings', '8 (707) 493-57-82'],
    ['weddings.contacts.phoneHref', 'group.weddings', 'tel:+77074935782'],
    ['weddings.contacts.whatsapp', 'group.weddings', 'https://wa.me/77074935782'],
    ['weddings.contacts.telegram', 'group.weddings', 'https://t.me/din_alksndr'],
    ['weddings.contacts.instagram', 'group.weddings', 'https://www.instagram.com/din.alksndr/'],

    // --- Corporate hero + SEO ---
    ['corporate.seo.title', 'group.corporate', 'Ведущий корпоративов Александр Дин — Казахстан'],
    ['corporate.seo.description', 'group.corporate', 'Александр Дин — ведущий корпоративных мероприятий в Казахстане. Профессиональный подход, харизма и точный сценарий под ваш формат.'],
    ['corporate.hero.title', 'group.corporate', 'АЛЕКСАНДР ДИН'],
    ['corporate.hero.subtitle', 'group.corporate', 'Ведущий мероприятий'],

    // --- Corporate About (Instagram-мок) ---
    ['corporate.about.username', 'group.corporate', 'din.alksndr'],
    ['corporate.about.usernameHref', 'group.corporate', 'https://www.instagram.com/din.alksndr?igsh=Nm05aW14ZXBuMjUz'],
    ['corporate.about.location', 'group.corporate', 'Алматы, Казахстан'],
    ['corporate.about.likeHint', 'group.corporate', '← нажмите на сердечко'],
    ['corporate.about.thanks', 'group.corporate', 'Ой, спасибо, вы тоже супер!'],
    ['corporate.about.heading', 'group.corporate', 'ДАВАЙТЕ\nЗНАКОМИТЬСЯ!'],
    ['corporate.about.paragraphs', 'group.corporate', [
      'Меня зовут Александр Дин, я — ведущий мероприятий.',
      'В ивент-сфере уже более 7 лет и сегодня профессионально провожу события для крупнейших компаний Казахстана и международных брендов.',
      'Какое-то время успел побывать в сфере продаж и управления, поэтому хорошо понимаю чего ждут Ваши коллеги от совместного праздника.',
      'Самое главное, что хочется донести — я искренне люблю свою работу и делаю всё, чтобы Вы тоже любили свою.',
      'Уверен, наш общий корпоратив станет для этого отличным поводом :)\nЧтобы это проверить — оставляйте заявку на сайте.',
      'Буду рад встрече!',
    ]],

    // --- Corporate: Что вы получите ---
    ['corporate.benefits.heading', 'group.corporate', 'ЧТО ВЫ\nПОЛУЧИТЕ'],
    ['corporate.benefits.items', 'group.corporate', [
      { title: 'ДОВОЛЬНЫХ СОТРУДНИКОВ', text: 'Никого ни к чему не принуждаю и даю всем пространство для отдыха. Кроме самых активных, конечно же. К ним другой разговор.' },
      { title: 'ВНИМАНИЕ К ДЕТАЛЯМ', text: 'Заранее узнаю всё про Вашу компанию, коллег и использую это на мероприятии.' },
      { title: 'КОМАНДНАЯ ОРГАНИЗАЦИЯ', text: 'Мы вместе создадим праздник для Ваших сотрудников: я предложу идеи, а Вы выберите, что нравится.' },
      { title: 'СПОКОЙСТВИЕ', text: 'Многолетний опыт позволяет мне предугадывать любые ситуации, а тщательная подготовка даст Вам возможность расслабиться не только на корпоративе, но и задолго до него.' },
    ]],

    // --- Corporate CTA / Контакты ---
    ['corporate.cta.heading', 'group.corporate', '95% ЛЮДЕЙ СТАНОВЯТСЯ СЧАСТЛИВЕЕ\nПРИ НАЖАТИИ НА ЭТУ КНОПКУ'],
    ['corporate.cta.btn', 'group.corporate', 'Нажать на кнопку'],
    ['corporate.contacts.heading', 'group.corporate', 'КОНТАКТЫ'],
    ['corporate.contacts.phoneDisplay', 'group.corporate', '8 (707) 493-57-82'],
    ['corporate.contacts.phoneHref', 'group.corporate', 'tel:+77074935782'],
    ['corporate.contacts.whatsapp', 'group.corporate', 'https://wa.me/77074935782'],
    ['corporate.contacts.telegram', 'group.corporate', 'https://t.me/din_alksndr'],
    ['corporate.contacts.instagram', 'group.corporate', 'https://www.instagram.com/din.alksndr/'],

    // --- Форма заявки (QuizBlock) ---
    ['quiz.title', 'group.quiz', 'РАССЧИТАЙТЕ СТОИМОСТЬ, ОТВЕТИВ НА ВОПРОСЫ НИЖЕ'],
    ['quiz.step1.dateLabel', 'group.quiz', 'Дата'],
    ['quiz.step1.cityLabel', 'group.quiz', 'Место проведения'],
    ['quiz.step1.citySubLabel', 'group.quiz', 'Ответьте по желанию'],
    ['quiz.step1.cityPlaceholder', 'group.quiz', 'Укажите город'],
    ['quiz.cities', 'group.quiz', [
      'Алматы', 'Астана', 'Шымкент', 'Актобе', 'Тараз', 'Павлодар', 'Усть-Каменогорск',
      'Семей', 'Атырау', 'Костанай', 'Кызылорда', 'Уральск', 'Петропавловск', 'Актау',
      'Темиртау', 'Туркестан', 'Кокшетау', 'Талдыкорган', 'Экибастуз', 'Рудный',
      'Жезказган', 'Балхаш', 'Сатпаев', 'Кентау', 'Жанаозен', 'Байконур',
    ]],
    ['quiz.step2.label', 'group.quiz', 'Кол-во гостей (примерно)'],
    ['quiz.step2.subLabel', 'group.quiz', 'Ответьте по желанию'],
    ['quiz.step2.options', 'group.quiz', ['10-30', '30-50', '50-100', '>100']],
    ['quiz.step3.label', 'group.quiz', 'Кому сообщить результат?'],
    ['quiz.step3.namePlaceholder', 'group.quiz', 'Ваше имя *'],
    ['quiz.step3.phonePlaceholder', 'group.quiz', '(000) 000-00-00 *'],
    ['quiz.step3.phoneError', 'group.quiz', 'Введите полный номер: (000) 000-00-00'],
    ['quiz.step3.contactOptions', 'group.quiz', ['Отправить в Telegram', 'Отправить в WhatsApp', 'Позвонить лично']],
    ['quiz.step3.contactError', 'group.quiz', 'Выберите способ связи'],
    ['quiz.step3.consentText', 'group.quiz', 'Я даю согласие на обработку персональных данных *'],
    ['quiz.nextBtn', 'group.quiz', 'Следующий вопрос →'],
    ['quiz.submitBtn', 'group.quiz', 'Отправить заявку →'],
    ['quiz.submitBtnLoading', 'group.quiz', 'Отправка...'],
    ['quiz.errorMsg', 'group.quiz', 'Ошибка отправки. Попробуйте ещё раз.'],
    ['quiz.successTitle', 'group.quiz', 'Заявка отправлена!'],
    ['quiz.successText', 'group.quiz', 'Я свяжусь с вами в ближайшее время.'],
  ];

  const upsert = db.prepare(`
    INSERT INTO content (key, value, group_name) VALUES (?, ?, ?)
    ON CONFLICT(key) DO NOTHING
  `);
  const insertMany = db.transaction((rows) => {
    let inserted = 0;
    for (const [key, group, value] of rows) {
      const info = upsert.run(key, JSON.stringify(value), group);
      if (info.changes) inserted += 1;
    }
    return inserted;
  });
  const inserted = insertMany(items);
  console.log(`content: добавлено ${inserted} новых ключей из ${items.length} (уже существующие не трогал).`);
}

seedVideos();
seedPhotos();
seedContent();
console.log('Готово.');
