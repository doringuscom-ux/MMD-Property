import { MapPin, Bed, Bath, Layout, Square, Heart, Share2, MoreHorizontal, Edit2, Copy, ToggleLeft, Image as ImageIcon, FileText, Trash2, Phone, Mail, ChevronRight, Eye, MessageSquare, Calendar, Building2, Sparkles, Home, Wind, Timer } from 'lucide-react';
import { useState } from 'react';

const AdminPropertyDetails = ({ property, onBack, formatPrice, onEdit, onDelete }) => {
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [locationRequested, setLocationRequested] = useState(false);

  if (!property) return null;

  // Calculate Days Active
  const calculateDaysActive = (createdAt) => {
    if (!createdAt) return '0';
    const diffTime = Math.abs(new Date() - new Date(createdAt));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays.toString();
  };

  // Performance stats (Real Data)
  const performance = [
    { label: 'Views', value: (property.views || 0).toString(), icon: Eye, colorHex: '#2563eb' },
    { label: 'Enquiries', value: (property.enquiryCount || 0).toString(), icon: MessageSquare, colorHex: '#10b981' },
    { label: 'Days Active', value: calculateDaysActive(property.createdAt), icon: Calendar, colorHex: '#6366f1' },
    { label: 'Favorites', value: (property.favoriteCount || 0).toString(), icon: Heart, colorHex: '#ec4899' },
  ];

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header / Breadcrumbs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold">
           <button onClick={onBack} className="text-slate-400 hover:text-blue-600 transition-colors">Properties</button>
           <ChevronRight className="w-4 h-4 text-slate-300" />
           <span className="text-slate-900">Property Details</span>
        </div>
        <div className="flex items-center gap-3">
           <button className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-blue-600 shadow-sm transition-all"><Share2 className="w-4 h-4" /></button>
           <button className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-pink-600 shadow-sm transition-all"><Heart className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Image & Tabs */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            {/* Main Image */}
            <div className="relative aspect-video rounded-3xl overflow-hidden group">
               <img src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute top-6 left-6 flex gap-2">
                  <span className={`px-4 py-1.5 rounded-lg text-white text-[10px] font-black uppercase tracking-widest shadow-lg ${property.adminStatus === 'Published' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                    {property.adminStatus || 'Published'}
                  </span>
                  <span className={`px-4 py-1.5 rounded-lg text-white text-[10px] font-black uppercase tracking-widest shadow-lg ${property.readyStatus === 'Ready to Move' ? 'bg-emerald-600' : 'bg-amber-500'}`}>
                    {property.readyStatus || 'Ready to Move'}
                  </span>
               </div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-5 gap-4">
               {property.images?.slice(0, 5).map((img, i) => (
                 <div key={i} className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group">
                    <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    {i === 4 && property.images.length > 5 && (
                      <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white font-black text-lg">
                        +{property.images.length - 5}
                      </div>
                    )}
                 </div>
               ))}
            </div>

            {/* Title & Price */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-4">
               <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">{property.propertyType}</span>
                    <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest">{property.furnishing}</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">{property.title}</h2>
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                     <MapPin className="w-4 h-4 text-blue-500" />
                     <span>{property.location ? (property.city ? `${property.location}, ${property.city}` : property.location) : (property.city || '')}</span>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-3xl font-black text-blue-600">₹ {formatPrice(property.price)}</p>
               </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
               <div className="flex items-center gap-3 p-3 rounded-2xl border bg-[#2563eb0A] border-[#2563eb20] hover:-translate-y-0.5 transition-transform cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 shrink-0"><Bed className="w-5 h-5" /></div>
                  <div className="overflow-hidden"><p className="text-sm font-black text-blue-900 truncate">{property.bedrooms || '0'}</p><p className="text-[9px] font-bold text-blue-600/70 uppercase tracking-widest truncate">Beds</p></div>
               </div>
               <div className="flex items-center gap-3 p-3 rounded-2xl border bg-[#10b9810A] border-[#10b98120] hover:-translate-y-0.5 transition-transform cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600 shrink-0"><Bath className="w-5 h-5" /></div>
                  <div className="overflow-hidden"><p className="text-sm font-black text-emerald-900 truncate">{property.bathrooms || '0'}</p><p className="text-[9px] font-bold text-emerald-600/70 uppercase tracking-widest truncate">Washrooms</p></div>
               </div>
               <div className="flex items-center gap-3 p-3 rounded-2xl border bg-[#fbbf240A] border-[#fbbf2420] hover:-translate-y-0.5 transition-transform cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-amber-500 shrink-0"><Square className="w-5 h-5" /></div>
                  <div className="overflow-hidden"><p className="text-sm font-black text-amber-900 truncate">{property.area || '0'}</p><p className="text-[9px] font-bold text-amber-600/70 uppercase tracking-widest truncate">Sq Ft</p></div>
               </div>
               <div className="flex items-center gap-3 p-3 rounded-2xl border bg-[#8b5cf60A] border-[#8b5cf620] hover:-translate-y-0.5 transition-transform cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-purple-600 shrink-0"><Building2 className="w-5 h-5" /></div>
                  <div className="overflow-hidden"><p className="text-sm font-black text-purple-900 truncate">{property.floor || 'G'}</p><p className="text-[9px] font-bold text-purple-600/70 uppercase tracking-widest truncate">Floor</p></div>
               </div>
               <div className="flex items-center gap-3 p-3 rounded-2xl border bg-[#6366f10A] border-[#6366f120] hover:-translate-y-0.5 transition-transform cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600 shrink-0"><Wind className="w-5 h-5" /></div>
                  <div className="overflow-hidden"><p className="text-sm font-black text-indigo-900 truncate">{property.facing || 'N'}</p><p className="text-[9px] font-bold text-indigo-600/70 uppercase tracking-widest truncate">Facing</p></div>
               </div>
               <div className="flex items-center gap-3 p-3 rounded-2xl border bg-[#ec48990A] border-[#ec489920] hover:-translate-y-0.5 transition-transform cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-pink-600 shrink-0"><Calendar className="w-5 h-5" /></div>
                  <div className="overflow-hidden"><p className="text-sm font-black text-pink-900 truncate">{property.builtYear || '-'}</p><p className="text-[9px] font-bold text-pink-600/70 uppercase tracking-widest truncate">Year</p></div>
               </div>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                       {[
                         { label: 'Property ID', value: `#${property.propertyId || property._id?.slice(-4)}` },
                         { label: 'Status', value: property.status },
                         { label: 'Ready Status', value: property.readyStatus || 'Ready to Move' },
                         { label: 'Furnishing', value: property.furnishing || 'Unfurnished' },
                         { label: 'Facing', value: property.facing || 'None' },
                         { label: 'Floor', value: property.floor || 'None' },
                         { label: 'Built Year', value: property.builtYear || '-' },
                         { label: 'Area', value: `${property.area || '0'} Sq Ft` },
                         { label: 'Map Link', value: property.mapLink ? (
                           <a href={property.mapLink.match(/src="([^"]+)"/)?.[1] || property.mapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Open Map</a>
                         ) : (
                           <button 
                             onClick={async () => {
                               if (!property.postedBy) {
                                 alert('This property has no owner to request from.');
                                 return;
                               }
                               setIsRequestingLocation(true);
                               try {
                                 const res = await fetch(`http://localhost:5000/api/properties/${property._id}/request-location`, {
                                   method: 'POST',
                                   headers: {
                                     Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}`
                                   }
                                 });
                                 if (res.ok) {
                                   setLocationRequested(true);
                                 } else {
                                   alert('Failed to send request');
                                 }
                               } catch (err) {
                                 alert('Error sending request');
                               } finally {
                                 setIsRequestingLocation(false);
                               }
                             }}
                             disabled={isRequestingLocation || locationRequested}
                             className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-widest text-white transition-all shadow-sm ${
                               locationRequested 
                                 ? 'bg-emerald-500 hover:bg-emerald-600' 
                                 : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'
                             } disabled:opacity-70 disabled:cursor-not-allowed`}
                           >
                             {isRequestingLocation ? 'Requesting...' : locationRequested ? 'Requested ✓' : 'Request Location'}
                           </button>
                         ) },
                       ].map((item, i) => (
                         <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                            <span className="text-sm font-black text-slate-700">{item.value}</span>
                         </div>
                       ))}
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-lg font-black text-slate-900">Description</h4>
                       <p className="text-slate-500 leading-relaxed font-medium">{property.description}</p>
                    </div>

                    {property.premiumFeatures && (
                      <div className="space-y-4 pt-4 border-t border-slate-50">
                        <h4 className="text-lg font-black text-slate-900">Features</h4>
                        <div className="flex flex-wrap gap-2.5 pt-2 animate-fade-in">
                           {property.premiumFeatures.split(',').map((feature, i) => (
                             <span key={i} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-[13px] font-bold tracking-wide">
                               {feature.trim()}
                             </span>
                           ))}
                        </div>
                      </div>
                    )}
             </div>
          </div>
        </div>

         {/* Right Column - Sidebar Widgets */}
         <div className="space-y-8">
            {/* Property Overview Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
               <h3 className="text-lg font-black text-slate-900">Property Overview</h3>
               <div className="space-y-3">
                  {[
                    { label: 'Property ID', value: `#${property.propertyId || property._id?.slice(-4)}` },
                    { label: 'Ready Status', value: property.readyStatus || 'Ready', isBadge: true, colorHex: '#10b981' },
                    { label: 'Category', value: property.propertyType, isBadge: true, colorHex: '#8b5cf6' },
                    { label: 'Location', value: property.location?.split(',')[0] || 'N/A' },
                    { label: 'Added By', value: property.postedBy?.name || 'Admin', isAgent: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all cursor-default">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">{item.label}</span>
                       {item.isAgent ? (
                         <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl shadow-sm border border-slate-100">
                            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold">
                               {item.value.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-[11px] font-black text-slate-700">{item.value}</span>
                         </div>
                       ) : item.isBadge ? (
                         <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm" style={{ backgroundColor: item.colorHex + '15', color: item.colorHex, border: `1px solid ${item.colorHex}30` }}>{item.value}</span>
                       ) : (
                         <span className="text-[11px] font-black text-slate-700 truncate text-right">{item.value}</span>
                       )}
                    </div>
                  ))}
               </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
               <h3 className="text-lg font-black text-slate-900">Quick Actions</h3>
               <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => onEdit(property)} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-[#2563eb0A] hover:bg-[#2563eb15] border border-[#2563eb20] text-blue-600 transition-all hover:-translate-y-0.5">
                     <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"><Edit2 className="w-4 h-4" /></div>
                     <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
                  </button>
                  <button className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-[#10b9810A] hover:bg-[#10b98115] border border-[#10b98120] text-emerald-600 transition-all hover:-translate-y-0.5">
                     <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"><Copy className="w-4 h-4" /></div>
                     <span className="text-[10px] font-black uppercase tracking-widest">Duplicate</span>
                  </button>
                  <button onClick={() => onDelete(property._id)} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-[#ef44440A] hover:bg-[#ef444415] border border-[#ef444420] text-red-600 transition-all hover:-translate-y-0.5 col-span-2">
                     <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"><Trash2 className="w-4 h-4" /></div>
                     <span className="text-[10px] font-black uppercase tracking-widest">Delete Property</span>
                  </button>
               </div>
            </div>

            {/* Performance Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
               <h3 className="text-lg font-black text-slate-900">Performance</h3>
               <div className="grid grid-cols-2 gap-3">
                  {performance.map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl border flex flex-col items-center justify-center text-center hover:-translate-y-0.5 transition-transform cursor-default" style={{ backgroundColor: item.colorHex + '08', borderColor: item.colorHex + '15' }}>
                       <div className="flex items-center gap-1.5 mb-2" style={{ color: item.colorHex }}>
                          <item.icon className="w-3.5 h-3.5" /> 
                          <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                       </div>
                       <p className="text-3xl font-black" style={{ color: item.colorHex }}>{item.value}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminPropertyDetails;
