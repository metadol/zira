import { useMedia } from "react-use";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogTitle,
} from "../../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "../../ui/drawer";

interface RespomsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title: string;
  description: string;
}

export const ResponsiveModal = ({
  open,
  onOpenChange,
  children,
  title,
  description,
}: RespomsiveModalProps) => {
  const isDesktop = useMedia("(min-width: 1024px)", false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* <DialogPortal> */}
          <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[80vh]">
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <DialogDescription className="sr-only">
              {description}
            </DialogDescription>
            {children}
          </DialogContent>
        {/* </DialogPortal> */}
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="w-full  p-0 border-none max-h-[85vh] overflow-y-auto">
          <DrawerTitle className="sr-only">{title}</DrawerTitle>
          <DrawerDescription className="sr-only">
            {description}
          </DrawerDescription>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
