"use client";

import { Button } from "@/components/atom/button";
import { Input } from "@/components/atom/input";
import { Controller } from "react-hook-form";
import Link from "next/link";
import { PublicRoutesEnum } from "@/enum/routes.enum";
import useSignup from "./useSignup";

const Signup = () => {
  const {
    control,
    errors,
    isPending,

    handleSubmit,
    handleFormSubmit,
  } = useSignup();

  console.log(errors);

  return (
    <form
      className="w-full flex flex-col gap-4 mt-3"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Controller
        control={control}
        render={({ field }) => (
          <Input
            type="text"
            placeholder="First Name"
            className="py-3"
            error={errors?.first_name?.message}
            {...field}
          />
        )}
        name="first_name"
      />
      <Controller
        control={control}
        render={({ field }) => (
          <Input
            type="text"
            placeholder="Last Name"
            className="py-3"
            error={errors?.last_name?.message}
            {...field}
          />
        )}
        name="last_name"
      />
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

      <Controller
        control={control}
        render={({ field }) => (
          <Input
            type="password"
            placeholder="Confirm Password"
            className="py-3"
            error={errors?.password_confirm?.message}
            {...field}
          />
        )}
        name="password_confirm"
      />

      <Button
        isLoading={isPending}
        type="submit"
        className="bg-primary w-full mt-4"
      >
        Create account
      </Button>

      <Link
        href={PublicRoutesEnum.signin}
        className="mt-4 text-center text-secondary font-bold link-hover"
      >
        Already have an account? Sign in
      </Link>
    </form>
  );
};

export default Signup;
