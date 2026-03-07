import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Heart, MapPin, Calendar, User, Accessibility, Syringe, Phone, Mail, Building2 } from 'lucide-react';
import type { Dog } from '@/types';

interface DogCardProps {
  dog: Dog;
}

export function DogCard({ dog }: DogCardProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [imageError, setImageError] = useState(false);

  const favorite = isFavorite(dog.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(dog.id);
    } else {
      addToFavorites(dog.id);
    }
  };

  const getSizeLabel = (size: string) => {
    const labels: Record<string, string> = {
      pequeno: 'Pequeno',
      medio: 'Médio',
      grande: 'Grande'
    };
    return labels[size] || size;
  };

  return (
    <>
      <Card className="overflow-hidden hover-lift card-glow cursor-pointer group" onClick={() => setShowDetails(true)}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={imageError ? 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400' : dog.image}
            alt={dog.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
          
          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 w-10 h-10 bg-white/90 dark:bg-card/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
          >
            <Heart className={`w-5 h-5 ${favorite ? 'fill-petred text-petred' : 'text-muted-foreground'}`} />
          </button>

          {/* Disability badge */}
          {dog.hasDisability && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-petblue text-white border-0">
                <Accessibility className="w-3 h-3 mr-1" />
                Especial
              </Badge>
            </div>
          )}

          {/* Gender badge - bottom right */}
          <div className="absolute bottom-3 right-3 z-10">
            <Badge className={`border-0 ${dog.gender === 'macho' ? 'bg-petblue text-white' : 'bg-petpink text-white'}`}>
              {dog.gender === 'macho' ? 'Macho' : 'Fêmea'}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-lg font-bold">{dog.name}</h3>
            <span className="text-sm text-muted-foreground">{dog.age} {dog.ageUnit}</span>
          </div>

          <div className="space-y-1.5 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-petred" />
              <span>{dog.city}, {dog.state}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-petblue" />
              <span className="truncate">{dog.ongName}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-petorange" />
              <span>{getSizeLabel(dog.size)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(true);
              }}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Conhecer
            </Button>
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                setShowContact(true);
              }}
              size="sm"
              className="flex-1 bg-gradient-to-r from-petpink to-petorange hover:opacity-90 text-white"
            >
              Quero Adotar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {dog.name}
              {dog.hasDisability && (
                <Badge className="bg-petblue text-white">
                  <Accessibility className="w-3 h-3 mr-1" />
                  Especial
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {dog.ongName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <img
              src={imageError ? 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400' : dog.image}
              alt={dog.name}
              className="w-full aspect-video object-cover rounded-xl"
              onError={() => setImageError(true)}
            />

            <p className="text-muted-foreground">{dog.description}</p>

            {dog.hasDisability && dog.disabilityType && (
              <div className="p-4 bg-petblue/10 rounded-xl border border-petblue/30">
                <p className="font-semibold text-petblue flex items-center gap-2">
                  <Accessibility className="w-5 h-5" />
                  Necessidade especial
                </p>
                <p className="text-sm mt-1">{dog.disabilityType}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Calendar className="w-5 h-5 text-petblue" />
                <div>
                  <p className="text-xs text-muted-foreground">Idade</p>
                  <p className="font-medium">{dog.age} {dog.ageUnit}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <User className={`w-5 h-5 ${dog.gender === 'macho' ? 'text-petblue' : 'text-petpink'}`} />
                <div>
                  <p className="text-xs text-muted-foreground">Sexo</p>
                  <p className="font-medium">{dog.gender === 'macho' ? 'Macho' : 'Fêmea'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <MapPin className="w-5 h-5 text-petred" />
                <div>
                  <p className="text-xs text-muted-foreground">Local</p>
                  <p className="font-medium">{dog.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Syringe className="w-5 h-5 text-petgreen" />
                <div>
                  <p className="text-xs text-muted-foreground">Vacinado</p>
                  <p className="font-medium">{dog.isVaccinated ? 'Sim' : 'Não'}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDetails(false)}
                className="flex-1"
              >
                Fechar
              </Button>
              <Button
                onClick={() => {
                  setShowDetails(false);
                  setShowContact(true);
                }}
                className="flex-1 bg-gradient-to-r from-petpink to-petorange hover:opacity-90 text-white"
              >
                Quero Adotar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Quero adotar {dog.name}!</DialogTitle>
            <DialogDescription>
              Entre em contato com a {dog.ongName} para iniciar o processo de adoção.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-xl">
              <p className="font-semibold mb-2">Próximos passos:</p>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Entre em contato com a ONG</li>
                <li>Agende uma visita para conhecer o cachorro</li>
                <li>Preencha o formulário de adoção</li>
                <li>Aguarde a aprovação</li>
                <li>Leve seu novo amigo para casa!</li>
              </ol>
            </div>

            <div className="space-y-3">
              <a
                href={`tel:${dog.ongName}`}
                className="flex items-center gap-3 p-4 bg-petgreen/10 rounded-xl hover:bg-petgreen/20 transition-colors"
              >
                <Phone className="w-6 h-6 text-petgreen" />
                <div>
                  <p className="font-semibold">Ligar para ONG</p>
                  <p className="text-sm text-muted-foreground">{dog.ongName}</p>
                </div>
              </a>

              <a
                href={`mailto:contato@${dog.ongName.toLowerCase().replace(/\s+/g, '')}.org?subject=Interesse em adotar ${dog.name}`}
                className="flex items-center gap-3 p-4 bg-petblue/10 rounded-xl hover:bg-petblue/20 transition-colors"
              >
                <Mail className="w-6 h-6 text-petblue" />
                <div>
                  <p className="font-semibold">Enviar email</p>
                  <p className="text-sm text-muted-foreground">Sobre {dog.name}</p>
                </div>
              </a>
            </div>

            <Button
              onClick={() => setShowContact(false)}
              variant="outline"
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
