import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BASE_URL } from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Phone, Mail, MapPin, Building2, Star, ShieldCheck, ExternalLink, Calendar, Loader2, CheckCircle } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';

const AgentProfile = () => {
  const { username } = useParams();
  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  useEffect(() => {
    fetchAgentDetails();
    window.scrollTo(0, 0);
  }, [username]);

  useEffect(() => {
    if (agent && agent._id) {
      fetchAgentProperties(agent._id);
    }
  }, [agent]);

  const fetchAgentDetails = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/public/agent/${username}`);
      if (!res.ok) throw new Error('Agent not found');
      const data = await res.json();
      setAgent(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentProperties = async (agentId) => {
    try {
      const res = await fetch(`${BASE_URL}/properties?postedBy=${agentId}&pageSize=50`);
      const data = await res.json();
      const propertiesList = data.properties || [];
      const formattedData = propertiesList
        .filter(p => p.adminStatus === 'Published')
        .map(p => ({
          id: p._id,
          title: p.title,
          price: p.price ? (p.price >= 1e7 ? (p.price / 1e7).toFixed(2) + ' Cr' : p.price >= 1e5 ? (p.price / 1e5).toFixed(2) + ' L' : p.price.toLocaleString('en-IN')) : 'Price on Request',
          location: p.location,
          beds: p.bedrooms?.toString() || '0',
          baths: p.bathrooms?.toString() || '0',
          area: p.area?.toString() || '0',
          type: p.status || p.propertyType,
          rating: "4.8",
          verified: p.isVerified,
          city: p.city,
          adminStatus: p.adminStatus,
          image: p.images[0],
          images: p.images
        }));
      setProperties(formattedData);
    } catch (error) {
      console.error(error);
    } finally {
      setPropertiesLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Agent Not Found</h2>
        <p className="text-slate-500 mb-6">The agent profile you are looking for does not exist.</p>
        <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">Back to Home</Link>
      </div>
    );
  }

  const joinYear = new Date(agent.createdAt).getFullYear();

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar isSolid={true} />
      
      {/* Agent Hero Section */}
      <div className="bg-[#0F172A] pt-32 pb-24 relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] -ml-48 -mb-48" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-10">
            {/* Premium Avatar */}
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-[2.5rem] p-1.5 bg-gradient-to-tr from-blue-600 via-cyan-400 to-indigo-600 shadow-2xl shadow-blue-500/30 flex-shrink-0 group">
              <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden relative">
                {agent.avatar ? (
                  <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-6xl font-black text-slate-300">
                    {agent.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {/* Verification Badge Overlap */}
                <div className="absolute bottom-3 right-3 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 text-center lg:text-left text-white pb-4 w-full">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 text-xs font-black uppercase tracking-[0.2em] mb-4 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> Premium Agent
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">{agent.name}</h1>
              <p className="text-slate-400 font-medium text-lg md:text-xl mb-8 max-w-2xl mx-auto lg:mx-0">
                Specialized real estate consultant helping you discover and secure the perfect property with complete transparency.
              </p>
              
              {/* Premium Stats Strip */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Member Since</p>
                    <p className="font-black text-white">{joinYear}</p>
                  </div>
                </div>

                {agent.experience && (
                  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Experience</p>
                      <p className="font-black text-white">{agent.experience}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Listings</p>
                    <p className="font-black text-white">{properties.length}</p>
                  </div>
                </div>

                {agent.propertiesSold > 0 && (
                  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Properties Sold</p>
                      <p className="font-black text-white">{agent.propertiesSold}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full lg:w-auto pb-4 pt-6 lg:pt-0">
              <a href={`tel:${agent.phone || ''}`} className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-white text-slate-900 font-black text-sm flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Phone className="w-5 h-5 text-blue-600" /> {agent.phone || 'Contact Agent'}
              </a>
              <a href={`mailto:${agent.email || ''}`} className="px-8 py-4 rounded-2xl bg-white/10 text-white font-black text-sm flex items-center justify-center gap-3 hover:bg-white/20 transition-all border border-white/10 backdrop-blur-sm hover:scale-105">
                <Mail className="w-5 h-5" /> Send Email
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Property Portfolio</h2>
              <p className="text-slate-500 font-bold mt-2">Explore all listings managed by {agent.name.split(' ')[0]}</p>
            </div>
            <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 font-black text-blue-600 text-sm">
              {properties.length} Properties
            </div>
          </div>

          {propertiesLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">Loading Portfolio...</p>
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map(property => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-100 shadow-sm">
              <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-slate-900 mb-2">No Active Listings</h3>
              <p className="text-slate-500 font-medium">This agent currently doesn't have any published properties on the platform.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AgentProfile;
