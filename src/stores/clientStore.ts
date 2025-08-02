import { create } from 'zustand';
import { Client } from '@/types';

interface ClientStore {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'dateAdded' | 'totalPurchases'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientsBySegment: (segment: Client['segment']) => Client[];
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    phone: '+1-555-0123',
    address: '123 Art Street, NYC',
    segment: 'collector',
    totalPurchases: 15000,
    dateAdded: '2023-08-15',
    lastContact: '2024-02-14',
    preferredMedium: 'Oil',
  },
  {
    id: '2',
    name: 'Modern Gallery',
    email: 'info@moderngallery.com',
    phone: '+1-555-0456',
    address: '456 Gallery Ave, LA',
    segment: 'gallery',
    totalPurchases: 45000,
    dateAdded: '2023-05-20',
    lastContact: '2024-01-20',
  },
];

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: mockClients,
  
  addClient: (client) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0],
      totalPurchases: 0,
    };
    set((state) => ({
      clients: [...state.clients, newClient],
    }));
  },

  updateClient: (id, updatedClient) => {
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, ...updatedClient } : client
      ),
    }));
  },

  deleteClient: (id) => {
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
    }));
  },

  getClientsBySegment: (segment) => {
    return get().clients.filter((client) => client.segment === segment);
  },
}));