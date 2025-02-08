
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

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string | null;
    createdAt: Date;
    updatedAt: date;
}