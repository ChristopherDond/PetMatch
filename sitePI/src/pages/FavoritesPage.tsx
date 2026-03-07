import { useAuth } from '@/hooks/useAuth';
import { DogCard } from '@/components/DogCard';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight } from 'lucide-react';
import { dogs } from '@/data/dogs';

interface FavoritesPageProps {
  onPageChange: (page: string) => void;
}

export function FavoritesPage({ onPageChange }: FavoritesPageProps) {
  const { user } = useAuth();

  const favoriteDogs = dogs.filter((dog) => user?.favorites.includes(dog.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-petpink/10 rounded-full mb-4">
          <Heart className="w-8 h-8 text-petpink fill-petpink" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Meus <span className="text-gradient">Favoritos</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Aqui estão os cães que você salvou. Entre em contato com a ONG para 
          iniciar o processo de adoção.
        </p>
      </div>

      {/* Favorites List */}
      {favoriteDogs.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteDogs.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Nenhum favorito ainda</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Você ainda não adicionou nenhum cachorro aos favoritos. 
            Navegue pela página de adoção e clique no coração para salvar!
          </p>
          <Button
            onClick={() => onPageChange('adoption')}
            className="bg-gradient-to-r from-petpink to-petred hover:opacity-90 text-white"
          >
            Ver Cães para Adoção
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
