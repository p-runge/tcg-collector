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
import { api } from "@/lib/api/server";
import { getIntl } from "@/lib/i18n/server";
import { BookHeart, Library, Plus } from "lucide-react";
import Link from "next/link";

export default async function CollectionPage() {
  const intl = await getIntl();

  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {intl.formatMessage({
              id: "collection.title",
              defaultMessage: "My Collection",
            })}
          </h1>
          <p className="text-muted-foreground">
            {intl.formatMessage({
              id: "collection.description",
              defaultMessage: "Track and manage your Pokémon card collection",
            })}
          </p>
        </div>
      </div>
      <Tabs defaultValue="collections" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="collections">
            <span className="inline-flex items-center gap-2">
              <BookHeart className="w-4 h-4" />
              {intl.formatMessage({
                id: "collection.tabs.sets",
                defaultMessage: "My Sets",
              })}
            </span>
          </TabsTrigger>
          <TabsTrigger value="my-cards">
            <span className="inline-flex items-center gap-2">
              <Library className="w-4 h-4" />
              {intl.formatMessage({
                id: "collection.tabs.cards",
                defaultMessage: "My Cards",
              })}
            </span>
          </TabsTrigger>
        </TabsList>
        <MySetsTab />
        <MyCardsTab />
      </Tabs>
    </>
  );
}

async function MySetsTab() {
  const intl = await getIntl();
  const userSets = await api.userSet.getList();

  return (
    <TabsContent value="collections">
      <div className="mb-6 flex justify-end">
        <Link href="/collection/new-set">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {intl.formatMessage({
              id: "collection.actions.addNewSet",
              defaultMessage: "Add New Set",
            })}
          </Button>
        </Link>
      </div>
      {userSets.length === 0 ? (
        // No sets
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">
              {intl.formatMessage({
                id: "collection.sets.noneTitle",
                defaultMessage: "No sets added yet",
              })}
            </h3>
            <p className="mb-6 text-muted-foreground">
              {intl.formatMessage({
                id: "collection.sets.noneDescription",
                defaultMessage: "Add your first set!",
              })}
            </p>
            <Link href="/collection/new-set">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {intl.formatMessage({
                  id: "collection.actions.addFirstSet",
                  defaultMessage: "Add Your First Set",
                })}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        // List sets in a grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userSets.map((userSet) => (
            <Link
              key={userSet.id}
              href={`/collection/${userSet.id}`}
              className="block"
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{userSet.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {intl.formatMessage({
                      id: "collection.sets.cardDescription",
                      defaultMessage: "View and manage cards in this set.",
                    })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </TabsContent>
  );
}

async function MyCardsTab() {
  const intl = await getIntl();

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
    <TabsContent value="my-cards">
      {Object.keys(groupedCards).length === 0 ? (
        // No cards in collection
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">
              {intl.formatMessage({
                id: "collection.cards.noneTitle",
                defaultMessage: "No cards in your collection yet",
              })}
            </h3>
            <p className="text-muted-foreground mb-6">
              {intl.formatMessage({
                id: "collection.cards.noneDescription",
                defaultMessage:
                  "Start adding cards to your collection!",
              })}
            </p>
            {/* // TODO: show a version of the card browser here */}
          </CardContent>
        </Card>
      ) : (
        // List cards in a grid
        <div className="space-y-8">
          {Object.entries(groupedCards).map(([setName, cards]) => (
            <Card key={setName}>
              <CardHeader>
                <CardTitle>{setName}</CardTitle>
                <CardDescription>
                  {intl.formatMessage(
                    {
                      id: "collection.cards.owned",
                      defaultMessage: "{count} cards owned",
                    },
                    { count: cards.length }
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className="flex items-center justify-between p-4 rounded-lg"
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
                        <div className="text-sm text-muted-foreground mt-1">
                          {card.language_name} • {card.variant_name} •{" "}
                          {card.condition_name}
                          {card.quantity > 1 && (
                            <>
                              {" "}
                              •{" "}
                              {intl.formatMessage({
                                id: "collection.card.qty",
                                defaultMessage: "Qty",
                              })}
                              : {card.quantity}
                            </>
                          )}
                        </div>
                        {card.notes && (
                          <div className="text-sm text-muted-foreground mt-1 italic">
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
  );
}
