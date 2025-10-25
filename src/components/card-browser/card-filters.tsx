"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api/react";
import { X } from "lucide-react";
import { useState } from "react";
import { useIntl } from "react-intl";

type CardFiltersProps = {
  onFilterChange: (filters: FilterState) => void;
};

export type FilterState = {
  setId: string;
  rarity: string;
  search: string;
  releaseDateFrom: string;
  releaseDateTo: string;
};

const RARITIES = [
  "Common",
  "Uncommon",
  "Rare",
  "Rare Holo",
  "Ultra Rare",
  "Secret Rare",
];

export function CardFilters({ onFilterChange }: CardFiltersProps) {
  const intl = useIntl();

  const [filters, setFilters] = useState<FilterState>({
    setId: "",
    rarity: "",
    search: "",
    releaseDateFrom: "",
    releaseDateTo: "",
  });

  const { data: setListData } = api.set.getList.useQuery();
  const sets = setListData || [];

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      setId: "",
      rarity: "",
      search: "",
      releaseDateFrom: "",
      releaseDateTo: "",
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{intl.formatMessage({ id: "cardFilter.filter.title", defaultMessage: "Filter Cards" })}</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            {intl.formatMessage({ id: "cardFilter.button.clearSelection", defaultMessage: "Clear" })}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm text-muted-foreground">
            {intl.formatMessage({ id: "cardFilter.search.placeholder", defaultMessage: "Search" })}
          </Label>
          <Input
            id="search"
            placeholder={intl.formatMessage({ id: "cardFilter.search.placeholder", defaultMessage: "Card name or number..." })}
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="set" className="text-sm text-muted-foreground">
            {intl.formatMessage({ id: "cardFilter.set.label", defaultMessage: "Set" })}
          </Label>
          <Select
            value={filters.setId}
            onValueChange={(value) => updateFilter("setId", value)}
          >
            <SelectTrigger id="set" className="bg-background">
              <SelectValue placeholder="All sets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{intl.formatMessage({ id: "cardFilter.set.all", defaultMessage: "All sets" })}</SelectItem>
              {sets.map((set) => (
                <SelectItem key={set.id} value={set.id}>
                  {set.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rarity" className="text-sm text-muted-foreground">
            {intl.formatMessage({ id: "cardFilter.rarity.label", defaultMessage: "Rarity" })}
          </Label>
          <Select
            value={filters.rarity}
            onValueChange={(value) => updateFilter("rarity", value)}
          >
            <SelectTrigger id="rarity" className="bg-background">
              <SelectValue placeholder="All rarities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{intl.formatMessage({ id: "cardFilter.rarity.all", defaultMessage: "All rarities" })}</SelectItem>
              {RARITIES.map((rarity) => (
                <SelectItem key={rarity} value={rarity.toLowerCase()}>
                  {rarity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date-from" className="text-sm text-muted-foreground">
            {intl.formatMessage({ id: "cardFilter.date.from", defaultMessage: "Release From" })}
          </Label>
          <Input
            id="date-from"
            type="date"
            placeholder={intl.formatMessage({ id: "cardFilter.date.placeholder", defaultMessage: "From" })}
            value={filters.releaseDateFrom}
            onChange={(e) => updateFilter("releaseDateFrom", e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date-to" className="text-sm text-muted-foreground">
            {intl.formatMessage({ id: "cardFilter.date.to", defaultMessage: "Release To" })}
          </Label>
          <Input
            id="date-to"
            type="date"
            placeholder={intl.formatMessage({ id: "cardFilter.date.placeholder", defaultMessage: "To" })}
            value={filters.releaseDateTo}
            onChange={(e) => updateFilter("releaseDateTo", e.target.value)}
            className="bg-background"
          />
        </div>
      </div>
    </div>
  );
}
