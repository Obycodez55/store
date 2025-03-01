import { signIn } from "next-auth/react";

export async function login({
  phone,
  password,
}: {
  phone: string;
  password: string;
}) {
  const result = await signIn("credentials", {
    redirect: false,
    phone,
    password,
  });
  if (result?.error) {
    console.log("Login Failed", result.error);
    throw new Error("Login Failed");
  }
  return result;
}

export const register = async (data: {
  phone: string;
  password: string;
  name: string;
  shopName: string;
  marketId: string;
  website?: string;
}) => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return response.json();
};
