import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const userInfo = localStorage.getItem('userInfo');
    
    if (!userInfo) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(userInfo);

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Logged in but not the right role
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
