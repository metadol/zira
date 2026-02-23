import { authGuard } from "@/features/auth/utils";
import { SignUpCard } from "@/features/auth/components/sign-up-card";

export const metadata = {
  title: "Sign Up",
};

const SignUpPage = async () => {
  await authGuard("public");

  return <SignUpCard />;
};

export default SignUpPage;
