import { PrismaClient, Tags } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const productImages = [
  "/images/market_2.jpg",
  "/images/market_3.jpg", 
  "/images/market_4.jpg",
  "/images/market_5.jpg",
  "/images/market.jpg"
];

async function seedVendorProducts() {
  console.log('🌱 Seeding vendor products...');

  try {
    const products = await prisma.product.createMany({
      data: Array.from({ length: 10 }, () => ({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        image: faker.helpers.arrayElement(productImages),
        price: parseFloat(faker.commerce.price({ min: 5, max: 50 })),
        tags: [faker.helpers.arrayElement(Object.values(Tags))],
        vendorId: 'cm7ddqskl0003q0kq313le9ve'
      }))
    });

    console.log(`✅ Created ${products.count} products for vendor`);
  } catch (error) {
    console.error('❌ Error seeding vendor products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedVendorProducts().catch((error) => {
  console.error('❌ Error:', error);
  prisma.$disconnect();
  process.exit(1);
});
