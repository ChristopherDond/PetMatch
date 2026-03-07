import {
  Heart,
  Target,
  Sparkles,
  Users,
  PawPrint,
  Accessibility,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-petpink to-petred rounded-full mb-6 animate-pulse-glow">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Sobre o <span className="text-gradient">PETCONNECTTA</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Conectando corações a patinhas. Uma plataforma dedicada a transformar
          vidas, tanto de cães quanto de pessoas, através da adoção responsável.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Card className="overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-petpink to-petred" />
          <CardContent className="p-8">
            <div className="w-14 h-14 bg-petpink/10 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-petpink" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Nossa Missão</h2>
            <p className="text-muted-foreground leading-relaxed">
              Conectar pessoas amorosas a cães que precisam de um lar, com foco
              especial em animais com deficiência. Queremos reduzir o número de
              cães abandonados e promover a adoção responsável como alternativa
              à compra.
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-petblue to-petgreen" />
          <CardContent className="p-8">
            <div className="w-14 h-14 bg-petblue/10 rounded-xl flex items-center justify-center mb-6">
              <Sparkles className="w-7 h-7 text-petblue" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Nossa Visão</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ser a principal plataforma de adoção de cães no Brasil,
              reconhecida pelo compromisso com o bem-estar animal e pela
              inclusão de cães com necessidades especiais. Um Brasil onde todo
              cachorro tenha um lar amoroso.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Story Section */}
      <div className="bg-gradient-to-r from-petpink/5 to-petorange/5 rounded-3xl p-8 lg:p-12 mb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-petpink/10 rounded-full mb-6">
              <PawPrint className="w-4 h-4 text-petpink" />
              <span className="text-sm font-medium text-petpink">
                Nossa História
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-6">Como Tudo Começou</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                O PETCONNECTTA nasceu da união de estudantes apaixonados por
                animais. Durante um projeto acadêmico, percebemos a dificuldade
                que ONGs enfrentavam para divulgar cães disponíveis para adoção,
                especialmente aqueles com deficiência.
              </p>
              <p>
                Decidimos criar uma plataforma que não apenas facilitasse a
                conexão entre adotantes e ONGs, mas que também desse
                visibilidade especial aos cães que muitas vezes são ignorados
                por causa de suas limitações físicas.
              </p>
              <p>
                Acreditamos que todo cachorro merece uma chance de ser feliz,
                independente de suas condições. Cães com deficiência são
                extremamente gratos e trazem uma alegria imensa para suas
                famílias.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://blog-static.petlove.com.br/wp-content/uploads/2021/02/Cachorro-filhote-na-grama-Petlove.jpg"
                  alt="Cachorro feliz"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-petpink to-petred flex items-center justify-center">
                <Heart className="w-16 h-16 text-white" />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-petblue to-petgreen flex items-center justify-center">
                <PawPrint className="w-16 h-16 text-white" />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800"
                  alt="Cachorro para adoção"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Nossos Valores</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Heart,
              title: "Amor",
              description:
                "Acreditamos que o amor pelos animais é o que nos move",
              color: "petpink",
            },
            {
              icon: Accessibility,
              title: "Inclusão",
              description:
                "Todos os cães merecem uma chance, especialmente os especiais",
              color: "petorange",
            },
            {
              icon: Target,
              title: "Compromisso",
              description:
                "Dedicados a encontrar o melhor lar para cada cachorro",
              color: "petblue",
            },
            {
              icon: Sparkles,
              title: "Esperança",
              description: "Transformando vidas, uma adoção de cada vez",
              color: "petgreen",
            },
          ].map((value, index) => (
            <Card key={index} className="text-center hover-lift">
              <CardContent className="p-6">
                <div
                  className={`w-16 h-16 mx-auto mb-4 bg-${value.color}/10 rounded-xl flex items-center justify-center`}
                >
                  <value.icon className={`w-8 h-8 text-${value.color}`} />
                </div>
                <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Equipe de Apresentação Section */}
      <div className="bg-muted rounded-3xl p-8 lg:p-12 mb-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-petblue/10 rounded-xl mb-4">
            <Users className="w-7 h-7 text-petblue" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Equipe de Apresentação</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Estudantes dedicados que promovem a causa e apresentam o projeto à
            comunidade.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Ana Júlia", color: "petpink" },
            { name: "Ana Clara", color: "petblue" },
            { name: "Kaique Silva", color: "petgreen" },
            { name: "Kawany Barreto", color: "petorange" },
            { name: "Julia Barreto", color: "petpink" },
            { name: "Pedro Arantes", color: "petblue" },
            { name: "Geovanna Andrade", color: "petred" },
          ].map((member, index) => (
            <Card
              key={index}
              className="text-center overflow-hidden hover-lift"
            >
              <div className={`h-2 bg-${member.color}`} />
              <CardContent className="p-6">
                <div
                  className={`w-20 h-20 mx-auto mb-4 bg-${member.color}/10 rounded-full flex items-center justify-center`}
                >
                  <Users className={`w-8 h-8 text-${member.color}`} />
                </div>
                <h3 className="font-bold text-xl">{member.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Equipe de Desenvolvimento */}
      <div className="bg-gradient-to-b from-muted to-background rounded-3xl p-8 lg:p-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-petgreen/10 rounded-xl mb-4">
            <Sparkles className="w-7 h-7 text-petgreen" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Equipe de Desenvolvimento</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Responsáveis pela arquitetura, código e implementação tecnológica da
            plataforma.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Gabryel", color: "petpink" },
            { name: "Henrique", color: "petblue" },
            { name: "Christopher", color: "petgreen" },
            { name: "Nicolas", color: "petorange" },
          ].map((member, index) => (
            <Card
              key={index}
              className="text-center overflow-hidden hover-lift border-t-4"
              style={{ borderColor: `var(--${member.color})` }}
            >
              <CardContent className="p-6">
                <div
                  className={`w-20 h-20 mx-auto mb-4 bg-${member.color}/10 rounded-full flex items-center justify-center`}
                >
                  <Users className={`w-8 h-8 text-${member.color}`} />
                </div>
                <h3 className="font-bold text-xl">{member.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground font-medium italic">
            "Juntos, transformando o destino de muitos peludinhos."
          </p>
        </div>
      </div>
    </div>
  );
}
