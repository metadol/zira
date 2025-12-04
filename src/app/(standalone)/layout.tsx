import { Logo } from "@/components/common/widgets/zira-logo";
import { UserButton } from "@/features/auth/components/user-button";
import Link from "next/link";

interface StandaloneLayoutProps {
  children: React.ReactNode;
}
//make this more reusable
export default function StandaloneLayout({ children }: StandaloneLayoutProps) {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl pt-4 px-6">
        <nav className="flex justify-between items-center pb-8">
          <Logo />
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </main>
  );
}
