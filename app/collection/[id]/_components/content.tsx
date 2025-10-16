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

export function EditCollectionPageContent({
  collectionId,
}: {
  collectionId: string;
}) {
  const router = useRouter();

  const [collectionName, setCollectionName] = useState("");
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch the existing collection data
    const fetchCollection = async () => {
      try {
        const response = await fetch(`/api/collections/${collectionId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch collection");
        }
        const data = (await response.json()) as {
          name: string;
          cardIds: string[];
        };
        console.log("Fetched collection data:", data);
        setCollectionName(data.name);
        setSelectedCards(new Set(data.cardIds));
      } catch (error) {
        console.error("Error fetching collection:", error);
        alert("Failed to load collection. Please try again.");
      }
    };

    fetchCollection();
  }, [collectionId]);

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

  const handleSaveCollection = async () => {
    if (!collectionName.trim()) {
      alert("Please enter a collection name");
      return;
    }

    if (selectedCards.size === 0) {
      alert("Please select at least one card");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: collectionName,
          cardIds: Array.from(selectedCards),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save collection");
      }

      // Redirect to the collection detail page
      router.push(`/collection/${collectionId}`);
    } catch (error) {
      console.error("Error saving collection:", error);
      alert("Failed to save collection. Please try again.");
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
              <h1 className="text-3xl font-bold">Edit Collection</h1>
              <p className="text-muted-foreground mt-1">
                Update the collection name and manage its cards
              </p>
            </div>
          </div>

          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="collection-name">Collection Name</Label>
                <Input
                  id="collection-name"
                  placeholder="Collection Name"
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
                  onClick={handleSaveCollection}
                  disabled={
                    isSaving ||
                    !collectionName.trim() ||
                    selectedCards.size === 0
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
