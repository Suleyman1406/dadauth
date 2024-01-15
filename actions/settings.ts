"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";

import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { SettingsSchema } from "@/schemas";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Not logged in!" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "User not found!" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.newPassword && values.password && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );
    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);

    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  if (values.email && values.email !== dbUser.email) {
    const existingUser = await db.user.findUnique({
      where: {
        email: values.email,
      },
    });

    if (existingUser) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(values.email);

    await sendVerificationEmail(values.email, verificationToken.token);

    return {
      success: "Verification email sent! Please check your inbox.",
    };
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      ...values,
    },
  });

  return { success: "Settings updated!" };
};
