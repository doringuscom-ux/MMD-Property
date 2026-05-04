import { Search, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import PropertyCard from '../PropertyCard';

const PropertyGrid = ({
  loading,
  properties,
  viewMode,
  pages,
  page,
  setPage,
  clearFilters
}) => {
  if (loading && properties.length === 0) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[400px] py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      {loading && properties.length > 0 && (
        <div className="absolute inset-0 z-20 bg-slate-50/40 backdrop-blur-[1px] flex justify-center items-center pointer-events-none">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 border-t-transparent"></div>
        </div>
      )}

      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 gap-8' : 'grid-cols-1 gap-6'}`}>
        {properties.length > 0 ? (
          properties.map((property, i) => (
            <div key={i} className={viewMode === 'list' ? 'lg:flex lg:bg-white lg:rounded-3xl lg:overflow-hidden lg:border lg:border-slate-100 lg:shadow-xl lg:shadow-slate-200/50' : ''}>
              <div className={viewMode === 'list' ? 'lg:w-1/3' : ''}>
                <PropertyCard {...property} />
              </div>
              {viewMode === 'list' && (
                <div className="hidden lg:flex flex-col flex-1 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">{property.type}</span>
                    <div className="flex items-center gap-1 text-amber-500 font-black">{property.rating}★</div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{property.title}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-6">
                    <MapPin className="w-4 h-4 text-blue-500" /> {property.location ? (property.city ? `${property.location}, ${property.city}` : property.location) : (property.city || '')}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-auto">
                    Experience premium living in this meticulously designed {property.title} located in the heart of {property.location || property.city}. Features high-end finishes and modern amenities.
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="text-3xl font-black text-blue-600">₹{property.price}</div>
                    <button className="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all">View Details</button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 text-slate-400 mb-6">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No Properties Found</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">We couldn't find any properties matching your current filters. Try adjusting your search or clear all filters.</p>
            <button
              onClick={clearFilters}
              className="px-8 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`p-3 rounded-2xl border transition-all ${page === 1 ? 'border-slate-100 text-slate-200 cursor-not-allowed' : 'border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600 bg-white shadow-sm hover:shadow-md'}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {[...Array(pages).keys()].map((x) => (
            <button
              key={x + 1}
              onClick={() => setPage(x + 1)}
              className={`w-12 h-12 rounded-2xl font-black text-sm transition-all duration-300 ${page === x + 1
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 scale-110'
                : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-600 hover:text-blue-600 shadow-sm'
                }`}
            >
              {x + 1}
            </button>
          ))}

          <button
            onClick={() => setPage(prev => Math.min(prev + 1, pages))}
            disabled={page === pages}
            className={`p-3 rounded-2xl border transition-all ${page === pages ? 'border-slate-100 text-slate-200 cursor-not-allowed' : 'border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600 bg-white shadow-sm hover:shadow-md'}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyGrid;
