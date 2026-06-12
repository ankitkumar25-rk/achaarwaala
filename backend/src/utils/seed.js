/**
 * Database seed: creates actual AchaarWaala artisanal pickle catalog
 * Run with: node src/utils/seed.js
 */
import 'dotenv/config';
import prisma from '../lib/prisma.js';

const categories = [
  { name: 'Raw Mango (Keri)', slug: 'raw-mango', description: 'Traditional handcrafted mango pickles made from premium local mangoes' },
  { name: 'Desert Berry (Ker)', slug: 'ker', description: 'Rare and authentic Rajasthani desert berry (Ker) pickles' },
  { name: 'Lemon (Nimbu)', slug: 'lemon', description: 'Zesty lemon pickles, oil-free and traditional sweet-tangy varieties' },
  { name: 'Red Chilli (Lal Mirch)', slug: 'red-chilli', description: 'Fiery stuffed and sliced Rajasthani red chilli pickles' },
  { name: 'Green Chilli (Hari Mirch)', slug: 'green-chilli', description: 'Spicy green chilli pickles, including the famous Athana Mirch' },
  { name: 'Garlic (Lahsun)', slug: 'garlic', description: 'Robust garlic pickles and traditional lahsun chutneys' },
  { name: 'Vegetables', slug: 'vegetables', description: 'Healthy and unique pickles made from ginger, turmeric, bitter gourd, and more' },
  { name: 'Rajasthani Special', slug: 'rajasthani-special', description: 'Exclusive traditional delicacies like Sangri, Gunda, and Karonda' },
  { name: 'Murabba (Preserves)', slug: 'murabba', description: 'Sweet and nutritious fruit preserves including Amla and Apple Murabba' },
  { name: 'Other Products', slug: 'others', description: 'Earthy local essentials like Gulkand, Kachi Ghani Oil, and traditional Papad' }
];
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌶️ Seeding database with actual AchaarWaala Pickles...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@achaarwaala.com' },
    update: { password: hashedPassword },
    create: {
      name: 'Admin',
      email: 'admin@achaarwaala.com',
      phone: '9999999999',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create demo customer
  await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      name: 'Ankit Kumar',
      email: 'customer@example.com',
      phone: '9876543210',
      role: 'CUSTOMER',
    },
  });
  console.log('✅ Demo customer created');

  // Create categories
  const createdCategories = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: { description: cat.description, slug: cat.slug },
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
  }
  console.log('✅ Categories created/updated:', Object.keys(createdCategories).length);

  // Create products (actual achaar varieties)
  const products = [
    {
      name: 'Desi Keri Lohagal Achaar',
      slug: 'desi-keri-lohagal-achaar',
      categorySlug: 'raw-mango',
      price: 400,
      mrp: 499,
      stock: 100,
      unit: '500g',
      isFeatured: true,
      tags: ['mango', 'keri', 'traditional', 'best-seller']
    },
    {
      name: 'Ker Sangri Special Rajasthani Achaar',
      slug: 'ker-sangri-special-rajasthani-achaar',
      categorySlug: 'rajasthani-special',
      price: 400,
      mrp: 550,
      stock: 50,
      unit: '500g',
      isFeatured: true,
      tags: ['rajasthani', 'ker', 'sangri', 'royal']
    },
    {
      name: 'Athana Hari Mirch (Green Chilli) Achaar',
      slug: 'athana-hari-mirch-green-chilli-achaar',
      categorySlug: 'green-chilli',
      price: 400,
      mrp: 499,
      stock: 120,
      unit: '500g',
      isFeatured: true,
      tags: ['chilli', 'green-chilli', 'athana', 'spicy']
    },
    {
      name: 'Desi Lahsun (Garlic) Achaar',
      slug: 'desi-lahsun-garlic-achaar',
      categorySlug: 'garlic',
      price: 400,
      mrp: 499,
      stock: 90,
      unit: '500g',
      tags: ['garlic', 'lahsun', 'spicy']
    },
    {
      name: 'Nimbu Begar Tel (Oil-free Lemon) Achaar',
      slug: 'nimbu-begar-tel-oil-free-lemon-achaar',
      categorySlug: 'lemon',
      price: 400,
      mrp: 499,
      stock: 110,
      unit: '500g',
      tags: ['lemon', 'nimbu', 'oil-free', 'digestive']
    },
    {
      name: 'Lal Mirch Bharwa (Stuffed Red Chilli) Achaar',
      slug: 'lal-mirch-bharwa-stuffed-red-chilli-achaar',
      categorySlug: 'red-chilli',
      price: 400,
      mrp: 520,
      stock: 75,
      unit: '500g',
      isFeatured: true,
      tags: ['chilli', 'red-chilli', 'stuffed', 'fiery']
    },
    {
      name: 'Lesua / Gunda (Gum Berry) Achaar',
      slug: 'lesua-gunda-gum-berry-achaar',
      categorySlug: 'rajasthani-special',
      price: 400,
      mrp: 499,
      stock: 60,
      unit: '500g',
      tags: ['gunda', 'lesua', 'berry', 'rajasthani']
    },
    {
      name: 'Ker 0-size Premium Achaar',
      slug: 'ker-0-size-premium-achaar',
      categorySlug: 'ker',
      price: 450,
      mrp: 600,
      stock: 40,
      unit: '500g',
      tags: ['ker', 'premium', 'berry']
    },
    {
      name: 'Kachi Haldi (Fresh Turmeric) Achaar',
      slug: 'kachi-haldi-fresh-turmeric-achaar',
      categorySlug: 'vegetables',
      price: 400,
      mrp: 499,
      stock: 80,
      unit: '500g',
      tags: ['turmeric', 'haldi', 'healthy', 'immunity']
    },
    {
      name: 'Amla Murabba (Sweet Gooseberry)',
      slug: 'amla-murabba-sweet-gooseberry',
      categorySlug: 'murabba',
      price: 400,
      mrp: 499,
      stock: 130,
      unit: '500g',
      tags: ['amla', 'murabba', 'sweet', 'gooseberry']
    },
    {
      name: 'Gulkand (Sun-cooked Rose Petals)',
      slug: 'gulkand-sun-cooked-rose-petals',
      categorySlug: 'others',
      price: 350,
      mrp: 450,
      stock: 140,
      unit: '500g',
      tags: ['gulkand', 'rose', 'sweet', 'ayurvedic']
    },
    {
      name: 'Desi Chana Methi Achaar',
      slug: 'desi-chana-methi-achaar',
      categorySlug: 'vegetables',
      price: 400,
      mrp: 480,
      stock: 95,
      unit: '500g',
      tags: ['chana', 'methi', 'mango', 'protein']
    }
  ];

  let productCount = 0;
  for (const p of products) {
    const { categorySlug, ...data } = p;
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {
        price: data.price,
        stock: data.stock,
        categoryId: createdCategories[categorySlug]
      },
      create: {
        ...data,
        shortDesc: `Pure handcrafted ${data.name} made in Lohagaal, Rajasthan.`,
        description: `This traditional ${data.name} is prepared using authentic, generation-old Rajasthani recipes. Sourced directly from local villages, it features premium ingredients, pure cold-pressed oil, and home-ground spices, aged naturally under the sun to bring you "Asli Swad, Seedha Gaon Se".`,
        categoryId: createdCategories[categorySlug],
        certifications: ['FSSAI Certified', '100% Handcrafted'],
        lowStockAlert: 10
      },
    });
    productCount++;
  }

  console.log(`✅ Products seeded: ${productCount}`);
  console.log('\n🎉 Seed complete!');
  console.log('   Admin: admin@achaarwaala.com / OTP Test Phone: 9999999999');
  console.log('   Customer: customer@example.com / OTP Test Phone: 9876543210');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
