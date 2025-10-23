import { redirect } from "next/navigation";
import { auth } from ".";

export default async function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAuthenticated = !!session;

  if (!isAuthenticated) {
    redirect("/");
  }

  return <>{children}</>;
}
