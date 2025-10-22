"use client";

import { CardBrowser } from "@/components/card-browser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api/react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function EditUserSetPageContent({ userSetId }: { userSetId: string }) {
  const router = useRouter();

  const [userSetName, setUserSetName] = useState("");
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  console.log("selectedCards", selectedCards);

  const { data: userSet } = api.userSet.getById.useQuery(
    { id: userSetId }
    // {
    //   onSuccess(data) {
    //     if (data) {
    //       setUserSetName(data.name);
    //       // Assuming data.cards is an array of card objects with an 'id' property
    //       const initialSelectedCards = new Set(
    //         data.cards?.map((card: { id: string }) => card.id) || []
    //       );
    //       setSelectedCards(initialSelectedCards);
    //     }
    //   },
    // }
  );
  console.log("userSet", userSet);
  useEffect(() => {
    if (userSet) {
      setUserSetName(userSet.set.name);
      const initialSelectedCards = new Set(
        userSet.cards?.map((card) => card.cardId) || []
      );
      setSelectedCards(initialSelectedCards);
    }
  }, [userSet]);

  const handleCardToggle = (cardId: string) => {
    setSelectedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const { mutate: updateUserSet } = api.userSet.update.useMutation();

  const handleSaveUserSet = async () => {
    if (!userSetName.trim()) {
      console.error("No set name provided");
      return;
    }

    if (selectedCards.size === 0) {
      console.error("No cards selected");
      return;
    }

    setIsSaving(true);

    updateUserSet(
      {
        id: userSetId,
        name: userSetName.trim(),
        cardIds: Array.from(selectedCards),
      },
      {
        onSuccess() {
          router.push("/collection");
        },
        onError(error) {
          console.error("Error updating user set:", error);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/collection">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Edit Set</h1>
              <p className="text-muted-foreground mt-1">
                Update the set name and manage its cards
              </p>
            </div>
          </div>

          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="user-set-name">Set Name</Label>
                <Input
                  id="user-set-name"
                  placeholder="Set Name"
                  value={userSetName}
                  onChange={(e) => setUserSetName(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {selectedCards.size}
                  </span>{" "}
                  cards selected
                </div>
                <Button
                  onClick={handleSaveUserSet}
                  disabled={
                    isSaving || !userSetName.trim() || selectedCards.size === 0
                  }
                  size="lg"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <CardBrowser
          selectedCards={selectedCards}
          onCardToggle={handleCardToggle}
        />
      </div>
    </div>
  );
}
