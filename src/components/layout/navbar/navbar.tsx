import { UserButton } from "./user-button";
import { MobileSidebar } from "./mobile-sidebar";
export const Navbar = () => {
  return (
    <nav className="pt-4 px-6 flex items-center justify-between bg-white">
      <div className="flex-col hidden lg:flex"> 
        <div className="text-2xl font-semibold">Home</div>
        <div className="text-muted-foreground">Monitor all of yhour projects here </div>
      </div>
      <MobileSidebar/>
      <UserButton />
    </nav>
  );
};
