"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { login, register } from "../services/auth.service";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Icons } from "../components/Icons";

// Form validation schema
const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type AuthFormValues = z.infer<typeof authSchema>;

const Auth = () => {
  const { status } = useSession();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: AuthFormValues) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        await login({ 
          email: data.email, 
          password: data.password 
        });
        toast.success("Welcome back!", {
          description: "You've successfully signed in."
        });
        router.push("/");
      } else {
        await register({ 
          email: data.email, 
          password: data.password 
        });
        toast.success("Account created!", {
          description: "Your account has been successfully created."
        });
      }
    } catch (error: any) {
      toast.error("Authentication failed", {
        description: error.message || "Please check your credentials and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="md:h-screen min-h-screen w-full grid lg:grid-cols-2">
      {/* Left side - Image with animated overlay */}
      <motion.div 
        className="hidden lg:block relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-primary-800/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />
        <img
          src="/images/market.jpg"
          alt="Marketplace"
          className="h-full w-full object-cover"
        />
        <motion.div 
          className="absolute inset-0 flex items-center justify-center p-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="max-w-xl text-white space-y-6">
            <h1 className="text-5xl font-display font-bold">
              Welcome to our Marketplace
            </h1>
            <p className="text-xl opacity-90">
              Discover unique products and connect with sellers worldwide.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Right side - Auth form */}
      <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-dark-bg">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-md"
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {isLogin ? "Welcome back" : "Create an account"}
                </CardTitle>
                <CardDescription>
                  {isLogin 
                    ? "Enter your credentials to access your account" 
                    : "Fill in your details to create a new account"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...form.register("email")}
                      disabled={isLoading}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-error-500">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...form.register("password")}
                      disabled={isLoading}
                    />
                    {form.formState.errors.password && (
                      <p className="text-sm text-error-500">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        {...form.register("confirmPassword")}
                        disabled={isLoading}
                      />
                      {form.formState.errors.confirmPassword && (
                        <p className="text-sm text-error-500">
                          {form.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoading ? "Processing..." : isLogin ? "Sign in" : "Create account"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-center w-full text-slate-600 dark:text-dark-text-secondary">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <Button
                    variant="link"
                    className="font-semibold"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      form.reset();
                    }}
                  >
                    {isLogin ? "Sign up" : "Login"}
                  </Button>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Auth;