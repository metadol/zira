import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";

export async function authGuard(type: "public" | "protected") {
  const user = await getCurrentUser();

  if (type === "public" && user) redirect("/");
  if (type === "protected" && !user) redirect("/sign-in");

  return user;
}
