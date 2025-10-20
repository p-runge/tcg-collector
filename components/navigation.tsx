import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Navigation() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center text-2xl font-bold text-gray-900 gap-2"
          >
            <Image
              src="/logo.png"
              alt="TCG Collector Logo"
              width={75}
              height={60}
            />
            TCG Collector
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">Start</Button>
            </Link>
            <Link href="/collection">
              <Button variant="ghost">My Collection</Button>
            </Link>
            <Link href="/sets">
              <Button variant="ghost">Sets</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
