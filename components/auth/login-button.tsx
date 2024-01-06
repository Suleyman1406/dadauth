"use client";

import { useRouter } from "next/navigation";

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

  if (mode === "modal") return <span>Modal</span>;

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
