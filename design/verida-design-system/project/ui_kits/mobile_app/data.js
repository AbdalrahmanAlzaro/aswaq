/* Mock data for the Aswaq mobile UI kit.
   All copy is illustrative — no real business names. */
window.ASWAQ_DATA = (function () {
  const CATEGORIES = [
    { id: "all",        en: "All",          ar: "الكل" },
    { id: "cafe",       en: "Cafés",        ar: "مقاهي" },
    { id: "restaurant", en: "Restaurants",  ar: "مطاعم" },
    { id: "gym",        en: "Gyms",         ar: "نوادي" },
    { id: "electronics",en: "Electronics",  ar: "إلكترونيات" },
    { id: "watches",    en: "Watches",      ar: "ساعات", luxury: true },
    { id: "jewelry",    en: "Jewellery",    ar: "مجوهرات", luxury: true },
  ];

  const BUSINESSES = [
    {
      id: "rumi",
      en: { name: "Café Rumi",         tagline: "Specialty filter, slow mornings",  neighborhood: "Jabal Al-Weibdeh" },
      ar: { name: "مقهى رومي",         tagline: "قهوة مختصة وصباحات هادئة",        neighborhood: "جبل اللويبدة" },
      category: "cafe",   rating: 4.7, reviews: 312, distance: "1.2 km", verified: true, open: true,
      grad: "linear-gradient(135deg, #d06b4b 0%, #8a611b 100%)",
    },
    {
      id: "habibah",
      en: { name: "Habibah Sweets",    tagline: "Kunafa nabulsia, since 1965",       neighborhood: "Downtown Amman" },
      ar: { name: "حلويات حبيبة",      tagline: "كنافة نابلسية، منذ 1965",          neighborhood: "وسط البلد" },
      category: "restaurant", rating: 4.9, reviews: 1820, distance: "3.4 km", verified: true, open: true,
      grad: "linear-gradient(135deg, #c99633 0%, #82331b 100%)",
    },
    {
      id: "royal-time",
      en: { name: "Royal Time",        tagline: "Authorised dealer, mechanical only", neighborhood: "Abdali Boulevard" },
      ar: { name: "رويال تايم",        tagline: "وكيل معتمد، ساعات ميكانيكية",       neighborhood: "بوليفارد العبدلي" },
      category: "watches", rating: 4.9, reviews: 58, distance: "5.1 km", verified: true, open: true, luxury: true,
      grad: "linear-gradient(135deg, #756d63 0%, #2b251f 100%)",
    },
    {
      id: "goldsmiths",
      en: { name: "Goldsmiths Amman",  tagline: "Filigree, custom, by the gram",      neighborhood: "Sweifieh" },
      ar: { name: "الصاغة عمّان",       tagline: "فيليجري وتصاميم خاصة، بالغرام",     neighborhood: "الصويفية" },
      category: "jewelry", rating: 4.8, reviews: 94, distance: "6.0 km", verified: true, open: false, luxury: true,
      grad: "linear-gradient(135deg, #f3e3b5 0%, #c99633 100%)",
    },
    {
      id: "aerial",
      en: { name: "Aerial Fitness",    tagline: "Pilates, yoga, climbing",            neighborhood: "Khalda" },
      ar: { name: "إيريال للرياضة",     tagline: "بيلاتس ويوغا وتسلق",                 neighborhood: "خلدا" },
      category: "gym", rating: 4.5, reviews: 187, distance: "2.8 km", verified: true, open: false,
      grad: "linear-gradient(135deg, #6e7331 0%, #1f1a15 100%)",
    },
    {
      id: "circuit",
      en: { name: "Circuit Electronics", tagline: "Phones, laptops, repairs",        neighborhood: "Mecca Street" },
      ar: { name: "سيركوت للإلكترونيات", tagline: "هواتف ولابتوبات وصيانة",          neighborhood: "شارع مكة" },
      category: "electronics", rating: 4.3, reviews: 412, distance: "4.2 km", verified: false, open: true,
      grad: "linear-gradient(135deg, #4a4339 0%, #1f1a15 100%)",
    },
  ];

  const PRODUCTS = [
    { id: "kunafa-kilo", vendorId: "habibah", price: 12, was: 15,
      en: { name: "Kunafa nabulsia, 1 kilo" }, ar: { name: "كنافة نابلسية، كيلو" },
      grad: "linear-gradient(135deg, #f5dccf, #d06b4b)" },
    { id: "halawet-jibn", vendorId: "habibah", price: 8,
      en: { name: "Halawet el jibn, tray of 12" }, ar: { name: "حلاوة الجبن، صينية 12" },
      grad: "linear-gradient(135deg, #faf3e1, #dcb24f)" },
    { id: "v60", vendorId: "rumi", price: 4.5,
      en: { name: "V60 single origin, Yirgacheffe" }, ar: { name: "في60 مفرد، يرغاتشيف" },
      grad: "linear-gradient(135deg, #8a611b, #2b251f)" },
    { id: "espresso-beans", vendorId: "rumi", price: 9,
      en: { name: "Espresso blend, 250g" }, ar: { name: "خلطة إسبريسو، 250غ" },
      grad: "linear-gradient(135deg, #a64223, #3b170c)" },
    { id: "seiko-presage", vendorId: "royal-time", price: 485, luxury: true,
      en: { name: "Seiko Presage Cocktail Time" }, ar: { name: "ساعة سيكو بريساج" },
      grad: "linear-gradient(135deg, #d8d2c8, #4a4339)" },
    { id: "tissot-prx", vendorId: "royal-time", price: 612, luxury: true,
      en: { name: "Tissot PRX Powermatic 80" }, ar: { name: "تيسوت PRX باورماتيك 80" },
      grad: "linear-gradient(135deg, #c99633, #5e2614)" },
    { id: "filigree-ring", vendorId: "goldsmiths", price: 240, luxury: true,
      en: { name: "Filigree gold ring, 18k" }, ar: { name: "خاتم فيليجري ذهب 18" },
      grad: "linear-gradient(135deg, #f3e3b5, #c99633)" },
    { id: "olive-earring", vendorId: "goldsmiths", price: 145, luxury: true,
      en: { name: "Olive-branch earrings, 21k" }, ar: { name: "أقراط غصن زيتون 21" },
      grad: "linear-gradient(135deg, #ebd086, #8a611b)" },
  ];

  const REVIEWS = [
    {
      author: "Lina A.", initial: "L", rating: 5, when: "2 weeks ago", verified: true,
      en: "Cheese kunafa was warm, syrup was light — exactly how I remember it from my grandfather's house in Salt. Wrapped carefully for the drive home.",
      ar: "كنافة الجبنة كانت دافئة والقطر خفيف — تماماً كما أتذكرها من بيت جدّي في السلط. تم تغليفها بعناية للرحلة.",
      helpful: 12,
    },
    {
      author: "Omar K.", initial: "O", rating: 4, when: "1 month ago", verified: true,
      en: "Best place I found for Yirgacheffe in Amman. The barista will talk you through every step if you ask — and you should.",
      ar: "أفضل مكان للقهوة الإثيوبية في عمّان. الباريستا يشرح لك كل خطوة إذا سألت — وأنصحك أن تسأل.",
      helpful: 7,
    },
    {
      author: "Rana S.", initial: "R", rating: 5, when: "3 days ago", verified: false,
      en: "Service was warm. Took my husband's grandmother's gold and turned it into something my daughter will actually wear.",
      ar: "خدمة دافئة. أخذوا ذهب جدة زوجي وحوّلوه إلى شيء ابنتي ستلبسه فعلاً.",
      helpful: 22,
    },
  ];

  return { CATEGORIES, BUSINESSES, PRODUCTS, REVIEWS };
})();
