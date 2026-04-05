import { Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { plotsData } from '../data/plots';
import { useState, useEffect } from 'react';

export function SearchBar() {
  const { searchQuery, setSearchQuery, setSelectedPlot } = useStore();
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    if (!query) return;
    
    // Try to find exact match first
    let match = plotsData.find(p => p.number.toLowerCase() === query.toLowerCase());
    
    // If no exact match, try matching by integer value (e.g., "25" matches "025")
    if (!match) {
      const queryInt = parseInt(query, 10);
      if (!isNaN(queryInt)) {
        match = plotsData.find(p => parseInt(p.number, 10) === queryInt);
      }
    }

    if (match) {
      setSelectedPlot(match);
      setSearchQuery(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(inputValue);
    }
  };

  return (
    <div className="pointer-events-auto relative w-64 shadow-xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input 
        type="text" 
        placeholder="Search Plot Number..." 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full bg-[#121821]/90 backdrop-blur-md border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
      />
    </div>
  );
}
