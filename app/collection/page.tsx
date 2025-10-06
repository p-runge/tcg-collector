import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db, usersTable } from "@/lib/db";
import { BookHeart, Library, Plus } from "lucide-react";
import Link from "next/link";

export default async function CollectionPage() {
  const userList = await db
    .select()
    .from(usersTable)
    .orderBy(usersTable.username);
  console.log("userList", userList);

  const groupedCards: {
    id: number;
    card_id: number;
    card_name: string;
    card_number: string;
    rarity: string | null;
    set_name: string;
    language_name: string;
    variant_name: string;
    condition_name: string;
    condition_abbr: string;
    quantity: number;
    notes: string | null;
  }[][] = [];

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
        </div>

        <Tabs defaultValue="collections" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="collections">
              <span className="inline-flex items-center gap-2">
                <BookHeart className="w-4 h-4" />
                Collections
              </span>
            </TabsTrigger>
            <TabsTrigger value="all-cards">
              <span className="inline-flex items-center gap-2">
                <Library className="w-4 h-4" />
                All Cards
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-cards">
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
                      <CardDescription>
                        {cards.length} cards owned
                      </CardDescription>
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
                                {card.quantity > 1 &&
                                  ` • Qty: ${card.quantity}`}
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
          </TabsContent>

          <TabsContent value="collections">
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">
                  No collections added yet
                </h3>
                <p className="text-gray-600 mb-6">Add your first collection!</p>
                <Link href="/collection/add">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Collection
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
