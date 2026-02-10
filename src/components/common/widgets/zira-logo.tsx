import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  size?: number;
  showText?: boolean;
};

export const Logo = ({
  size = 40,
  // showText = true,
}: LogoProps) => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/favicon.svg"
        alt="Zira Logo"
        width={size}
        height={size}
      />

      {/* {showText && (
        <p className="text-lg font-semibold">Zira</p>
      )} */}
    </Link>
  );
};
