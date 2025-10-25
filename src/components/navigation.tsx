import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { DarkModeToggle } from "./dark-mode-toggle";
import { LanguageDropdown } from "./language-dropdown";

export async function Navigation() {
  const session = await auth();

  return (
    <header className="shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center text-2xl font-bold gap-2"
          >
            <Image
              src="/logo.png"
              alt="TCG Collector Logo"
              width={75}
              height={60}
            />
            TCG Collector
          </Link>

          <LanguageDropdown />
          <DarkModeToggle />

          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">Start</Button>
            </Link>
            <Link href="/sets">
              <Button variant="ghost">Sets</Button>
            </Link>
            {session && (
              <Link href="/collection">
                <Button variant="ghost">My Collection</Button>
              </Link>
            )}

            {session ? (
              <Link href="/api/auth/signout">
                <Button variant="default">Sign Out</Button>
              </Link>
            ) : (
              <Link href="/api/auth/signin">
                <Button variant="default">Sign In</Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
