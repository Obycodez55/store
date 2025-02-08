import { Tags } from "@prisma/client";

export interface Market {
    id: string;
    name: string;
    location: string;
    description: string;
    image: string;
    images: Image[];
    vendors: Vendor[];
    prevDate: Date;
    nextDate: Date;
    createdAt: Date;
    updatedAt: date;
}

export interface Image {
    id: string;
    url: string;
    createdAt: Date;
    updatedAt: date;
}

export interface Vendor {
    id: string;
    name: string;
    products: Product[];
    createdAt: Date;
    updatedAt: date;
}

interface Product {
    id: string;
    name: string;
    price: number;
    description: string | null;
    tags: Tags[];
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    vendor: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        market: {
            id: string;
            name: string;
            location: string;
            description: string;
            image: string;
            prevDate: Date;
            nextDate: Date;
            createdAt: Date;
            updatedAt: Date;
        }
    }
}