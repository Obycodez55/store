import { Market, User, Vendor, Product, Tags } from "@prisma/client";

export interface MarketWithVendors extends Market {
  vendors: VendorWithProducts[];
}

export interface VendorWithProducts extends Vendor {
  user: User;
  products: Product[];
  market: Market;
}

export interface ProductWithImages extends Product {
  images: Array<{ id: string; url: string }>;
  vendor: {
    name: string;
    email?: string;
    phone?: string;
    website?: string;
    market: {
      name: string;
      location: string;
    };
  };
}

export interface Market {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  images: MarketImage[];
  prevDate: Date | null;
  nextDate: Date | null;
  interval: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketImage {
  id: string;
  url: string;
  marketId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Image {
  id: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vendor {
  id: string;
  name: string;
  marketId: string;
  products: Product[];
  createdAt: Date;
  updatedAt: Date;
  email?: string;
  phone: string;
  website?: string;
  goodsSold: string[];
  market?: Market;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  tags: Tags[];
  image: string | null;
  images: ProductImage[];
  createdAt: Date;
  updatedAt: Date;
  vendor: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    website: string | null;
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
    };
  };
}

export interface ProductImage {
  id: string;
  url: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}
