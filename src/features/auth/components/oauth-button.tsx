"use client";

import { toast } from "sonner";
import { useState } from "react";
import { onOAuth } from "@/lib/oauth";
import { FcGoogle } from "react-icons/fc";
import { OAuthProvider } from "node-appwrite";
import { Button } from "@/components/ui/button";

interface OAuthButtonProps {
  disabled?: boolean;
}

export const OAuthButton = ({ disabled = false }: OAuthButtonProps) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleOAuth = async () => {
    setIsRedirecting(true);
    try {
      await onOAuth(OAuthProvider.Google);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <Button
      disabled={disabled || isRedirecting}
      variant="secondary"
      size="lg"
      className="w-full"
      onClick={handleOAuth}
    >
      <FcGoogle className="mr-2 size-6" />
    </Button>
  );
};