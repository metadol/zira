import { Logo } from "@/components/common/widgets/zira-logo";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Logo/>
      <h1 className="text-xl font-semibold">404</h1>
    </div>
  );
}
