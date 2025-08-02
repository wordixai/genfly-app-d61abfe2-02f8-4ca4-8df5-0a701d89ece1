import { create } from 'zustand';
import { Artwork } from '@/types';

interface ArtworkStore {
  artworks: Artwork[];
  addArtwork: (artwork: Omit<Artwork, 'id' | 'dateAdded'>) => void;
  updateArtwork: (id: string, artwork: Partial<Artwork>) => void;
  deleteArtwork: (id: string) => void;
  markAsSold: (id: string, soldPrice: number, clientId: string) => void;
  getAvailableArtworks: () => Artwork[];
  getArtworksByStatus: (status: Artwork['status']) => Artwork[];
}

const mockArtworks: Artwork[] = [
  {
    id: '1',
    title: 'Sunset Dreams',
    medium: 'Oil on Canvas',
    dimensions: '24" x 36"',
    yearCreated: 2024,
    price: 2500,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
    description: 'A vibrant landscape capturing the golden hour',
    tags: ['landscape', 'contemporary', 'oil'],
    dateAdded: '2024-01-15',
  },
  {
    id: '2',
    title: 'Urban Reflections',
    medium: 'Acrylic on Canvas',
    dimensions: '18" x 24"',
    yearCreated: 2023,
    price: 1800,
    status: 'sold',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    tags: ['urban', 'contemporary', 'acrylic'],
    dateAdded: '2023-11-20',
    soldDate: '2024-02-14',
    soldPrice: 1800,
  },
  {
    id: '3',
    title: 'Abstract Flow',
    medium: 'Mixed Media',
    dimensions: '30" x 40"',
    yearCreated: 2024,
    price: 3200,
    status: 'exhibition',
    imageUrl: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400',
    tags: ['abstract', 'mixed-media', 'large'],
    dateAdded: '2024-02-01',
  },
];

export const useArtworkStore = create<ArtworkStore>((set, get) => ({
  artworks: mockArtworks,
  
  addArtwork: (artwork) => {
    const newArtwork: Artwork = {
      ...artwork,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0],
    };
    set((state) => ({
      artworks: [...state.artworks, newArtwork],
    }));
  },

  updateArtwork: (id, updatedArtwork) => {
    set((state) => ({
      artworks: state.artworks.map((artwork) =>
        artwork.id === id ? { ...artwork, ...updatedArtwork } : artwork
      ),
    }));
  },

  deleteArtwork: (id) => {
    set((state) => ({
      artworks: state.artworks.filter((artwork) => artwork.id !== id),
    }));
  },

  markAsSold: (id, soldPrice, clientId) => {
    set((state) => ({
      artworks: state.artworks.map((artwork) =>
        artwork.id === id
          ? {
              ...artwork,
              status: 'sold' as const,
              soldPrice,
              soldDate: new Date().toISOString().split('T')[0],
              clientId,
            }
          : artwork
      ),
    }));
  },

  getAvailableArtworks: () => {
    return get().artworks.filter((artwork) => artwork.status === 'available');
  },

  getArtworksByStatus: (status) => {
    return get().artworks.filter((artwork) => artwork.status === status);
  },
}));