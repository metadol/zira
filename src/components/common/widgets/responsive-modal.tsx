import { useMedia } from "react-use";

import { Dialog, DialogContent } from "../../ui/dialog";
import { Drawer, DrawerContent } from "../../ui/drawer";

interface RespomsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const ResponsiveModal = ({
  open,
  onOpenChange,
  children,
}: RespomsiveModalProps) => {
  const isDesktop = useMedia("(min-width: 1024px)", false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[80vh]">
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="w-full  p-0 border-none max-h-[85vh] overflow-y-auto">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
