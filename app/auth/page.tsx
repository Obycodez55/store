"use client";
import { useCallback, useState, useEffect } from "react";
import Input from "../components/Input";
import { FaUserLarge } from "react-icons/fa6";
import { LoginButton } from "../components/LoginButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { login, register } from "../services/auth.service";
import { toast } from "sonner";

const Auth = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [isLogin, setIsLogin] = useState<boolean>(true);

  interface HandleSubmitEvent extends React.MouseEvent<HTMLButtonElement> {
    preventDefault: () => void;
  }

  const handleSubmit = useCallback(
    async (e: HandleSubmitEvent) => {
      e.preventDefault();
      setLoading(true);
      if (isLogin) {
        try {
          await login({ email, password });
          toast.success("Login Successful", {
            description: "You are now logged in"
          });
          router.push("/");
        } catch (error) {
          toast.error("Login Failed", {
            description: "Invalid email or password"
          });
        }
      } else {
        try {
          await register({ email, password });
          toast.success("Registration Successful", {
            description: "You are now registered and logged in"
          });
        } catch (error: any) {
          toast.error("Registration Failed", {
            description: error.message
          });
        }
      }
    },
    [email, password, confirmPassword, isLogin]
  );
  return (
    <div className="grid md:grid-cols-2 shadow-xl p-4 h-screen text-gray-900">
      <div className="flex justify-center items-center h-full overflow-hidden rounded-lg max-md:hidden">
        <img src="/images/market.jpg" alt="" />
      </div>
      <div className="flex justify-center items-center px-10">
        <form
          action=""
          className="md:w-[80%] p-3 space-y-8 border bg-white shadow-md rounded-md"
        >
          <div className="flex justify-center items-center">
            <h2 className="md:text-5xl text-3xl font-bold flex gap-2 items-center ">
              {" "}
              <FaUserLarge className="text-blue-950 md:text-4xl text:2xl" />
              {isLogin ? "Login" : "Sign In"}
            </h2>
          </div>
          <Input
            label="Email"
            id="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            type="text"
          />

          <Input
            label="Password"
            id="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            type="password"
          />

          {!isLogin && (
            <Input
              label="Confirm Password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              type="password"
            />
          )}

          {isLogin ? (
            <p>
              Don&apos;t have an account?{" "}
              <span
                className="text-blue-950 font-semibold cursor-pointer"
                onClick={() => {
                  setIsLogin(false);
                }}
              >
                Sign up
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span
                className="text-blue-950 font-semibold cursor-pointer"
                onClick={() => {
                  setIsLogin(true);
                }}
              >
                Login
              </span>
            </p>
          )}

          <div className="flex justify-center items-center">
            <button
              className="bg-blue-950 hover:bg-blue-900 font-semibold text-white px-6 py-2 rounded-lg"
              onClick={handleSubmit}
            >
              {loading ? "Loading..." : isLogin ? "Login" : "Register"}
            </button>
          </div>
          <LoginButton />
        </form>
      </div>
    </div>
  );
};

export default Auth;
