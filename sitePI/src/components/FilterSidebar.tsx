import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Calendar, Search, Heart, Building, User, Navigation, MapPinned } from 'lucide-react';
import { cities, ageRanges, ongs } from '@/data/dogs';
import type { FilterOptions } from '@/types';

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  cepInput: string;
  onCepChange: (cep: string) => void;
  onSearchByCep: () => void;
}

const sizeOptions = [
  { value: 'all', label: 'Todos os portes' },
  { value: 'pequeno', label: 'Pequeno' },
  { value: 'medio', label: 'Médio' },
  { value: 'grande', label: 'Grande' }
];

const genderOptions = [
  { value: 'all', label: 'Todos os gêneros' },
  { value: 'macho', label: 'Macho' },
  { value: 'femea', label: 'Fêmea' }
];

const disabilityOptions = [
  { value: 'all', label: 'Todos os pets' },
  { value: 'yes', label: 'Com necessidades especiais' },
  { value: 'no', label: 'Sem necessidades especiais' }
];

export function FilterSidebar({
  filters,
  onFilterChange,
  cepInput,
  onCepChange,
  onSearchByCep
}: FilterSidebarProps) {
  const [showCepSearch, setShowCepSearch] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* CEP Search */}
      <div className="bg-gradient-to-r from-petpink/10 to-petorange/10 rounded-xl p-4 border border-petpink/20">
        <button
          onClick={() => setShowCepSearch(!showCepSearch)}
          className="flex items-center gap-2 w-full text-left"
        >
          <Navigation className="w-5 h-5 text-petpink" />
          <span className="font-medium">Buscar por proximidade</span>
        </button>
        
        {showCepSearch && (
          <div className="mt-3 space-y-2">
            <Input
              type="text"
              placeholder="Digite seu CEP"
              value={cepInput}
              onChange={(e) => onCepChange(e.target.value)}
              className="h-10"
            />
            <button
              onClick={onSearchByCep}
              disabled={cepInput.length < 8}
              className="w-full py-2 px-4 bg-gradient-to-r from-petpink to-petorange text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MapPinned className="w-4 h-4 inline mr-2" />
              Buscar próximos
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-petpink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filtros
        </h3>

        <div className="space-y-4">
          {/* City */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-petred" />
              Cidade
            </Label>
            <Select 
              value={filters.city} 
              onValueChange={(value) => updateFilter('city', value)}
            >
              <SelectTrigger className="bg-white dark:bg-card border h-10">
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

          {/* Age */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-petblue" />
              Idade
            </Label>
            <Select 
              value={filters.ageRange} 
              onValueChange={(value) => updateFilter('ageRange', value)}
            >
              <SelectTrigger className="bg-white dark:bg-card border h-10">
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

          {/* Size */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="w-4 h-4 text-petgreen" />
              Porte
            </Label>
            <Select 
              value={filters.size} 
              onValueChange={(value) => updateFilter('size', value)}
            >
              <SelectTrigger className="bg-white dark:bg-card border h-10">
                <SelectValue placeholder="Todos os portes" />
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

          {/* Gender */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4 text-petpink" />
              Gênero
            </Label>
            <Select 
              value={filters.gender || 'all'} 
              onValueChange={(value) => updateFilter('gender', value)}
            >
              <SelectTrigger className="bg-white dark:bg-card border h-10">
                <SelectValue placeholder="Todos os gêneros" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-card">
                {genderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Disability */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="w-4 h-4 text-petorange" />
              Necessidades Especiais
            </Label>
            <Select 
              value={filters.hasDisability} 
              onValueChange={(value) => updateFilter('hasDisability', value)}
            >
              <SelectTrigger className="bg-white dark:bg-card border h-10">
                <SelectValue placeholder="Todos os pets" />
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

          {/* ONG */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building className="w-4 h-4 text-petpink" />
              ONG
            </Label>
            <Select 
              value={filters.ongId} 
              onValueChange={(value) => updateFilter('ongId', value)}
            >
              <SelectTrigger className="bg-white dark:bg-card border h-10">
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
        </div>
      </div>
    </div>
  );
}
