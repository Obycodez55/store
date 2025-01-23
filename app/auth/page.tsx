"use client";
import { useCallback, useState } from "react";
import Input from "../components/Input";

const Auth = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [isLogin, setIsLogin] = useState<boolean>(true);

interface HandleSubmitEvent extends React.MouseEvent<HTMLButtonElement> {
   preventDefault: () => void;
}

const handleSubmit = useCallback((e: HandleSubmitEvent) => {
   e.preventDefault();
   setLoading(true);
   if (isLogin) {
     // Login
     console.log("Login");
     console.log({phoneNumber, password});
   } else {
       // Register
       console.log("Register");
       console.log({phoneNumber, password, confirmPassword});
   }
}, [phoneNumber, password, confirmPassword, isLogin]);
  return (
    <div className="grid md:grid-cols-2 shadow-xl p-4 h-screen text-gray-900">
      <div className="flex justify-center items-center h-full overflow-hidden rounded-lg max-md:hidden">
        <img src="/images/market.jpg" alt="" />
      </div>
      <div className="flex justify-center items-center px-10">
        <form action="" className="w-full space-y-8">
          <div className="flex justify-center items-center">
            <h2 className="text-5xl font-bold">Login</h2>
          </div>
          <Input
            label="Phone Number"
            id="phone"
            value={phoneNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPhoneNumber(e.target.value)
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
              Don't have an account? <span className="text-red-600 cursor-pointer" onClick={(e)=>{setIsLogin(false)}}>Sign up</span>
            </p>
          ) : (
            <p>
              Already have an account? <span className="text-red-600 cursor-pointer" onClick={(e)=>{setIsLogin(true)}}>Login</span>
            </p>
          )}

          <div className="flex justify-center items-center">
            <button
              className="bg-neutral-500 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg"
             onClick={handleSubmit}
            >
              {loading ? "Loading..." : isLogin ? "Login" : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
