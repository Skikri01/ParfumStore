import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mensPerfumes = [
  {
    name: 'Souverain Cuir Impérial Extrait',
    brand: 'SWILA Atelier',
    description: 'An iconic masculine signature blending smoked Russian birch tar, Tuscan leather, cracked black pepper, and wild thyme. An authoritative fragrance for visionary men.',
    price: 340.0,
    stock_quantity: 16,
    volume_ml: 100,
    top_notes: 'Black Pepper, Wild Thyme, Italian Saffron',
    heart_notes: 'Tuscan Leather, Smoked Birch Wood, Raspberry Leaf',
    base_notes: 'Spanish Cistus, Cade Oil, Ambergris Accord',
    image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    category_slug: 'woody',
  },
  {
    name: 'Bleu Majestueux Pour Homme',
    brand: 'SWILA PARFUM',
    description: 'Crisp Sicilian grapefruit and iced ginger anchored by rich Somalian frankincense, amberwood, and deep Haitian vetiver. Fresh elegance meets nocturnal seduction.',
    price: 260.0,
    stock_quantity: 24,
    volume_ml: 100,
    top_notes: 'Sicilian Grapefruit, Pink Peppercorn, Mint Absolute',
    heart_notes: 'Iced Ginger, Nutmeg, Jasmine Sambac',
    base_notes: 'Somalian Frankincense, Haitian Vetiver, Dry Cedarwood',
    image_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    category_slug: 'fresh-citrus',
  },
  {
    name: 'Tobacco Vanille Nobile Pour Homme',
    brand: 'SWILA Atelier',
    description: 'A sumptuous and narcotic creation of cured Havana tobacco leaves, roasted cocoa beans, dried fruits, and Madagascar bourbon vanilla. Sophistication in a flacon.',
    price: 380.0,
    stock_quantity: 12,
    volume_ml: 100,
    top_notes: 'Tobacco Leaf, Spicy Cinnamon, Clove Bud',
    heart_notes: 'Roasted Cacao, Tonka Bean, Tobacco Flower',
    base_notes: 'Bourbon Vanilla, Dried Plum Accord, Sweet Woods',
    image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    category_slug: 'gourmand',
  },
  {
    name: 'Oud Wood Suprême Extrait',
    brand: 'SWILA Atelier',
    description: 'One of the rarest compositions in modern perfumery: smoky agarwood, rosewood, and cardamom mingling with Chinese pepper, vetiver, and creamy sandalwood.',
    price: 420.0,
    stock_quantity: 8,
    volume_ml: 100,
    top_notes: 'Cardamom, Sichuan Pepper, Rosewood',
    heart_notes: 'Smoky Agarwood (Oud), Sandalwood, Haitian Vetiver',
    base_notes: 'Tonka Bean, Vanilla Orchid, Golden Amber',
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    category_slug: 'oud',
  },
  {
    name: 'Aventus Légendaire Extrait',
    brand: 'SWILA PARFUM',
    description: 'The triumph of modern masculine perfumery. Crisp blackcurrant and bergamot from Italy opening into smoky birch wood tar, Moroccan jasmine, and salty oakmoss.',
    price: 395.0,
    stock_quantity: 15,
    volume_ml: 100,
    top_notes: 'Blackcurrant, Green Apple, Calabrian Bergamot',
    heart_notes: 'Birch Tar, Patchouli, Moroccan Jasmine, Pink Pepper',
    base_notes: 'Oakmoss, Gray Ambergris, White Musk, Bourbon Vanilla',
    image_url: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
    category_slug: 'woody',
  },
  {
    name: 'Interlude Sauvage Pour Homme',
    brand: 'SWILA Atelier',
    description: 'A monument of balsamic power. Smoked blue oregano and pimento berry oil combined with warm myrrh, leather, and frankincense. A shield of timeless mystery.',
    price: 360.0,
    stock_quantity: 9,
    volume_ml: 100,
    top_notes: 'Bergamot, Wild Oregano, Pimento Berry',
    heart_notes: 'Amber, Opoponax, Frankincense, Cistus',
    base_notes: 'Leather, Agarwood Smoke, Patchouli, Sandalwood',
    image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    category_slug: 'oriental',
  },
  {
    name: 'Vetiver Royal d\'Haïti',
    brand: 'Maison Royale',
    description: 'Pure Haitian vetiver roots sun-dried and cold-distilled with green cardamom, crushed coriander seeds, and Virginia cedar. Earthy, refined, and effortlessly distinguished.',
    price: 240.0,
    stock_quantity: 19,
    volume_ml: 100,
    top_notes: 'Grapefruit Rind, Crushed Coriander, Neroli',
    heart_notes: 'Green Cardamom, Orris Butter, Nutmeg',
    base_notes: 'Haitian Vetiver, Virginia Cedar, Oakwood',
    image_url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
    category_slug: 'woody',
  },
  {
    name: 'Bois d\'Argent Prestige',
    brand: 'SWILA PARFUM',
    description: 'An ethereal contrast of precious Florentine iris concrete, Somalian incense smoke, and warm honeyed musk. An understated jewel of French high perfumery.',
    price: 320.0,
    stock_quantity: 11,
    volume_ml: 100,
    top_notes: 'Juniper Berries, Cypress, Iris Pallida',
    heart_notes: 'Somalian Myrrh, Indonesian Patchouli, Honey',
    base_notes: 'Leather, White Musk, Vanilla Orchid, Amber Resin',
    image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    category_slug: 'woody',
  },
  {
    name: 'Elysium Céleste Homme',
    brand: 'SWILA Atelier',
    description: 'Radiant lemon, lime, and lavender blending into crisp apple, blackcurrant, and a smoky drydown of pink pepper, cedarwood, and rich ambergris.',
    price: 290.0,
    stock_quantity: 21,
    volume_ml: 50,
    top_notes: 'Grapefruit, Lemon, Lime, Bergamot, Thyme',
    heart_notes: 'Blackcurrant, Lily of the Valley, Crisp Apple, Rose de Mai',
    base_notes: 'Vetiver, Juniper Berry, Pink Pepper, Benzoin, Ambergris',
    image_url: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=800&q=80',
    category_slug: 'fresh-citrus',
  },
  {
    name: 'Grand Soir Ambré Pour Homme',
    brand: 'SWILA Atelier',
    description: 'The golden warmth of a twilight in Paris. Rich Cistus labdanum from Spain and warm benzoin from Siam, dressed in toasted tonka bean and pure Madagascar vanilla.',
    price: 330.0,
    stock_quantity: 14,
    volume_ml: 100,
    top_notes: 'Spanish Labdanum, Bergamot Zest, Coriander',
    heart_notes: 'Siam Benzoin, Tonka Bean, Lavender Flowers',
    base_notes: 'Vanilla Absolu, Amber Accord, Golden Sandalwood',
    image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    category_slug: 'oriental',
  },
];

async function main() {
  console.log('🚀 Starting insertion of luxury Men\'s Perfumes...');

  // 1. Ensure category 'men' exists
  let menCat = await prisma.category.findUnique({
    where: { slug: 'men' },
  });

  if (!menCat) {
    menCat = await prisma.category.create({
      data: {
        name: 'Parfums Homme (Men)',
        slug: 'men',
      },
    });
    console.log('Created dedicated category:', menCat.name);
  }

  // Also get map of categories by slug
  const allCats = await prisma.category.findMany();
  const catMap = Object.fromEntries(allCats.map((c) => [c.slug, c.id]));

  let insertedCount = 0;

  for (const item of mensPerfumes) {
    // Check if perfume already exists by name
    const existing = await prisma.product.findFirst({
      where: { name: item.name },
    });

    const categoryId = catMap[item.category_slug] || menCat.id;

    if (!existing) {
      await prisma.product.create({
        data: {
          name: item.name,
          brand: item.brand,
          description: item.description,
          price: item.price,
          stock_quantity: item.stock_quantity,
          volume_ml: item.volume_ml,
          top_notes: item.top_notes,
          heart_notes: item.heart_notes,
          base_notes: item.base_notes,
          image_url: item.image_url,
          category_id: categoryId,
        },
      });
      console.log(`+ Inserted: ${item.name} (${item.brand})`);
      insertedCount++;
    } else {
      console.log(`- Already exists: ${item.name}`);
    }
  }

  console.log(`\n🎉 Successfully inserted ${insertedCount} new Men's Perfumes into the database!`);
}

main()
  .catch((e) => {
    console.error('Error inserting men perfumes:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
