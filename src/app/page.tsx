import { Button } from "@/components/ui/button";
import { TestComponent } from "@/features/test";

export default function Home() {
  return (
    <div className="flex gap-4 p-2">
      <Button variant={"primary"} size={"lg"}>Primary</Button>
      <Button variant={"secondary"}>Secondary</Button>
      <Button variant={"destructive"} size={"xs"}>Destrctive</Button>
      <Button variant={"ghost"}>Ghost</Button>
      <Button variant={"muted"}>Muted</Button>
      <Button variant={"teritary"}>Teritary</Button>
    </div>
  );
}
