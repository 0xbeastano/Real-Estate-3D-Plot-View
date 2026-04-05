import { create } from 'zustand';
import { PlotData, PlotStatus, PlotCategory } from '../data/plots';

interface AppState {
  selectedPlot: PlotData | null;
  hoveredPlot: string | null;
  viewMode: '2d' | '3d' | 'side';
  dataSource: 'procedural' | 'glb';
  showWireframe: boolean;
  activeFilters: { status: PlotStatus[], categories: PlotCategory[] };
  searchQuery: string;
  fov: number;
  pitch: number;
  yaw: number;
  setSelectedPlot: (plot: PlotData | null) => void;
  setHoveredPlot: (id: string | null) => void;
  setViewMode: (mode: '2d' | '3d' | 'side') => void;
  setDataSource: (source: 'procedural' | 'glb') => void;
  setShowWireframe: (show: boolean) => void;
  toggleStatusFilter: (status: PlotStatus) => void;
  toggleCategoryFilter: (category: PlotCategory) => void;
  setSearchQuery: (query: string) => void;
  setFov: (fov: number) => void;
  setPitch: (pitch: number) => void;
  setYaw: (yaw: number) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedPlot: null,
  hoveredPlot: null,
  viewMode: '2d',
  dataSource: 'procedural',
  showWireframe: false,
  activeFilters: {
    status: ['available', 'sold', 'reserved'],
    categories: ['standard', 'corner', 'park-facing', 'road-facing', 'commercial']
  },
  searchQuery: '',
  fov: 45,
  pitch: Math.PI / 4,
  yaw: 0,
  setSelectedPlot: (plot) => set({ selectedPlot: plot }),
  setHoveredPlot: (id) => set({ hoveredPlot: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setDataSource: (source) => set({ dataSource: source }),
  setShowWireframe: (show) => set({ showWireframe: show }),
  toggleStatusFilter: (status) => set((state) => {
    const current = state.activeFilters.status;
    const updated = current.includes(status) 
      ? current.filter(s => s !== status)
      : [...current, status];
    return { activeFilters: { ...state.activeFilters, status: updated } };
  }),
  toggleCategoryFilter: (category) => set((state) => {
    const current = state.activeFilters.categories;
    const updated = current.includes(category) 
      ? current.filter(c => c !== category)
      : [...current, category];
    return { activeFilters: { ...state.activeFilters, categories: updated } };
  }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFov: (fov) => set({ fov }),
  setPitch: (pitch) => set({ pitch }),
  setYaw: (yaw) => set({ yaw })
}));
