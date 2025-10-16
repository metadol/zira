import { Eclipse } from "lucide-react";
import Link from "next/link";
import { DottedSeparator } from "./dotted-seperator";
import { Navigation } from "./navigation";

export const Sidebar = () => {
  return (
    <aside className="w-full h-full  p-4">
      <Link href="/" className="flex items-center gap-2 ">
        <Eclipse />
        <p>Zira</p>
      </Link>

      <DottedSeparator className="my-4" />

      <Navigation />
    </aside>
  );
};
