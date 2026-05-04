import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../api';
import { MapPin, Bed, Bath, Square, Heart, Share2, Star, ShieldCheck, ArrowUpRight, Eye, TrendingUp, Camera, Clock } from 'lucide-react';

const PropertyCard = ({
  image,
  price,
  title,
  location,
  beds,
  baths,
  area,
  type,
  rating,
  verified,
  trending,
  images = [],
  onViewDetails,
  onSave,
  id,
  adminStatus,
  city,
  isLiked
}) => {
  const navigate = useNavigate();
  const [wished, setWished] = React.useState(isLiked || false);
  const [shared, setShared] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isHovering, setIsHovering] = React.useState(false);

  // Sync wished state with isLiked prop
  React.useEffect(() => {
    setWished(isLiked);
  }, [isLiked]);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/users/wishlist/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        }
      });
      if (response.ok) {
        setWished(!wished);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShared(true);
    setTimeout(() => setShared(false), 1500);
  };

  const typeConfig = {
    'For Sale': {
      color: 'from-blue-600 to-blue-500',
      bg: 'bg-blue-600',
      icon: <Eye className="w-3.5 h-3.5" />,
      label: 'FOR SALE',
      pill: 'rounded-lg'
    },
    'New Launch': {
      color: 'from-violet-600 to-violet-500',
      bg: 'bg-violet-600',
      icon: null,
      label: 'NEW LAUNCH',
      pill: 'rounded-full'
    },
    'Premium': {
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-500',
      icon: <Star className="w-3.5 h-3.5 fill-current" />,
      label: 'PREMIUM',
      pill: 'rounded-full'
    },
  };
  const config = typeConfig[type] || typeConfig['Premium'];

  const formatPrice = (price) => {
    if (!price) return '1.2 Cr';
    const numPrice = parseFloat(price);
    if (numPrice >= 10000000) return `${(numPrice / 10000000).toFixed(1)} Cr`;
    if (numPrice >= 100000) return `${(numPrice / 100000).toFixed(1)} Lac`;
    return price.toString();
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const displayImage = images.length > 0 ? images[currentImageIndex] : (image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800');

  return (
    <div
      onClick={() => navigate(`/property/${id}`)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {trending && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-lg">
          <TrendingUp className="w-3 h-3" />
          <span>HOT</span>
        </div>
      )}

      <div className="relative h-56 overflow-hidden block">
        <img
          src={displayImage}
          alt={title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800';
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-x-3 top-3 flex justify-between items-start z-10">
          <div className={`flex items-center gap-1 px-2.5 py-1 text-[9px] font-black tracking-wider text-white shadow-md bg-gradient-to-r ${config.color} ${config.pill}`}>
            {config.icon}
            <span>{config.label}</span>
          </div>

          {adminStatus === 'Pending' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-black tracking-widest text-amber-600 shadow-xl border border-amber-100">
              <Clock className="w-3.5 h-3.5" />
              <span>PENDING REVIEW</span>
            </div>
          )}

          <div className="flex gap-1.5">
            <button
              onClick={handleWishlist}
              className={`p-1.5 rounded-full border transition-all duration-300 ${wished
                ? 'bg-red-500 border-red-500 text-white'
                : 'bg-white border-gray-100 text-gray-500 hover:text-red-500 shadow-sm'
                }`}
            >
              <Heart className="w-3.5 h-3.5" fill={wished ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full border bg-white border-gray-100 text-gray-500 hover:text-blue-600 transition-all duration-300 shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 flex items-end justify-between">
          <div>
            <p className="text-white/70 text-[9px] font-medium uppercase tracking-tight mb-0">Starting from</p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-white text-lg font-bold tracking-tight">₹{price}</span>
            </div>
          </div>
          {rating && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-black/30 backdrop-blur-md rounded-full border border-white/10">
              <Star className="w-3 h-3 text-amber-400 fill-current" />
              <span className="text-white text-[10px] font-bold">{rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section - compact */}
      <div className="flex flex-col p-3 bg-white flex-grow">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1 text-blue-600 font-bold text-[9px] uppercase tracking-wider">
            <MapPin className="w-3 h-3" />
            <span>{location ? (city ? `${location}, ${city}` : location) : (city || '')}</span>
          </div>
          {verified && (
            <div className="bg-emerald-50 p-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
            </div>
          )}
        </div>

        <h3 className="text-base font-extrabold text-gray-900 leading-tight mb-2 line-clamp-1">
          {title || 'Luxury 4BHK Villa'}
        </h3>

        <div className="grid grid-cols-3 gap-2 mb-3 pb-2 border-b border-gray-50">
          {[
            { Icon: Bed, value: beds || '4', label: 'Beds' },
            { Icon: Bath, value: baths || '4', label: 'Baths' },
            { Icon: Square, value: area || '3800', label: 'Sqft' },
          ].map(({ Icon, value, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <Icon className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900">{value}</span>
                <span className="text-[9px] text-gray-400 font-medium">{label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-400 font-medium">Price</span>
            <span className="text-md font-bold text-gray-900">₹{price}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 group-hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition-all duration-300 shadow-md shadow-blue-200">
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl" />
      </div>
    </div>
  );
};

export default PropertyCard;