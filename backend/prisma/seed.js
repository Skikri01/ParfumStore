"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌟 Seeding AURA PARFUMS luxury database...');
    // 1. Clear existing records cleanly
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    // 2. Create Users
    const salt = await bcryptjs_1.default.genSalt(10);
    const adminPassword = await bcryptjs_1.default.hash('AdminPassword123!', salt);
    const customerPassword = await bcryptjs_1.default.hash('CustomerPass123!', salt);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@auraparfums.com',
            password_hash: adminPassword,
            role: 'admin',
        },
    });
    const customer1 = await prisma.user.create({
        data: {
            email: 'vip@auraparfums.com',
            password_hash: customerPassword,
            role: 'customer',
        },
    });
    const customer2 = await prisma.user.create({
        data: {
            email: 'elena.vance@hauteluxury.com',
            password_hash: customerPassword,
            role: 'customer',
        },
    });
    console.log(` Created users: Admin (${admin.email}), VIP Customer (${customer1.email})`);
    // 3. Create Categories
    const categories = await Promise.all([
        prisma.category.create({
            data: { name: 'Oud & Amber', slug: 'oud' },
        }),
        prisma.category.create({
            data: { name: 'Haute Floral', slug: 'floral' },
        }),
        prisma.category.create({
            data: { name: 'Smoky Woody', slug: 'woody' },
        }),
        prisma.category.create({
            data: { name: 'Imperial Oriental', slug: 'oriental' },
        }),
        prisma.category.create({
            data: { name: 'Fresh & Citrus', slug: 'fresh-citrus' },
        }),
        prisma.category.create({
            data: { name: 'Velvet Gourmand', slug: 'gourmand' },
        }),
    ]);
    const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));
    console.log(` Created ${categories.length} fragrance categories`);
    // 4. Create Luxury Perfume Products
    const perfumesData = [
        {
            name: 'Nocturne Imperial Extrait',
            brand: 'AURA Atelier',
            description: 'An enigmatic blend of aged Cambodian oud infused with royal black saffron and smoked damask rose. Crafted in limited small batches for twilight majesty.',
            price: 360.0,
            stock_quantity: 14,
            volume_ml: 100,
            top_notes: 'Golden Saffron, Bergamot, Pink Peppercorn',
            heart_notes: 'Damascena Rose Absolu, Taif Rose, Smoky Cistus',
            base_notes: 'Cambodian Agarwood (Oud), Pure Leather, Madagascar Amber',
            image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
            category_id: catMap['oud'],
        },
        {
            name: 'Soleil Doré Eau de Parfum',
            brand: 'Maison Royale',
            description: 'Sun-drenched Mediterranean neroli bathed in white honey and sparkling Calabrian mandarin. Radiates an intoxicating golden halo from dawn until dusk.',
            price: 245.0,
            stock_quantity: 4, // low stock alert!
            volume_ml: 50,
            top_notes: 'Calabrian Mandarin, Bitter Orange, Petitgrain',
            heart_notes: 'Neroli Royale, Moroccan Orange Blossom, Jasmine Sambac',
            base_notes: 'White Honey, Cashmere Musk, Virginian Cedarwood',
            image_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
            category_id: catMap['floral'],
        },
        {
            name: 'Bois De Santal Sovereign',
            brand: 'AURA Atelier',
            description: 'Creamy Mysore sandalwood entwined with dry cedar chips, roasted tonka bean, and a whisper of green violet leaf. The ultimate understated luxury signifier.',
            price: 310.0,
            stock_quantity: 18,
            volume_ml: 100,
            top_notes: 'Violet Leaf, Cardamom, Italian Bergamot',
            heart_notes: 'Florentine Orris, Iris Concrete, Papyrus',
            base_notes: 'Mysore Sandalwood, Virginia Cedar, Venezuelan Tonka',
            image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
            category_id: catMap['woody'],
        },
        {
            name: 'Velvet Noir Gourmand',
            brand: 'L’Elixir Privé',
            description: 'Decadent dark Venezuelan cacao kissed with Bourbon vanilla, toasted hazelnut praline, and deep patchouli. Rich, narcotic, and universally alluring.',
            price: 285.0,
            stock_quantity: 2, // critical low stock
            volume_ml: 100,
            top_notes: 'Bitter Almond, Roasted Coffee Bean, Bergamot Zest',
            heart_notes: 'Dark Cacao Absolu, Hazelnut Praline, Tuberose',
            base_notes: 'Bourbon Vanilla Bean, Amber Resin, Indonesian Patchouli',
            image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
            category_id: catMap['gourmand'],
        },
        {
            name: 'Ambre Céleste Pure Scent',
            brand: 'Maison Royale',
            description: 'An ethereal meditation on warm resinous Baltic amber, illuminated by Frankincense tears and soft powdery vanilla orchid. Regal warmth distilled into glass.',
            price: 390.0,
            stock_quantity: 9,
            volume_ml: 100,
            top_notes: 'Omani Frankincense, Elemi Resin, Pink Pepper',
            heart_notes: 'Benzoin Siam, Vanilla Orchid, Labdanum',
            base_notes: 'Ambergris Accord, Smoked Guaiacwood, White Musk',
            image_url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
            category_id: catMap['oriental'],
        },
        {
            name: 'Riviera Vesper Fresh',
            brand: 'Cannes Parfumerie',
            description: 'Crisp coastal sea salt mingling with wild sea fennel, crushed mint leaves, and Sicilian lemon rinds. Crisp, invigorating, and effortlessly chic.',
            price: 195.0,
            stock_quantity: 22,
            volume_ml: 50,
            top_notes: 'Sicilian Lemon, Crushed Peppermint, Sea Salt',
            heart_notes: 'French Lavender, Sea Fennel, Rosemary Flowers',
            base_notes: 'Driftwood, White Amber, Oakmoss',
            image_url: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
            category_id: catMap['fresh-citrus'],
        },
        {
            name: 'Oud Al-Maliki',
            brand: 'AURA Atelier',
            description: 'A monument of royal Arabian perfumery featuring rare Hindi agarwood seasoned with cardamoms, cinnamon bark, and deep golden honeycomb.',
            price: 450.0,
            stock_quantity: 7,
            volume_ml: 100,
            top_notes: 'Ceylon Cinnamon, Green Cardamom, Nutmeg',
            heart_notes: 'Wild Honey, Turkish Rose, Dried Fruits',
            base_notes: 'Vintage Hindi Oud, Benzoin, Rich Leather',
            image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
            category_id: catMap['oud'],
        },
        {
            name: 'Rose Éternelle Extrait',
            brand: 'L’Elixir Privé',
            description: 'An architectural bouquet of May Rose from Grasse surrounded by sparkling pink pepper, velvety peony, and modern white patchouli.',
            price: 275.0,
            stock_quantity: 11,
            volume_ml: 50,
            top_notes: 'Pink Pepper, Lychee, Italian Mandarin',
            heart_notes: 'Grasse Centifolia Rose, Wild Peony, Dewy Greens',
            base_notes: 'White Patchouli, Modern Musk, Clear Amber',
            image_url: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=800&q=80',
            category_id: catMap['floral'],
        },
    ];
    const createdProducts = [];
    for (const p of perfumesData) {
        const prod = await prisma.product.create({ data: p });
        createdProducts.push(prod);
    }
    console.log(` Created ${createdProducts.length} luxury perfumes`);
    // 5. Create Sample Orders for analytics & history demonstration
    const order1 = await prisma.order.create({
        data: {
            user_id: customer1.id,
            total_amount: 670.0,
            status: 'delivered',
            shipping_address: '742 Evergreen Terrace, Penthouse Suite 40B, New York, NY 10021',
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            items: {
                create: [
                    {
                        product_id: createdProducts[0].id,
                        quantity: 1,
                        price_at_purchase: 360.0,
                    },
                    {
                        product_id: createdProducts[2].id,
                        quantity: 1,
                        price_at_purchase: 310.0,
                    },
                ],
            },
        },
    });
    const order2 = await prisma.order.create({
        data: {
            user_id: customer1.id,
            total_amount: 390.0,
            status: 'shipped',
            shipping_address: '742 Evergreen Terrace, Penthouse Suite 40B, New York, NY 10021',
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            items: {
                create: [
                    {
                        product_id: createdProducts[4].id,
                        quantity: 1,
                        price_at_purchase: 390.0,
                    },
                ],
            },
        },
    });
    const order3 = await prisma.order.create({
        data: {
            user_id: customer2.id,
            total_amount: 570.0,
            status: 'processing',
            shipping_address: '12 Avenue Montaigne, 75008 Paris, France',
            created_at: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
            items: {
                create: [
                    {
                        product_id: createdProducts[3].id,
                        quantity: 2,
                        price_at_purchase: 285.0,
                    },
                ],
            },
        },
    });
    const order4 = await prisma.order.create({
        data: {
            user_id: customer2.id,
            total_amount: 450.0,
            status: 'pending',
            shipping_address: '12 Avenue Montaigne, 75008 Paris, France',
            created_at: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
            items: {
                create: [
                    {
                        product_id: createdProducts[6].id,
                        quantity: 1,
                        price_at_purchase: 450.0,
                    },
                ],
            },
        },
    });
    console.log(` Created 4 sample customer orders`);
    console.log('🎉 Seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
