import { Navigation } from "./navigation";
import { Projects } from "./projects-switcher";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Logo } from "@/components/common/widgets/zira-logo";
import { DottedSeparator } from "@/components/common/widgets/dotted-seperator";

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
