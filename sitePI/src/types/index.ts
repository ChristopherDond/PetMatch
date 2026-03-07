export interface Dog {
  id: string;
  name: string;
  age: number;
  ageUnit: 'meses' | 'anos';
  city: string;
  state: string;
  hasDisability: boolean;
  disabilityType?: string;
  ongId: string;
  ongName: string;
  image: string;
  description: string;
  gender: 'macho' | 'femea';
  size: 'pequeno' | 'medio' | 'grande';
  isVaccinated: boolean;
  isCastrated: boolean;
}

export interface ONG {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  favorites: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface FilterOptions {
  city: string;
  ageRange: string;
  hasDisability: string;
  ongId: string;
  size: string;
  gender?: string;
}
