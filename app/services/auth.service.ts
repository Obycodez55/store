import { signIn } from "next-auth/react";
import axios, { AxiosError } from 'axios';


export async function login({ email, password }: { email: string; password: string }) {
    const result = await signIn("credentials", {
        redirect: false,
        email,
        password
    });
    if (result?.error) {
        throw new Error("Login Failed");
    }
    return result;
}

export async function register({ email, password }: { email: string; password: string }) {
    try {
        const response = await axios.post("/api/auth/register", {
            email,
            password
        });
        if (response.status === 201) login({ email, password });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}