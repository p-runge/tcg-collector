import { sql } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Navigation } from "@/components/navigation";

export default async function Dashboard() {
  // Get collection stats
  const [userCards, collectingSets, totalSets] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM user_cards`,
    sql`SELECT COUNT(*) as count FROM user_collecting_sets`,
    sql`SELECT COUNT(*) as count FROM sets`,
  ]);

  const recentCards = await sql`
    SELECT 
      uc.*,
      c.name as card_name,
      c.number as card_number,
      s.name as set_name,
      s.code as set_code,
      l.name as language_name,
      v.name as variant_name,
      cond.name as condition_name
    FROM user_cards uc
    JOIN cards c ON uc.card_id = c.id
    JOIN sets s ON c.set_id = s.id
    JOIN languages l ON uc.language_id = l.id
    JOIN variants v ON uc.variant_id = v.id
    JOIN conditions cond ON uc.condition_id = cond.id
    ORDER BY uc.created_at DESC
    LIMIT 5
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Overview of your Pokémon card collection
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Cards Owned</CardTitle>
              <CardDescription>Total cards in your collection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userCards[0].count}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collecting Sets</CardTitle>
              <CardDescription>
                Sets you&apos;re actively collecting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {collectingSets[0].count}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Sets</CardTitle>
              <CardDescription>Total sets in database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalSets[0].count}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks for managing your collection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/collection/add">
                <Button className="w-full justify-start">
                  Add Cards to Collection
                </Button>
              </Link>
              <Link href="/collection">
                <Button variant="outline" className="w-full justify-start">
                  View My Collection
                </Button>
              </Link>
              <Link href="/sets">
                <Button variant="outline" className="w-full justify-start">
                  Browse Sets
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" className="w-full justify-start">
                  Collection Settings
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recently Added Cards</CardTitle>
              <CardDescription>
                Your latest collection additions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentCards.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No cards added yet. Start building your collection!
                </p>
              ) : (
                <div className="space-y-3">
                  {recentCards.map((card) => (
                    <div
                      key={card.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{card.card_name}</div>
                        <div className="text-sm text-gray-500">
                          {card.set_code} #{card.card_number} •{" "}
                          {card.language_name} • {card.variant_name}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {card.condition_name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
