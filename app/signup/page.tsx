import { Signup } from "@/components/organisms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignupPage = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="max-w-[500px] w-full mx-auto flex flex-col gap-4">
        <h2 className="text-center font-extrabold text-[32px]">
          Create new account
        </h2>
        <Signup />
      </div>
    </div>
  );
};

export default SignupPage;
