export interface Artwork {
  id: string;
  title: string;
  medium: string;
  dimensions: string;
  yearCreated: number;
  price: number;
  status: 'available' | 'sold' | 'reserved' | 'exhibition';
  imageUrl: string;
  description?: string;
  tags: string[];
  dateAdded: string;
  soldDate?: string;
  soldPrice?: number;
  clientId?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  segment: 'collector' | 'gallery' | 'institution' | 'casual';
  notes?: string;
  totalPurchases: number;
  dateAdded: string;
  lastContact?: string;
  preferredMedium?: string;
}

export interface Exhibition {
  id: string;
  title: string;
  venue: string;
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  artworkIds: string[];
  description?: string;
  commission?: number;
  totalSales?: number;
}

export interface Sale {
  id: string;
  artworkId: string;
  clientId: string;
  saleDate: string;
  salePrice: number;
  commission?: number;
  notes?: string;
}