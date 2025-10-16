"use client";

import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Sidebar } from "./sidebar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="lg:hidden">
          <MenuIcon className="size-4 text-neutral-500" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};


// the Sheet component (from shadcn/ui or Radix UI) automatically calls the function you pass to onOpenChange with the new open state whenever it changes — like this:

// onOpenChange={setIsOpen}

// onOpenChange(true)   // when opening
// onOpenChange(false)  // when closing


// Since onOpenChange={setIsOpen},
// that’s the same as calling:

// setIsOpen(true)
// setIsOpen(false)


