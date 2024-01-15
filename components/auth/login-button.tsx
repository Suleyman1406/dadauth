"use client";

import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LoginForm } from "./login-form";

interface ILoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({
  asChild,
  children,
  mode = "redirect",
}: ILoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
  };

  if (mode === "modal")
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="p-0 w-auto bg-transparent">
          <LoginForm />
        </DialogContent>
      </Dialog>
    );

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
