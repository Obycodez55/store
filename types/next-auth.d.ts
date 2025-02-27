import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email?: string;
      image?: string;
      phone: string;
      vendorId: string | null;
    };
  }

  interface User {
    vendorId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    vendorId?: string | null;
    phone?: string;
  }
}
