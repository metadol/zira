import { Button } from "@/components/ui/button";
import { TestComponent } from "@/features/test";

export default function Home() {
  return (
    <div className="flex gap-4 p-2">
      <Button>Primary</Button>
      <Button variant={"secondary"}>Secondary</Button>
      <Button variant={"destructive"}>Destrctive</Button>
      <Button variant={"ghost"}>Ghost</Button>
      <Button variant={"link"}>Link</Button>
      <Button variant={"outline"}>Outline</Button>
    </div>
  );
}
