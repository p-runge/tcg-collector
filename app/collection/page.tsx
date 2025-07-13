import { sql } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function CollectionPage() {
  const userCards = (await sql`
    SELECT 
      uc.*,
      c.name as card_name,
      c.number as card_number,
      c.rarity,
      s.name as set_name,
      s.code as set_code,
      ser.name as series_name,
      l.name as language_name,
      v.name as variant_name,
      cond.name as condition_name,
      cond.abbreviation as condition_abbr
    FROM user_cards uc
    JOIN cards c ON uc.card_id = c.id
    JOIN sets s ON c.set_id = s.id
    JOIN series ser ON s.series_id = ser.id
    JOIN languages l ON uc.language_id = l.id
    JOIN variants v ON uc.variant_id = v.id
    JOIN conditions cond ON uc.condition_id = cond.id
    ORDER BY ser.name, s.name, c.number::integer
  `) as {
    id: number;
    card_id: number;
    user_id: number;
    quantity: number;
    notes: string | null;
    card_name: string;
    card_number: string;
    rarity: string | null;
    set_name: string;
    set_code: string;
    series_name: string;
    language_name: string;
    variant_name: string | null;
    condition_name: string;
    condition_abbr: string;
  }[];

  const groupedCards = userCards.reduce((acc, card) => {
    const key = `${card.series_name} - ${card.set_name}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(card);
    return acc;
  }, {} as Record<string, typeof userCards>);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Collection
            </h1>
            <p className="text-gray-600">
              Track and manage your Pokémon card collection
            </p>
          </div>
          <Link href="/collection/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Cards
            </Button>
          </Link>
        </div>

        {Object.keys(groupedCards).length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">
                No cards in your collection yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start adding cards to track your Pokémon collection!
              </p>
              <Link href="/collection/add">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Card
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedCards).map(([setName, cards]) => (
              <Card key={setName}>
                <CardHeader>
                  <CardTitle>{setName}</CardTitle>
                  <CardDescription>{cards.length} cards owned</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {cards.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="font-medium">
                              #{card.card_number} {card.card_name}
                            </div>
                            {card.rarity && (
                              <Badge variant="outline" className="text-xs">
                                {card.rarity}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {card.language_name} • {card.variant_name} •{" "}
                            {card.condition_name}
                            {card.quantity > 1 && ` • Qty: ${card.quantity}`}
                          </div>
                          {card.notes && (
                            <div className="text-sm text-gray-500 mt-1 italic">
                              {card.notes}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              card.condition_abbr === "M"
                                ? "default"
                                : card.condition_abbr === "NM"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {card.condition_abbr}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
