import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"
import { Heart, Star } from "lucide-react"

export default async function SetsPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  const sets = await sql`
    SELECT 
      s.*,
      ser.name as series_name,
      CASE WHEN ucs.id IS NOT NULL THEN true ELSE false END as is_collecting
    FROM sets s
    JOIN series ser ON s.series_id = ser.id
    LEFT JOIN user_collecting_sets ucs ON s.id = ucs.set_id AND ucs.user_id = ${session.user.id}
    ORDER BY s.release_date DESC, s.name
  `

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Browse Sets</h1>
          <UserNav user={session.user} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Browse all available Pokémon card sets. Click on a set to view its cards or mark sets you're actively
            collecting.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sets.map((set) => (
            <Card key={set.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{set.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {set.series_name} • {set.code}
                    </CardDescription>
                  </div>
                  {set.is_collecting && (
                    <Badge variant="secondary" className="ml-2">
                      <Star className="w-3 h-3 mr-1" />
                      Collecting
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    {set.total_cards && `${set.total_cards} cards`}
                    {set.release_date && ` • Released ${new Date(set.release_date).getFullYear()}`}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/sets/${set.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Cards
                      </Button>
                    </Link>
                    <form
                      action={async () => {
                        "use server"
                        if (set.is_collecting) {
                          await sql`
                          DELETE FROM user_collecting_sets 
                          WHERE user_id = ${session.user.id} AND set_id = ${set.id}
                        `
                        } else {
                          await sql`
                          INSERT INTO user_collecting_sets (user_id, set_id)
                          VALUES (${session.user.id}, ${set.id})
                          ON CONFLICT (user_id, set_id) DO NOTHING
                        `
                        }
                      }}
                    >
                      <Button type="submit" variant={set.is_collecting ? "default" : "outline"} size="icon">
                        <Heart className={`w-4 h-4 ${set.is_collecting ? "fill-current" : ""}`} />
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
