"use client";

import { signOut } from "next-auth/react";

interface ILogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: ILogoutButtonProps) => {
  return (
    <span onClick={() => signOut()} className="cursor-pointer">
      {children}
    </span>
  );
};
