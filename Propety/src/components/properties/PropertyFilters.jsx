import { X, Search } from 'lucide-react';

const PropertyFilters = ({
  showFilters,
  setShowFilters,
  sortBy,
  setSortBy,
  searchLocality,
  setSearchLocality,
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  selectedBeds,
  setSelectedBeds,
  handleApplyFilters,
  clearFilters,
  appliedMinPrice,
  appliedMaxPrice,
  formatPriceLabel,
  availableCategories = ['All'],
  availableTypes = ['All']
}) => {
  return (
    <aside className={`fixed inset-0 z-[110] lg:relative lg:inset-auto transition-all duration-300 ${showFilters ? 'visible' : 'invisible lg:visible'}`}>
      <div
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${showFilters ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setShowFilters(false)}
      />

      <div className={`absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white lg:relative lg:w-80 lg:h-auto lg:bg-transparent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="h-full overflow-y-auto lg:h-auto bg-white lg:rounded-3xl border-r lg:border border-slate-100 lg:shadow-xl lg:shadow-slate-200/50">
          <div className="sticky top-0 z-10 flex items-center justify-between lg:hidden p-6 bg-white border-b border-slate-50">
            <h3 className="text-xl font-black text-slate-900">Filters</h3>
            <button onClick={() => setShowFilters(false)} className="p-3 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 space-y-8">
            <div className="min-[543px]:hidden">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-medium outline-none appearance-none cursor-pointer"
              >
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Search Locality</h4>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchLocality}
                  onChange={(e) => setSearchLocality(e.target.value)}
                  placeholder="e.g. Sector 20"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-medium focus:ring-2 ring-blue-500/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Category</h4>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' : 'border-slate-100 text-slate-600 hover:border-blue-600 hover:text-blue-600'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Property Type</h4>
              <div className="grid grid-cols-2 gap-3">
                {availableTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all text-left ${selectedType === type ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' : 'border-slate-100 text-slate-600 hover:border-blue-600 hover:text-blue-600'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Price Range</h4>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-wider">Min Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 100000))}
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-xs outline-none focus:border-blue-600 transition-all"
                    />
                  </div>
                  <div className="text-[10px] font-bold text-slate-900">{formatPriceLabel(minPrice)}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-wider">Max Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 100000))}
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-xs outline-none focus:border-blue-600 transition-all"
                    />
                  </div>
                  <div className="text-[10px] font-bold text-slate-900">{formatPriceLabel(maxPrice)}</div>
                </div>
              </div>

              <div className="space-y-6">
                <input
                  type="range"
                  min="0"
                  max="100000000"
                  step="100000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 100000))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  type="range"
                  min="0"
                  max="100000000"
                  step="100000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 100000))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Bedrooms</h4>
              <div className="grid grid-cols-5 gap-2">
                {['Any', '1', '2', '3', '4', '5'].map(num => (
                  <button
                    key={num}
                    onClick={() => setSelectedBeds(num)}
                    className={`aspect-square flex items-center justify-center rounded-xl border text-xs font-bold transition-all ${selectedBeds === num ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' : 'border-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleApplyFilters}
              className={`w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 ${minPrice === appliedMinPrice && maxPrice === appliedMaxPrice ? 'lg:hidden' : ''}`}
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="w-full text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-red-500 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PropertyFilters;
