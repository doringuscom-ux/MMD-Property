import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheck, Building2, ChevronRight, Loader2, Search } from 'lucide-react';

const AgentsDirectory = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAgents();
    window.scrollTo(0, 0);
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/public/agents`);
      if (!res.ok) throw new Error('Failed to load agents');
      const data = await res.json();
      setAgents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar isSolid={true} />
      
      {/* Header */}
      <div className="bg-[#0F172A] pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl -mr-64 -mt-64" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">Find an Expert Agent</h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10">
            Connect with our top-rated real estate professionals who can help you find your dream property.
          </p>
          
          <div className="max-w-xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search agents by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-400 text-lg font-bold outline-none focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 transition-all shadow-2xl backdrop-blur-md"
            />
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="flex-1 py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="font-bold text-slate-500 uppercase tracking-widest text-sm">Loading Agents...</p>
            </div>
          ) : filteredAgents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAgents.map(agent => (
                <Link to={`/agent/${agent.username || agent._id}`} key={agent._id} className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-300 group flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full mb-6 p-1.5 bg-gradient-to-tr from-blue-600 to-emerald-400 relative">
                    <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                      {agent.avatar ? (
                        <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl font-black text-slate-300">{agent.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="absolute bottom-1 right-1 w-8 h-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg text-white" title="Verified Agent">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{agent.name}</h3>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Verified Real Estate Agent</p>
                  
                  <div className={`w-full grid ${agent.propertiesSold > 0 ? 'grid-cols-3' : 'grid-cols-2'} gap-4 mb-8`}>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center">
                      <p className="text-xl md:text-2xl font-black text-slate-900 leading-none mb-1">{agent.propertyCount || 0}</p>
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight">Active</p>
                    </div>
                    {agent.propertiesSold > 0 && (
                      <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex flex-col justify-center">
                        <p className="text-xl md:text-2xl font-black text-purple-700 leading-none mb-1">{agent.propertiesSold}</p>
                        <p className="text-[9px] md:text-[10px] font-bold text-purple-600 uppercase tracking-wider leading-tight">Sold</p>
                      </div>
                    )}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center">
                      <p className="text-xl md:text-2xl font-black text-slate-900 leading-none mb-1">{new Date().getFullYear() - new Date(agent.createdAt).getFullYear() + 1}</p>
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight">Yrs Exp.</p>
                    </div>
                  </div>
                  
                  <div className="w-full px-6 py-4 rounded-2xl bg-blue-50 text-blue-600 font-black text-sm flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    View Profile <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-slate-100 max-w-2xl mx-auto">
              <UserCircle className="w-20 h-20 text-slate-200 mx-auto mb-6" />
              <h3 className="text-3xl font-black text-slate-900 mb-3">No Agents Found</h3>
              <p className="text-slate-500 font-medium">We couldn't find any agents matching your search.</p>
              <button onClick={() => setSearchTerm('')} className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all">
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AgentsDirectory;
