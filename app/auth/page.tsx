"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "../services/auth.service";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Icons } from "../components/Icons";
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Globe
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
});

const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string(),
    name: z.string().min(2, "Name must be at least 2 characters"),
    marketId: z.string().min(1, "Please select a market"),
    website: z.string().url("Please enter a valid website URL").optional(),
    phone: z.string().min(10, "Please enter a valid phone number").optional()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

type AuthFormValues = z.infer<typeof registerSchema>;

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const formVariants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      bounce: 0.4
    }
  }
};

const Auth = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [markets, setMarkets] = useState<{ id: string; name: string }[]>([]);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      marketId: "",
      phone: "",
      website: ""
    }
  });

  // When switching between login/register, reset the form
  useEffect(() => {
    form.reset();
  }, [isLogin, form]);

  // Fetch markets for the dropdown
  useEffect(() => {
    const fetchMarkets = async () => {
      const response = await fetch("/api/markets");
      const data = await response.json();
      setMarkets(
        data.map((market: any) => ({
          id: market.id,
          name: market.name
        }))
      );
    };

    if (!isLogin) {
      fetchMarkets();
    }
  }, [isLogin]);

  const onSubmit = useCallback(
    async (data: AuthFormValues) => {
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
          router.push("/dashboard");
        } else {
          await register({
            email: data.email,
            password: data.password,
            name: data.name,
            marketId: data.marketId,
            phone: data.phone,
            website: data.website
          });
          toast.success("Account created!", {
            description: "Your account has been successfully created."
          });
          await login({
            email: data.email,
            password: data.password
          });
          router.push("/dashboard");
        }
      } catch (error: any) {
        toast.error("Authentication failed", {
          description:
            error.message || "Please check your credentials and try again."
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isLogin, router]
  );

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      {/* Left side - Image with animated overlay */}
      <motion.div
        className="hidden lg:block relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
            alt="Local market with fresh produce"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/90 via-primary-900/90 to-primary-800/90 dark:from-primary-950/95 dark:via-primary-950/90 dark:to-primary-900/90" />
        <div className="absolute inset-0">
          {/* Decorative pattern overlay */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                Welcome to MarketPlace
              </h1>
              <p className="text-lg text-white/60 max-w-md leading-relaxed">
                Connect with local markets, discover fresh produce, and support
                your community.
              </p>
            </div>

            {/* Feature list */}
            <motion.ul
              className="space-y-4 text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {[
                "Discover local markets near you",
                "Connect with trusted vendors",
                "Access fresh, quality products",
                "Support your local community"
              ].map((feature, index) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-300" />
                  {feature}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Auth form */}
      <div className="flex items-center justify-center p-6 bg-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-md space-y-6"
          >
            <motion.div
              variants={formVariants}
              className="text-center space-y-2"
            >
              <h2 className="text-2xl font-display font-bold text-foreground">
                {isLogin ? "Welcome back" : "Create an account"}
              </h2>
              <p className="text-muted-foreground">
                {isLogin
                  ? "Enter your credentials to access your account"
                  : "Fill in your details to create a new account"}
              </p>
            </motion.div>

            <Card>
              <CardContent className="pt-6">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        {...form.register("email")}
                        disabled={isLoading}
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <Input
                            id="name"
                            placeholder="Enter your full name"
                            {...form.register("name")}
                            disabled={isLoading}
                            className="pl-10"
                          />
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        </div>
                        {form.formState.errors.name && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="marketId">Select Market</Label>
                        <Select
                          onValueChange={(value) =>
                            form.setValue("marketId", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a market" />
                          </SelectTrigger>
                          <SelectContent>
                            {markets.map((market) => (
                              <SelectItem key={market.id} value={market.id}>
                                {market.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {form.formState.errors.marketId && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.marketId.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            {...form.register("phone")}
                            disabled={isLoading}
                            className="pl-10"
                          />
                          <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        </div>
                        {form.formState.errors.phone && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.phone.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <div className="relative">
                          <Input
                            id="website"
                            type="url"
                            placeholder="Enter your website URL"
                            {...form.register("website")}
                            disabled={isLoading}
                            className="pl-10"
                          />
                          <Globe className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        </div>
                        {form.formState.errors.website && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.website.message}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...form.register("password")}
                        disabled={isLoading}
                        className="pl-10 pr-10"
                      />
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {form.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          {...form.register("confirmPassword")}
                          disabled={isLoading}
                          className="pl-10"
                        />
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                      {form.formState.errors.confirmPassword && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoading
                      ? "Processing..."
                      : isLogin
                      ? "Sign in"
                      : "Create account"}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col gap-4 text-center">
                <div className="text-sm text-muted-foreground">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <Button
                    variant="link"
                    className="font-semibold text-primary hover:text-primary/80"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      form.reset();
                    }}
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => router.push("/")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to home
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Auth;
