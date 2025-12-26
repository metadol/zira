import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name?: string;
  email?: string;
  className?: string;
  fallbackclassName?: string;
}

export const UserAvatar = ({
  name,
  email,
  className,
  fallbackclassName,
}: UserAvatarProps) => {
  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email
    ? email.charAt(0).toUpperCase()
    : "U";

  return (
    <Avatar
      className={cn("size-10 border border-neutral-300 transition", className)}
    >
      <AvatarFallback
        className={cn(
          "flex items-center justify-center bg-neutral-200 font-medium text-neutral-500",
          fallbackclassName
        )}
      >
        {avatarFallback}
      </AvatarFallback>
    </Avatar>
  );
};
