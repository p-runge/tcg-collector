import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-primary">TCG Collector</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl text-center">
        The easiest way to track your Pokémon card collection. Manage sets in
        multiple languages, variants, and conditions with ease.
      </p>
      <div className="flex gap-4">
        <Link href="/collection" passHref>
          <Button className="cursor-pointer">My Collection</Button>
        </Link>
        <Link href="/sets" passHref>
          <Button className="cursor-pointer" variant="outline">
            Browse Sets
          </Button>
        </Link>
      </div>
    </main>
  );
}
