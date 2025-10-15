import { SignInCard } from "@/features/auth/components/sign-in-card";
import { getCurrentUser } from "@/lib/auth";
import { authGuard } from "@/lib/auth-guard";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  await authGuard("public");
  
  return <SignInCard />;
};

export default SignInPage;
