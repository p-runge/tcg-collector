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
import { useIntl } from "react-intl";

export function EditUserSetPageContent({ userSetId }: { userSetId: string }) {
  const router = useRouter();
  const intl = useIntl();

  const [userSetName, setUserSetName] = useState("");
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const { data: userSet } = api.userSet.getById.useQuery({ id: userSetId });

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

  const apiUtils = api.useUtils();
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
          apiUtils.userSet.getById.invalidate({ id: userSetId });
          router.push("/collection");
        },
        onError(error) {
          console.error("Error updating user set:", error);
        },
      }
    );
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/collection">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">
            {intl.formatMessage({
              id: "userSet.title.edit",
              defaultMessage: "Edit Set",
            })}
          </h1>
          <p className="text-muted-foreground mt-1">
            {intl.formatMessage({
              id: "userSet.subtitle",
              defaultMessage: "Name your set and select cards to add",
            })}
          </p>
        </div>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="user-set-name">
              {intl.formatMessage({
                id: "userSet.nameLabel",
                defaultMessage: "Set Name",
              })}
            </Label>
            <Input
              id="user-set-name"
              placeholder={intl.formatMessage({
                id: "userSet.namePlaceholder",
                defaultMessage: "My Awesome Set",
              })}
              value={userSetName}
              onChange={(e) => setUserSetName(e.target.value)}
              className="text-lg"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {intl.formatMessage(
                {
                  id: "userSet.cardsSelected",
                  defaultMessage: "{count} cards selected",
                },
                { count: selectedCards.size }
              )}
            </div>
            <Button
              onClick={handleSaveUserSet}
              disabled={
                isSaving || !userSetName.trim() || selectedCards.size === 0
              }
              size="lg"
            >
              <Save className="h-5 w-5 mr-2" />
              {isSaving
                ? intl.formatMessage({
                  id: "userSet.saving",
                  defaultMessage: "Saving...",
                })
                : intl.formatMessage({
                  id: "userSet.save",
                  defaultMessage: "Save Changes",
                })}
            </Button>
          </div>
        </div>
      </Card>

      <hr className="mb-6" />

      <CardBrowser
        selectedCards={selectedCards}
        onCardToggle={handleCardToggle}
      />
    </>
  );
}
