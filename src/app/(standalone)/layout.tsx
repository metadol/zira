import { Logo } from "@/components/common/widgets/zira-logo";
import { UserButton } from "@/components/layout/navbar/user-button";

interface StandaloneLayoutProps {
  children: React.ReactNode;
}

export default function StandaloneLayout({ children }: StandaloneLayoutProps) {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl pt-4 px-6">
        <nav className="flex justify-between items-center pb-8">
          <Logo />
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center">
          <div className="w-full lg:max-w-xl">{children}</div>
        </div>
      </div>
    </main>
  );
}
