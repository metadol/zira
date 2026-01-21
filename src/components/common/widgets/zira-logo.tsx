import { Eclipse } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Logo = () => (
  <Link href="/" className="flex items-center gap-2 ">
    {/* <Eclipse /> */}
    <Image src="/favicon.svg" alt="Zira Logo" width={40} height={40} />
    <p>Zira</p>
  </Link>
);
