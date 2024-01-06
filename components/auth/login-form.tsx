import { CardWrapper } from "@/components/auth/card-wrapper";

export const LoginForm = () => {
  return (
    <CardWrapper
      showSocial
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account"
      backButtonHref="/auth/register"
    >
      Login Form!
    </CardWrapper>
  );
};
