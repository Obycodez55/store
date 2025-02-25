import { signIn } from "next-auth/react";

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const result = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });
  if (result?.error) {
    console.log("Login Failed", result.error);
    throw new Error("Login Failed");
  }
  return result;
}

export const register = async (data: {
  email: string;
  password: string;
  name: string;
  marketId: string;
  phone?: string;
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
