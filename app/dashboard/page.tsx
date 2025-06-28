"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Plus,
  Edit3,
  Grid,
  List,
  Settings,
  X,
  Eye,
  Info,
  Users,
  User,
  CircleIcon,
  DiamondIcon,
  StarIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Available languages for Pokemon cards
const cardLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh-tw", name: "Chinese (Traditional)", flag: "🇹🇼" },
  { code: "zh-cn", name: "Chinese (Simplified)", flag: "🇨🇳" },
];

// Card conditions with colors for quick visual identification
const cardConditions = [
  {
    value: "M",
    label: "Mint",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    value: "NM",
    label: "Near Mint",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    value: "EX",
    label: "Excellent",
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  {
    value: "LP",
    label: "Light Played",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  {
    value: "MP",
    label: "Moderately Played",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  {
    value: "HP",
    label: "Heavily Played",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  {
    value: "D",
    label: "Damaged",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
];

// Mock data for Pokemon sets and cards
const pokemonSets = [
  {
    id: "base1",
    name: "Base Set",
    variants: ["Normal", "1st Edition", "Shadowless"],
    totalCards: 102,
  },
  {
    id: "jungle",
    name: "Jungle",
    variants: ["Normal", "1st Edition"],
    totalCards: 64,
  },
  {
    id: "fossil",
    name: "Fossil",
    variants: ["Normal", "1st Edition"],
    totalCards: 62,
  },
];

const Rarity = ["Common", "Uncommon", "Rare", "Rare Holo"] as const;
type Rarity = (typeof Rarity)[number];

type Card = {
  id: number;
  name: string;
  number: string;
  rarity: Rarity;
  imageUrl: string;
  smallImageUrl: string;
};

// Mock cards with Pokemon TCG API image URLs
const mockCards: Card[] = [
  {
    id: 1,
    name: "Charizard",
    number: "4/102",
    rarity: "Rare Holo",
    imageUrl: "https://images.pokemontcg.io/base1/4_hires.png",
    smallImageUrl: "https://images.pokemontcg.io/base1/4.png",
  },
  {
    id: 2,
    name: "Blastoise",
    number: "2/102",
    rarity: "Rare Holo",
    imageUrl: "https://images.pokemontcg.io/base1/2_hires.png",
    smallImageUrl: "https://images.pokemontcg.io/base1/2.png",
  },
  {
    id: 3,
    name: "Venusaur",
    number: "15/102",
    rarity: "Rare Holo",
    imageUrl: "https://images.pokemontcg.io/base1/15_hires.png",
    smallImageUrl: "https://images.pokemontcg.io/base1/15.png",
  },
  {
    id: 4,
    name: "Pikachu",
    number: "58/102",
    rarity: "Common",
    imageUrl: "https://images.pokemontcg.io/base1/58_hires.png",
    smallImageUrl: "https://images.pokemontcg.io/base1/58.png",
  },
  {
    id: 5,
    name: "Alakazam",
    number: "1/102",
    rarity: "Rare Holo",
    imageUrl: "https://images.pokemontcg.io/base1/1_hires.png",
    smallImageUrl: "https://images.pokemontcg.io/base1/1.png",
  },
  {
    id: 6,
    name: "Machamp",
    number: "8/102",
    rarity: "Rare Holo",
    imageUrl: "https://images.pokemontcg.io/base1/8_hires.png",
    smallImageUrl: "https://images.pokemontcg.io/base1/8.png",
  },
  {
    id: 7,
    name: "Poliwrath",
    number: "13/102",
    rarity: "Rare Holo",
    imageUrl: "https://images.pokemontcg.io/base1/13_hires.png",
    smallImageUrl: "https://images.pokemontcg.io/base1/13.png",
  },
  {
    id: 8,
    name: "Raichu",
    number: "14/102",
    rarity: "Rare Holo",
    imageUrl: "https://images.pokemontcg.io/base1/14_hires.png",
    smallImageUrl: "https://images.pokemontcg.io/base1/14.png",
  },
];

type CardEntry = {
  id: string; // Unique ID for each individual card
  condition: string;
  language: string;
  note?: string;
  photos: string[]; // Array of photo URLs/base64
  dateAdded: Date;
};

type CardCollection = {
  [cardId: number]: {
    [variant: string]: CardEntry[];
  };
};

type AddingMode = "individual" | "bulk";

export default function PokemonCollectionManager() {
  const [collection, setCollection] = useState<CardCollection>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    setCollection(JSON.parse(localStorage.getItem("collection") ?? "{}"));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem("collection", JSON.stringify(collection));
  }, [collection]);

  const [selectedSet, setSelectedSet] = useState(pokemonSets[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [addingMode, setAddingMode] = useState<AddingMode>("individual");
  const [filterRarity, setFilterRarity] = useState<Rarity | "all">("all");
  const [bulkVariant, setBulkVariant] = useState("");
  const [bulkCondition, setBulkCondition] = useState("NM");
  const [bulkLanguage, setBulkLanguage] = useState("en");
  const [defaultLanguage, setDefaultLanguage] = useState("en");
  const [editingCard, setEditingCard] = useState<{
    cardId: number;
    variant: string;
    entryId: string;
  } | null>(null);
  const [editForm, setEditForm] = useState({
    note: "",
    photos: [] as string[],
  });
  const [showSettings, setShowSettings] = useState(false);
  const [viewingPhotos, setViewingPhotos] = useState<string[]>([]);

  const [selectedQuickLanguage, setSelectedQuickLanguage] =
    useState(defaultLanguage);

  const filteredCards = mockCards.filter((card) => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.number.includes(searchTerm);
    const matchesRarity =
      filterRarity === "all" || card.rarity === filterRarity;
    return matchesSearch && matchesRarity;
  });

  const getCardEntries = (cardId: number, variant: string): CardEntry[] => {
    return collection[cardId]?.[variant] || [];
  };

  const getTotalQuantity = (cardId: number, variant: string) => {
    return getCardEntries(cardId, variant).length;
  };

  const addCardEntry = (
    cardId: number,
    variant: string,
    condition: string,
    language: string
  ) => {
    const newEntry: CardEntry = {
      id: `${cardId}-${variant}-${Date.now()}-${Math.random()}`,
      condition,
      language,
      photos: [],
      dateAdded: new Date(),
    };

    setCollection((prev) => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        [variant]: [...(prev[cardId]?.[variant] || []), newEntry],
      },
    }));
  };

  const updateCardEntry = (
    cardId: number,
    variant: string,
    entryId: string,
    updates: Partial<CardEntry>
  ) => {
    setCollection((prev) => {
      const entries = [...(prev[cardId]?.[variant] || [])];
      const entryIndex = entries.findIndex((entry) => entry.id === entryId);

      if (entryIndex >= 0) {
        entries[entryIndex] = { ...entries[entryIndex], ...updates };
      }

      return {
        ...prev,
        [cardId]: {
          ...prev[cardId],
          [variant]: entries,
        },
      };
    });
  };

  const removeCardEntry = (
    cardId: number,
    variant: string,
    entryId: string
  ) => {
    setCollection((prev) => {
      const entries = (prev[cardId]?.[variant] || []).filter(
        (entry) => entry.id !== entryId
      );

      return {
        ...prev,
        [cardId]: {
          ...prev[cardId],
          [variant]: entries,
        },
      };
    });
  };

  const toggleCardSelection = (cardId: number) => {
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

  const selectAllCards = () => {
    setSelectedCards(new Set(filteredCards.map((card) => card.id)));
  };

  const clearSelection = () => {
    setSelectedCards(new Set());
  };

  const bulkAddVariant = () => {
    if (!bulkVariant || selectedCards.size === 0) return;

    selectedCards.forEach((cardId) => {
      addCardEntry(cardId, bulkVariant, bulkCondition, bulkLanguage);
    });
    clearSelection();
  };

  const getTotalOwned = () => {
    return Object.values(collection).reduce((total, cardVariants) => {
      return (
        total +
        Object.values(cardVariants).reduce(
          (cardTotal, entries) => cardTotal + entries.length,
          0
        )
      );
    }, 0);
  };

  const getUniqueCardsOwned = () => {
    return Object.keys(collection).filter((cardId) => {
      const cardVariants = collection[Number.parseInt(cardId)];
      return Object.values(cardVariants).some((entries) => entries.length > 0);
    }).length;
  };

  const startEditingCard = (
    cardId: number,
    variant: string,
    entryId: string
  ) => {
    const entry = getCardEntries(cardId, variant).find((e) => e.id === entryId);
    if (entry) {
      setEditingCard({ cardId, variant, entryId });
      setEditForm({
        note: entry.note || "",
        photos: [...entry.photos],
      });
    }
  };

  const saveCardEdit = () => {
    if (editingCard) {
      updateCardEntry(
        editingCard.cardId,
        editingCard.variant,
        editingCard.entryId,
        {
          note: editForm.note.trim() || undefined,
          photos: editForm.photos,
        }
      );
      setEditingCard(null);
      setEditForm({ note: "", photos: [] });
    }
  };

  const cancelCardEdit = () => {
    setEditingCard(null);
    setEditForm({ note: "", photos: [] });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditForm((prev) => ({
          ...prev,
          photos: [...prev.photos, result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (photoIndex: number) => {
    setEditForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== photoIndex),
    }));
  };

  const getConditionInfo = (condition: string) => {
    return (
      cardConditions.find((c) => c.value === condition) || cardConditions[1]
    );
  };

  const getLanguageInfo = (languageCode: string) => {
    return (
      cardLanguages.find((l) => l.code === languageCode) || cardLanguages[0]
    );
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">
                  Pokemon Card Collection Manager
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Select
                  value={selectedSet.id}
                  onValueChange={(value) => {
                    const set = pokemonSets.find((s) => s.id === value);
                    if (set) setSelectedSet(set);
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pokemonSets.map((set) => (
                      <SelectItem key={set.id} value={set.id}>
                        {set.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {getUniqueCardsOwned()}/{selectedSet.totalCards} Cards
                  </Badge>
                  <Badge variant="outline">{getTotalOwned()} Total Cards</Badge>
                  <Badge variant="outline">
                    Default: {getLanguageInfo(defaultLanguage).flag}{" "}
                    {getLanguageInfo(defaultLanguage).name}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Settings Dialog */}
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="defaultLanguage" className="mb-2">
                    Default Language
                  </Label>
                  <Select
                    value={defaultLanguage}
                    onValueChange={setDefaultLanguage}
                  >
                    <SelectTrigger id="defaultLanguage">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cardLanguages.map((language) => (
                        <SelectItem key={language.code} value={language.code}>
                          {language.flag} {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setShowSettings(false)}>Close</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Photo Viewer Dialog */}
          <Dialog
            open={viewingPhotos.length > 0}
            onOpenChange={() => setViewingPhotos([])}
          >
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Card Photos</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {viewingPhotos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo || "/placeholder.svg"}
                    alt={`Card photo ${index + 1}`}
                    className="w-full rounded border"
                  />
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search cards..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>

                  <Select
                    value={filterRarity}
                    onValueChange={(rarity) =>
                      setFilterRarity(rarity as typeof filterRarity)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rarities</SelectItem>
                      {Object.values(Rarity).map((rarity) => (
                        <SelectItem key={rarity} value={rarity}>
                          {rarity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 items-center">
                  {/* Adding Mode Toggle */}
                  <div className="flex items-center gap-2 mr-4">
                    <div className="flex items-center gap-1">
                      <Button
                        variant={
                          addingMode === "individual" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          setAddingMode("individual");
                          setSelectedCards(new Set()); // Clear selection when switching modes
                        }}
                        className="flex items-center gap-1"
                      >
                        <User className="h-3 w-3" />
                        Individual
                      </Button>
                      <Button
                        variant={addingMode === "bulk" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAddingMode("bulk")}
                        className="flex items-center gap-1"
                      >
                        <Users className="h-3 w-3" />
                        Bulk
                      </Button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <Info className="h-3 w-3 text-gray-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div className="space-y-2 text-sm">
                            <div>
                              <strong>Individual Mode:</strong> Add cards one by
                              one using the + dropdown on each card. Perfect for
                              adding specific cards with different conditions.
                            </div>
                            <div>
                              <strong>Bulk Mode:</strong> Select multiple cards
                              with checkboxes, then add the same
                              variant/condition/language to all at once. Great
                              for adding many similar cards quickly.
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Bulk Actions - Only show in bulk mode */}
              {addingMode === "bulk" && selectedCards.size > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-sm font-medium">
                      {selectedCards.size} cards selected
                    </span>
                    <Select value={bulkVariant} onValueChange={setBulkVariant}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select variant" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedSet.variants.map((variant) => (
                          <SelectItem key={variant} value={variant}>
                            {variant}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={bulkCondition}
                      onValueChange={setBulkCondition}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cardConditions.map((condition) => (
                          <SelectItem
                            key={condition.value}
                            value={condition.value}
                          >
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={bulkLanguage}
                      onValueChange={setBulkLanguage}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cardLanguages.map((language) => (
                          <SelectItem key={language.code} value={language.code}>
                            {language.flag} {language.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={bulkAddVariant} disabled={!bulkVariant}>
                      Add to Collection
                    </Button>
                    <Button variant="outline" onClick={clearSelection}>
                      Clear Selection
                    </Button>
                  </div>
                </div>
              )}

              {/* Bulk Mode Helper Text */}
              {addingMode === "bulk" && selectedCards.size === 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span>
                      Select cards using the checkboxes to add them in bulk with
                      the same settings.
                    </span>
                  </div>
                </div>
              )}

              {addingMode === "bulk" && (
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAllCards}>
                    Select All Visible
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearSelection}>
                    Clear Selection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cards Display */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-2"
            }
          >
            {filteredCards.map((card) => (
              <label
                key={card.id}
                className={cn(addingMode === "bulk" && "cursor-pointer")}
              >
                <Card
                  className={`transition-all ${
                    selectedCards.has(card.id) ? "ring-2 ring-blue-500" : ""
                  } ${viewMode === "list" ? "p-2" : ""}`}
                >
                  <CardContent className={viewMode === "grid" ? "p-4" : "p-2"}>
                    <div className="flex items-start gap-3">
                      {/* Checkbox - Only show in bulk mode */}
                      {addingMode === "bulk" && (
                        <Checkbox
                          checked={selectedCards.has(card.id)}
                          onCheckedChange={() => toggleCardSelection(card.id)}
                        />
                      )}

                      {/* Card Thumbnail */}
                      <div className="flex-shrink-0">
                        <img
                          src={card.smallImageUrl || "/placeholder.svg"}
                          alt={card.name}
                          className="w-16 h-22 object-cover rounded border shadow-sm"
                          onError={(e) => {
                            e.currentTarget.src = `/placeholder.svg?height=88&width=64&text=${encodeURIComponent(
                              card.name
                            )}`;
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold truncate">
                            {card.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {card.number}
                            {
                              {
                                Common: (
                                  <CircleIcon
                                    style={{
                                      fill: "black",
                                    }}
                                  />
                                ),
                                Uncommon: (
                                  <DiamondIcon
                                    style={{
                                      fill: "black",
                                    }}
                                  />
                                ),
                                Rare: (
                                  <StarIcon
                                    style={{
                                      fill: "black",
                                    }}
                                  />
                                ),
                                "Rare Holo": (
                                  <>
                                    <StarIcon
                                      style={{
                                        fill: "black",
                                      }}
                                    />
                                    H
                                  </>
                                ),
                              }[card.rarity]
                            }
                          </Badge>
                        </div>

                        {/* Variants */}
                        <div className="space-y-2">
                          {selectedSet.variants.map((variant) => {
                            const entries = getCardEntries(card.id, variant);
                            const totalQuantity = getTotalQuantity(
                              card.id,
                              variant
                            );

                            return (
                              <div key={variant} className="space-y-1">
                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm font-medium">
                                    {variant}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                      Total: {totalQuantity}
                                    </span>

                                    {/* Individual Add Dropdown - Only show in individual mode */}
                                    {addingMode === "individual" && (
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-6 px-2"
                                          >
                                            <Plus className="h-3 w-3" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-80 p-3">
                                          <div className="space-y-3">
                                            <div className="text-sm font-medium text-center">
                                              Add Card
                                            </div>

                                            <div className="border-t pt-3">
                                              <div className="text-xs text-gray-600 mb-2">
                                                Select Language:
                                              </div>
                                              <div className="text-xs text-gray-500 mb-2 italic">
                                                Choose language, then click
                                                condition to add
                                              </div>
                                              <div className="grid grid-cols-5 gap-1 mb-3">
                                                {cardLanguages
                                                  .slice(0, 10)
                                                  .map((language) => (
                                                    <label
                                                      key={language.code}
                                                      className={`flex items-center justify-center h-8 p-1 text-xs border rounded cursor-pointer transition-colors ${
                                                        selectedQuickLanguage ===
                                                        language.code
                                                          ? "bg-blue-100 border-blue-500 text-blue-700"
                                                          : "bg-white border-gray-300 hover:bg-gray-50"
                                                      }`}
                                                      title={language.name}
                                                    >
                                                      <input
                                                        type="radio"
                                                        name="language"
                                                        value={language.code}
                                                        checked={
                                                          selectedQuickLanguage ===
                                                          language.code
                                                        }
                                                        onChange={() =>
                                                          setSelectedQuickLanguage(
                                                            language.code
                                                          )
                                                        }
                                                        className="sr-only"
                                                      />
                                                      {language.flag}
                                                    </label>
                                                  ))}
                                              </div>

                                              <div className="text-xs text-gray-600 mb-2">
                                                Add Card with Condition:
                                              </div>
                                              <div className="grid grid-cols-4 gap-1">
                                                {cardConditions.map(
                                                  (condition) => (
                                                    <Button
                                                      key={condition.value}
                                                      size="sm"
                                                      variant="outline"
                                                      onClick={() => {
                                                        addCardEntry(
                                                          card.id,
                                                          variant,
                                                          condition.value,
                                                          selectedQuickLanguage
                                                        );
                                                      }}
                                                      className="h-8 text-xs justify-start"
                                                    >
                                                      <div className="flex items-center gap-1">
                                                        <div
                                                          className={`w-2 h-2 rounded-full ${
                                                            condition.color.split(
                                                              " "
                                                            )[0]
                                                          }`}
                                                        />
                                                        <span>
                                                          {condition.value}
                                                        </span>
                                                      </div>
                                                    </Button>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    )}
                                  </div>
                                </div>

                                {/* Individual Card Entries */}
                                {entries
                                  .sort((a, b) => {
                                    // sort by condition
                                    const conditionOrder = cardConditions.map(
                                      (c) => c.value
                                    );
                                    return (
                                      conditionOrder.indexOf(a.condition) -
                                      conditionOrder.indexOf(b.condition)
                                    );
                                  })
                                  .map((entry) => {
                                    const conditionInfo = getConditionInfo(
                                      entry.condition
                                    );
                                    const languageInfo = getLanguageInfo(
                                      entry.language
                                    );
                                    return (
                                      <div
                                        key={entry.id}
                                        className="flex items-center gap-2 p-2 bg-white rounded border ml-4"
                                      >
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {languageInfo.flag}{" "}
                                          {languageInfo.code.toUpperCase()}
                                        </Badge>

                                        <Badge
                                          className={`text-xs ${conditionInfo.color} border`}
                                        >
                                          {conditionInfo.label}
                                        </Badge>

                                        <div className="flex items-center gap-1 ml-auto">
                                          {entry.photos.length > 0 && (
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() =>
                                                setViewingPhotos(entry.photos)
                                              }
                                              className="h-6 w-6 p-0"
                                            >
                                              <Eye className="h-3 w-3 text-blue-600" />
                                            </Button>
                                          )}

                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                  startEditingCard(
                                                    card.id,
                                                    variant,
                                                    entry.id
                                                  )
                                                }
                                                className="h-6 w-6 p-0"
                                              >
                                                <Edit3
                                                  className={`h-3 w-3 ${
                                                    entry.note ||
                                                    entry.photos.length > 0
                                                      ? "text-blue-600"
                                                      : "text-gray-400"
                                                  }`}
                                                />
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                              <DialogHeader>
                                                <DialogTitle>
                                                  Edit Card - {card.name} (
                                                  {variant} -{" "}
                                                  {conditionInfo.label} -{" "}
                                                  {languageInfo.name})
                                                </DialogTitle>
                                              </DialogHeader>
                                              <div className="space-y-4">
                                                <div>
                                                  <Label htmlFor="note">
                                                    Note
                                                  </Label>
                                                  <Textarea
                                                    id="note"
                                                    value={editForm.note}
                                                    onChange={(e) =>
                                                      setEditForm((prev) => ({
                                                        ...prev,
                                                        note: e.target.value,
                                                      }))
                                                    }
                                                    placeholder="Add a note about this specific card..."
                                                    rows={3}
                                                  />
                                                </div>

                                                <div>
                                                  <Label>Photos</Label>
                                                  <div className="space-y-2">
                                                    <Input
                                                      type="file"
                                                      accept="image/*"
                                                      multiple
                                                      onChange={
                                                        handlePhotoUpload
                                                      }
                                                      className="cursor-pointer"
                                                    />
                                                    {editForm.photos.length >
                                                      0 && (
                                                      <div className="grid grid-cols-3 gap-2">
                                                        {editForm.photos.map(
                                                          (photo, index) => (
                                                            <div
                                                              key={index}
                                                              className="relative"
                                                            >
                                                              <img
                                                                src={
                                                                  photo ||
                                                                  "/placeholder.svg"
                                                                }
                                                                alt={`Photo ${
                                                                  index + 1
                                                                }`}
                                                                className="w-full h-20 object-cover rounded border"
                                                              />
                                                              <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() =>
                                                                  removePhoto(
                                                                    index
                                                                  )
                                                                }
                                                                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                                                              >
                                                                <X className="h-3 w-3" />
                                                              </Button>
                                                            </div>
                                                          )
                                                        )}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>

                                                <div className="flex gap-2 justify-between">
                                                  <Button
                                                    variant="destructive"
                                                    onClick={() => {
                                                      removeCardEntry(
                                                        card.id,
                                                        variant,
                                                        entry.id
                                                      );
                                                      cancelCardEdit();
                                                    }}
                                                  >
                                                    Remove Card
                                                  </Button>
                                                  <div className="flex gap-2">
                                                    <Button
                                                      variant="outline"
                                                      onClick={cancelCardEdit}
                                                    >
                                                      Cancel
                                                    </Button>
                                                    <Button
                                                      onClick={saveCardEdit}
                                                    >
                                                      Save Changes
                                                    </Button>
                                                  </div>
                                                </div>
                                              </div>
                                            </DialogContent>
                                          </Dialog>
                                        </div>

                                        {entry.note && (
                                          <div className="w-full text-xs text-gray-600 bg-yellow-50 p-1 rounded mt-1">
                                            {entry.note}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </label>
            ))}
          </div>

          {filteredCards.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">
                  No cards found matching your search criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
