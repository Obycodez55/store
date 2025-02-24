import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { item } = await request.json();
        const vendor = await prisma.vendor.findFirst({
            where: { user: { id: session.user.id as string } },
            select: { id: true, goodsSold: true }
        });

        if (!vendor) {
            return new NextResponse("Vendor not found", { status: 404 });
        }

        const updatedVendor = await prisma.vendor.update({
            where: { id: vendor.id },
            data: {
                goodsSold: [...(vendor.goodsSold || []), item]
            }
        });

        return NextResponse.json(updatedVendor);
    } catch (error) {
        console.error("Error adding goods:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { item } = await request.json();
        const vendor = await prisma.vendor.findFirst({
            where: { user: { id: session.user.id as string } },
            select: { id: true, goodsSold: true }
        });

        if (!vendor) {
            return new NextResponse("Vendor not found", { status: 404 });
        }

        const updatedVendor = await prisma.vendor.update({
            where: { id: vendor.id },
            data: {
                goodsSold: vendor.goodsSold.filter((good) => good !== item)
            }
        });

        return NextResponse.json(updatedVendor);
    } catch (error) {
        console.error("Error removing goods:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
} 