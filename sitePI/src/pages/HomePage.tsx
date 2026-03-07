import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  PawPrint,
  MapPin,
  Users,
  ArrowRight,
  Sparkles,
  Accessibility,
  Search,
} from "lucide-react";
import { dogs } from "@/data/dogs";

// 1. Movemos o sorteio para fora do componente.
// Isso resolve o erro de "impure function" e melhora a performance.
const featuredDogs = [...dogs].sort(() => 0.5 - Math.random()).slice(0, 4);

interface HomePageProps {
  onPageChange: (page: string) => void;
}

export function HomePage({ onPageChange }: HomePageProps) {
  // 2. O cálculo de contagem é simples e pode ficar aqui dentro.
  const specialNeedsCount = dogs.filter((d) => d.hasDisability).length;

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-petpink/30 via-petorange/20 to-petyellow/10" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-petpink/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-petorange/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <img
                  src="/logo.png"
                  alt="PETCONNECTTA"
                  className="w-32 h-32 lg:w-48 lg:h-48 object-contain animate-float drop-shadow-2xl"
                />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-petpink/10 rounded-full">
                <Sparkles className="w-4 h-4 text-petpink" />
                <span className="text-sm font-medium text-petpink">
                  Adoção Responsável
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                Encontre seu <span className="text-gradient">melhor amigo</span>{" "}
                de quatro patas
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                O PETCONNECTTA conecta pessoas amorosas a cães que precisam de
                um lar. Especialmente aqueles com deficiência, que merecem uma
                chance especial.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={() => onPageChange("adoption")}
                  size="lg"
                  className="bg-gradient-to-r from-petpink to-petorange hover:opacity-90 text-white font-semibold text-lg h-14 px-8"
                >
                  <PawPrint className="w-5 h-5 mr-2" />
                  Ver Cachorros
                </Button>
                <Button
                  onClick={() => onPageChange("about")}
                  variant="outline"
                  size="lg"
                  className="text-lg h-14 px-8"
                >
                  Conhecer Projeto
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-petpink/10 rounded-xl flex items-center justify-center">
                    <PawPrint className="w-6 h-6 text-petpink" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{dogs.length}</p>
                    <p className="text-sm text-muted-foreground">
                      Cães disponíveis
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-petorange/10 rounded-xl flex items-center justify-center">
                    <Accessibility className="w-6 h-6 text-petorange" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{specialNeedsCount}</p>
                    <p className="text-sm text-muted-foreground">Especiais</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-petblue/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-petblue" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-sm text-muted-foreground">Cidades</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://blog-static.petlove.com.br/wp-content/uploads/2021/02/Cachorro-filhote-na-grama-Petlove.jpg"
                    alt="Cachorro fofo"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-petpink to-petred flex items-center justify-center">
                  <Heart className="w-20 h-20 text-white animate-pulse" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-petblue to-petpink flex items-center justify-center">
                  <PawPrint className="w-20 h-20 text-white animate-bounce-soft" />
                </div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="http://zukapets.com/cdn/shop/articles/cachorro.jpg?v=1715951227"
                    alt="Cachorro para adoção"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dogs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Cães em Destaque</h2>
            <p className="text-muted-foreground">
              Conheça alguns dos nossos amigos esperando um lar
            </p>
          </div>
          <Button
            onClick={() => onPageChange("adoption")}
            variant="outline"
            className="hidden sm:flex"
          >
            Ver todos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDogs.map((dog) => (
            <Card
              key={dog.id}
              className="overflow-hidden hover-lift cursor-pointer group"
              onClick={() => onPageChange("adoption")}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={dog.image}
                  alt={dog.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {dog.hasDisability && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-petorange text-white border-0">
                      <Accessibility className="w-3 h-3 mr-1" />
                      Especial
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{dog.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {dog.city}, {dog.state}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {dog.age} {dog.ageUnit}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {dog.gender === "macho" ? "Macho" : "Fêmea"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Special Needs Section */}
      <section className="bg-gradient-to-r from-petpink/10 via-petorange/10 to-petyellow/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://m.media-amazon.com/images/I/71H-dYSg6SL._AC_UF1000,1000_QL80_.jpg"
                  alt="Cão especial"
                  className="rounded-2xl shadow-lg hover:scale-105 transition-transform"
                />
                <img
                  src="https://images.tcdn.com.br/img/img_prod/1175673/cadeira_de_rodas_para_articulada_13_2_41d15aaac6058fb7a014b3b6bcfde48a.jpeg"
                  alt="Cão com cadeira de rodas"
                  className="rounded-2xl shadow-lg mt-8 hover:scale-105 transition-transform"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-petorange/20 rounded-full">
                <Accessibility className="w-4 h-4 text-petorange" />
                <span className="text-sm font-medium text-petorange">
                  Cães Especiais
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold">
                Eles também merecem <span className="text-petorange">amor</span>
              </h2>

              <p className="text-lg text-muted-foreground">
                Cães com deficiência são extremamente gratos e leais. Eles
                precisam de cuidados especiais, mas retribuem com muito amor e
                carinho. Dê uma chance a um amigo especial!
              </p>

              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-petgreen/20 rounded-full flex items-center justify-center">
                    <Heart className="w-3 h-3 text-petgreen" />
                  </div>
                  <span>Super gratos e companheiros</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-petgreen/20 rounded-full flex items-center justify-center">
                    <Heart className="w-3 h-3 text-petgreen" />
                  </div>
                  <span>Adaptam-se muito bem a novos lares</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-petgreen/20 rounded-full flex items-center justify-center">
                    <Heart className="w-3 h-3 text-petgreen" />
                  </div>
                  <span>ONGs fornecem suporte e orientação</span>
                </li>
              </ul>

              <Button
                onClick={() => onPageChange("adoption")}
                size="lg"
                className="bg-gradient-to-r from-petpink to-petorange hover:opacity-90 text-white font-semibold"
              >
                <Accessibility className="w-5 h-5 mr-2" />
                Ver Cães Especiais
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Adotar um cachorro é simples e gratificante. Siga estes passos:
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Search,
              title: "Encontre",
              description:
                "Navegue pelos cães disponíveis e encontre seu match perfeito",
              color: "petpink",
            },
            {
              icon: Heart,
              title: "Selecione",
              description:
                "Adicione aos favoritos e entre em contato com a ONG",
              color: "petred",
            },
            {
              icon: Users,
              title: "Conheça",
              description: "Visite a ONG e passe um tempo com o cachorro",
              color: "petblue",
            },
            {
              icon: PawPrint,
              title: "Leve para Casa",
              description: "Complete a adoção e comece uma nova vida juntos",
              color: "petgreen",
            },
          ].map((step, index) => (
            <div key={index} className="text-center group">
              <div
                className={`w-20 h-20 mx-auto mb-4 bg-${step.color}/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <step.icon className={`w-10 h-10 text-${step.color}`} />
              </div>
              <div className="w-8 h-8 mx-auto mb-4 bg-petpink text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
