import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Filter, Search, X, MapPin, Calendar, Heart, Building, Navigation, MapPinned } from 'lucide-react';
import { cities, ageRanges, ongs } from '@/data/dogs';
import type { FilterOptions } from '@/types';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  resultCount: number;
}

const disabilityOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'yes', label: 'Com deficiência' },
  { value: 'no', label: 'Sem deficiência' }
];

const sizeOptions = [
  { value: 'all', label: 'Todos os tamanhos' },
  { value: 'pequeno', label: 'Pequeno' },
  { value: 'medio', label: 'Médio' },
  { value: 'grande', label: 'Grande' }
];

// City coordinates for future distance calculation feature
// const cityCoordinates: Record<string, { lat: number; lng: number }> = {
//   'São Paulo': { lat: -23.5505, lng: -46.6333 },
//   'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
//   'Belo Horizonte': { lat: -19.9167, lng: -43.9345 },
//   'Curitiba': { lat: -25.4284, lng: -49.2733 }
// };

export function FilterBar({ filters, onFilterChange, onClearFilters, resultCount }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [cepInput, setCepInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [searchMode, setSearchMode] = useState<'filters' | 'cep' | 'city'>('filters');

  const hasActiveFilters = 
    filters.city !== 'all' || 
    filters.ageRange !== 'all' || 
    filters.hasDisability !== 'all' || 
    filters.ongId !== 'all' ||
    filters.size !== 'all';

  const applyFilters = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setLocalFilters({
      city: 'all',
      ageRange: 'all',
      hasDisability: 'all',
      ongId: 'all',
      size: 'all'
    });
    setCepInput('');
    setCityInput('');
    onClearFilters();
    setIsOpen(false);
  };

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  // Search by CEP (simulated - in real app would use ViaCEP API)
  const searchByCep = () => {
    // Simulate CEP lookup - for demo, we'll map some CEP ranges to cities
    const cepPrefix = cepInput.replace(/\D/g, '').substring(0, 5);
    let closestCity = 'all';
    
    // Simulated CEP to city mapping
    if (cepPrefix >= '01000' && cepPrefix <= '09999') closestCity = 'São Paulo';
    else if (cepPrefix >= '20000' && cepPrefix <= '28999') closestCity = 'Rio de Janeiro';
    else if (cepPrefix >= '30000' && cepPrefix <= '34999') closestCity = 'Belo Horizonte';
    else if (cepPrefix >= '80000' && cepPrefix <= '82999') closestCity = 'Curitiba';
    
    if (closestCity !== 'all') {
      setLocalFilters(prev => ({ ...prev, city: closestCity }));
      onFilterChange({ ...localFilters, city: closestCity });
    }
    setIsOpen(false);
  };

  // Search by city name
  const searchByCity = () => {
    const matchedCity = cities.find(c => 
      c.toLowerCase().includes(cityInput.toLowerCase())
    );
    if (matchedCity) {
      setLocalFilters(prev => ({ ...prev, city: matchedCity }));
      onFilterChange({ ...localFilters, city: matchedCity });
    }
    setIsOpen(false);
  };

  return (
    <div className="bg-white dark:bg-card rounded-xl shadow-lg border border-border p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search and quick filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant={hasActiveFilters ? 'default' : 'outline'} 
                className={hasActiveFilters ? 'bg-gradient-to-r from-petpink to-petorange hover:opacity-90' : ''}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                {hasActiveFilters && (
                  <span className="ml-2 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                    Ativo
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-[450px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-petpink" />
                  Filtrar Cachorros
                </SheetTitle>
              </SheetHeader>

              {/* Search Mode Tabs */}
              <div className="mt-6 flex gap-2 mb-6">
                <button
                  onClick={() => setSearchMode('filters')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    searchMode === 'filters' 
                      ? 'bg-gradient-to-r from-petpink to-petorange text-white' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  Filtros Detalhados
                </button>
                <button
                  onClick={() => setSearchMode('cep')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    searchMode === 'cep' 
                      ? 'bg-gradient-to-r from-petpink to-petorange text-white' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  Buscar por CEP
                </button>
                <button
                  onClick={() => setSearchMode('city')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    searchMode === 'city' 
                      ? 'bg-gradient-to-r from-petpink to-petorange text-white' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  Buscar por Cidade
                </button>
              </div>

              {/* CEP Search Mode */}
              {searchMode === 'cep' && (
                <div className="space-y-6">
                  <div className="bg-petpink/5 rounded-xl p-4 border border-petpink/20">
                    <Label className="flex items-center gap-2 mb-3">
                      <Navigation className="w-4 h-4 text-petpink" />
                      Digite seu CEP
                    </Label>
                    <Input
                      type="text"
                      placeholder="00000-000"
                      value={cepInput}
                      onChange={(e) => setCepInput(e.target.value)}
                      className="h-12 border-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Encontraremos cães próximos à sua localização
                    </p>
                  </div>

                  <Button
                    onClick={searchByCep}
                    disabled={cepInput.length < 8}
                    className="w-full h-12 bg-gradient-to-r from-petpink to-petorange hover:opacity-90 text-white font-semibold"
                  >
                    <MapPinned className="w-5 h-5 mr-2" />
                    Buscar Próximos
                  </Button>
                </div>
              )}

              {/* City Search Mode */}
              {searchMode === 'city' && (
                <div className="space-y-6">
                  <div className="bg-petblue/5 rounded-xl p-4 border border-petblue/20">
                    <Label className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-petblue" />
                      Digite a cidade
                    </Label>
                    <Input
                      type="text"
                      placeholder="Ex: São Paulo"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      className="h-12 border-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Digite o nome da cidade para filtrar
                    </p>
                  </div>

                  {/* Quick City Buttons */}
                  <div className="space-y-2">
                    <Label className="text-sm">Cidades disponíveis:</Label>
                    <div className="flex flex-wrap gap-2">
                      {cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setCityInput(city);
                            setLocalFilters(prev => ({ ...prev, city }));
                          }}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                            localFilters.city === city
                              ? 'bg-petpink text-white'
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={searchByCity}
                    disabled={!cityInput}
                    className="w-full h-12 bg-gradient-to-r from-petblue to-petpink hover:opacity-90 text-white font-semibold"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Filtrar por Cidade
                  </Button>
                </div>
              )}

              {/* Detailed Filters Mode */}
              {searchMode === 'filters' && (
                <div className="space-y-6">
                  {/* City Filter */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-petred" />
                      Cidade
                    </Label>
                    <Select 
                      value={localFilters.city} 
                      onValueChange={(value) => updateFilter('city', value)}
                    >
                      <SelectTrigger className="bg-white dark:bg-card border-2 h-12">
                        <SelectValue placeholder="Todas as cidades" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-card">
                        <SelectItem value="all">Todas as cidades</SelectItem>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Age Filter */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-petblue" />
                      Idade
                    </Label>
                    <Select 
                      value={localFilters.ageRange} 
                      onValueChange={(value) => updateFilter('ageRange', value)}
                    >
                      <SelectTrigger className="bg-white dark:bg-card border-2 h-12">
                        <SelectValue placeholder="Todas as idades" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-card">
                        {ageRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Size Filter */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-petgreen" />
                      Tamanho
                    </Label>
                    <Select 
                      value={localFilters.size} 
                      onValueChange={(value) => updateFilter('size', value)}
                    >
                      <SelectTrigger className="bg-white dark:bg-card border-2 h-12">
                        <SelectValue placeholder="Todos os tamanhos" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-card">
                        {sizeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Disability Filter */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-petorange" />
                      Deficiência
                    </Label>
                    <Select 
                      value={localFilters.hasDisability} 
                      onValueChange={(value) => updateFilter('hasDisability', value)}
                    >
                      <SelectTrigger className="bg-white dark:bg-card border-2 h-12">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-card">
                        {disabilityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ONG Filter */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-petpink" />
                      ONG
                    </Label>
                    <Select 
                      value={localFilters.ongId} 
                      onValueChange={(value) => updateFilter('ongId', value)}
                    >
                      <SelectTrigger className="bg-white dark:bg-card border-2 h-12">
                        <SelectValue placeholder="Todas as ONGs" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-card">
                        <SelectItem value="all">Todas as ONGs</SelectItem>
                        {ongs.map((ong) => (
                          <SelectItem key={ong.id} value={ong.id}>
                            {ong.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="flex-1 h-12"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Limpar
                    </Button>
                    <Button
                      onClick={applyFilters}
                      className="flex-1 h-12 bg-gradient-to-r from-petpink to-petorange hover:opacity-90 text-white font-semibold"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Aplicar
                    </Button>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="w-4 h-4 mr-1" />
              Limpar filtros
            </Button>
          )}
        </div>

        {/* Result count */}
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{resultCount}</span> cachorro{resultCount !== 1 ? 's' : ''} encontrado{resultCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Active filter tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          {filters.city !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-petpink/10 text-petpink rounded-full text-sm">
              <MapPin className="w-3 h-3" />
              {filters.city}
            </span>
          )}
          {filters.ageRange !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-petblue/10 text-petblue rounded-full text-sm">
              <Calendar className="w-3 h-3" />
              {ageRanges.find(r => r.value === filters.ageRange)?.label}
            </span>
          )}
          {filters.size !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-petgreen/10 text-petgreen rounded-full text-sm">
              <Search className="w-3 h-3" />
              {sizeOptions.find(o => o.value === filters.size)?.label}
            </span>
          )}
          {filters.hasDisability !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-petorange/10 text-petorange rounded-full text-sm">
              <Heart className="w-3 h-3" />
              {disabilityOptions.find(o => o.value === filters.hasDisability)?.label}
            </span>
          )}
          {filters.ongId !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-petpink/10 text-petpink rounded-full text-sm">
              <Building className="w-3 h-3" />
              {ongs.find(o => o.id === filters.ongId)?.name}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
