"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import z from "zod";

import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { DEFAULT_LOGIN_REDIRECT_URL } from "@/routes";
import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { db } from "@/lib/db";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid credentials!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(email, verificationToken.token);

    return { success: "Confirmation email sent again!" };
  }

  console.log(existingUser.isTwoFactorEnabled);

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const token = await getTwoFactorTokenByEmail(existingUser.email);

      if (!token || token.token !== code)
        return { error: "Invalid credentials!" };

      const hasExpired = new Date(token.expires) < new Date();

      if (hasExpired) {
        return { error: "2FA Code expired" };
      }

      await db.twoFactorToken.delete({
        where: {
          id: token.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const isPasswordsMatches = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isPasswordsMatches) return { error: "Invalid credentials!" };

      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorEmail(existingUser.email, twoFactorToken.token);

      return {
        twoFactor: true,
      };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT_URL,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }

  return { success: "Email sent!" };
};
