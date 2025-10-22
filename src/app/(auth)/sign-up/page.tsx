import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { authGuard } from "@/lib/auth-guard";

const SignUpPage = async () => {
  await authGuard("public");

  return <SignUpCard />;
};

export default SignUpPage;
