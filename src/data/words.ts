import { WordItem } from '../types';

export const CHUNKS = [
  { id: 1, title: 'Блок 1: Деловые основы', range: '1–10', desc: 'Контакты, компании, делегации и пожелания' },
  { id: 2, title: 'Блок 2: Партнеры и переписка', range: '11–20', desc: 'Персонал, отношения, рекомендации и запросы' },
  { id: 3, title: 'Блок 3: Заказы и организации', range: '21–30', desc: 'Каталоги, комитеты, ведомства и стратегия' },
  { id: 4, title: 'Блок 4: Филиалы и география', range: '31–40', desc: 'Дочерние фирмы, сферы, провинции и города' },
  { id: 5, title: 'Блок 5: Ярмарки и инвестиции', range: '41–50', desc: 'Выставки, масштаб, привлечение бизнеса и мосты' },
  { id: 6, title: 'Блок 6: Имена и ведомства', range: '51–57', desc: 'Имена партнеров, города, Кантонская ярмарка' },
];

export const WORDS: WordItem[] = [
  // --- CHUNK 1 (1-10) ---
  {
    id: 1,
    hanzi: '纺织品',
    pinyin: 'fǎngzhīpǐn',
    tones: [3, 1, 3],
    ru: 'текстиль, текстильные изделия',
    en: 'textile(s)',
    category: 'vocab',
    chunk: 1,
    morphemes: [
      { char: '纺', pinyin: 'fǎng', meaning: 'прясть, пряжа' },
      { char: '织', pinyin: 'zhī', meaning: 'ткать' },
      { char: '品', pinyin: 'pǐn', meaning: 'изделие, товар' }
    ],
    tip: 'Прясть (纺) + ткать (织) + товар (品) = текстильная продукция.'
  },
  {
    id: 2,
    hanzi: '总公司',
    pinyin: 'zǒnggōngsī',
    tones: [3, 1, 1],
    ru: 'головная компания',
    en: 'head office, parent company',
    category: 'vocab',
    chunk: 1,
    morphemes: [
      { char: '总', pinyin: 'zǒng', meaning: 'главный, общий' },
      { char: '公司', pinyin: 'gōngsī', meaning: 'компания' }
    ],
    tip: '总 = главный/генеральный (как в 总经理 генеральный директор).'
  },
  {
    id: 3,
    hanzi: '顺风',
    pinyin: 'shùnfēng',
    tones: [4, 1],
    ru: 'попутный ветер; по ветру',
    en: 'to go with the wind, favorable wind',
    category: 'vocab',
    chunk: 1,
    morphemes: [
      { char: '顺', pinyin: 'shùn', meaning: 'вдоль, по направлению, попутный' },
      { char: '风', pinyin: 'fēng', meaning: 'ветер' }
    ],
    tip: 'Пожелание: 一路顺风 (yílù shùnfēng) — Счастливого пути! (Попутного ветра на всем пути).'
  },
  {
    id: 4,
    hanzi: '关照',
    pinyin: 'guānzhào',
    tones: [1, 4],
    ru: 'заботиться, присматривать, помогать',
    en: 'to look after, to help, care',
    category: 'vocab',
    chunk: 1,
    morphemes: [
      { char: '关', pinyin: 'guān', meaning: 'забота, отношение (关心)' },
      { char: '照', pinyin: 'zhào', meaning: 'освещать, присматривать (照顾)' }
    ],
    tip: 'Вежливая фраза: 请多关照 (Прошу любить и жаловать / позаботьтесь обо мне).'
  },
  {
    id: 5,
    hanzi: '希望',
    pinyin: 'xīwàng',
    tones: [1, 4],
    ru: 'надеяться; надежда',
    en: 'to hope; hope',
    category: 'vocab',
    chunk: 1,
    morphemes: [
      { char: '希', pinyin: 'xī', meaning: 'редкий, надеяться' },
      { char: '望', pinyin: 'wàng', meaning: 'всматриваться вдаль, ожидать' }
    ],
    tip: 'Часто в деловых письмах: 我们希望... (Мы надеемся...)'
  },
  {
    id: 6,
    hanzi: '期间',
    pinyin: 'qījiān',
    tones: [1, 1],
    ru: 'период, время',
    en: 'time, period, duration',
    category: 'vocab',
    chunk: 1,
    morphemes: [
      { char: '期', pinyin: 'qī', meaning: 'срок, период' },
      { char: '间', pinyin: 'jiān', meaning: 'промежуток, среди' }
    ],
    tip: 'В грамматике ставится после события: 访问期间 (во время визита).'
  },
  {
    id: 7,
    hanzi: '允许',
    pinyin: 'yǔnxǔ',
    tones: [3, 3],
    ru: 'разрешать, позволять',
    en: 'to allow, to permit',
    category: 'vocab',
    chunk: 1,
    morphemes: [
      { char: '允', pinyin: 'yǔn', meaning: 'соглашаться, одобрять' },
      { char: '许', pinyin: 'xǔ', meaning: 'обещать, позволять' }
    ],
    tip: 'Оба слога 3-го тона -> произносится yúnxǔ (правило смены тонов 3+3 -> 2+3).'
  },
  {
    id: 8,
    hanzi: '委派',
    pinyin: 'wěipài',
    tones: [3, 4],
    ru: 'командировать, назначать, поручать',
    en: 'to entrust, to designate, to dispatch',
    category: 'vocab',
    chunk: 1,
    morphemes: [
      { char: '委', pinyin: 'wěi', meaning: 'поручать (委托)' },
      { char: '派', pinyin: 'pài', meaning: 'отправлять, направлять (派出)' }
    ],
    tip: 'Деловой глагол: компания «направляет/командирует» сотрудника.'
  },
  {
    id: 9,
    hanzi: '具体',
    pinyin: 'jùtǐ',
    tones: [4, 3],
    ru: 'конкретный',
    en: 'concrete, specific',
    category: 'vocab',
    chunk: 1,
    morphemes: [
      { char: '具', pinyin: 'jù', meaning: 'обладать, иметь форму' },
      { char: '体', pinyin: 'tǐ', meaning: 'тело, сущность' }
    ],
    tip: 'Имеющий физическое тело/форму = конкретный (противоположность 抽象 абстрактный).'
  },
  {
    id: 10,
    hanzi: '代表团',
    pinyin: 'dàibiǎotuán',
    tones: [4, 3, 2],
    ru: 'делегация',
    en: 'delegation',
    category: 'vocab',
    chunk: 1,
    morphemes: [
      { char: '代表', pinyin: 'dàibiǎo', meaning: 'представитель, представлять' },
      { char: '团', pinyin: 'tuán', meaning: 'группа, союз, коллектив' }
    ],
    tip: 'Группа (团) представителей (代表) = делегация.'
  },

  // --- CHUNK 2 (11-20) ---
  {
    id: 11,
    hanzi: '成员',
    pinyin: 'chéngyuán',
    tones: [2, 2],
    ru: 'член (делегации, группы)',
    en: 'member',
    category: 'vocab',
    chunk: 2,
    morphemes: [
      { char: '成', pinyin: 'chéng', meaning: 'составлять, становиться' },
      { char: '员', pinyin: 'yuán', meaning: 'человек, сотрудник, лицо' }
    ],
    tip: 'Лицо, составляющее группу = член группы.'
  },
  {
    id: 12,
    hanzi: '助手',
    pinyin: 'zhùshǒu',
    tones: [4, 3],
    ru: 'помощник, ассистент',
    en: 'assistant',
    category: 'vocab',
    chunk: 2,
    morphemes: [
      { char: '助', pinyin: 'zhù', meaning: 'помогать (帮助)' },
      { char: '手', pinyin: 'shǒu', meaning: 'рука; мастер, человек' }
    ],
    tip: 'Буквально «рука помощи» или «человек, помогающий делу».'
  },
  {
    id: 13,
    hanzi: '保持',
    pinyin: 'bǎochí',
    tones: [3, 2],
    ru: 'поддерживать, сохранять',
    en: 'to keep, to maintain',
    category: 'vocab',
    chunk: 2,
    morphemes: [
      { char: '保', pinyin: 'bǎo', meaning: 'защищать, беречь, сохранять' },
      { char: '持', pinyin: 'chí', meaning: 'держать в руках, поддерживать' }
    ],
    tip: 'Частое сочетание: 保持联系 (поддерживать связь).'
  },
  {
    id: 14,
    hanzi: '密切',
    pinyin: 'mìqiè',
    tones: [4, 4],
    ru: 'тесный, близкий',
    en: 'close, intimate',
    category: 'vocab',
    chunk: 2,
    morphemes: [
      { char: '密', pinyin: 'mì', meaning: 'густой, плотный, секретный' },
      { char: '切', pinyin: 'qiè', meaning: 'вплотную, искренний' }
    ],
    tip: 'Часто: 保持密切联系 (поддерживать тесные связи/контакты).'
  },
  {
    id: 15,
    hanzi: '询问',
    pinyin: 'xúnwèn',
    tones: [2, 4],
    ru: 'расспрашивать, осведомляться',
    en: 'to inquire',
    category: 'vocab',
    chunk: 2,
    morphemes: [
      { char: '询', pinyin: 'xún', meaning: 'расспрашивать, справляться' },
      { char: '问', pinyin: 'wèn', meaning: 'спрашивать' }
    ],
    tip: 'Более официальный и вежливый синоним слова 问.'
  },
  {
    id: 16,
    hanzi: '结识',
    pinyin: 'jiéshí',
    tones: [2, 2],
    ru: 'познакомиться',
    en: 'to get to know, to make acquaintance',
    category: 'vocab',
    chunk: 2,
    morphemes: [
      { char: '结', pinyin: 'jié', meaning: 'связывать, узел' },
      { char: '识', pinyin: 'shí', meaning: 'знать, распознавать (认识)' }
    ],
    tip: 'Связать (结) знакомство (识) — более официальное, чем 认识.'
  },
  {
    id: 17,
    hanzi: '商务',
    pinyin: 'shāngwù',
    tones: [1, 4],
    ru: 'коммерческие дела, коммерция',
    en: 'commercial affairs, business',
    category: 'vocab',
    chunk: 2,
    morphemes: [
      { char: '商', pinyin: 'shāng', meaning: 'торговля, бизнес' },
      { char: '务', pinyin: 'wù', meaning: 'дело, служба, занятие' }
    ],
    tip: 'Корень в словах: 商务部 (Минкоммерции), 电子商务 (e-commerce).'
  },
  {
    id: 18,
    hanzi: '推荐',
    pinyin: 'tuījiàn',
    tones: [1, 4],
    ru: 'рекомендовать',
    en: 'to recommend',
    category: 'vocab',
    chunk: 2,
    morphemes: [
      { char: '推', pinyin: 'tuī', meaning: 'толкать, продвигать' },
      { char: '荐', pinyin: 'jiàn', meaning: 'выдвигать кандидатуру, представлять' }
    ],
    tip: 'Продвигать (推) и выдвигать (荐) = рекомендовать.'
  },
  {
    id: 19,
    hanzi: '附上',
    pinyin: 'fùshàng',
    tones: [4, 4],
    ru: 'приложить (к письму), прикрепить',
    en: 'to enclose, to attach',
    category: 'vocab',
    chunk: 2,
    morphemes: [
      { char: '附', pinyin: 'fù', meaning: 'прилагать, крепить' },
      { char: '上', pinyin: 'shàng', meaning: 'наверх, к' }
    ],
    tip: 'Стандартная фраза делового email: 随信附上... (к письму прилагаем...)'
  },
  {
    id: 20,
    hanzi: '需要',
    pinyin: 'xūyào',
    tones: [1, 4],
    ru: 'требоваться, нуждаться; потребность',
    en: 'to need, to require; demand',
    category: 'vocab',
    chunk: 2,
    morphemes: [
      { char: '需', pinyin: 'xū', meaning: 'нуждаться, необходимость' },
      { char: '要', pinyin: 'yào', meaning: 'хотеть, требоваться' }
    ],
    tip: 'Может быть глаголом (нуждаться) и сущ. (потребность: 客户的需要).'
  },

  // --- CHUNK 3 (21-30) ---
  {
    id: 21,
    hanzi: '订购',
    pinyin: 'dìnggòu',
    tones: [4, 4],
    ru: 'заказывать (товар)',
    en: 'to order (goods)',
    category: 'vocab',
    chunk: 3,
    morphemes: [
      { char: '订', pinyin: 'dìng', meaning: 'договариваться, бронировать (预订)' },
      { char: '购', pinyin: 'gòu', meaning: 'покупать, приобретать (购买)' }
    ],
    tip: 'Договариваться о покупке = заказывать товар.'
  },
  {
    id: 22,
    hanzi: '目录',
    pinyin: 'mùlù',
    tones: [4, 4],
    ru: 'каталог, список',
    en: 'catalogue, list, directory',
    category: 'vocab',
    chunk: 3,
    morphemes: [
      { char: '目', pinyin: 'mù', meaning: 'глаз; пункт, раздел (项目)' },
      { char: '录', pinyin: 'lù', meaning: 'запись, регистр, вносить' }
    ],
    tip: 'Запись пунктов = каталог продукции или содержание книги.'
  },
  {
    id: 23,
    hanzi: '委员会',
    pinyin: 'wěiyuánhuì',
    tones: [3, 2, 4],
    ru: 'комитет, комиссия',
    en: 'committee, commission',
    category: 'vocab',
    chunk: 3,
    morphemes: [
      { char: '委员', pinyin: 'wěiyuán', meaning: 'комиссар, член комиссии' },
      { char: '会', pinyin: 'huì', meaning: 'собрание, совет, общество' }
    ],
    tip: 'Собрание уполномоченных лиц (委员) = комитет.'
  },
  {
    id: 24,
    hanzi: '投石问路',
    pinyin: 'tóushí-wènlù',
    tones: [2, 2, 4, 4],
    ru: 'прощупывать почву (букв. «бросить камень, чтобы узнать дорогу»)',
    en: 'to explore the way, test the waters',
    category: 'vocab',
    chunk: 3,
    morphemes: [
      { char: '投', pinyin: 'tóu', meaning: 'бросать, кидать' },
      { char: '石', pinyin: 'shí', meaning: 'камень' },
      { char: '问', pinyin: 'wèn', meaning: 'спрашивать, узнавать' },
      { char: '路', pinyin: 'lù', meaning: 'дорога, путь' }
    ],
    tip: 'Образный чэнъюй: бросить вперед камень в темноте, чтобы узнать, твердая ли почва.'
  },
  {
    id: 25,
    hanzi: '简便',
    pinyin: 'jiǎnbiàn',
    tones: [3, 4],
    ru: 'простой и удобный',
    en: 'simple and convenient, handy',
    category: 'vocab',
    chunk: 3,
    morphemes: [
      { char: '简', pinyin: 'jiǎn', meaning: 'простой (简单)' },
      { char: '便', pinyin: 'biàn', meaning: 'удобный (方便)' }
    ],
    tip: 'Слияние 简单 (простой) + 方便 (удобный) = 简便.'
  },
  {
    id: 26,
    hanzi: '驻',
    pinyin: 'zhù',
    tones: [4],
    ru: 'быть аккредитованным, находиться/располагаться',
    en: 'to be stationed, resident',
    category: 'vocab',
    chunk: 3,
    morphemes: [
      { char: '驻', pinyin: 'zhù', meaning: 'останавливаться, размещаться, аккредитоваться' }
    ],
    tip: 'Употребляется перед страной: 驻华 (аккредитованный в Китае), 驻美 (в США).'
  },
  {
    id: 27,
    hanzi: '机构',
    pinyin: 'jīgòu',
    tones: [1, 4],
    ru: 'орган, учреждение, структура',
    en: 'setup, organization, institution',
    category: 'vocab',
    chunk: 3,
    morphemes: [
      { char: '机', pinyin: 'jī', meaning: 'механизм, аппарат' },
      { char: '构', pinyin: 'gòu', meaning: 'конструкция, строить' }
    ],
    tip: 'Механизм устройства общества = организация, учреждение.'
  },
  {
    id: 28,
    hanzi: '官方',
    pinyin: 'guānfāng',
    tones: [1, 1],
    ru: 'официальный, правительственный',
    en: 'government, official',
    category: 'vocab',
    chunk: 3,
    morphemes: [
      { char: '官', pinyin: 'guān', meaning: 'чиновник, государственный' },
      { char: '方', pinyin: 'fāng', meaning: 'сторона (люди, ведомство)' }
    ],
    tip: 'Сторона чиновников = официальные власти / правительственные круги.'
  },
  {
    id: 29,
    hanzi: '处',
    pinyin: 'chù',
    tones: [4],
    ru: 'отдел, управление',
    en: 'department, office, section',
    category: 'vocab',
    chunk: 3,
    morphemes: [
      { char: '处', pinyin: 'chù', meaning: 'место; отдел в министерстве (4 тон)' }
    ],
    tip: 'Важно: в значении "отдел/управление" читается 4-м тоном (chù).'
  },
  {
    id: 30,
    hanzi: '民间',
    pinyin: 'mínjiān',
    tones: [2, 1],
    ru: 'негосударственный, народный, общественный',
    en: 'non-government, folk, civil',
    category: 'vocab',
    chunk: 3,
    morphemes: [
      { char: '民', pinyin: 'mín', meaning: 'народ, граждане (人民)' },
      { char: '间', pinyin: 'jiān', meaning: 'среди, среда' }
    ],
    tip: 'В народе / среди народа = негосударственный (антоним к 官方).'
  },

  // --- CHUNK 4 (31-40) ---
  {
    id: 31,
    hanzi: '子公司',
    pinyin: 'zǐgōngsī',
    tones: [3, 1, 1],
    ru: 'дочерняя компания',
    en: 'subsidiary, branch company',
    category: 'vocab',
    chunk: 4,
    morphemes: [
      { char: '子', pinyin: 'zǐ', meaning: 'сын, ребенок, дочерний' },
      { char: '公司', pinyin: 'gōngsī', meaning: 'компания' }
    ],
    tip: 'Сравните: 总公司 (головная) и 子公司 (дочерняя).'
  },
  {
    id: 32,
    hanzi: '专业',
    pinyin: 'zhuānyè',
    tones: [1, 4],
    ru: 'специализированный; специальность',
    en: 'specialized; speciality, profession',
    category: 'vocab',
    chunk: 4,
    morphemes: [
      { char: '专', pinyin: 'zhuān', meaning: 'специальный, исключительный' },
      { char: '业', pinyin: 'yè', meaning: 'дело, отрасль, профессия' }
    ],
    tip: 'Узкая отрасль = специальность или профессиональный/специализированный.'
  },
  {
    id: 33,
    hanzi: '资料',
    pinyin: 'zīliào',
    tones: [1, 4],
    ru: 'материалы, данные',
    en: 'data, material, information',
    category: 'vocab',
    chunk: 4,
    morphemes: [
      { char: '资', pinyin: 'zī', meaning: 'ресурсы, капитал' },
      { char: '料', pinyin: 'liào', meaning: 'материал, сырье' }
    ],
    tip: 'Информационные ресурсы = материалы (письменные, аналитические).'
  },
  {
    id: 34,
    hanzi: '范围',
    pinyin: 'fànwéi',
    tones: [4, 2],
    ru: 'сфера, рамки, охват',
    en: 'scope, range, limits',
    category: 'vocab',
    chunk: 4,
    morphemes: [
      { char: '范', pinyin: 'fàn', meaning: 'образец, норма, рамка' },
      { char: '围', pinyin: 'wéi', meaning: 'окружать, периметр' }
    ],
    tip: 'Бизнес-контекст: 业务范围 (сфера деятельности компании).'
  },
  {
    id: 35,
    hanzi: '渠道',
    pinyin: 'qúdào',
    tones: [2, 4],
    ru: 'канал (связи, сбыта)',
    en: 'channel (of communication, distribution)',
    category: 'vocab',
    chunk: 4,
    morphemes: [
      { char: '渠', pinyin: 'qú', meaning: 'ров, водоканал' },
      { char: '道', pinyin: 'dào', meaning: 'путь, русло' }
    ],
    tip: 'Бизнес-русло: 销售渠道 (каналы продаж), 通讯渠道 (каналы связи).'
  },
  {
    id: 36,
    hanzi: '举办',
    pinyin: 'jǔbàn',
    tones: [3, 4],
    ru: 'организовывать, проводить',
    en: 'to hold, to conduct (an event)',
    category: 'vocab',
    chunk: 4,
    morphemes: [
      { char: '举', pinyin: 'jǔ', meaning: 'поднимать, приводить в действие' },
      { char: '办', pinyin: 'bàn', meaning: 'делать, вести дела' }
    ],
    tip: 'Употребляется с мероприятиями: 举办展览会 (проводить выставку).'
  },
  {
    id: 37,
    hanzi: '博览会',
    pinyin: 'bólǎnhuì',
    tones: [2, 3, 4],
    ru: 'выставка, ярмарка',
    en: 'fair, exposition, expo',
    category: 'vocab',
    chunk: 4,
    morphemes: [
      { char: '博', pinyin: 'bó', meaning: 'богатый, обширный (как в 世博会 ЭКСПО)' },
      { char: '览', pinyin: 'lǎn', meaning: 'осматривать, обозревать (游览)' },
      { char: '会', pinyin: 'huì', meaning: 'собрание' }
    ],
    tip: 'Обширное собрание для всеобщего обозрения = выставка/экспозиция.'
  },
  {
    id: 38,
    hanzi: '省',
    pinyin: 'shěng',
    tones: [3],
    ru: 'провинция',
    en: 'province',
    category: 'vocab',
    chunk: 4,
    morphemes: [
      { char: '省', pinyin: 'shěng', meaning: 'провинция (высшая административная единица КНР)' }
    ],
    tip: 'Например: 广东省 (провинция Гуандун).'
  },
  {
    id: 39,
    hanzi: '市',
    pinyin: 'shì',
    tones: [4],
    ru: 'город',
    en: 'municipality, city, market',
    category: 'vocab',
    chunk: 4,
    morphemes: [
      { char: '市', pinyin: 'shì', meaning: 'город, рынок' }
    ],
    tip: 'Например: 北京市 (город Пекин), 上海市 (город Шанхай).'
  },
  {
    id: 40,
    hanzi: '地方',
    pinyin: 'dìfang',
    tones: [4, 5],
    ru: 'место; местный',
    en: 'place, locality; local',
    category: 'vocab',
    chunk: 4,
    morphemes: [
      { char: '地', pinyin: 'dì', meaning: 'земля, территория' },
      { char: '方', pinyin: 'fang', meaning: 'сторона, край (нейтральный тон)' }
    ],
    tip: '地方 правительство / местный уровень (антоним 中央 центральный).'
  },

  // --- CHUNK 5 (41-50) ---
  {
    id: 41,
    hanzi: '交易会',
    pinyin: 'jiāoyìhuì',
    tones: [1, 4, 4],
    ru: 'торговая ярмарка',
    en: 'trade fair',
    category: 'vocab',
    chunk: 5,
    morphemes: [
      { char: '交易', pinyin: 'jiāoyì', meaning: 'торговые сделки, обмен' },
      { char: '会', pinyin: 'huì', meaning: 'собрание, ярмарка' }
    ],
    tip: 'Собрание для совершения торговых сделок (交易).'
  },
  {
    id: 42,
    hanzi: '综合性',
    pinyin: 'zōnghéxìng',
    tones: [1, 2, 4],
    ru: 'комплексный характер, универсальность',
    en: 'comprehensiveness, composite nature',
    category: 'vocab',
    chunk: 5,
    morphemes: [
      { char: '综合', pinyin: 'zōnghé', meaning: 'комплексный, сводный' },
      { char: '性', pinyin: 'xìng', meaning: 'свойство, характер, суффикс -ость/-ство' }
    ],
    tip: 'Суффикс 性 образует абстрактное свойство (как англ. -ness, -ity).'
  },
  {
    id: 43,
    hanzi: '大型',
    pinyin: 'dàxíng',
    tones: [4, 2],
    ru: 'крупномасштабный, крупный',
    en: 'large-scale, large-sized',
    category: 'vocab',
    chunk: 5,
    morphemes: [
      { char: '大', pinyin: 'dà', meaning: 'большой' },
      { char: '型', pinyin: 'xíng', meaning: 'тип, размер, модель' }
    ],
    tip: 'Большого типа = крупномасштабный (大型企业 крупное предприятие).'
  },
  {
    id: 44,
    hanzi: '积极',
    pinyin: 'jījí',
    tones: [1, 2],
    ru: 'активный',
    en: 'active, positive, enthusiastic',
    category: 'vocab',
    chunk: 5,
    morphemes: [
      { char: '积', pinyin: 'jī', meaning: 'накапливать' },
      { char: '极', pinyin: 'jí', meaning: 'полюс, предел, крайность' }
    ],
    tip: 'Часто в девизах: 积极参加 (активно участвовать).'
  },
  {
    id: 45,
    hanzi: '参展',
    pinyin: 'cānzhǎn',
    tones: [1, 3],
    ru: 'участвовать в выставке',
    en: 'to attend/participate in an exhibition',
    category: 'vocab',
    chunk: 5,
    morphemes: [
      { char: '参', pinyin: 'cān', meaning: 'участвовать (参加)' },
      { char: '展', pinyin: 'zhǎn', meaning: 'выставка (展览)' }
    ],
    tip: 'Сокращение: 参加 (участвовать) + 展览 (выставка) = 参展.'
  },
  {
    id: 46,
    hanzi: '纷纷',
    pinyin: 'fēnfēn',
    tones: [1, 1],
    ru: 'один за другим, массово',
    en: 'numerous, one after another, in succession',
    category: 'vocab',
    chunk: 5,
    morphemes: [
      { char: '纷', pinyin: 'fēn', meaning: 'многочисленный, хаотичный' },
      { char: '纷', pinyin: 'fēn', meaning: 'удвоение для усиления' }
    ],
    tip: 'О действиях многих людей: 大家纷纷表示... (Все один за другим высказали...)'
  },
  {
    id: 47,
    hanzi: '区域',
    pinyin: 'qūyù',
    tones: [1, 4],
    ru: 'район, регион, региональный',
    en: 'region, zone, area',
    category: 'vocab',
    chunk: 5,
    morphemes: [
      { char: '区', pinyin: 'qū', meaning: 'район, зона (地区)' },
      { char: '域', pinyin: 'yù', meaning: 'территория, пределы (地域)' }
    ],
    tip: 'Географический регион или экономическая зона.'
  },
  {
    id: 48,
    hanzi: '招商',
    pinyin: 'zhāoshāng',
    tones: [1, 1],
    ru: 'привлекать инвестиции / бизнес',
    en: 'to invite outside investments, attract business',
    category: 'vocab',
    chunk: 5,
    morphemes: [
      { char: '招', pinyin: 'zhāo', meaning: 'манить, привлекать, созывать' },
      { char: '商', pinyin: 'shāng', meaning: 'купцы, бизнес, инвестиции' }
    ],
    tip: 'Привлекать купцов/бизнес = привлекать инвестиции в регион.'
  },
  {
    id: 49,
    hanzi: '牵线搭桥',
    pinyin: 'qiānxiàn-dāqiáo',
    tones: [1, 4, 1, 2],
    ru: 'наводить мосты, выступать связующим звеном',
    en: 'to serve as a link, bridge-building',
    category: 'vocab',
    chunk: 5,
    morphemes: [
      { char: '牵线', pinyin: 'qiānxiàn', meaning: 'тянуть нить / соединять нитями' },
      { char: '搭桥', pinyin: 'dāqiáo', meaning: 'строить/наводить мост' }
    ],
    tip: 'Красивая образная идиома о посредничестве и сближении партнеров.'
  },
  {
    id: 50,
    hanzi: '道路',
    pinyin: 'dàolù',
    tones: [4, 4],
    ru: 'дорога, путь',
    en: 'road, way, path',
    category: 'vocab',
    chunk: 5,
    morphemes: [
      { char: '道', pinyin: 'dào', meaning: 'дорога, путь, дао' },
      { char: '路', pinyin: 'lù', meaning: 'дорога, улица' }
    ],
    tip: 'И в прямом, и в переносном смысле (путь развития).'
  },

  // --- CHUNK 6: PROPER NAMES (51-57) ---
  {
    id: 51,
    hanzi: '纽约',
    pinyin: 'Niǔyuē',
    tones: [3, 1],
    ru: 'Нью-Йорк',
    en: 'New York',
    category: 'proper',
    chunk: 6,
    morphemes: [
      { char: '纽', pinyin: 'niǔ', meaning: 'узел (фонетически "Нью")' },
      { char: '约', pinyin: 'yuē', meaning: 'договор (фонетически "Йорк")' }
    ],
    tip: 'Фонетическая транскрипция города New York.'
  },
  {
    id: 52,
    hanzi: '罗斯',
    pinyin: 'Luósī',
    tones: [2, 1],
    ru: 'Росс (фамилия)',
    en: 'Ross',
    category: 'proper',
    chunk: 6,
    morphemes: [
      { char: '罗', pinyin: 'luó', meaning: 'сеть (фонетически "Ро-")' },
      { char: '斯', pinyin: 'sī', meaning: 'этот (фонетически "-сс")' }
    ],
    tip: 'Имя/фамилия партнера из первого диалога.'
  },
  {
    id: 53,
    hanzi: '杰克逊',
    pinyin: 'Jiékèxùn',
    tones: [2, 4, 4],
    ru: 'Джексон (фамилия)',
    en: 'Jackson',
    category: 'proper',
    chunk: 6,
    morphemes: [
      { char: '杰', pinyin: 'jié', meaning: 'выдающийся ("Джек-")' },
      { char: '克', pinyin: 'kè', meaning: 'преодолевать ("-к-")' },
      { char: '逊', pinyin: 'xùn', meaning: 'скромный ("-сон")' }
    ],
    tip: 'Американская фамилия Jackson в китайской записи.'
  },
  {
    id: 54,
    hanzi: '布朗',
    pinyin: 'Bùlǎng',
    tones: [4, 3],
    ru: 'Браун (фамилия)',
    en: 'Brown',
    category: 'proper',
    chunk: 6,
    morphemes: [
      { char: '布', pinyin: 'bù', meaning: 'ткань / объявлять ("Б-")' },
      { char: '朗', pinyin: 'lǎng', meaning: 'ясный, звонкий ("-раун")' }
    ],
    tip: 'Фамилия Brown.'
  },
  {
    id: 55,
    hanzi: '商务部',
    pinyin: 'Shāngwù Bù',
    tones: [1, 4, 4],
    ru: 'Министерство коммерции (КНР)',
    en: 'Ministry of Commerce (MOFCOM)',
    category: 'proper',
    chunk: 6,
    morphemes: [
      { char: '商务', pinyin: 'shāngwù', meaning: 'коммерческие дела' },
      { char: '部', pinyin: 'bù', meaning: 'министерство, ведомство' }
    ],
    tip: 'Ключевое экономическое ведомство Китая.'
  },
  {
    id: 56,
    hanzi: '天津',
    pinyin: 'Tiānjīn',
    tones: [1, 1],
    ru: 'Тяньцзинь',
    en: 'Tianjin',
    category: 'proper',
    chunk: 6,
    morphemes: [
      { char: '天', pinyin: 'tiān', meaning: 'небо, император' },
      { char: '津', pinyin: 'jīn', meaning: 'брод, переправа' }
    ],
    tip: 'Один из 4 городов центрального подчинения Китая, порт рядом с Пекином.'
  },
  {
    id: 57,
    hanzi: '广交会 (中国进出口商品交易会)',
    pinyin: 'Guǎngjiāohuì (Zhōngguó Jìn-chūkǒu Shāngpǐn Jiāoyì Huì)',
    tones: [3, 1, 4],
    ru: 'Кантонская ярмарка (Китайская ярмарка импортных и экспортных товаров)',
    en: 'Canton Fair (China Import and Export Fair)',
    category: 'proper',
    chunk: 6,
    morphemes: [
      { char: '广', pinyin: 'guǎng', meaning: 'Гуанчжоу / широкий' },
      { char: '交', pinyin: 'jiāo', meaning: 'обмен, торговля' },
      { char: '会', pinyin: 'huì', meaning: 'ярмарка, собрание' }
    ],
    tip: 'Самая крупная и старейшая торговая выставка Китая в Гуанчжоу!'
  }
];
