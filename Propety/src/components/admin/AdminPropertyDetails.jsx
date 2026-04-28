import { MapPin, Bed, Bath, Layout, Square, Heart, Share2, MoreHorizontal, Edit2, Copy, ToggleLeft, Image as ImageIcon, FileText, Trash2, Phone, Mail, ChevronRight, Eye, MessageSquare, Calendar, Building2, Sparkles, Home, Wind, Timer } from 'lucide-react';
import { useState } from 'react';

const AdminPropertyDetails = ({ property, onBack, formatPrice }) => {
  const [activeTab, setActiveTab] = useState('Details');

  if (!property) return null;

  const tabs = ['Details', 'Amenities', 'Features', 'Location', 'Floor Plan', 'Documents'];

  // Performance stats (Real but 0 since we don't have tracking yet)
  const performance = [
    { label: 'Views', value: '0', icon: Eye, color: 'text-blue-600', bgColor: 'bg-blue-50/50', border: 'border-blue-50' },
    { label: 'Enquiries', value: '0', icon: MessageSquare, color: 'text-emerald-600', bgColor: 'bg-emerald-50/50', border: 'border-emerald-50' },
    { label: 'Bookings', value: '0', icon: Calendar, color: 'text-indigo-600', bgColor: 'bg-indigo-50/50', border: 'border-indigo-50' },
    { label: 'Favorites', value: '0', icon: Heart, color: 'text-pink-600', bgColor: 'bg-pink-50/50', border: 'border-pink-50' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Image & Tabs */}
        <div className="lg:col-span-2 space-y-8">
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
                     <span>{property.location}</span>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-3xl font-black text-blue-600">₹ {formatPrice(property.price)}</p>
               </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600"><Bed className="w-4 h-4" /></div>
                  <div><p className="text-xs font-black text-slate-900">{property.bedrooms || '0'}</p><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Beds</p></div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600"><Bath className="w-4 h-4" /></div>
                  <div><p className="text-xs font-black text-slate-900">{property.bathrooms || '0'}</p><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Washrooms</p></div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-amber-500"><Square className="w-4 h-4" /></div>
                  <div><p className="text-xs font-black text-slate-900">{property.area || '0'}</p><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sq Ft</p></div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-purple-600"><Building2 className="w-4 h-4" /></div>
                  <div><p className="text-xs font-black text-slate-900">{property.floor || 'G'}</p><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Floor</p></div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600"><Wind className="w-4 h-4" /></div>
                  <div><p className="text-xs font-black text-slate-900">{property.facing || 'N'}</p><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Facing</p></div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-pink-600"><Calendar className="w-4 h-4" /></div>
                  <div><p className="text-xs font-black text-slate-900">{property.builtYear || '-'}</p><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Year</p></div>
               </div>
            </div>
          </div>

          {/* Detailed Content Tabs */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
             <div className="px-8 border-b border-slate-50 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div className="flex gap-8">
                   {tabs.map(tab => (
                     <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        className={`py-6 text-sm font-black uppercase tracking-widest transition-all relative ${
                          activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                     >
                        {tab}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full shadow-[0_-4px_10px_rgba(37,99,235,0.3)]" />}
                     </button>
                   ))}
                </div>
             </div>
             <div className="p-8 space-y-8">
                {activeTab === 'Details' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                       {[
                         { label: 'Property ID', value: `#PROP${property._id?.slice(-4)}` },
                         { label: 'Status', value: property.status },
                         { label: 'Ready Status', value: property.readyStatus || 'Ready to Move' },
                         { label: 'Furnishing', value: property.furnishing || 'Unfurnished' },
                         { label: 'Facing', value: property.facing || 'None' },
                         { label: 'Floor', value: property.floor || 'None' },
                         { label: 'Built Year', value: property.builtYear || '-' },
                         { label: 'Area', value: `${property.area || '0'} Sq Ft` },
                       ].map((item, i) => (
                         <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                            <span className="text-sm font-black text-slate-700">{item.value}</span>
                         </div>
                       ))}
                    </div>
                    {property.premiumFeatures && (
                      <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-3">
                         <div className="flex items-center gap-2">
                           <Sparkles className="w-5 h-5 text-amber-500" />
                           <h4 className="text-lg font-black text-amber-900">Premium Features</h4>
                         </div>
                         <p className="text-amber-800 font-medium leading-relaxed">{property.premiumFeatures}</p>
                      </div>
                    )}
                    <div className="space-y-4">
                       <h4 className="text-lg font-black text-slate-900">Description</h4>
                       <p className="text-slate-500 leading-relaxed font-medium">{property.description}</p>
                    </div>
                  </>
                )}

                {activeTab === 'Location' && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-black text-slate-900">Map Location</h4>
                    <div className="bg-slate-50 rounded-[2.5rem] overflow-hidden aspect-video border border-slate-100 relative group">
                      {property.mapLink ? (
                        <div 
                          className="w-full h-full" 
                          dangerouslySetInnerHTML={{ __html: property.mapLink }} 
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                          <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center mb-6 animate-bounce">
                            <MapPin className="w-10 h-10 text-blue-600" />
                          </div>
                          <h5 className="text-xl font-black text-slate-900 mb-2">No Map Link Added</h5>
                          <p className="text-slate-500 font-medium max-w-xs">You haven't added a Google Maps embed code for this property yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab !== 'Details' && activeTab !== 'Location' && (
                  <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
                     <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4"><ImageIcon className="w-8 h-8 text-slate-300" /></div>
                     <p className="text-sm font-black uppercase tracking-widest text-slate-400">{activeTab} Info Coming Soon</p>
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
              <div className="space-y-4">
                 {[
                   { label: 'Property ID', value: `#PROP${property._id?.slice(-4)}` },
                   { label: 'Ready Status', value: property.readyStatus || 'Ready', color: 'text-emerald-600 bg-emerald-50' },
                   { label: 'Category', value: property.propertyType },
                   { label: 'Location', value: property.location.split(',')[0] },
                   { label: 'Added By', value: 'Admin', isAgent: true },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                      {item.isAgent ? (
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">A</div>
                           <span className="text-sm font-black text-slate-900">{item.value}</span>
                        </div>
                      ) : (
                        <span className={`text-sm font-black ${item.color || 'text-slate-700'} ${item.color ? 'px-2 py-0.5 rounded-md text-[10px] uppercase tracking-widest' : ''}`}>{item.value}</span>
                      )}
                   </div>
                 ))}
              </div>
           </div>

           {/* Quick Actions Card */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                 <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100">
                    <Edit2 className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
                 </button>
                 <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100">
                    <Copy className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Duplicate</span>
                 </button>
                 <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-all border border-transparent hover:border-red-100">
                    <Trash2 className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Delete</span>
                 </button>
              </div>
           </div>

           {/* Performance Card */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900">Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                 {performance.map((item, i) => (
                   <div key={i} className={`p-4 rounded-2xl ${item.bgColor} border ${item.border}`}>
                      <div className={`flex items-center gap-2 ${item.color} mb-2`}>
                         <item.icon className="w-4 h-4" /> 
                         <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                      </div>
                      <p className="text-xl font-black text-slate-900">{item.value}</p>
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
