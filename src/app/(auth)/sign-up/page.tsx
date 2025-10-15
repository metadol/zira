import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { getCurrentUser } from "@/lib/auth";
import { authGuard } from "@/lib/auth-guard";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
  await authGuard("public");

  return <SignUpCard />;
};

export default SignUpPage;
