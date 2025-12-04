import { NotificationTemplate, SurahData, TimeContext, Dhikr } from './types';

// ... (Keep existing Notifications and Quran Data) ...
// --- Task 1: Hyper-Personalized Nudge Engine Content ---

export const FAJR_NOTIFICATIONS: NotificationTemplate[] = [
  { id: 'f1', category: 'fajr', content: 'صمت الفجر يُعيد ترميم روحك.' },
  { id: 'f2', category: 'fajr', content: 'تنفس بعمق.. واتصل بمصدر القوة.' },
  { id: 'f3', category: 'fajr', content: 'بداية هادئة ليوم مليء بالإنجاز.' },
  { id: 'f4', category: 'fajr', content: 'إعادة ضبط البوصلة نحو السماء.' },
  { id: 'f5', category: 'fajr', content: 'نور الفجر يزيل عتمة القلب.' },
  { id: 'f6', category: 'fajr', content: 'استقبل يومك بقلبٍ حاضر.' },
  { id: 'f7', category: 'fajr', content: 'اللحظة المثالية للخلوة مع الذات.' },
  { id: 'f8', category: 'fajr', content: 'وقودك الروحي لرحلة اليوم.' },
  { id: 'f9', category: 'fajr', content: 'دع السكينة تتسلل إلى أعماقك.' },
  { id: 'f10', category: 'fajr', content: 'اصنع مساحتك المقدسة الآن.' },
  { id: 'f11', category: 'fajr', content: 'استيقظ.. العالم ينتظر أثرك الطيب.' },
  { id: 'f12', category: 'fajr', content: 'صفاء الذهن يبدأ بسجدة.' },
  { id: 'f13', category: 'fajr', content: 'رتب فوضى عقلك في هدوء الفجر.' },
  { id: 'f14', category: 'fajr', content: 'موعدك الخاص لتجديد العهد.' },
  { id: 'f15', category: 'fajr', content: 'الشروق الحقيقي يبدأ من داخلك.' },
];

export const ASR_NOTIFICATIONS: NotificationTemplate[] = [
  { id: 'a1', category: 'asr', content: 'توقف لحظة.. استعد توازنك الآن.' },
  { id: 'a2', category: 'asr', content: 'استراحة المحارب لتجديد الطاقة.' },
  { id: 'a3', category: 'asr', content: 'افصل عن ضجيج العالم قليلاً.' },
  { id: 'a4', category: 'asr', content: 'تنفس.. لا يزال في اليوم متسع.' },
  { id: 'a5', category: 'asr', content: 'عد إلى مركزك الروحي.' },
  { id: 'a6', category: 'asr', content: 'هدوء ما قبل الغروب يبدأ الآن.' },
  { id: 'a7', category: 'asr', content: 'أعد شحن قلبك لإكمال المسير.' },
  { id: 'a8', category: 'asr', content: 'انسحب من الزحام إلى السلام.' },
  { id: 'a9', category: 'asr', content: 'فرصة لاستعادة الصفاء الذهني.' },
  { id: 'a10', category: 'asr', content: 'دع القلق واسجد لرب الفلق.' },
  { id: 'a11', category: 'asr', content: 'واحة سلام في منتصف الزحام.' },
  { id: 'a12', category: 'asr', content: 'خفف أحمالك النفسية الآن.' },
  { id: 'a13', category: 'asr', content: 'لحظة إدراك وتصحيح مسار.' },
  { id: 'a14', category: 'asr', content: 'جدد نيتك وأكمل عملك.' },
  { id: 'a15', category: 'asr', content: 'السكينة تنتظرك.. لا تتأخر.' },
];

export const MIDDAY_MOTIVATION: NotificationTemplate[] = [
  { id: 'm1', category: 'midday', content: '﴿وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ﴾', tag: '#إتقان_العمل' },
  { id: 'm2', category: 'midday', content: '﴿وَاصْبِرْ لِحُكْمِ رَبِّكَ فَإِنَّكَ بِأَعْيُنِنَا﴾', tag: '#المرونة' },
  { id: 'm3', category: 'midday', content: 'إن الله يحب إذا عمل أحدكم عملاً أن يتقنه.', tag: '#التميز' },
  { id: 'm4', category: 'midday', content: '﴿لا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا﴾', tag: '#توازن' },
  { id: 'm5', category: 'midday', content: 'استعن بالله ولا تعجز.', tag: '#القوة' },
];

export const SLEEP_TRANQUILITY: NotificationTemplate[] = [
  { id: 's1', category: 'sleep', content: '﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾', tag: '#سكينة' },
  { id: 's2', category: 'sleep', content: 'باسمك ربي وضعت جنبي.. فاغفر لي.', tag: '#تسليم' },
  { id: 's3', category: 'sleep', content: 'أفرغ قلبك من ضجيج اليوم.', tag: '#تأمل' },
  { id: 's4', category: 'sleep', content: 'غداً يوم أجمل.. نم قرير العين.', tag: '#أمل' },
  { id: 's5', category: 'sleep', content: 'جلسة هدوء مسائية: امتنان لما أنجزت.', tag: '#امتنان' },
];

export const QURAN_DATA: SurahData[] = [
  {
    id: '12',
    name: 'سورة يوسف',
    segments: [
      {
        id: 'y1',
        surahName: 'يوسف',
        range: 'الآيات 1-6',
        moodTag: '#بناء_الرؤية',
        motivationalText: 'الأحلام العظيمة تبدأ برؤية صادقة في قلب نقي.'
      },
      {
        id: 'y2',
        surahName: 'يوسف',
        range: 'الآيات 23-34',
        moodTag: '#تحدي_الإغراء',
        motivationalText: 'قوة الشخصية تظهر عند القدرة على قول "لا" للخطأ.'
      },
      {
        id: 'y3',
        surahName: 'يوسف',
        range: 'الآيات 80-87',
        moodTag: '#الأمل_الصادق',
        motivationalText: 'لا تيأس من رَوْح الله مهما اشتدت الظروف.'
      },
      {
        id: 'y4',
        surahName: 'يوسف',
        range: 'الآيات 90-101',
        moodTag: '#الفرج_بعد_الشدة',
        motivationalText: 'الصبر الجميل نهايته تمكين وعزة.'
      },
      {
        id: 'y5',
        surahName: 'يوسف',
        range: 'الآيات 54-57',
        moodTag: '#التخطيط_للمستقبل',
        motivationalText: 'الكفاءة والأمانة هما مفتاح إدارة الأزمات.'
      }
    ]
  },
  {
    id: '18',
    name: 'سورة الكهف',
    segments: [
      {
        id: 'k1',
        surahName: 'الكهف',
        range: 'الآيات 9-26',
        moodTag: '#الثبات_على_المبدأ',
        motivationalText: 'العزلة عن الباطل تحمي نقاء الفكرة.'
      },
      {
        id: 'k2',
        surahName: 'الكهف',
        range: 'الآيات 32-44',
        moodTag: '#حقيقة_الثروة',
        motivationalText: 'قيمتك الحقيقية في جوهرك لا في ممتلكاتك.'
      },
      {
        id: 'k3',
        surahName: 'الكهف',
        range: 'الآيات 60-82',
        moodTag: '#التواضع_للعلم',
        motivationalText: 'رحلة التعلم تتطلب صبراً على ما لم تحط به خبراً.'
      },
      {
        id: 'k4',
        surahName: 'الكهف',
        range: 'الآيات 83-98',
        moodTag: '#القيادة_والقوة',
        motivationalText: 'سخّر قوتك لخدمة الضعفاء وبناء الحضارة.'
      },
      {
        id: 'k5',
        surahName: 'الكهف',
        range: 'الآيات 103-110',
        moodTag: '#الإخلاص',
        motivationalText: 'العمل الصالح هو ما كان خالصاً لوجه الله.'
      }
    ]
  }
];

export const UI_COPY = {
  dashboardTitles: {
    morning: "إشراقة جديدة.. اصنع أثرك.",
    afternoon: "واصل السعي.. أنت في الطريق.",
    evening: "هدوء المساء.. وقت الامتنان."
  },
  trackHabitButtons: [
    "وثّق إنجازك الروحي",
    "أضف لحظة وعي",
    "سجّل أثراً طيباً"
  ],
  weeklySummary: {
    good: "نسقك البياني مذهل هذا الأسبوع، روحك في صعود مستمر.",
    needsImprovement: "كل تراجع هو فرصة لانطلاقة أقوى، دعنا نعد ضبط الإيقاع."
  }
};

export const ADHKAR_DATA: Dhikr[] = [
    { id: 'm1', category: 'morning', text: 'أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.', count: 1 },
    { id: 'm2', category: 'morning', text: 'اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور.', count: 1 },
    { id: 'm3', category: 'morning', text: 'سبحان الله وبحمده: عدد خلقه، ورضا نفسه، وزنة عرشه، ومداد كلماته.', count: 3 },
    { id: 'e1', category: 'evening', text: 'أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له.', count: 1 },
    { id: 'e2', category: 'evening', text: 'اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير.', count: 1 },
    { id: 's1', category: 'sleep', text: 'باسمك ربي وضعت جنبي وبك أرفعه، إن أمسكت نفسي فارحمها، وإن أرسلتها فاحفظها بما تحفظ به عبادك الصالحين.', count: 1 },
];
