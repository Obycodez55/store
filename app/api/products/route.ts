import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        const products = await prisma.product.findMany({
            where: userId ? {
                vendor: {
                    user: {
                        id: userId
                    }
                }
            } : undefined,
            include: {
                vendor: {
                    include: {
                        market: true
                    }
                }
            }
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const formData = await req.formData();

        // Get vendor
        const vendor = await prisma.vendor.findFirst({
            where: {
                user: {
                    id: session.user.id
                }
            }
        });

        if (!vendor) {
            return new NextResponse('Vendor not found', { status: 404 });
        }

        // Upload image to Cloudinary if provided
        let imageUrl = null;
        const image = formData.get('image') as File | null;
        if (image) {
            const imageBuffer = await image.arrayBuffer();
            const imageBase64 = Buffer.from(imageBuffer).toString('base64');
            const result = await cloudinary.uploader.upload(
                `data:${image.type};base64,${imageBase64}`,
                { folder: 'products' }
            );
            imageUrl = result.secure_url;
        }

        // Create product
        const product = await prisma.product.create({
            data: {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                price: parseFloat(formData.get('price') as string),
                image: imageUrl,
                vendorId: vendor.id
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
