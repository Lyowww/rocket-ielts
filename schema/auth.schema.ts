import * as z from "zod";

export const accessCodeSchema = z.object({
  code: z
    .string({ required_error: "Access code is required" })
    .nonempty({ message: "Access code is required" })
    .trim()
    .min(1, {
      message: "Access code is required",
    }),
});

export const signinSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .nonempty({ message: "Email is required" })
    .trim()
    .email({ message: "Enter a valid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .nonempty({ message: "Password is required" })
    .trim()
    .min(1, {
      message: "Password is required",
    }),
});

export const signupSchema = z.object({
  first_name: z
    .string({ required_error: "First name is required" })
    .nonempty({ message: "First name is required" })
    .trim()
    .min(2, { message: "First name must be at least 2 characters" }),

  last_name: z
    .string({ required_error: "Last name is required" })
    .nonempty({ message: "Last name is required" })
    .trim()
    .min(2, { message: "Last name must be at least 2 characters" }),

  email: z
    .string({ required_error: "Email is required" })
    .nonempty({ message: "Email is required" })
    .trim()
    .email({ message: "Enter a valid email address" }),

  password: z
    .string({ required_error: "Password is required" })
    .nonempty({ message: "Password is required" })
    .trim()
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
  password_confirm: z
    .string({ required_error: "Please confirm your password" })
    .nonempty({ message: "Please confirm your password" })
    .trim()
    .min(6, {
      message: "Password confirmation must be at least 6 characters",
    }),
}).refine((data) => data.password === data.password_confirm, {
  path: ["password_confirm"],
  message: "Passwords do not match",
});
