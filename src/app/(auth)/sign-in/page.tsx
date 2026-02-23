import { authGuard } from "@/features/auth/utils";
import { SignInCard } from "@/features/auth/components/sign-in-card";

export const metadata = {
  title: "Sign In",
};

const SignInPage = async () => {
  await authGuard("public");
  
  return <SignInCard />;
};

export default SignInPage;
