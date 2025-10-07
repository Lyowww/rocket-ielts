import { SignIn } from "@/components/organisms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

const Signin = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="max-w-[500px] w-full mx-auto flex flex-col gap-4">
        <h2 className="text-center font-extrabold text-[32px]">
          Sign in to your account
        </h2>
        <SignIn />
      </div>
    </div>
  );
};

export default Signin;
