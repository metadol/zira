import { Eclipse } from "lucide-react";
import Link from "next/link";
import { DottedSeparator } from "../../../dotted-seperator";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "../../../../features/workspaces/components/workspace-switcher";
import { Logo } from "../../../zira-logo";
import { Projects } from "../../../../features/projects/components/projects-switcher";

export const Sidebar = () => {
  return (
    <aside className="w-full h-full bg-neutral-100 p-4">
      <Logo />

      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects />
    </aside>
  );
};
