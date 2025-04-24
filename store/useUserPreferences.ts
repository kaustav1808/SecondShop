import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

type UserPreferencesState = {
  theme: Theme;
  favorites: string[]; // Array of product IDs
  recentlyViewed: string[]; // Array of product IDs
  setTheme: (theme: Theme) => void;
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  addToRecentlyViewed: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
};

const useUserPreferences = create<UserPreferencesState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      favorites: [],
      recentlyViewed: [],
      
      setTheme: (theme) => set({ theme }),
      
      addToFavorites: (productId) => {
        set((state) => {
          if (state.favorites.includes(productId)) {
            return state;
          }
          return { favorites: [productId, ...state.favorites] };
        });
      },
      
      removeFromFavorites: (productId) => {
        set((state) => ({
          favorites: state.favorites.filter(id => id !== productId)
        }));
      },
      
      addToRecentlyViewed: (productId) => {
        set((state) => {
          // Remove if already in the list
          const filtered = state.recentlyViewed.filter(id => id !== productId);
          // Add to the beginning of the array
          return { 
            recentlyViewed: [productId, ...filtered].slice(0, 20) // Keep only the last 20
          };
        });
      },
      
      isFavorite: (productId) => {
        return get().favorites.includes(productId);
      }
    }),
    {
      name: 'user-preferences',
    }
  )
);

export default useUserPreferences;