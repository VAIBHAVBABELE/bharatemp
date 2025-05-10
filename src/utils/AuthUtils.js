import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const checkAdminAccess = (requiredRole = ["SubAdmin","SuperAdmin"]) => {
  const token = JSON.parse(localStorage.getItem('token'));
  if (!token) return false;
  
  const decodedToken = jwtDecode(token);
  return requiredRole.includes(decodedToken.role);
};

export const useAdminRouteProtection = (requiredRole = ["SubAdmin","SuperAdmin"]) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) {
      navigate('/admin-login');
      return;
    }

    const decodedToken = jwtDecode(token);
    if (!requiredRole.includes(decodedToken.role)) {
      setShowPopup(true);
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  const closePopup = () => {
    setShowPopup(false);
    navigate(-1); // Go back to previous page
  };

  return { showPopup, closePopup, isAuthorized };
};