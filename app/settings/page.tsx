import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserNav } from "@/components/user-nav"

export default async function SettingsPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  const [user, languages] = await Promise.all([
    sql`SELECT * FROM users WHERE id = ${session.user.id}`,
    sql`SELECT * FROM languages ORDER BY name`,
  ])

  const currentUser = user[0]

  async function updateFavoriteLanguage(formData: FormData) {
    "use server"
    const languageId = formData.get("language_id")

    if (languageId) {
      await sql`
        UPDATE users 
        SET favorite_language_id = ${languageId}
        WHERE id = ${session.user.id}
      `
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <UserNav user={session.user} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Collection Preferences</CardTitle>
              <CardDescription>Set your preferences for managing your Pokémon card collection</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={updateFavoriteLanguage} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Favorite Language</Label>
                  <Select name="language_id" defaultValue={currentUser.favorite_language_id?.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your favorite language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.id} value={language.id.toString()}>
                          {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600">
                    This will be used as the default language when adding new cards to your collection.
                  </p>
                </div>
                <Button type="submit">Save Preferences</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details from Discord</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Username</Label>
                  <p className="text-sm text-gray-600 mt-1">{currentUser.username}</p>
                </div>
                <div>
                  <Label>Discord ID</Label>
                  <p className="text-sm text-gray-600 mt-1">{currentUser.discord_id}</p>
                </div>
                <div>
                  <Label>Member Since</Label>
                  <p className="text-sm text-gray-600 mt-1">{new Date(currentUser.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
