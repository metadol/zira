import { UserButton } from "@/features/auth/components/user-button";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div>
      <UserButton />{" "}
    </div>
  );
}

// asdf@r.com
