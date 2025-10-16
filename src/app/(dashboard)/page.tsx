import { UserButton } from "@/features/auth/components/user-button";
import { getCurrentUser } from "@/lib/auth";
import { authGuard } from "@/lib/auth-guard";
import { redirect } from "next/navigation";

export default async function Home() {
  await authGuard("protected");
  return (
    <div>
      This is the dashboard home page
    </div>
  );
}

// asdf@r.com
