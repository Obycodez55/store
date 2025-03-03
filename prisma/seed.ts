import { PrismaClient, Tags } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as XLSX from "xlsx";
import { join } from "path";
import bcrypt from "bcryptjs";
import moment from "moment";

const prisma = new PrismaClient();

const marketImages = [
  "/images/market_2.jpg",
  "/images/market_3.jpg",
  "/images/market_4.jpg",
  "/images/market_5.jpg",
  "/images/market.jpg",
];

const productImages = [
  "/images/market_2.jpg",
  "/images/market_3.jpg",
  "/images/market_4.jpg",
  "/images/market_5.jpg",
  "/images/market.jpg",
];

function convertStringToDate(dateString: string): Date | null {
  const date = moment(dateString, "DD-MM-YYYY", true);
  return date.isValid() ? date.toDate() : null;
}
// Read market data from Excel file
function readMarketData() {
  const workbook = XLSX.readFile(join(__dirname, "markets.xlsx"));
  const sheet1 = workbook.SheetNames[0];
  const sheet2 = workbook.SheetNames[1];
  const worksheet1 = workbook.Sheets[sheet1];
  const worksheet2 = workbook.Sheets[sheet2];
  const data1 = XLSX.utils.sheet_to_json(worksheet1);
  const data2 = XLSX.utils.sheet_to_json(worksheet2);

  const combinedData = [...data1, ...data2];

  return combinedData.map((row: any) => ({
    name: row["Market Name"],
    location: row["Location"] || "Location not specified",
    description: row["Description"] || "Description not specified",
    prevDate: row["Previous Market Day"]
      ? convertStringToDate(row["Previous Market Day"])
      : null,
    interval: row["Interval"],
  }));
}

async function seed() {
  console.log("🌱 Seeding database...");

  await prisma.market.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const marketData = readMarketData();

  for (const marketInfo of marketData) {
    console.log("market prev date", marketInfo.prevDate);
    try {
      const market = await prisma.market.create({
        data: {
          name: marketInfo.name,
          description: marketInfo.description,
          image: faker.helpers.arrayElement(marketImages),
          location: marketInfo.location,
          prevDate: marketInfo.prevDate,
          interval: marketInfo.interval,
          images: {
            create: marketImages.map((url) => ({ url })),
          },
          vendors: {
            create: await Promise.all(
              Array.from({ length: 3 }, async () => {
                // Create a user first
                const hashedPassword = await bcrypt.hash("password123", 10);
                const email = faker.internet.email();
                const phone = faker.phone.number();
                return {
                  name: faker.company.name(),
                  website: faker.internet.url(),
                  phone,
                  goodsSold: Array.from({ length: 3 }, () =>
                    faker.commerce.product()
                  ),
                  products: {
                    create: Array.from({ length: 5 }, () => ({
                      name: faker.commerce.productName(),
                      description: faker.commerce.productDescription(),
                      image: faker.helpers.arrayElement(productImages),
                      tags: [faker.helpers.arrayElement(Object.values(Tags))],
                    })),
                  },
                  user: {
                    create: {
                      password: hashedPassword,
                      name: faker.person.fullName(),
                      phone,
                    },
                  },
                };
              })
            ),
          },
        },
      });

      console.log(`✅ Created market: ${market.name}`);
    } catch (error) {
      console.error(`❌ Error creating market ${marketInfo.name}:`, error);
    }
  }

  console.log("🎉 Seeding completed.");
  await prisma.$disconnect();
}

seed().catch((error) => {
  console.error("❌ Error seeding database:", error);
  prisma.$disconnect();
  process.exit(1);
});
