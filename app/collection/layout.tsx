import RouteGuard from "@/lib/auth/route-guard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RouteGuard>{children}</RouteGuard>;
}
