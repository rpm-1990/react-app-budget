import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // After 20 seconds, redirect to HomePage
    const timer = setTimeout(() => {
      navigate('/Pages/HomePage');
    }, 5000); // 20 seconds in milliseconds

    // Clear the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);  return (
    <div>
      Session Logout Successful
    </div>
  );
}

export default LogoutPage;