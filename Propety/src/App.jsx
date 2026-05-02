import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostProperty from './pages/PostProperty';
import MyProperties from './pages/MyProperties';
import SavedProperties from './pages/SavedProperties';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/post-property" element={<PostProperty />} />
        <Route path="/edit-property/:id" element={<PostProperty />} />
        <Route path="/my-properties" element={<MyProperties />} />
        <Route path="/saved-properties" element={<SavedProperties />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'sub-admin']} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;