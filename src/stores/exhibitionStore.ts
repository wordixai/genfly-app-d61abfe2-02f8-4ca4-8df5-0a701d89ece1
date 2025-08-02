import { create } from 'zustand';
import { Exhibition } from '@/types';

interface ExhibitionStore {
  exhibitions: Exhibition[];
  addExhibition: (exhibition: Omit<Exhibition, 'id'>) => void;
  updateExhibition: (id: string, exhibition: Partial<Exhibition>) => void;
  deleteExhibition: (id: string) => void;
  getUpcomingExhibitions: () => Exhibition[];
  getActiveExhibitions: () => Exhibition[];
}

const mockExhibitions: Exhibition[] = [
  {
    id: '1',
    title: 'Spring Collection 2024',
    venue: 'Downtown Gallery',
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    status: 'scheduled',
    artworkIds: ['1', '3'],
    description: 'A collection of contemporary works',
    commission: 40,
  },
  {
    id: '2',
    title: 'Urban Visions',
    venue: 'Metropolitan Art Center',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    status: 'completed',
    artworkIds: ['2'],
    totalSales: 1800,
    commission: 35,
  },
];

export const useExhibitionStore = create<ExhibitionStore>((set, get) => ({
  exhibitions: mockExhibitions,
  
  addExhibition: (exhibition) => {
    const newExhibition: Exhibition = {
      ...exhibition,
      id: Date.now().toString(),
    };
    set((state) => ({
      exhibitions: [...state.exhibitions, newExhibition],
    }));
  },

  updateExhibition: (id, updatedExhibition) => {
    set((state) => ({
      exhibitions: state.exhibitions.map((exhibition) =>
        exhibition.id === id ? { ...exhibition, ...updatedExhibition } : exhibition
      ),
    }));
  },

  deleteExhibition: (id) => {
    set((state) => ({
      exhibitions: state.exhibitions.filter((exhibition) => exhibition.id !== id),
    }));
  },

  getUpcomingExhibitions: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().exhibitions.filter(
      (exhibition) => exhibition.startDate > today || exhibition.status === 'scheduled'
    );
  },

  getActiveExhibitions: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().exhibitions.filter(
      (exhibition) => 
        exhibition.status === 'active' ||
        (exhibition.startDate <= today && exhibition.endDate >= today)
    );
  },
}));