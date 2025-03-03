import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import { join } from "path";
import moment from "moment";

const prisma = new PrismaClient();

function convertStringToDate(dateString: string): Date | null {
  const date = moment(dateString, "DD-MM-YYYY", true);
  return date.isValid() ? date.toDate() : null;
}

// Read market data from Excel file
let __dirname = "/home/prosper/Desktop/workspace/Collaborations/store/prisma";
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
    prevDate: row["Previous Market Day"]
      ? convertStringToDate(row["Previous Market Day"])
      : null,
  }));
}

async function updateMarketDates() {
  console.log("🔄 Updating market dates...");

  const marketData = readMarketData();
  let updatedCount = 0;
  let notFoundCount = 0;

  for (const marketInfo of marketData) {
    try {
      // Find market by name
      const existingMarket = await prisma.market.findFirst({
        where: { name: marketInfo.name },
      });

      if (existingMarket) {
        // Update only prevDate field
        await prisma.market.update({
          where: { id: existingMarket.id },
          data: { prevDate: marketInfo.prevDate },
        });
        console.log(`✅ Updated prevDate for market: ${marketInfo.name}`);
        updatedCount++;
      } else {
        console.log(`⚠️ Market not found: ${marketInfo.name}`);
        notFoundCount++;
      }
    } catch (error) {
      console.error(`❌ Error updating market ${marketInfo.name}:`, error);
    }
  }

  console.log(
    `🎉 Update completed. Updated: ${updatedCount}, Not found: ${notFoundCount}`
  );
  await prisma.$disconnect();
}

updateMarketDates().catch((error) => {
  console.error("❌ Error updating market dates:", error);
  prisma.$disconnect();
  process.exit(1);
});
