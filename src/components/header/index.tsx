import { auth } from "@/lib/auth";
import HeaderContent from "./content";

export async function Header() {
  const session = await auth();

  return <HeaderContent session={session} />;
}
