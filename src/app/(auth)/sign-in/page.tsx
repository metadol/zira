import { SignInCard } from "@/features/auth/components/sign-in-card";
import { authGuard } from "@/lib/auth-guard";

const SignInPage = async () => {
  await authGuard("public");
  
  return <SignInCard />;
};

export default SignInPage;
