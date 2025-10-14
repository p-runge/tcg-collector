"use client";

import { CardBrowser } from "@/components/card-browser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewCollectionPage() {
  const router = useRouter();
  const [collectionName, setCollectionName] = useState("");
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [isCreating, setIsCreating] = useState(false);

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

  const handleCreateCollection = async () => {
    if (!collectionName.trim()) {
      alert("Please enter a collection name");
      return;
    }

    if (selectedCards.size === 0) {
      alert("Please select at least one card");
      return;
    }

    setIsCreating(true);

    try {
      // TODO: Replace with actual user ID from auth
      const userId = "00000000-0000-0000-0000-000000000000";

      const response = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: collectionName,
          userId,
          cardIds: Array.from(selectedCards),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create collection");
      }

      const collection = await response.json();
      console.log("Collection created:", collection);

      // Redirect to collections list or detail page
      router.push("/collection");
    } catch (error) {
      console.error("Error creating collection:", error);
      alert("Failed to create collection. Please try again.");
    } finally {
      setIsCreating(false);
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
              <h1 className="text-3xl font-bold">Create New Collection</h1>
              <p className="text-muted-foreground mt-1">
                Name your collection and select cards to add
              </p>
            </div>
          </div>

          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="collection-name">Collection Name</Label>
                <Input
                  id="collection-name"
                  placeholder="My Awesome Collection"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
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
                  onClick={handleCreateCollection}
                  disabled={
                    isCreating ||
                    !collectionName.trim() ||
                    selectedCards.size === 0
                  }
                  size="lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  {isCreating ? "Creating..." : "Create Collection"}
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
