import { sql } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"

export default async function SettingsPage() {
  const [currentSettings, languages] = await Promise.all([
    sql`SELECT * FROM app_settings WHERE setting_key = 'favorite_language_id'`,
    sql`SELECT * FROM languages ORDER BY name`,
  ])

  const favoriteLanguageId = currentSettings[0]?.setting_value

  async function updateFavoriteLanguage(formData: FormData) {
    "use server"
    const languageId = formData.get("language_id")

    if (languageId) {
      await sql`
        UPDATE app_settings 
        SET setting_value = ${languageId}, updated_at = CURRENT_TIMESTAMP
        WHERE setting_key = 'favorite_language_id'
      `
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Configure your collection preferences</p>
        </div>

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
                  <Select name="language_id" defaultValue={favoriteLanguageId}>
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
              <CardTitle>About</CardTitle>
              <CardDescription>Information about your collection tracker</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Version</Label>
                  <p className="text-sm text-gray-600 mt-1">1.0.0</p>
                </div>
                <div>
                  <Label>Database</Label>
                  <p className="text-sm text-gray-600 mt-1">PostgreSQL with comprehensive Pokémon card data</p>
                </div>
                <div>
                  <Label>Features</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Track cards by language, variant, condition, and quantity. Mark sets as actively collecting.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
