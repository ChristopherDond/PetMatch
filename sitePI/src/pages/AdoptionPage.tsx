import { useState, useMemo } from "react";
import { DogCard } from "@/components/DogCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { dogs } from "@/data/dogs";
import type { FilterOptions } from "@/types";

export function AdoptionPage() {
  const [filters, setFilters] = useState<FilterOptions>({
    city: "all",
    ageRange: "all",
    hasDisability: "all",
    ongId: "all",
    size: "all",
    gender: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [cepInput, setCepInput] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredDogs = useMemo(() => {
    return dogs.filter((dog) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          dog.name.toLowerCase().includes(query) ||
          dog.city.toLowerCase().includes(query) ||
          dog.ongName.toLowerCase().includes(query) ||
          (dog.description && dog.description.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // City filter
      if (filters.city !== "all" && dog.city !== filters.city) {
        return false;
      }

      // Age filter
      if (filters.ageRange !== "all") {
        const ageInYears = dog.ageUnit === "anos" ? dog.age : dog.age / 12;
        if (filters.ageRange === "puppy" && ageInYears > 1) return false;
        if (filters.ageRange === "adult" && (ageInYears <= 1 || ageInYears > 7))
          return false;
        if (filters.ageRange === "senior" && ageInYears <= 7) return false;
      }

      // Size filter
      if (filters.size !== "all" && dog.size !== filters.size) {
        return false;
      }

      // Gender filter
      if (
        filters.gender &&
        filters.gender !== "all" &&
        dog.gender !== filters.gender
      ) {
        return false;
      }

      // Disability filter
      if (filters.hasDisability !== "all") {
        if (filters.hasDisability === "yes" && !dog.hasDisability) return false;
        if (filters.hasDisability === "no" && dog.hasDisability) return false;
      }

      // ONG filter
      if (filters.ongId !== "all" && dog.ongId !== filters.ongId) {
        return false;
      }

      return true;
    });
  }, [filters, searchQuery]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      city: "all",
      ageRange: "all",
      hasDisability: "all",
      ongId: "all",
      size: "all",
      gender: "all",
    });
    setSearchQuery("");
    setCepInput("");
  };

  const searchByCep = () => {
    const cepPrefix = cepInput.replace(/\D/g, "").substring(0, 5);
    let closestCity = "all";

    if (cepPrefix >= "01000" && cepPrefix <= "09999") closestCity = "São Paulo";
    else if (cepPrefix >= "20000" && cepPrefix <= "28999")
      closestCity = "Rio de Janeiro";
    else if (cepPrefix >= "30000" && cepPrefix <= "34999")
      closestCity = "Belo Horizonte";
    else if (cepPrefix >= "80000" && cepPrefix <= "82999")
      closestCity = "Curitiba";

    if (closestCity !== "all") {
      setFilters((prev) => ({ ...prev, city: closestCity }));
    }
  };

  const hasActiveFilters =
    filters.city !== "all" ||
    filters.ageRange !== "all" ||
    filters.hasDisability !== "all" ||
    filters.ongId !== "all" ||
    filters.size !== "all" ||
    filters.gender !== "all" ||
    searchQuery !== "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src="/logo.png"
          alt="PETCONNECTTA"
          className="w-14 h-14 object-contain"
        />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Pets para Adoção</h1>
          <p className="text-muted-foreground text-sm">
            Encontre seu novo melhor amigo
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nome, raça, cidade ou ONG..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 text-base"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          {showMobileFilters ? "Ocultar filtros" : "Mostrar filtros"}
          {hasActiveFilters && (
            <span className="ml-2 bg-petpink text-white text-xs px-2 py-0.5 rounded-full">
              !
            </span>
          )}
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            cepInput={cepInput}
            onCepChange={setCepInput}
            onSearchByCep={searchByCep}
          />
        </aside>

        {/* Mobile Filters */}
        {showMobileFilters && (
          <div className="lg:hidden w-full mb-6">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              cepInput={cepInput}
              onCepChange={setCepInput}
              onSearchByCep={searchByCep}
            />
          </div>
        )}

        {/* Results */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">
                {filteredDogs.length}
              </span>{" "}
              pet{filteredDogs.length !== 1 ? "s" : ""} encontrado
              {filteredDogs.length !== 1 ? "s" : ""}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-petpink hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {/* Dogs Grid */}
          {filteredDogs.length > 0 ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Nenhum pet encontrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Tente ajustar os filtros ou buscar com outros termos.
              </p>
              <Button onClick={handleClearFilters} variant="outline">
                Limpar todos os filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
