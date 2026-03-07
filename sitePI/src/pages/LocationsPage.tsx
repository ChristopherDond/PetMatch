import { useState } from "react";
import { ongs } from "@/data/dogs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Phone,
  Mail,
  Search,
  ExternalLink,
  Navigation,
  Building2,
} from "lucide-react";

export function LocationsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOngs = ongs.filter(
    (ong) =>
      ong.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ong.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ong.state.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getDirections = (ong: (typeof ongs)[0]) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${ong.latitude},${ong.longitude}`;
    window.open(url, "_blank");
  };

  // Center map on Brazil
  const mapCenter = { lat: -14.235, lng: -51.9253 };

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
          <h1 className="text-2xl sm:text-3xl font-bold">ONGs Parceiras</h1>
          <p className="text-muted-foreground text-sm">
            Encontre a ONG mais próxima de você
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nome, cidade ou estado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12"
        />
      </div>

      {/* Main Map */}
      <div className="mb-8">
        <div className="aspect-[16/9] lg:aspect-[21/9] rounded-2xl overflow-hidden border shadow-lg">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lng - 25}%2C${mapCenter.lat - 20}%2C${mapCenter.lng + 25}%2C${mapCenter.lat + 15}&layer=mapnik&marker=${mapCenter.lat}%2C${mapCenter.lng}`}
            style={{ filter: "grayscale(0.1)" }}
          />
        </div>
        <div className="flex justify-end mt-2">
          <a
            href="https://www.openstreetmap.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-petpink flex items-center gap-1"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir mapa maior
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-petpink/10 to-petorange/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-petpink">{ongs.length}</p>
          <p className="text-sm text-muted-foreground">ONGs parceiras</p>
        </div>
        <div className="bg-gradient-to-br from-petblue/10 to-petpink/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-petblue">5</p>
          <p className="text-sm text-muted-foreground">Estados</p>
        </div>
        <div className="bg-gradient-to-br from-petgreen/10 to-petblue/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-petgreen">100%</p>
          <p className="text-sm text-muted-foreground">Verificadas</p>
        </div>
        <div className="bg-gradient-to-br from-petorange/10 to-petyellow/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-petorange">24h</p>
          <p className="text-sm text-muted-foreground">Atendimento</p>
        </div>
      </div>

      {/* ONGs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOngs.map((ong) => (
          <Card key={ong.id} className="overflow-hidden hover-lift group">
            {/* Mini Map */}
            <div className="relative h-40 overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${ong.longitude - 0.02}%2C${ong.latitude - 0.02}%2C${ong.longitude + 0.02}%2C${ong.latitude + 0.02}&layer=mapnik&marker=${ong.latitude}%2C${ong.longitude}`}
                style={{ filter: "grayscale(0.2)" }}
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-white/90 text-foreground shadow-md">
                  <MapPin className="w-3 h-3 mr-1" />
                  {ong.city}
                </Badge>
              </div>
            </div>

            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-petpink to-petorange rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{ong.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {ong.city}, {ong.state}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {ong.description}
              </p>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-petred" />
                  <span className="text-muted-foreground truncate">
                    {ong.address}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-petgreen" />
                  <a
                    href={`tel:${ong.phone}`}
                    className="text-petblue hover:underline"
                  >
                    {ong.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-petblue" />
                  <a
                    href={`mailto:${ong.email}`}
                    className="text-petblue hover:underline truncate"
                  >
                    {ong.email}
                  </a>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`https://www.openstreetmap.org/?mlat=${ong.latitude}&mlon=${ong.longitude}#map=15/${ong.latitude}/${ong.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <MapPin className="w-4 h-4 mr-1" />
                    Ver Mapa
                  </Button>
                </a>
                <Button
                  size="sm"
                  onClick={() => getDirections(ong)}
                  className="flex-1 bg-gradient-to-r from-petpink to-petorange hover:opacity-90 text-white"
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Rota
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOngs.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Nenhuma ONG encontrada</h3>
          <p className="text-muted-foreground">
            Tente buscar com outros termos.
          </p>
        </div>
      )}
    </div>
  );
}
