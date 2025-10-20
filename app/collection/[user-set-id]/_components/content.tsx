"use client";

import { CardBrowser } from "@/components/card-browser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  useEffect(() => {
    // Fetch the existing user set data
    const fetchUserSet = async () => {
      try {
        const response = await fetch(`/api/user-sets/${userSetId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user set");
        }
        const data = (await response.json()) as {
          name: string;
          cards: { id: string }[];
        };
        console.log("Fetched user set data:", data);
        setUserSetName(data.name);
        setSelectedCards(new Set(data.cards.map((card) => card.id)));
      } catch (error) {
        console.error("Error fetching user set:", error);
        alert("Failed to load user set. Please try again.");
      }
    };

    fetchUserSet();
  }, [userSetId]);

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

  const handleSaveUserSet = async () => {
    if (!userSetName.trim()) {
      alert("Please enter a user set name");
      return;
    }

    if (selectedCards.size === 0) {
      alert("Please select at least one card");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/user-sets/${userSetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userSetName,
          cardIds: Array.from(selectedCards),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save user set");
      }

      // Redirect to the user set detail page
      router.push(`/collection/${userSetId}`);
    } catch (error) {
      console.error("Error saving user set:", error);
      alert("Failed to save user set. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
              <h1 className="text-3xl font-bold">Edit User Set</h1>
              <p className="text-muted-foreground mt-1">
                Update the user set name and manage its cards
              </p>
            </div>
          </div>

          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="user-set-name">User Set Name</Label>
                <Input
                  id="user-set-name"
                  placeholder="User Set Name"
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
