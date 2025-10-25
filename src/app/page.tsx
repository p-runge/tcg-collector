import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { LanguageDropdown } from "@/components/language-dropdown";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-primary">TCG Collector</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl text-center">
        The easiest way to track your Pokémon card collection. Manage sets in
        multiple languages, variants, and conditions with ease.
      </p>

      <div className="mb-6 flex gap-4">
        <LanguageDropdown />
        <DarkModeToggle />
      </div>

      <div className="flex gap-4">
        <Link href="/sets" passHref className="mb-8">
          <Button className="cursor-pointer" variant="outline">
            Browse Sets
          </Button>
        </Link>
        {session && (
          <Link href="/collection" passHref>
            <Button className="cursor-pointer">My Collection</Button>
          </Link>
        )}
      </div>

      {!session && (
        <>
          <p className="text-lg text-muted-foreground mb-4 max-w-xl text-center">
            Want to keep track of your own collection?
          </p>
          <Link href="/api/auth/signin" passHref>
            <Button className="cursor-pointer" variant="default">
              Sign in
            </Button>
          </Link>
        </>
      )}
    </main>
  );
}
