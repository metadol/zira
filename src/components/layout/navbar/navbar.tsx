"use client";

import { UserButton } from "./user-button";
import { usePathname } from "next/navigation";
import { MobileSidebar } from "./mobile-sidebar";

const pathnameMap = {
  projects: {
    title: "My Project",
    description: "View tasks of your project here.",
  },
  default: {
    title: "Home",
    description: "Monitor all of your projects and tasks here.",
  },
};

export const Navbar = () => {
  const pathname = usePathname();
  const pathnameKey = pathname.split("/")[3];

  const { title, description } =
    pathnameMap[pathnameKey as keyof typeof pathnameMap] ?? pathnameMap.default;

  return (
    <nav className="pt-4 px-6 flex items-center justify-between bg-white">
      <div className="flex-col hidden lg:flex">
        <div className="text-2xl font-semibold">{title}</div>
        <div className="text-muted-foreground">{description}</div>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};
