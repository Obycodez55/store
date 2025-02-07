import { PrismaClient, Tags } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const marketImages = [
    "/images/market_2.jpg", 
    "/images/market_3.jpg", 
    "/images/market_4.jpg", 
    "/images/market_5.jpg", 
    "/images/market.jpg"
];

const productImages = [
    "/images/market_2.jpg", 
    "/images/market_3.jpg", 
    "/images/market_4.jpg", 
    "/images/market_5.jpg", 
    "/images/market.jpg"
];

async function seed() {
  console.log('🌱 Seeding database...');

  await prisma.market.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.product.deleteMany();

  for (let i = 0; i < 5; i++) {
    const market = await prisma.market.create({
      data: {
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        image: faker.helpers.arrayElement(marketImages),
        location: faker.location.city(),
        prevDate: faker.date.past(),
        nextDate: faker.date.future(),
        images: {
          create: marketImages.map((url) => ({ url })),
        },
        vendors: {
          create: Array.from({ length: 3 }, () => ({
            name: faker.company.name(),
            description: faker.lorem.sentence(),
            image: faker.image.avatar(),
            products: {
              create: Array.from({ length: 5 }, () => ({
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                image: faker.helpers.arrayElement(productImages),
                price: parseFloat(faker.commerce.price({ min: 5, max: 50 })),
                tags: [faker.helpers.arrayElement(Object.values(Tags))],
              })),
            },
          })),
        },
      },
    });

    console.log(`✅ Created market: ${market.name}`);
  }

  console.log('🎉 Seeding completed.');
  await prisma.$disconnect();
}

seed().catch((error) => {
  console.error('❌ Error seeding database:', error);
  prisma.$disconnect();
  process.exit(1);
});
