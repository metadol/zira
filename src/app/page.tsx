import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAdminClient } from "@/lib/appwrite";

export default function Home() {
  console.log(createAdminClient)
  return (
    <div className="flex gap-4 p-2">
      <Input placeholder="Input" />
      <Button variant={"primary"} >Primary</Button>
      <Button variant={"secondary"} size={"lg"}>Secondary</Button>
      <Button variant={"destructive"} size={"xs"}>Destrctive</Button>
      <Button variant={"ghost"}>Ghost</Button>
      <Button variant={"muted"}>Muted</Button>
      {/* <Button variant={"teritary"}>Teritary</Button> */}
    </div>
  );
}
