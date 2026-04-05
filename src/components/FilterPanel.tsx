import { useStore } from '../store/useStore';
import { PlotStatus, PlotCategory } from '../data/plots';

export function FilterPanel() {
  const { activeFilters, toggleStatusFilter, toggleCategoryFilter } = useStore();

  const statuses: { value: PlotStatus, label: string, color: string }[] = [
    { value: 'available', label: 'Available', color: 'bg-[#4CAF50]' },
    { value: 'reserved', label: 'Booked', color: 'bg-[#FFC107]' },
    { value: 'sold', label: 'Sold', color: 'bg-[#F44336]' }
  ];

  const categories: { value: PlotCategory, label: string, color?: string }[] = [
    { value: 'standard', label: 'Standard' },
    { value: 'corner', label: 'Corner' },
    { value: 'park-facing', label: 'Premium (Park Facing)', color: 'bg-[#00BCD4]' },
    { value: 'road-facing', label: 'Road Facing' },
    { value: 'commercial', label: 'Commercial', color: 'bg-[#00BCD4]' }
  ];

  return (
    <div className="bg-[#121821]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 w-72 shadow-2xl text-white pointer-events-auto">
      <div className="mb-6">
        <h3 className="font-bold mb-3 text-xs text-gray-400 uppercase tracking-wider">Status</h3>
        <div className="space-y-3">
          {statuses.map(s => (
            <label key={s.value} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${s.color} shadow-sm`}></div>
                <span className="text-sm text-gray-200 group-hover:text-white transition-colors">{s.label}</span>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${activeFilters.status.includes(s.value) ? 'bg-blue-500' : 'bg-gray-700'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${activeFilters.status.includes(s.value) ? 'left-6' : 'left-1'}`}></div>
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={activeFilters.status.includes(s.value)}
                onChange={() => toggleStatusFilter(s.value)}
              />
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-3 text-xs text-gray-400 uppercase tracking-wider">Categories</h3>
        <div className="space-y-3">
          {categories.map(c => (
            <label key={c.value} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                {c.color && <div className={`w-3 h-3 rounded-full ${c.color} shadow-sm`}></div>}
                <span className="text-sm text-gray-200 group-hover:text-white transition-colors">{c.label}</span>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${activeFilters.categories.includes(c.value) ? 'bg-blue-500' : 'bg-gray-700'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${activeFilters.categories.includes(c.value) ? 'left-6' : 'left-1'}`}></div>
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={activeFilters.categories.includes(c.value)}
                onChange={() => toggleCategoryFilter(c.value)}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
