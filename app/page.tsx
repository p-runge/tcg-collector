"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit3, Grid, List, Settings, X, Eye, Info, Users, User, Loader2, RefreshCw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toggle } from "@/components/ui/toggle"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { usePokemonSets, usePokemonCards, usePokemonRarities } from "@/hooks/usePokemonData"
import { cardLanguages, pokemonAPI } from "@/lib/pokemon-api"

// Card conditions with colors for quick visual identification
const cardConditions = [
  { value: "M", label: "Mint", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "NM", label: "Near Mint", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "EX", label: "Excellent", color: "bg-cyan-100 text-cyan-800 border-cyan-200" },
  { value: "LP", label: "Light Played", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "MP", label: "Moderately Played", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { value: "HP", label: "Heavily Played", color: "bg-red-100 text-red-800 border-red-200" },
  { value: "D", label: "Damaged", color: "bg-gray-100 text-gray-800 border-gray-200" },
]

type CardEntry = {
  id: string // Unique ID for each individual card
  condition: string
  language: string
  note?: string
  photos: string[] // Array of photo URLs/base64
  dateAdded: Date
}

type CardCollection = {
  [cardId: string]: {
    [variant: string]: CardEntry[]
  }
}

type AddingMode = "individual" | "bulk"

interface AddCardFormProps {
  onAdd: (condition: string, language: string) => void
  defaultCondition: string
  defaultLanguage: string
}

function AddCardForm({ onAdd, defaultCondition, defaultLanguage }: AddCardFormProps) {
  const [selectedCondition, setSelectedCondition] = useState(defaultCondition)
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage)

  const handleAdd = () => {
    onAdd(selectedCondition, selectedLanguage)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="condition">Condition</Label>
        <Select value={selectedCondition} onValueChange={setSelectedCondition}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cardConditions.map((condition) => (
              <SelectItem key={condition.value} value={condition.value}>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${condition.color.split(" ")[0]}`} />
                  {condition.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cardLanguages.map((language) => (
              <SelectItem key={language.code} value={language.code}>
                <span className="flex items-center gap-2">
                  <span>{language.flag}</span>
                  <span>{language.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleAdd}>Add Card</Button>
      </div>
    </div>
  )
}

export default function PokemonCollectionManager() {
  // Pokemon API data
  const { sets, loading: setsLoading, error: setsError } = usePokemonSets()
  const [selectedSet, setSelectedSet] = useState<any>(null)
  const { cards, loading: cardsLoading, error: cardsError } = usePokemonCards(selectedSet?.id)
  const { rarities, loading: raritiesLoading } = usePokemonRarities()

  // Collection state
  const [collection, setCollection] = useState<CardCollection>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [addingMode, setAddingMode] = useState<AddingMode>("individual")
  const [filterRarity, setFilterRarity] = useState<string>("all")
  const [bulkVariant, setBulkVariant] = useState("")
  const [bulkCondition, setBulkCondition] = useState("NM")
  const [bulkLanguage, setBulkLanguage] = useState("en")
  const [defaultLanguage, setDefaultLanguage] = useState("en")
  const [editingCard, setEditingCard] = useState<{ cardId: string; variant: string; entryId: string } | null>(null)
  const [editForm, setEditForm] = useState({
    note: "",
    photos: [] as string[],
  })
  const [showSettings, setShowSettings] = useState(false)
  const [viewingPhotos, setViewingPhotos] = useState<string[]>([])

  const [selectedQuickLanguage, setSelectedQuickLanguage] = useState(defaultLanguage)

  // Set the first set as selected when sets load
  useEffect(() => {
    if (sets.length > 0 && !selectedSet) {
      setSelectedSet(sets[0])
    }
  }, [sets, selectedSet])

  // Reset bulk variant when set changes
  useEffect(() => {
    setBulkVariant("")
  }, [selectedSet])

  const filteredCards = cards.filter((card) => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) || card.number.includes(searchTerm)
    const matchesRarity = filterRarity === "all" || card.rarity === filterRarity
    return matchesSearch && matchesRarity
  })

  const getCardEntries = (cardId: string, variant: string): CardEntry[] => {
    return collection[cardId]?.[variant] || []
  }

  const getTotalQuantity = (cardId: string, variant: string) => {
    return getCardEntries(cardId, variant).length
  }

  const addCardEntry = (cardId: string, variant: string, condition: string, language: string) => {
    const newEntry: CardEntry = {
      id: `${cardId}-${variant}-${Date.now()}-${Math.random()}`,
      condition,
      language,
      photos: [],
      dateAdded: new Date(),
    }

    setCollection((prev) => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        [variant]: [...(prev[cardId]?.[variant] || []), newEntry],
      },
    }))
  }

  const updateCardEntry = (cardId: string, variant: string, entryId: string, updates: Partial<CardEntry>) => {
    setCollection((prev) => {
      const entries = [...(prev[cardId]?.[variant] || [])]
      const entryIndex = entries.findIndex((entry) => entry.id === entryId)

      if (entryIndex >= 0) {
        entries[entryIndex] = { ...entries[entryIndex], ...updates }
      }

      return {
        ...prev,
        [cardId]: {
          ...prev[cardId],
          [variant]: entries,
        },
      }
    })
  }

  const removeCardEntry = (cardId: string, variant: string, entryId: string) => {
    setCollection((prev) => {
      const entries = (prev[cardId]?.[variant] || []).filter((entry) => entry.id !== entryId)

      return {
        ...prev,
        [cardId]: {
          ...prev[cardId],
          [variant]: entries,
        },
      }
    })
  }

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  const selectAllCards = () => {
    setSelectedCards(new Set(filteredCards.map((card) => card.id)))
  }

  const clearSelection = () => {
    setSelectedCards(new Set())
  }

  const bulkAddVariant = () => {
    if (!bulkVariant || selectedCards.size === 0) return

    selectedCards.forEach((cardId) => {
      addCardEntry(cardId, bulkVariant, bulkCondition, bulkLanguage)
    })
    clearSelection()
  }

  const getTotalOwned = () => {
    return Object.values(collection).reduce((total, cardVariants) => {
      return total + Object.values(cardVariants).reduce((cardTotal, entries) => cardTotal + entries.length, 0)
    }, 0)
  }

  const getUniqueCardsOwned = () => {
    return Object.keys(collection).filter((cardId) => {
      const cardVariants = collection[cardId]
      return Object.values(cardVariants).some((entries) => entries.length > 0)
    }).length
  }

  const startEditingCard = (cardId: string, variant: string, entryId: string) => {
    const entry = getCardEntries(cardId, variant).find((e) => e.id === entryId)
    if (entry) {
      setEditingCard({ cardId, variant, entryId })
      setEditForm({
        note: entry.note || "",
        photos: [...entry.photos],
      })
    }
  }

  const saveCardEdit = () => {
    if (editingCard) {
      updateCardEntry(editingCard.cardId, editingCard.variant, editingCard.entryId, {
        note: editForm.note.trim() || undefined,
        photos: editForm.photos,
      })
      setEditingCard(null)
      setEditForm({ note: "", photos: [] })
    }
  }

  const cancelCardEdit = () => {
    setEditingCard(null)
    setEditForm({ note: "", photos: [] })
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setEditForm((prev) => ({
          ...prev,
          photos: [...prev.photos, result],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (photoIndex: number) => {
    setEditForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== photoIndex),
    }))
  }

  const getConditionInfo = (condition: string) => {
    return cardConditions.find((c) => c.value === condition) || cardConditions[1]
  }

  const getLanguageInfo = (languageCode: string) => {
    return cardLanguages.find((l) => l.code === languageCode) || cardLanguages[0]
  }

  const clearCache = () => {
    pokemonAPI.clearCache()
    window.location.reload()
  }

  // Loading state
  if (setsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading Pokemon sets...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (setsError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertDescription className="text-center space-y-4">
            <p>Error loading Pokemon data: {setsError}</p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">Pokemon Card Collection Manager</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearCache}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear Cache
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Select
                  value={selectedSet?.id || ""}
                  onValueChange={(value) => {
                    const set = sets.find((s) => s.id === value)
                    if (set) setSelectedSet(set)
                  }}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select a set..." />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-72">
                      {sets.map((set) => (
                        <SelectItem key={set.id} value={set.id}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{set.name}</span>
                            <span className="text-xs text-muted-foreground">{set.series}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>

                {selectedSet && (
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {getUniqueCardsOwned()}/{selectedSet.totalCards} Cards
                    </Badge>
                    <Badge variant="outline">{getTotalOwned()} Total Cards</Badge>
                    <Badge variant="outline">
                      Default: {getLanguageInfo(defaultLanguage).flag} {getLanguageInfo(defaultLanguage).name}
                    </Badge>
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Settings Dialog */}
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cardLanguages.map((language) => (
                        <SelectItem key={language.code} value={language.code}>
                          <span className="flex items-center gap-2">
                            <span>{language.flag}</span>
                            <span>{language.name}</span>
                          </span>
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
          <Dialog open={viewingPhotos.length > 0} onOpenChange={() => setViewingPhotos([])}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Card Photos</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-96">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                  {viewingPhotos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo || "/placeholder.svg"}
                      alt={`Card photo ${index + 1}`}
                      className="w-full rounded border"
                    />
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {selectedSet && (
            <>
              {/* Controls */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search cards..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>

                      <Select value={filterRarity} onValueChange={setFilterRarity}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Rarities</SelectItem>
                          {rarities.map((rarity) => (
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
                          <Toggle
                            pressed={addingMode === "individual"}
                            onPressedChange={() => {
                              setAddingMode("individual")
                              setSelectedCards(new Set())
                            }}
                            size="sm"
                          >
                            <User className="h-3 w-3 mr-1" />
                            Individual
                          </Toggle>
                          <Toggle
                            pressed={addingMode === "bulk"}
                            onPressedChange={() => setAddingMode("bulk")}
                            size="sm"
                          >
                            <Users className="h-3 w-3 mr-1" />
                            Bulk
                          </Toggle>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <div className="space-y-2 text-sm">
                                <div>
                                  <strong>Individual Mode:</strong> Add cards one by one using the + dropdown on each
                                  card. Perfect for adding specific cards with different conditions.
                                </div>
                                <div>
                                  <strong>Bulk Mode:</strong> Select multiple cards with checkboxes, then add the same
                                  variant/condition/language to all at once. Great for adding many similar cards
                                  quickly.
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      <Separator orientation="vertical" className="h-6" />

                      <Toggle pressed={viewMode === "grid"} onPressedChange={() => setViewMode("grid")} size="sm">
                        <Grid className="h-4 w-4" />
                      </Toggle>
                      <Toggle pressed={viewMode === "list"} onPressedChange={() => setViewMode("list")} size="sm">
                        <List className="h-4 w-4" />
                      </Toggle>
                    </div>
                  </div>

                  {/* Bulk Actions - Only show in bulk mode */}
                  {addingMode === "bulk" && selectedCards.size > 0 && (
                    <>
                      <Separator className="my-4" />
                      <Alert>
                        <AlertDescription>
                          <div className="flex items-center gap-4 flex-wrap">
                            <span className="text-sm font-medium">{selectedCards.size} cards selected</span>
                            <Select value={bulkVariant} onValueChange={setBulkVariant}>
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Select variant" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedSet.variants.map((variant: string) => (
                                  <SelectItem key={variant} value={variant}>
                                    {variant}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select value={bulkCondition} onValueChange={setBulkCondition}>
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {cardConditions.map((condition) => (
                                  <SelectItem key={condition.value} value={condition.value}>
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full ${condition.color.split(" ")[0]}`} />
                                      {condition.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select value={bulkLanguage} onValueChange={setBulkLanguage}>
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {cardLanguages.map((language) => (
                                  <SelectItem key={language.code} value={language.code}>
                                    <span className="flex items-center gap-2">
                                      <span>{language.flag}</span>
                                      <span>{language.name}</span>
                                    </span>
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
                        </AlertDescription>
                      </Alert>
                    </>
                  )}

                  {/* Bulk Mode Helper Text */}
                  {addingMode === "bulk" && selectedCards.size === 0 && (
                    <>
                      <Separator className="my-4" />
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Select cards using the checkboxes to add them in bulk with the same settings.
                        </AlertDescription>
                      </Alert>
                    </>
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

              {/* Cards Loading State */}
              {cardsLoading && (
                <Card>
                  <CardContent className="text-center py-12">
                    <div className="space-y-4">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                      <p className="text-muted-foreground">Loading cards for {selectedSet.name}...</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Cards Error State */}
              {cardsError && (
                <Alert>
                  <AlertDescription className="text-center space-y-4">
                    <p>Error loading cards: {cardsError}</p>
                    <Button onClick={() => window.location.reload()}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Cards Display */}
              {!cardsLoading && !cardsError && (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                      : "space-y-2"
                  }
                >
                  {filteredCards.map((card) => (
                    <Card
                      key={card.id}
                      className={`transition-all ${selectedCards.has(card.id) ? "ring-2 ring-primary" : ""} ${viewMode === "list" ? "p-2" : ""}`}
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
                              src={card.images.small || "/placeholder.svg"}
                              alt={card.name}
                              className="w-16 h-22 object-cover rounded border shadow-sm"
                              onError={(e) => {
                                e.currentTarget.src = `/placeholder.svg?height=88&width=64&text=${encodeURIComponent(card.name)}`
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold truncate">{card.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {card.number}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="secondary" className="text-xs">
                                {card.rarity}
                              </Badge>
                            </div>

                            {/* Variants */}
                            <div className="space-y-2">
                              {selectedSet.variants.map((variant: string) => {
                                const entries = getCardEntries(card.id, variant)
                                const totalQuantity = getTotalQuantity(card.id, variant)

                                return (
                                  <div key={variant} className="space-y-1">
                                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                                      <span className="text-sm font-medium">{variant}</span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Total: {totalQuantity}</span>

                                        {/* Individual Add Dropdown - Only show in individual mode */}
                                        {addingMode === "individual" && (
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button size="sm" variant="outline" className="h-6 px-2">
                                                <Plus className="h-3 w-3" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-80 p-3">
                                              <div className="space-y-3">
                                                <div className="text-sm font-medium text-center">Add Card</div>
                                                <Separator />

                                                <div className="space-y-3">
                                                  <div>
                                                    <Label className="text-xs text-muted-foreground">
                                                      Select Language:
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground mb-2 italic">
                                                      Choose language, then click condition to add
                                                    </p>
                                                    <RadioGroup
                                                      value={selectedQuickLanguage}
                                                      onValueChange={setSelectedQuickLanguage}
                                                      className="grid grid-cols-5 gap-1"
                                                    >
                                                      {cardLanguages.slice(0, 10).map((language) => (
                                                        <div key={language.code} className="flex items-center">
                                                          <RadioGroupItem
                                                            value={language.code}
                                                            id={language.code}
                                                            className="sr-only"
                                                          />
                                                          <Label
                                                            htmlFor={language.code}
                                                            className={`flex items-center justify-center h-8 p-1 text-xs border rounded cursor-pointer transition-colors ${
                                                              selectedQuickLanguage === language.code
                                                                ? "bg-primary/10 border-primary text-primary"
                                                                : "bg-background border-border hover:bg-muted"
                                                            }`}
                                                            title={language.name}
                                                          >
                                                            {language.flag}
                                                          </Label>
                                                        </div>
                                                      ))}
                                                    </RadioGroup>
                                                  </div>

                                                  <div>
                                                    <Label className="text-xs text-muted-foreground mb-2 block">
                                                      Add Card with Condition:
                                                    </Label>
                                                    <div className="grid grid-cols-4 gap-1">
                                                      {cardConditions.map((condition) => (
                                                        <Button
                                                          key={condition.value}
                                                          size="sm"
                                                          variant="outline"
                                                          onClick={() => {
                                                            addCardEntry(
                                                              card.id,
                                                              variant,
                                                              condition.value,
                                                              selectedQuickLanguage,
                                                            )
                                                          }}
                                                          className="h-8 text-xs justify-start"
                                                        >
                                                          <div className="flex items-center gap-1">
                                                            <div
                                                              className={`w-2 h-2 rounded-full ${condition.color.split(" ")[0]}`}
                                                            />
                                                            <span>{condition.value}</span>
                                                          </div>
                                                        </Button>
                                                      ))}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        )}
                                      </div>
                                    </div>

                                    {/* Individual Card Entries */}
                                    {entries.map((entry) => {
                                      const conditionInfo = getConditionInfo(entry.condition)
                                      const languageInfo = getLanguageInfo(entry.language)
                                      return (
                                        <div
                                          key={entry.id}
                                          className="flex items-center gap-2 p-2 bg-background rounded border ml-4"
                                        >
                                          <Badge className={`text-xs ${conditionInfo.color} border`}>
                                            {conditionInfo.label}
                                          </Badge>

                                          <Badge variant="outline" className="text-xs">
                                            {languageInfo.flag} {languageInfo.code.toUpperCase()}
                                          </Badge>

                                          <div className="flex items-center gap-1 ml-auto">
                                            {entry.photos.length > 0 && (
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setViewingPhotos(entry.photos)}
                                                className="h-6 w-6 p-0"
                                              >
                                                <Eye className="h-3 w-3 text-primary" />
                                              </Button>
                                            )}

                                            <Dialog>
                                              <DialogTrigger asChild>
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={() => startEditingCard(card.id, variant, entry.id)}
                                                  className="h-6 w-6 p-0"
                                                >
                                                  <Edit3
                                                    className={`h-3 w-3 ${entry.note || entry.photos.length > 0 ? "text-primary" : "text-muted-foreground"}`}
                                                  />
                                                </Button>
                                              </DialogTrigger>
                                              <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                  <DialogTitle>
                                                    Edit Card - {card.name} ({variant} - {conditionInfo.label} -{" "}
                                                    {languageInfo.name})
                                                  </DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                  <div className="space-y-2">
                                                    <Label htmlFor="note">Note</Label>
                                                    <Textarea
                                                      id="note"
                                                      value={editForm.note}
                                                      onChange={(e) =>
                                                        setEditForm((prev) => ({ ...prev, note: e.target.value }))
                                                      }
                                                      placeholder="Add a note about this specific card..."
                                                      rows={3}
                                                    />
                                                  </div>

                                                  <div className="space-y-2">
                                                    <Label>Photos</Label>
                                                    <div className="space-y-2">
                                                      <Input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handlePhotoUpload}
                                                        className="cursor-pointer"
                                                      />
                                                      {editForm.photos.length > 0 && (
                                                        <div className="grid grid-cols-3 gap-2">
                                                          {editForm.photos.map((photo, index) => (
                                                            <div key={index} className="relative">
                                                              <img
                                                                src={photo || "/placeholder.svg"}
                                                                alt={`Photo ${index + 1}`}
                                                                className="w-full h-20 object-cover rounded border"
                                                              />
                                                              <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => removePhoto(index)}
                                                                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                                                              >
                                                                <X className="h-3 w-3" />
                                                              </Button>
                                                            </div>
                                                          ))}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>

                                                  <div className="flex gap-2 justify-between">
                                                    <Button
                                                      variant="destructive"
                                                      onClick={() => {
                                                        removeCardEntry(card.id, variant, entry.id)
                                                        cancelCardEdit()
                                                      }}
                                                    >
                                                      Remove Card
                                                    </Button>
                                                    <div className="flex gap-2">
                                                      <Button variant="outline" onClick={cancelCardEdit}>
                                                        Cancel
                                                      </Button>
                                                      <Button onClick={saveCardEdit}>Save Changes</Button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </DialogContent>
                                            </Dialog>
                                          </div>

                                          {entry.note && (
                                            <div className="w-full text-xs text-muted-foreground bg-muted p-1 rounded mt-1">
                                              {entry.note}
                                            </div>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!cardsLoading && !cardsError && filteredCards.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">No cards found matching your search criteria.</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
