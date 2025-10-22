"use client";

import { CardBrowser } from "@/components/card-browser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api/react";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewSetPage() {
  const router = useRouter();
  const [setName, setSetName] = useState("");
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

  const { mutate: createUserSet } = api.userSet.create.useMutation({
    onSuccess() {
      router.push("/collection");
    },
    onError(error) {
      console.error("Error creating user set:", error);
    },
  });

  const handleCreateSet = async () => {
    if (!setName.trim()) {
      console.error("Please enter a set name");
      return;
    }

    if (selectedCards.size === 0) {
      console.error("Please select at least one card");
      return;
    }

    setIsCreating(true);

    createUserSet(
      {
        name: setName,
        cardIds: Array.from(selectedCards),
      },
      {
        onSettled() {
          setIsCreating(false);
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
              <h1 className="text-3xl font-bold">Create New Set</h1>
              <p className="text-muted-foreground mt-1">
                Name your set and select cards to add
              </p>
            </div>
          </div>

          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="set-name">Set Name</Label>
                <Input
                  id="set-name"
                  placeholder="My Awesome Set"
                  value={setName}
                  onChange={(e) => setSetName(e.target.value)}
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
                  onClick={handleCreateSet}
                  disabled={
                    isCreating || !setName.trim() || selectedCards.size === 0
                  }
                  size="lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  {isCreating ? "Creating..." : "Create Set"}
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
