import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("Session in dashboard:", { session });

    // Use the vendorId from the session directly if available
    const vendorId = session.user.vendorId;

    if (!vendorId) {
      return new NextResponse("No vendor associated with this account", {
        status: 404,
      });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        market: {
          select: {
            id: true,
            name: true,
            location: true,
            description: true,
          },
        },
        products: true,
      },
    });

    console.log({ session, vendor });
    if (!vendor) {
      return new NextResponse("Vendor not found", { status: 404 });
    }

    return NextResponse.json(vendor);
  } catch (error) {
    console.log("Error fetching vendor dashboard:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
