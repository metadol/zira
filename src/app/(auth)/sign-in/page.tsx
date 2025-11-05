import { SignInCard } from "@/features/auth/components/sign-in-card";
import { authGuard } from "@/features/auth/utils";

const SignInPage = async () => {
  await authGuard("public");
  
  return <SignInCard />;
};

export default SignInPage;
