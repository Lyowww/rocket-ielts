import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "@/schema/auth.schema";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useState } from "react";

type SigninSchemaType = z.infer<typeof signinSchema>;

const useSignin = () => {
  const [errorRes, setErrorRes] = useState<string>("");
  const {
    control,
    handleSubmit,
    // setError,
    formState: { errors },
  } = useForm<SigninSchemaType>({
    mode: "onSubmit",
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["signin"],
    mutationFn: (data: SigninPayload) => authService.signIn(data),
    onSuccess: (data) => {
      Cookies.set("access_token", data?.access, { secure: true, expires: 0.5 });
      Cookies.set("refresh_token", data?.refresh, {
        secure: true,
        expires: 0.5,
      });
      window.location.href = "/";
    },
    onError: (error: { error: string }) => {
      setErrorRes(error?.error);
    },
  });

  const handleFormSubmit = async (data: SigninSchemaType) => {
    if (!isPending) {
      mutate(data);
    }
  };

  return {
    control,
    errors,
    isPending,
    errorRes,

    handleSubmit,
    handleFormSubmit,
  };
};

export default useSignin;
