"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schema/auth.schema";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { PublicRoutesEnum } from "@/enum/routes.enum";
import { toast } from "sonner";

type SignupSchemaType = z.infer<typeof signupSchema>;

const useSignup = () => {
  const { push } = useRouter();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupSchemaType>({
    mode: "onSubmit",
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirm: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: (data: SignupPayload) => authService.signUp(data),
    onSuccess: () => {
      toast.success("Account created successfully");
      push(PublicRoutesEnum.signin);
    },
    onError: (error: [string, string[]][]) => {
      console.log(error);

      Object.entries(error).forEach(([field, messages]) => {
        setError(field as keyof SignupSchemaType, {
          type: "manual",
          message: messages[0],
        });
      });
    },
  });

  const handleFormSubmit = async (data: SignupSchemaType) => {
    if (!isPending) {
      const payload: SignupPayload = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        password_confirm: data.password_confirm,
      };
      mutate(payload);
    }
  };

  return {
    control,
    errors,
    isPending,
    handleSubmit,
    handleFormSubmit,
  };
};

export default useSignup;
