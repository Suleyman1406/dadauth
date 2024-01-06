"use client";

import { BackButton } from "@/components/auth/back-button";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface ICardWrapperProps {
  headerLabel: string;
  showSocial?: boolean;
  backButtonHref: string;
  backButtonLabel: string;
  children: React.ReactNode;
}

export const CardWrapper = ({
  children,
  showSocial,
  headerLabel,
  backButtonHref,
  backButtonLabel,
}: ICardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
