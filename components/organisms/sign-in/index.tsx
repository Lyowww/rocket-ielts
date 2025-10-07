"use client";

import { Button } from "@/components/atom/button";
import { Input } from "@/components/atom/input";
import useSignin from "./useSignin";
import { Controller } from "react-hook-form";
import Link from "next/link";
import { PublicRoutesEnum } from "@/enum/routes.enum";

const SignIn = () => {
  const {
    control,
    errors,
    isPending,
    errorRes,

    handleSubmit,
    handleFormSubmit,
  } = useSignin();

  return (
    <form
      className="w-full flex flex-col gap-4 mt-3"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Controller
        control={control}
        render={({ field }) => (
          <Input
            type="email"
            placeholder="Email address"
            className="py-3"
            error={errors?.email?.message}
            {...field}
          />
        )}
        name="email"
      />

      <Controller
        control={control}
        render={({ field }) => (
          <Input
            type="password"
            placeholder="Password"
            className="py-3"
            error={errors?.password?.message}
            {...field}
          />
        )}
        name="password"
      />
      {!!errorRes && <p className="text-red-500 text-sm">{errorRes}</p>}
      <Button
        isLoading={isPending}
        type="submit"
        className="bg-primary w-full mt-4"
      >
        Sign in
      </Button>

      <Link
        href={PublicRoutesEnum.signup}
        className="mt-4 text-center text-secondary font-bold link-hover"
      >
        Create new account
      </Link>
    </form>
  );
};

export default SignIn;
