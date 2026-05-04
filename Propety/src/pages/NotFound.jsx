import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar isSolid={true} />
      
      <div className="flex-1 flex items-center justify-center p-4 pt-24 pb-16">
        <div className="max-w-2xl w-full text-center">
          {/* Animated 404 Background */}
          <div className="relative mb-8">
            <h1 className="text-[150px] md:text-[220px] font-black text-slate-200 select-none leading-none tracking-tighter">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass px-8 py-4 rounded-2xl shadow-xl border border-white/20 animate-float">
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  Oops! Page not found
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-heading">
              Lost in the Neighborhood?
            </h2>
            <p className="text-lg text-slate-600 max-w-md mx-auto">
              The property or page you're looking for doesn't exist or has been moved to a new location.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-1 active:scale-95"
              >
                <Home size={20} />
                Back to Home
              </Link>
              <button 
                onClick={() => window.history.back()}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3 rounded-full font-semibold transition-all shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-95"
              >
                <ArrowLeft size={20} />
                Go Back
              </button>
            </div>
          </div>

          {/* Subtle decorative elements */}
          <div className="mt-16 flex justify-center gap-4 opacity-20">
            <div className="w-12 h-1.5 bg-slate-400 rounded-full"></div>
            <div className="w-24 h-1.5 bg-slate-400 rounded-full"></div>
            <div className="w-12 h-1.5 bg-slate-400 rounded-full"></div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
