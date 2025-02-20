import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// PUT /api/products/[productId] - Update a product
export async function PUT(
    req: Request,
    { params }: { params: { productId: string } }  // Changed from id to productId
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const formData = await req.formData();

        // Check if product exists and belongs to the vendor
        const existingProduct = await prisma.product.findFirst({
            where: {
                id: params.productId,  // Changed from id to productId
                vendor: {
                    user: {
                        id: session.user.id
                    }
                }
            }
        });

        if (!existingProduct) {
            return new NextResponse('Product not found', { status: 404 });
        }

        // Upload new image if provided
        let imageUrl = existingProduct.image;
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

        // Update product
        const product = await prisma.product.update({
            where: { id: params.productId },  // Changed from id to productId
            data: {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                price: parseFloat(formData.get('price') as string),
                image: imageUrl
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}

// DELETE /api/products/[productId] - Delete a product
export async function DELETE(
    req: Request,
    { params }: { params: { productId: string } }  // Changed from id to productId
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Check if product exists and belongs to the vendor
        const product = await prisma.product.findFirst({
            where: {
                id: params.productId,  // Changed from id to productId
                vendor: {
                    user: {
                        id: session.user.id
                    }
                }
            }
        });

        if (!product) {
            return new NextResponse('Product not found', { status: 404 });
        }

        // Delete product
        await prisma.product.delete({
            where: { id: params.productId }  // Changed from id to productId
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting product:', error);
        return new NextResponse('Internal error', { status: 500 });
    }
} 