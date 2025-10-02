"use client";

import { Button } from "@/components/ui/button";
import { useCurrent } from "@/features/auth/api/client/use-current";
import { useLogout } from "@/features/auth/api/client/use-logout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { data, isLoading } = useCurrent();
  const { mutate } = useLogout();

  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/sign-in");
    }
  }, [data, isLoading]);

  return <div>Only Autenticated users can see this
    <Button onClick={() => mutate()}>Logout</Button>
     </div>;
}

// asdf@r.com