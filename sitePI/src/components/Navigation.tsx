import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Search,
  Heart,
  MapPin,
  Info,
  Phone,
  User,
  LogOut,
  Moon,
  Sun,
  Menu,
  Bell,
} from "lucide-react";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  notificationCount: number;
  onOpenNotifications: () => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "adoption", label: "Adoção", icon: Search },
  { id: "favorites", label: "Favoritos", icon: Heart },
  { id: "locations", label: "Localizações", icon: MapPin },
  { id: "about", label: "Sobre", icon: Info },
  { id: "contact", label: "Contato", icon: Phone },
];

export function Navigation({
  currentPage,
  onPageChange,
  notificationCount,
  onOpenNotifications,
}: NavigationProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onPageChange("home")}
            className="flex items-center gap-3 group"
          >
            <img
              src="/logo.png"
              alt="PETCONNECTTA Logo"
              className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
            />
            <span className="text-xl font-black bg-gradient-to-r from-petpink to-petorange bg-clip-text text-transparent hidden sm:block">
              PETCONNECTTA
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentPage === item.id
                    ? "bg-petpink text-white"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-petred text-white text-xs rounded-full flex items-center justify-center animate-bounce-soft">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5 text-petorange" />
              )}
            </button>

            {/* User menu - Desktop */}
            <div className="hidden sm:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 rounded-full hover:bg-muted transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-petblue to-petpink rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {user?.name}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onPageChange("favorites")}>
                    <Heart className="w-4 h-4 mr-2" />
                    Meus favoritos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTheme}>
                    {theme === "light" ? (
                      <>
                        <Moon className="w-4 h-4 mr-2" />
                        Modo escuro
                      </>
                    ) : (
                      <>
                        <Sun className="w-4 h-4 mr-2" />
                        Modo claro
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden p-2 rounded-full hover:bg-muted transition-colors">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <img
                        src="/logo.png"
                        alt="PETCONNECTTA Logo"
                        className="w-12 h-12 object-contain"
                      />
                      <span className="text-xl font-black bg-gradient-to-r from-petpink to-petorange bg-clip-text text-transparent">
                        PETCONNECTTA
                      </span>
                    </div>
                  </div>

                  {/* User info - Mobile */}
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-xl mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-petblue to-petpink rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Mobile nav items */}
                  <div className="flex-1 space-y-1">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onPageChange(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all ${
                          currentPage === item.id
                            ? "bg-petpink text-white"
                            : "hover:bg-muted"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Mobile actions */}
                  <div className="border-t border-border pt-4 space-y-2">
                    <button
                      onClick={() => {
                        toggleTheme();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-left"
                    >
                      {theme === "light" ? (
                        <>
                          <Moon className="w-5 h-5" />
                          Modo escuro
                        </>
                      ) : (
                        <>
                          <Sun className="w-5 h-5" />
                          Modo claro
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      Sair
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
