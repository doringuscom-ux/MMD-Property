import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BASE_URL } from '../api';

// Property Components
import PropertyHeader from '../components/properties/PropertyHeader';
import PropertyFilters from '../components/properties/PropertyFilters';
import PropertyGrid from '../components/properties/PropertyGrid';

const Properties = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('Newest First');
  const [searchLocality, setSearchLocality] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000000); // 10 Cr
  const [appliedMinPrice, setAppliedMinPrice] = useState(0);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(100000000);
  const [selectedBeds, setSelectedBeds] = useState('Any');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [availableCategories, setAvailableCategories] = useState(['All']);
  const [availableTypes, setAvailableTypes] = useState(['All']);
  const [wishlist, setWishlist] = useState([]);
  const location = useLocation();

  // Sync URL params with filters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    const category = params.get('category');
    const type = params.get('type');
    const budget = params.get('budget');

    if (search) {
      setSearchLocality(search);
      setDebouncedSearch(search);
      // Auto-select city if search matches a city name
      const cities = ['Panchkula', 'Mohali', 'Chandigarh', 'Zirakpur', 'Derabassi', 'Lalru', 'Kharar', 'New Chandigarh'];
      const matchedCity = cities.find(c => c.toLowerCase() === search.toLowerCase());
      if (matchedCity) setSelectedCity(matchedCity);
    }
    if (category) setSelectedCategory(category);
    if (type) setSelectedType(type);
    
    if (budget) {
      if (budget === 'Under 50L') {
        setAppliedMinPrice(0);
        setAppliedMaxPrice(5000000);
        setMinPrice(0);
        setMaxPrice(5000000);
      } else if (budget === '50L – 1Cr') {
        setAppliedMinPrice(5000000);
        setAppliedMaxPrice(10000000);
        setMinPrice(5000000);
        setMaxPrice(10000000);
      } else if (budget === '1Cr – 2Cr') {
        setAppliedMinPrice(10000000);
        setAppliedMaxPrice(20000000);
        setMinPrice(10000000);
        setMaxPrice(20000000);
      } else if (budget === '2Cr+') {
        setAppliedMinPrice(20000000);
        setAppliedMaxPrice(100000000);
        setMinPrice(20000000);
        setMaxPrice(100000000);
      }
    }
  }, [location.search]);

  // Fetch unique filter options and wishlist on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch filters
        const filterRes = await fetch(`${BASE_URL}/properties?pageSize=200&showAll=true`);
        const filterData = await filterRes.json();
        const allProps = filterData.properties || [];
        
        const categories = new Set();
        const types = new Set();
        allProps.forEach(p => {
          if (p.status) categories.add(p.status);
          if (p.propertyType) types.add(p.propertyType);
        });
        
        setAvailableCategories(['All', ...Array.from(categories)]);
        setAvailableTypes(['All', ...Array.from(types)]);

        // Fetch wishlist if logged in
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
          const wishRes = await fetch(`${BASE_URL}/users/wishlist`, {
            headers: { 'Authorization': `Bearer ${userInfo.token}` }
          });
          const wishData = await wishRes.json();
          if (wishRes.ok) {
            setWishlist(wishData.map(p => p._id));
          }
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
      }
    };
    fetchInitialData();
  }, []);

  // Reset page when other filters change
  useEffect(() => {
    setPage(1);
  }, [selectedType, selectedCategory, selectedCity, selectedBeds, appliedMinPrice, appliedMaxPrice]);

  // Fetch properties with proper query parameters
  useEffect(() => {
    const fetchProperties = async (pageNumber = 1) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('pageNumber', pageNumber);
        params.append('pageSize', 12); // Consistent page size

        if (selectedType !== 'All') params.append('propertyType', selectedType);
        if (selectedCategory !== 'All') params.append('status', selectedCategory);
        if (selectedCity !== 'All') params.append('city', selectedCity);

        if (selectedBeds !== 'Any') {
          let bedValue = selectedBeds === '5' ? 5 : parseInt(selectedBeds, 10);
          params.append('bedrooms', bedValue);
        }

        if (appliedMinPrice > 0) params.append('minPrice', appliedMinPrice);
        if (appliedMaxPrice < 100000000) params.append('maxPrice', appliedMaxPrice);

        const url = `${BASE_URL}/properties?${params.toString()}`;
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const response = await fetch(url, {
          headers: {
            'Authorization': userInfo?.token ? `Bearer ${userInfo.token}` : ''
          }
        });
        const data = await response.json();

        const propertiesList = data.properties || [];
        setPages(data.pages || 1);
        if (data.page && data.page !== pageNumber) setPage(data.page);

        const formattedData = propertiesList.map(p => ({
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
          isLiked: wishlist.includes(p._id),
          image: p.images[0],
          images: p.images
        }));
        setProperties(formattedData);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties(page);
    window.scrollTo(0, 0);
  }, [page, selectedType, selectedCategory, selectedCity, selectedBeds, appliedMinPrice, appliedMaxPrice, wishlist]);

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const cleanStr = priceStr.toString().replace(/[₹,]/g, '').trim();
    let value = parseFloat(cleanStr);
    if (isNaN(value)) return 0;
    if (cleanStr.includes('Cr')) value *= 1e7;
    else if (cleanStr.includes('L')) value *= 1e5;
    return value;
  };

  const filteredAndSortedProperties = [...properties].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return parsePrice(a.price) - parsePrice(b.price);
    if (sortBy === 'Price: High to Low') return parsePrice(b.price) - parsePrice(a.price);
    return b.id.localeCompare(a.id);
  });

  const clearFilters = () => {
    setSearchLocality('');
    setSelectedCity('All');
    setSelectedType('All');
    setSelectedCategory('All');
    setMinPrice(0);
    setMaxPrice(100000000);
    setAppliedMinPrice(0);
    setAppliedMaxPrice(100000000);
    setSelectedBeds('Any');
  };

  const handleApplyFilters = () => {
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    setShowFilters(false);
  };

  const formatPriceLabel = (value) => {
    if (value >= 1e7) return (value / 1e7).toFixed(1) + ' Cr';
    if (value >= 1e5) return (value / 1e5).toFixed(0) + ' L';
    return value;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <PropertyHeader 
        count={filteredAndSortedProperties.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setShowFilters={setShowFilters}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <PropertyFilters 
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            searchLocality={searchLocality}
            setSearchLocality={setSearchLocality}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            selectedBeds={selectedBeds}
            setSelectedBeds={setSelectedBeds}
            handleApplyFilters={handleApplyFilters}
            clearFilters={clearFilters}
            appliedMinPrice={appliedMinPrice}
            appliedMaxPrice={appliedMaxPrice}
            formatPriceLabel={formatPriceLabel}
            availableCategories={availableCategories}
            availableTypes={availableTypes}
          />

          <PropertyGrid 
            loading={loading}
            properties={filteredAndSortedProperties}
            viewMode={viewMode}
            pages={pages}
            page={page}
            setPage={setPage}
            clearFilters={clearFilters}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Properties;