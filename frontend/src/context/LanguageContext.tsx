import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand
    brandName: 'SWILA PARFUM',
    brandTagline: 'HAUTE PARFUMERIE PARIS',

    // Top bar & Language
    topAnnouncement: 'COMPLIMENTARY WORLDWIDE EXPRESS DELIVERY ON ALL ORDERS',
    selectLanguage: 'Language',

    // Nav Links
    flashSales: 'FLASH SALES',
    aboutUs: 'ABOUT US',
    contact: 'CONTACT',
    menPerfumes: "MEN'S PERFUMES",
    womenPerfumes: "WOMEN'S PERFUMES",
    designerPerfumes: 'DESIGNER PERFUMES',
    beautyCosmetics: 'BEAUTY & COSMETICS',
    fullCatalog: 'FULL CATALOG',
    bakhourOud: 'BAKHOUR & OUD',

    // Nav Actions
    searchPlaceholder: 'Search perfumes, notes, or collections...',
    searchBtn: 'Search',
    cart: 'Cart',
    yourCart: 'Your Shopping Bag',
    cartEmpty: 'Your shopping bag is empty',
    cartEmptySubtitle: 'Explore our curated flacons to select your signature scent.',
    explorePerfumes: 'Explore Perfumes',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    complimentary: 'Complimentary',
    total: 'Total',
    checkout: 'Checkout',
    securePayment: '100% Encrypted & Secure Checkout',

    // Account & Auth
    clientAccount: 'Client Account',
    myOrders: 'My Orders',
    adminDashboard: 'Admin Dashboard',
    signOut: 'Sign Out',
    signIn: 'Sign In',
    register: 'Create Account',
    loginTitle: 'Client Portal',
    loginSubtitle: 'Access your confidential orders and private perfume wardrobe.',
    emailAddress: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    quickDemoLogin: '⚡ 1-Click Fast Demonstration Logins',
    adminAtelier: 'Admin Atelier',
    vipCustomer: 'VIP Client',
    noAccountYet: "Don't hold an account yet?",
    applyMembership: 'Apply for Membership',
    alreadyRegistered: 'Already have an account?',
    signInHere: 'Sign In Here',

    // Home Page
    heroSubtitle: 'MAISON DE HAUTE PARFUMERIE',
    heroTitle: 'The Pure Luxury of Fragrance',
    heroDescription: 'Precious botanical harvests, aged wild agarwood, and bespoke extraits crafted with passion and distinction.',
    exploreCollection: 'Explore Collection',
    bakhourSeries: 'Bakhour & Oud Series',
    olfactoryUniverses: 'Olfactory Universes',
    fragranceFamilies: 'Fragrance Families',
    viewAll: 'View All',
    exclusiveSelection: 'Curated Masterpieces',
    bestSellers: 'Best Selling Flacons',
    craftsmanshipSubtitle: 'Artisanal Heritage & Noble Ingredients',
    craftsmanshipTitle: "The Art of Extraction & Flaconnage",
    craftsmanshipDesc: 'Every SWILA PARFUM flacon is crafted with master glassmakers and filled with pure extracts from Grasse and precious Arabian oud woods.',
    craftsmanshipBullet1: 'Harvested at dawn in Grasse, France',
    craftsmanshipBullet2: 'Cold macerated for 90 days in small casks',
    craftsmanshipBullet3: 'Heavy crystal bottle with magnetic cap',

    // Shop Page
    catalogTitle: 'Full Fragrance Catalog',
    catalogSubtitle: 'Explore our complete collection of bespoke extraits and eau de parfums.',
    sortBy: 'Sort by',
    sortNewest: 'Newest Releases',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortName: 'Name: A to Z',
    filters: 'Filters',
    resetFilters: 'Reset',
    allFamilies: 'All Fragrance Families',
    bottleVolume: 'Flacon Volume',
    allVolumes: 'All',
    maxPrice: 'Max Price',
    perfumesAvailable: 'perfumes available',
    noPerfumesMatch: 'No perfumes match your criteria',
    resetFiltersBtn: 'Reset All Filters',
    discover: 'Discover',
    addToCart: 'Add to Bag',
    soldOut: 'Sold Out',
    inStock: 'in stock',
    lowStock: 'Low Stock: Only',

    // Product Detail
    backToCatalog: 'Back to Catalog',
    shareCreation: 'Share Creation',
    linkCopied: 'Link Copied',
    pureExtrait: 'Extrait de Parfum',
    taxIncluded: 'Taxes included / Free courier',
    pyramidTitle: 'Olfactory Pyramid',
    topNotes: 'Top Notes (Head)',
    heartNotes: 'Heart Notes (Heart)',
    baseNotes: 'Base Notes (Dry Down)',
    acquireBottle: 'Add to Bag',
    buyNow: 'Buy Now',
    quickOrderTitle: 'Please fill in the form to order',
    phoneNumber: 'Phone Number',
    deliveryAddress: 'Delivery Address',
    citySelect: 'City',
    whatsappOrder: 'Order via WhatsApp',
    whatsappChat: 'Chat with us on WhatsApp',
    expressCourier: 'Express Insured Delivery',
    authenticGuaranteed: '100% Certified Authentic',
    sampleIncluded: 'Complimentary Vial Included',
    youMayAlsoLike: 'Harmonious Compositions',

    // Checkout
    checkoutTitle: 'Checkout & Delivery',
    checkoutSubtitle: 'Enter your delivery details to finalize your luxury acquisition.',
    shippingDestination: '1. Shipping Address',
    fullName: 'Full Name',
    recipientEmail: 'Notification Email',
    streetAddress: 'Street Address & Apartment',
    city: 'City',
    postalCode: 'Postal / ZIP Code',
    country: 'Country',
    giftMessage: 'Calligraphy Gift Note (Optional)',
    paymentMethod: '2. Payment Simulation',
    testMode: 'Instant Sandbox VIP Checkout',
    testBadge: 'TEST',
    placeOrder: 'Confirm Order',
    orderConfirmed: 'Order Confirmed',
    orderConfirmedDesc: 'Our atelier has received your order and is hand-packaging your flacons.',
    orderRef: 'Order Reference',
    trackOrders: 'Track My Orders',
    returnToShop: 'Return to Boutique',

    // User Orders
    myOrdersTitle: 'My Flacon Orders',
    myOrdersSubtitle: 'Private archive of your past acquisitions and shipment tracking.',
    orderDate: 'Date Placed',
    statusPending: 'Pending Approval',
    statusProcessing: 'Atelier Preparation',
    statusShipped: 'Dispatched with Courier',
    statusDelivered: 'Delivered',
    statusCancelled: 'Cancelled',
    acquireNewFlacon: 'Acquire New Flacon',
    noPastOrders: 'No past acquisitions found',

    // Footer
    pureConcentration: 'High Concentration',
    pureConcentrationSub: 'Pure oils & natural absolues',
    masterPerfumers: 'Master Perfumer',
    masterPerfumersSub: 'Heritage atelier founded in Paris',
    authenticBadge: '100% Authentic',
    authenticBadgeSub: 'Directly from our workshops',
    freeDelivery: 'Complimentary Shipping',
    freeDeliverySub: 'Insured worldwide delivery',
    footerStory: 'Haute Parfumerie house created for connoisseurs who value rare botanicals, noble oud resins, and timeless distinction.',
    newsletterTitle: 'Join The Haute Circle',
    newsletterDesc: 'Receive private invitations to confidential flacon releases and private previews.',
    rightsReserved: 'All rights reserved.',
  },

  fr: {
    // Brand
    brandName: 'SWILA PARFUM',
    brandTagline: 'HAUTE PARFUMERIE PARIS',

    // Top bar & Language
    topAnnouncement: 'LIVRAISON EXPRESS OFFERTE SUR TOUTES LES COMMANDES',
    selectLanguage: 'Langue',

    // Nav Links
    flashSales: 'VENTES FLASH',
    aboutUs: 'À PROPOS',
    contact: 'CONTACT',
    menPerfumes: 'PARFUMS HOMME',
    womenPerfumes: 'PARFUMS FEMME',
    designerPerfumes: 'PARFUMS DESIGNER',
    beautyCosmetics: 'BEAUTÉ ET COSMÉTIQUE',
    fullCatalog: 'NOTRE CATALOGUE COMPLET',
    bakhourOud: 'BAKHOUR & OUD',

    // Nav Actions
    searchPlaceholder: 'Rechercher un parfum, une note ou une collection...',
    searchBtn: 'Chercher',
    cart: 'Panier',
    yourCart: 'Votre Panier',
    cartEmpty: 'Votre panier est vide',
    cartEmptySubtitle: 'Explorez notre catalogue pour sélectionner votre signature olfactive.',
    explorePerfumes: 'Découvrir les parfums',
    subtotal: 'Sous-total',
    shipping: 'Livraison',
    complimentary: 'Offerte',
    total: 'Total',
    checkout: 'Commander',
    securePayment: 'Paiement 100% sécurisé et crypté',

    // Account & Auth
    clientAccount: 'Compte client',
    myOrders: 'Mes Commandes',
    adminDashboard: 'Admin Dashboard',
    signOut: 'Déconnexion',
    signIn: 'Se Connecter',
    register: 'Créer un Compte',
    loginTitle: 'Espace Client',
    loginSubtitle: 'Accédez à vos commandes et à votre garde-robe de parfums.',
    emailAddress: 'Adresse e-mail',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    quickDemoLogin: '⚡ Connexion Rapide (Démonstration)',
    adminAtelier: 'Admin Atelier',
    vipCustomer: 'Client VIP',
    noAccountYet: "Vous n'avez pas encore de compte ?",
    applyMembership: 'Créer un compte',
    alreadyRegistered: 'Vous avez déjà un compte ?',
    signInHere: 'Se connecter',

    // Home Page
    heroSubtitle: 'MAISON DE HAUTE PARFUMERIE',
    heroTitle: "L'Élégance Pure du Parfum",
    heroDescription: "Des extraits rares, des bois précieux et des fragrances d'exception façonnées avec rigueur et raffinement.",
    exploreCollection: 'Découvrir la Collection',
    bakhourSeries: 'Collection Bakhour & Oud',
    olfactoryUniverses: 'Univers Olfactifs',
    fragranceFamilies: 'Nos Familles de Parfums',
    viewAll: 'Tout voir',
    exclusiveSelection: 'Sélection Exclusive',
    bestSellers: 'Les Meilleures Ventes',
    craftsmanshipSubtitle: 'Savoir-Faire & Matières Nobles',
    craftsmanshipTitle: "L'Art de l'Extraction & du Flaconnage",
    craftsmanshipDesc: 'Chaque flacon SWILA PARFUM est façonné selon la tradition de la haute parfumerie française.',
    craftsmanshipBullet1: 'Récolté à l’aube à Grasse, France',
    craftsmanshipBullet2: 'Macération à froid en petits fûts',
    craftsmanshipBullet3: 'Flacons en verre épais et bouchon magnétique',

    // Shop Page
    catalogTitle: 'Notre Catalogue Complet',
    catalogSubtitle: 'Explorez nos créations parfumées et trouvez votre signature olfactive.',
    sortBy: 'Trier par',
    sortNewest: 'Nouveautés',
    sortPriceAsc: 'Prix: Croissant',
    sortPriceDesc: 'Prix: Décroissant',
    sortName: 'Nom: A à Z',
    filters: 'Filtres',
    resetFilters: 'Réinitialiser',
    allFamilies: 'Toutes les familles',
    bottleVolume: 'Contenance',
    allVolumes: 'Tous',
    maxPrice: 'Prix Maximum',
    perfumesAvailable: 'parfums disponibles',
    noPerfumesMatch: 'Aucun parfum ne correspond à vos critères',
    resetFiltersBtn: 'Réinitialiser les filtres',
    discover: 'Découvrir',
    addToCart: 'Ajouter au Panier',
    soldOut: 'Épuisé',
    inStock: 'en stock',
    lowStock: 'Stock faible : Seulement',

    // Product Detail
    backToCatalog: 'Retour au catalogue',
    shareCreation: 'Partager',
    linkCopied: 'Lien copié',
    pureExtrait: 'Extrait de Parfum',
    taxIncluded: 'TVA incluse / Livraison offerte',
    pyramidTitle: 'Pyramide Olfactive',
    topNotes: 'Notes de Tête',
    heartNotes: 'Notes de Cœur',
    baseNotes: 'Notes de Fond',
    acquireBottle: 'Ajouter au Panier',
    buyNow: 'Acheter Maintenant',
    quickOrderTitle: 'Veuillez remplir le formulaire pour commander',
    phoneNumber: 'Numéro De Téléphone',
    deliveryAddress: 'Adresse De Livraison',
    citySelect: 'La Ville',
    whatsappOrder: 'Commander via WhatsApp',
    whatsappChat: 'Discuter sur WhatsApp',
    expressCourier: 'Livraison express assurée',
    authenticGuaranteed: '100% Authentique garanti',
    sampleIncluded: 'Échantillon offert inclus',
    youMayAlsoLike: 'Vous Aimerez Aussi',

    // Checkout
    checkoutTitle: 'Validation de la Commande',
    checkoutSubtitle: 'Renseignez vos coordonnées de livraison pour finaliser votre commande.',
    shippingDestination: '1. Adresse de Livraison',
    fullName: 'Nom & Prénom',
    recipientEmail: 'Adresse e-mail',
    streetAddress: 'Adresse postale',
    city: 'Ville',
    postalCode: 'Code Postal',
    country: 'Pays',
    giftMessage: 'Message cadeau (Optionnel)',
    paymentMethod: '2. Mode de Paiement',
    testMode: 'Paiement Sécurisé Simulé',
    testBadge: 'TEST',
    placeOrder: 'Confirmer la commande',
    orderConfirmed: 'Commande Confirmée',
    orderConfirmedDesc: 'Votre commande a été prise en compte et est en cours de préparation.',
    orderRef: 'Numéro de commande',
    trackOrders: 'Suivre mes commandes',
    returnToShop: 'Retour à la boutique',

    // User Orders
    myOrdersTitle: 'Mes Commandes',
    myOrdersSubtitle: 'Historique de vos commandes et suivi des livraisons.',
    orderDate: 'Date',
    statusPending: 'En attente',
    statusProcessing: 'En préparation',
    statusShipped: 'Expédiée',
    statusDelivered: 'Livrée',
    statusCancelled: 'Annulée',
    acquireNewFlacon: 'Commander un flacon',
    noPastOrders: 'Aucune commande trouvée',

    // Footer
    pureConcentration: 'Haute Concentration',
    pureConcentrationSub: 'Huiles pures et absolus naturels',
    masterPerfumers: 'Artisan Parfumeur',
    masterPerfumersSub: 'Maison fondée à Paris',
    authenticBadge: '100% Authentique',
    authenticBadgeSub: 'Directement de nos ateliers',
    freeDelivery: 'Livraison Offerte',
    freeDeliverySub: 'Envoi soigné dans le monde entier',
    footerStory: "Maison de haute parfumerie créative. Nos flacons incarnent l’équilibre subtil des extraits précieux et des bois rares.",
    newsletterTitle: 'Newsletter',
    newsletterDesc: 'Inscrivez-vous pour recevoir en avant-première nos nouvelles créations et offres exclusives.',
    rightsReserved: 'Tous droits réservés.',
  },

  ar: {
    // Brand
    brandName: 'سويلا بارفان',
    brandTagline: 'عطور باريس الفاخرة',

    // Top bar & Language
    topAnnouncement: 'شحن سريع مجاني لجميع الطلبات في جميع أنحاء العالم',
    selectLanguage: 'اللغة',

    // Nav Links
    flashSales: 'عروض حصرية',
    aboutUs: 'من نحن',
    contact: 'اتصل بنا',
    menPerfumes: 'عطور رجالية',
    womenPerfumes: 'عطور نسائية',
    designerPerfumes: 'عطور النيش',
    beautyCosmetics: 'الجمال والعناية',
    fullCatalog: 'كتالوج العطور الكامل',
    bakhourOud: 'بخور وعود',

    // Nav Actions
    searchPlaceholder: 'ابحث عن عطر أو نوتة عطرية...',
    searchBtn: 'بحث',
    cart: 'السلة',
    yourCart: 'حقيبة التسوق',
    cartEmpty: 'حقيبة التسوق فارغة',
    cartEmptySubtitle: 'تفضل بزيارة تشكيلتنا لاختيار بصمتك العطرية الفريدة.',
    explorePerfumes: 'استكشف العطور',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    complimentary: 'مجاناً',
    total: 'المجموع الكلي',
    checkout: 'إتمام الطلب',
    securePayment: 'دفع إلكتروني آمن ومشفّر 100%',

    // Account & Auth
    clientAccount: 'حساب العميل',
    myOrders: 'طلباتي السابقة',
    adminDashboard: 'لوحة التحكم',
    signOut: 'تسجيل الخروج',
    signIn: 'تسجيل الدخول',
    register: 'إنشاء حساب جديد',
    loginTitle: 'بوابة العملاء',
    loginSubtitle: 'ادخل لمتابعة طلباتك وخزانتك العطرية الخاصة.',
    emailAddress: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    quickDemoLogin: '⚡ تسجيل دخول تجريبي بنقرة واحدة',
    adminAtelier: 'مدير النظام',
    vipCustomer: 'عميل مميز (VIP)',
    noAccountYet: 'ليس لديك حساب بعد؟',
    applyMembership: 'انضم إلى نخبة سويلا',
    alreadyRegistered: 'هل لديك حساب بالفعل؟',
    signInHere: 'سجل دخولك هنا',

    // Home Page
    heroSubtitle: 'دار العطور الفاخرة باريس',
    heroTitle: 'فخامة العطور الخالصة',
    heroDescription: 'خلاصات نادرة من العود الكمبودي المعتق والورود الملكية الفاخرة مصممة لأصحاب الذوق الرفيع.',
    exploreCollection: 'اكتشف المجموعة',
    bakhourSeries: 'مجموعة البخور والعود',
    olfactoryUniverses: 'عوالم الروائح',
    fragranceFamilies: 'عائلات العطور لدينا',
    viewAll: 'عرض الكل',
    exclusiveSelection: 'روائع العطور المختارة',
    bestSellers: 'الأكثر مبيعاً',
    craftsmanshipSubtitle: 'أصالة الحرفة ومكونات نقية',
    craftsmanshipTitle: 'فن التقطير وتصميم القوارير',
    craftsmanshipDesc: 'تُصنع كل زجاجة من عطور سويلا بأيدي حرفيين في فرنسا بمكونات طبيعية تم تعتيقها بعناية فائقة.',
    craftsmanshipBullet1: 'حصاد فجر اليوم في غراس، فرنسا',
    craftsmanshipBullet2: 'تعتيق بارد في براميل خشبية عتيقة',
    craftsmanshipBullet3: 'زجاج كريستالي فاخر مع غطاء مغناطيسي',

    // Shop Page
    catalogTitle: 'كتالوج العطور الكامل',
    catalogSubtitle: 'اكتشف جميع خلاصات العطور الفاخرة واختر ما يعبّر عن شخصيتك.',
    sortBy: 'ترتيب حسب',
    sortNewest: 'الأحدث أولاً',
    sortPriceAsc: 'السعر: من الأقل للأعلى',
    sortPriceDesc: 'السعر: من الأعلى للأقل',
    sortName: 'الاسم: أ إلى ي',
    filters: 'التصفيات',
    resetFilters: 'إعادة ضبط',
    allFamilies: 'جميع العائلات العطرية',
    bottleVolume: 'حجم الزجاجة',
    allVolumes: 'الكل',
    maxPrice: 'أعلى سعر',
    perfumesAvailable: 'عطر متوفر',
    noPerfumesMatch: 'لا توجد عطور تطابق معايير البحث',
    resetFiltersBtn: 'إعادة ضبط الفلاتر',
    discover: 'اكتشف',
    addToCart: 'أضف للسلة',
    soldOut: 'نفدت الكمية',
    inStock: 'متوفر',
    lowStock: 'كمية محدودة: متبقي فقط',

    // Product Detail
    backToCatalog: 'الرجوع إلى الكتالوج',
    shareCreation: 'مشاركة العطر',
    linkCopied: 'تم نسخ الرابط',
    pureExtrait: 'خلاصة عطرية نقية',
    taxIncluded: 'شامل الضريبة / التوصيل مجاني',
    pyramidTitle: 'الهرم العطري',
    topNotes: 'قمة العطر (الافتتاحية)',
    heartNotes: 'قلب العطر (الوسط)',
    baseNotes: 'قاعدة العطر (الثبات)',
    acquireBottle: 'أضف إلى السلة',
    buyNow: 'اشتري الآن',
    quickOrderTitle: 'يرجى ملء الاستمارة لإتمام الطلب',
    phoneNumber: 'رقم الهاتف',
    deliveryAddress: 'عنوان التوصيل',
    citySelect: 'المدينة',
    whatsappOrder: 'اطلب عبر واتساب',
    whatsappChat: 'تواصل معنا على واتساب',
    expressCourier: 'شحن سريع ومؤمّن',
    authenticGuaranteed: 'عطور أصلية 100%',
    sampleIncluded: 'عينة مجانية مدمجة للتجربة',
    youMayAlsoLike: 'عطور قد تنال إعجابك',

    // Checkout
    checkoutTitle: 'إتمام الطلب والشحن',
    checkoutSubtitle: 'أدخل تفاصيل التوصيل لاستلام عطرك الفاخر.',
    shippingDestination: '1. عنوان الشحن والتوصيل',
    fullName: 'الاسم الكامل',
    recipientEmail: 'البريد الإلكتروني للإشعارات',
    streetAddress: 'العنوان والشارع ورقم الشقة',
    city: 'المدينة',
    postalCode: 'الرمز البريدي',
    country: 'الدولة',
    giftMessage: 'إهداء خاص أو رسالة مع الطلب (اختياري)',
    paymentMethod: '2. طريقة الدفع',
    testMode: 'دفع إلكتروني فوري تجريبي',
    testBadge: 'تجريبي',
    placeOrder: 'تأكيد وشراء الطلب',
    orderConfirmed: 'تم تأكيد طلبك بنجاح',
    orderConfirmedDesc: 'لقد استلمت دار العطور طلبك وجارٍ تجهيز الطرد وتغليفه بعناية.',
    orderRef: 'رقم الطلب',
    trackOrders: 'متابعة شحناتي',
    returnToShop: 'العودة للمتجر',

    // User Orders
    myOrdersTitle: 'سجل الطلبات السابقة',
    myOrdersSubtitle: 'تابع حالة الشحن وسجل طلباتك العطرية السابقة.',
    orderDate: 'تاريخ الطلب',
    statusPending: 'قيد المراجعة',
    statusProcessing: 'قيد التجهيز',
    statusShipped: 'تم الشحن',
    statusDelivered: 'تم التوصيل',
    statusCancelled: 'ملغي',
    acquireNewFlacon: 'طلب عطر جديد',
    noPastOrders: 'لا توجد طلبات سابقة مسجلة',

    // Footer
    pureConcentration: 'تركيز استثنائي',
    pureConcentrationSub: 'زيوت عطرية أصلية وخلاصات نقية',
    masterPerfumers: 'صانعو العطور الباريسيون',
    masterPerfumersSub: 'خبرة عريقة في فن العطور',
    authenticBadge: 'أصلي ومضمون 100%',
    authenticBadgeSub: 'مباشرة من معاملنا إلى بابك',
    freeDelivery: 'توصيل مجاني ومؤمن',
    freeDeliverySub: 'شحن فاخر وسريع لكافة المناطق',
    footerStory: 'دار سويلا بارفان متخصصة في ابتكار أندر العطور المستخلصة من العود والورد النبيل.',
    newsletterTitle: 'النشرة البريدية الخاصة',
    newsletterDesc: 'اشترك لتصلك أحدث العطور الحصرية والعروض الخاصة قبل طرحها.',
    rightsReserved: 'جميع الحقوق محفوظة.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('swila_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('swila_lang', lang);
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'}>{children}</div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
};
