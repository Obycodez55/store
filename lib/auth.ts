import { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import { User } from "@prisma/client";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "tel", placeholder: "+1234567890" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          throw new Error("Missing credentials");
        }
        console.log("credentials", { credentials });
        const user = await prisma.user.findFirst({
          where: { phone: credentials.phone },
          include: { vendor: true },
        });
        if (!user) {
          throw new Error("Invalid phone number or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid phone number or password");
        }
        console.log("user loggedin", { user });

        return {
          id: user.id,
          name: user.name,
          phone: user.phone,
          image: user.image,
          vendorId: user.vendorId,
          shopName: user.shopName,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  secret: process.env.NEXTAUTH_SECRET || "fallbacksecretdonotuseinproduction",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.phone = (user as User & { phone: string }).phone;
        token.vendorId = (user as User & { vendorId: string | null }).vendorId;
        token.shopName = (user as User & { shopName: string }).shopName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.phone = token.phone as string;
        session.user.vendorId = token.vendorId as string;
        session.user.shopName = token.shopName as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  debug: true,
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug(code, metadata);
    },
  },
};

export default authOptions;
