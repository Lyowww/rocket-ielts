import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { accessCodeSchema } from "@/schema/auth.schema";
import Cookies from "js-cookie";
import { PublicRoutesEnum } from "@/enum/routes.enum";

type AccessCodeType = z.infer<typeof accessCodeSchema>;
const VALID_CODE = "Let the magic begin!";
const useAccessToken = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AccessCodeType>({
    mode: "onSubmit",
    resolver: zodResolver(accessCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleFormSubmit = async (data: AccessCodeType) => {
    if (data.code.trim() === VALID_CODE) {
      Cookies.set("sessionCode", "valid", { secure: true, sameSite: "Lax" });
      window.location.href = PublicRoutesEnum.signin;
    } else {
      setError("code", {
        type: "manual",
        message: "Invalid code. Please try again.",
      });
    }
  };

  return {
    control,
    errors,

    handleSubmit,
    handleFormSubmit,
  };
};

export default useAccessToken;
