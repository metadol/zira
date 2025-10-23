import { Eclipse } from "lucide-react";
import Link from "next/link";
import { DottedSeparator } from "./dotted-seperator";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";

export const Sidebar = () => {
  return (
    <aside className="w-full h-full bg-neutral-100 p-4">
      <Link href="/" className="flex items-center gap-2 ">
        <Eclipse />
        <p>Zira</p>
      </Link>

      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />

      <Navigation />
    </aside>
  );
};
