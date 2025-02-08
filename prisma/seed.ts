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

  for (let i = 0; i < 63; i++) {
    // Generate nextDate within next 14 days
    const nextDate = faker.date.future({ years: 0.0384 }); // ~14 days
    // Generate prevDate within 14 days before nextDate
    const prevDate = faker.date.between({
      from: new Date(nextDate.getTime() - 14 * 24 * 60 * 60 * 1000),
      to: nextDate
    });

    const market = await prisma.market.create({
      data: {
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        image: faker.helpers.arrayElement(marketImages),
        location: faker.location.city(),
        prevDate,
        nextDate,
        images: {
          create: marketImages.map((url) => ({ url })),
        },
        vendors: {
          create: Array.from({ length: 3 }, () => ({
            name: faker.company.name(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            website: faker.internet.url(),
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
