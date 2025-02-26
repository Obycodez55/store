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

    const vendor = await prisma.vendor.findFirst({
      where: { user: {id: session.user.id} },
      include: {
        market: {
          select: {
            id: true,
            name: true,
            location: true,
            description: true,
          },
        },
      },
    });

    if (!vendor) {
      return new NextResponse("Vendor not found", { status: 404 });
    }

    return NextResponse.json(vendor);
  } catch (error) {
    console.error("Error fetching vendor dashboard:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
