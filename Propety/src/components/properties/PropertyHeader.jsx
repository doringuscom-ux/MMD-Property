import { Search, LayoutGrid, List, SlidersHorizontal, ChevronDown } from 'lucide-react';

const PropertyHeader = ({ 
  count, 
  viewMode, 
  setViewMode, 
  sortBy, 
  setSortBy, 
  setShowFilters 
}) => {
  return (
    <div className="bg-white border-b border-slate-100 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-center flex-wrap justify-between gap-4 md:gap-6">
          <div>
            <h1 className="text-xl min-[390px]:text-2xl min-[576px]:text-3xl md:text-4xl font-black text-slate-900 mb-1 min-[390px]:mb-2 tracking-tight">Explore Properties</h1>
            <p className="text-[10px] min-[390px]:text-xs min-[576px]:text-sm md:text-base text-slate-500 font-medium">Showing {count} verified properties in Tri-City</p>
          </div>

          <div className="flex items-center gap-2 min-[769px]:gap-4">
            <div className="hidden min-[674px]:flex items-center bg-slate-100 rounded-2xl p-0.5 min-[769px]:p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 min-[769px]:p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <LayoutGrid className="w-4 h-4 min-[769px]:w-5 min-[769px]:h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 min-[769px]:p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <List className="w-4 h-4 min-[769px]:w-5 min-[769px]:h-5" />
              </button>
            </div>

            <div className="hidden min-[543px]:block relative group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-9 py-2.5 rounded-xl bg-white border border-slate-200 text-xs min-[769px]:text-sm font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowFilters(true)}
              className="flex lg:hidden items-center gap-2 px-5 py-3 rounded-xl min-[769px]:rounded-2xl bg-blue-600 text-white font-bold text-xs min-[769px]:text-sm shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;
