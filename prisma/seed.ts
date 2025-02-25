import { PrismaClient, Tags } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as XLSX from 'xlsx';
import { join } from 'path';
import bcrypt from 'bcryptjs';

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

// Read market data from Excel file
function readMarketData() {
  const workbook = XLSX.readFile(join(__dirname, 'markets.xlsx'));
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  return data.map((row: any) => ({
    name: row['Market Name'],
    location: row['Location'] || 'Location not specified',
    description: row['Description'] || 'Description not specified',
    prevDate: new Date(row['Previous Market Day'] || Date.now()),
    nextDate: new Date(row['Next Market Day'] || Date.now() + 7 * 24 * 60 * 60 * 1000)
  }));
}

async function seed() {
  console.log('🌱 Seeding database...');

  await prisma.market.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const marketData = readMarketData();

  for (const marketInfo of marketData) {
    try {
      const market = await prisma.market.create({
        data: {
          name: marketInfo.name,
          description: marketInfo.description,
          image: faker.helpers.arrayElement(marketImages),
          location: marketInfo.location,
          prevDate: marketInfo.prevDate,
          nextDate: marketInfo.nextDate,
          images: {
            create: marketImages.map((url) => ({ url })),
          },
          vendors: {
            create: await Promise.all(Array.from({ length: 3 }, async () => {
              // Create a user first
              const hashedPassword = await bcrypt.hash('password123', 10);
              const email = faker.internet.email();

              return {
                name: faker.company.name(),
                email,
                phone: faker.phone.number(),
                website: faker.internet.url(),
                goodsSold: Array.from({ length: 3 }, () => faker.commerce.product()),
                products: {
                  create: Array.from({ length: 5 }, () => ({
                    name: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    image: faker.helpers.arrayElement(productImages),
                    price: parseFloat(faker.commerce.price({ min: 5, max: 50 })),
                    tags: [faker.helpers.arrayElement(Object.values(Tags))]
                  }))
                },
                user: {
                  create: {
                    email,
                    password: hashedPassword,
                    name: faker.person.fullName()
                  }
                }
              };
            }))
          }
        }
      });

      console.log(`✅ Created market: ${market.name}`);
    } catch (error) {
      console.error(`❌ Error creating market ${marketInfo.name}:`, error);
    }
  }

  console.log('🎉 Seeding completed.');
  await prisma.$disconnect();
}

seed().catch((error) => {
  console.error('❌ Error seeding database:', error);
  prisma.$disconnect();
  process.exit(1);
});
