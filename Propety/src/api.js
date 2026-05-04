const isProduction = import.meta.env.MODE === 'production';

export const BASE_URL = isProduction 
  ? 'https://mmd-property.onrender.com/api' 
  : 'http://localhost:5000/api';

export const IMAGE_BASE_URL = isProduction
  ? 'https://mmd-property.onrender.com'
  : 'http://localhost:5000';
