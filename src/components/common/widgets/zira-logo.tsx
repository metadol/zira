import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  size?: number;
  redirect?: boolean;
};

export const Logo = ({ size = 40, redirect = true }: LogoProps) => {
  
  const logo = (
    <Image
      priority
      src="/favicon.svg"
      alt="Zira Logo"
      width={size}
      height={Math.round((size * 39) / 50)} // Maintain aspect ratio based on original dimensions (50x39)
    />
  );

  if (!redirect) return logo;

  return (
    <Link href="/" className="flex items-center gap-2">
      {logo}
    </Link>
  );
};
