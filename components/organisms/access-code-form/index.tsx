"use client";

import { Button } from "@/components/atom/button";
import { Input } from "@/components/atom/input";
import useAccessToken from "./useAccessToken";
import { Controller } from "react-hook-form";

const AccessCodeForm = () => {
  const {
    control,
    errors,

    handleSubmit,
    handleFormSubmit,
  } = useAccessToken();

  return (
    <form
      className="w-full flex flex-col gap-6"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <figure className="w-full">
        <Controller
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              placeholder="Access Code"
              className="mt-4"
              error={errors?.code?.message}
              {...field}
            />
          )}
          name="code"
        />
      </figure>

      <Button type="submit" className="bg-primary w-full">
        Submit
      </Button>
    </form>
  );
};

export default AccessCodeForm;
