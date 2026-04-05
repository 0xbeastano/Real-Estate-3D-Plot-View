import React from 'react';
import type { PlotData, PlotStatus } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Map, Box, X, ShieldCheck, Banknote, Maximize, CheckCircle2, Clock, Compass } from 'lucide-react';

interface UIOverlayProps {
  viewMode: '2D' | '3D';
  setViewMode: (mode: '2D' | '3D') => void;
  selectedPlot: PlotData | null;
  onClearSelection: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterStatus: PlotStatus | 'all';
  setFilterStatus: (status: PlotStatus | 'all') => void;
  onSelectPlotByNumber: (num: string) => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({
  viewMode, setViewMode, selectedPlot, onClearSelection,
  searchQuery, setSearchQuery, filterStatus, setFilterStatus, onSelectPlotByNumber
}) => {
  const StatusIcon = ({ status, className = "" }: { status: string, className?: string }) => {
    switch (status) {
      case 'available': return <CheckCircle2 className={`text-green-400 ${className}`} />;
      case 'sold': return <X className={`text-red-400 ${className}`} />;
      case 'reserved': return <Clock className={`text-amber-400 ${className}`} />;
      default: return null;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden font-sans">

      {/* Top-Left: Logo & Compass */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-5 left-5 pointer-events-auto flex flex-col gap-3"
      >
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Box size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">PREETHI ESTATES</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Interactive Plot Explorer</p>
            </div>
          </div>
        </div>
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 w-10 h-10 rounded-xl flex items-center justify-center">
          <Compass size={18} className="text-gray-400" />
        </div>
      </motion.div>

      {/* Bottom-Right: Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-5 right-5 pointer-events-auto flex flex-col gap-3 items-end"
      >
        {/* Status & Category toggles */}
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex flex-col gap-2 w-56">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300 font-medium">Categories</span>
            <div className="w-9 h-5 bg-gray-700 rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-gray-400 rounded-full absolute top-0.5 left-0.5" />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300 font-medium">Status</span>
            <div className="w-9 h-5 bg-emerald-600 rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5" />
            </div>
          </div>
        </div>

        {/* View mode + Action buttons */}
        <div className="flex gap-2 items-center">
          <button className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <Map size={18} />
          </button>
          <button
            onClick={() => setViewMode('2D')}
            className={`backdrop-blur-xl border rounded-xl w-10 h-10 flex items-center justify-center font-bold text-sm transition-all ${
              viewMode === '2D'
                ? 'bg-white/20 border-white/30 text-white'
                : 'bg-black/60 border-white/10 text-gray-400 hover:text-white'
            }`}
          >2D</button>
          <button
            onClick={() => setViewMode('3D')}
            className={`backdrop-blur-xl border rounded-xl w-10 h-10 flex items-center justify-center font-bold text-sm transition-all ${
              viewMode === '3D'
                ? 'bg-white/20 border-white/30 text-white'
                : 'bg-black/60 border-white/10 text-gray-400 hover:text-white'
            }`}
          >3D</button>
          <button className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z"/></svg>
          </button>
        </div>

        {/* Search */}
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-3 w-56">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Search Plot"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.length >= 1) onSelectPlotByNumber(e.target.value);
              }}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 pl-8 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2">
          <button className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2 text-xs text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors">
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
            Gallery
          </button>
          <button className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2 text-xs text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors">
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7"/></svg>
            Info
          </button>
          <button className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2 text-xs text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors">
            <Compass size={12} />
            Locate
          </button>
        </div>
      </motion.div>

      {/* Top-Right: Status indicator */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-5 right-5 pointer-events-auto"
      >
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-3">
          <div className="w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-md flex items-center justify-center">
            <svg width="12" height="12" fill="white" viewBox="0 0 16 16"><path d="M13.5 2L8 14 6 8 0 6z"/></svg>
          </div>
        </div>
      </motion.div>

      {/* Left: Filter panel (only show when no plot selected) */}
      {!selectedPlot && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute left-5 bottom-5 pointer-events-auto"
        >
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-3 w-48">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Filter Status</p>
            <div className="flex flex-col gap-1">
              {[
                { id: 'all', label: 'All Plots', dot: 'bg-white' },
                { id: 'available', label: 'Available', dot: 'bg-green-400' },
                { id: 'reserved', label: 'Reserved', dot: 'bg-amber-400' },
                { id: 'sold', label: 'Sold', dot: 'bg-red-400' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setFilterStatus(s.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                    filterStatus === s.id
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Selected Plot Detail Card */}
      <AnimatePresence>
        {selectedPlot && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute left-5 bottom-5 bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl w-72 pointer-events-auto overflow-hidden"
          >
            <div className={`p-4 border-b border-white/5 ${
              selectedPlot.status === 'available' ? 'bg-green-500/5' :
              selectedPlot.status === 'sold' ? 'bg-red-500/5' : 'bg-amber-500/5'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Plot Details</p>
                  <h2 className="text-2xl font-bold text-white">#{selectedPlot.number}</h2>
                </div>
                <button
                  onClick={onClearSelection}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X size={14} className="text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                <div className={`p-2 rounded-lg ${
                  selectedPlot.status === 'available' ? 'bg-green-500/15 text-green-400' :
                  selectedPlot.status === 'sold' ? 'bg-red-500/15 text-red-400' :
                  'bg-amber-500/15 text-amber-400'
                }`}>
                  <StatusIcon status={selectedPlot.status} className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Status</p>
                  <p className="text-sm font-semibold capitalize text-white">{selectedPlot.status}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-3 rounded-xl">
                  <Banknote className="text-emerald-400 mb-1" size={16} />
                  <p className="text-[10px] text-gray-500">Price</p>
                  <p className="text-sm font-bold text-white">₹{selectedPlot.price.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <Maximize className="text-emerald-400 mb-1" size={16} />
                  <p className="text-[10px] text-gray-500">Area</p>
                  <p className="text-sm font-bold text-white">{selectedPlot.area} sq.ft</p>
                </div>
              </div>

              {selectedPlot.status === 'available' && (
                <button className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl font-semibold text-sm text-white transition-all shadow-lg shadow-emerald-500/20">
                  Inquire Now
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
