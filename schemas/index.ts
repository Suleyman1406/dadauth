import { UserRole } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});
export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});
export const ResetSchema = z.object({
  email: z.string().email(),
});
export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const SettingsSchema = z
  .object({
    name: z.optional(
      z.string().min(3, {
        message: "Name must be at least 3 characters long",
      })
    ),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string()),
    newPassword: z.optional(
      z.string().min(6, {
        message: "Password must be at least 6 characters long",
      })
    ),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      if (!data.password && data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message:
        "You must provide both password and new password to change your password",
      path: ["password"],
    }
  );
