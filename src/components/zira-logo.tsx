import { Eclipse } from "lucide-react";
import Link from "next/link";

export const Logo = () => (
  <Link href="/" className="flex items-center gap-2 ">
    <Eclipse />
    <p>Zira</p>
  </Link>
);
