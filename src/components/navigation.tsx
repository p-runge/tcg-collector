import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { DarkModeToggle } from "./dark-mode-toggle";
import { LanguageDropdown } from "./language-dropdown";
import { getIntl } from "@/lib/i18n/server";

export async function Navigation() {
  const session = await auth();
  const intl = await getIntl();

  return (
    <header className="shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center text-2xl font-bold gap-2"
            >
              <Image
                src="/bulkratte_logo.png"
                alt={
                  intl.formatMessage({ id: "navigation.logoAlt", defaultMessage: "{logoName} Logo" }, { logoName: "TCG Collector" })
                }
                width={80}
                height={80}
                // the file has padding itself, so we counter the header padding
                className="-my-4"
              />
            </Link>
            <LanguageDropdown />
            <DarkModeToggle />
          </div>

          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">
                {intl.formatMessage({ id: "navigation.home", defaultMessage: "Home" })}
              </Button>
            </Link>
            <Link href="/sets">
              <Button variant="ghost">
                {intl.formatMessage({ id: "navigation.sets", defaultMessage: "Sets" })}
              </Button>
            </Link>
            {session && (
              <Link href="/collection">
                <Button variant="ghost">
                  {intl.formatMessage({ id: "navigation.collection", defaultMessage: "My Collection" })}
                </Button>
              </Link>
            )}

            {session ? (
              <Link href="/api/auth/signout">
                <Button variant="default">
                  {intl.formatMessage({ id: "navigation.signOut", defaultMessage: "Sign Out" })}
                </Button>
              </Link>
            ) : (
              <Link href="/api/auth/signin">
                <Button variant="default">
                  {intl.formatMessage({ id: "navigation.signIn", defaultMessage: "Sign In" })}
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
