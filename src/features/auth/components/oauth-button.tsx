"use client";

import { toast } from "sonner";
import { onOAuth } from "@/lib/oauth";
import { FcGoogle } from "react-icons/fc";
import { OAuthProvider } from "node-appwrite";
import { Button } from "@/components/ui/button";

interface OAuthButtonProps {
  disabled?: boolean;
  onLoading?: (isLoading: boolean) => void; // Notify parent
}

export const OAuthButton = ({
  disabled = false,
  onLoading,
}: OAuthButtonProps) => {
  const handleOAuth = async () => {
    onLoading?.(true); // Notify parent
    try {
      await onOAuth(OAuthProvider.Google);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
      onLoading?.(false); // only set loading to false on error, on success the page will redirect
    }
  };

  return (
    <Button
      disabled={disabled}
      variant="secondary"
      size="lg"
      className="w-full"
      onClick={handleOAuth}
    >
      <FcGoogle className="mr-2 size-6" />
    </Button>
  );
};
