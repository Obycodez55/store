import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string | null;
    phone: string;
    shopName: string | null;
    vendorId: string | null;
  }

  interface Session {
    user: User & {
      id: string;
      name: string | null;
      phone: string;
      shopName: string | null;
      vendorId: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    vendorId?: string | null;
    phone?: string;
  }
}
