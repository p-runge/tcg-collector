import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Pokémon Tracker
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">Start</Button>
            </Link>
            <Link href="/collection">
              <Button variant="ghost">Collection</Button>
            </Link>
            <Link href="/sets">
              <Button variant="ghost">Sets</Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost">Settings</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
