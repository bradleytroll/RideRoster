import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddRide from './components/AddRide';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import RecentlyRatedRides from './components/RecentlyRatedRides';
import { jwtDecode } from 'jwt-decode'; // Correct import statement

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token); // Correct usage
      setUserId(decodedToken.id);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserId(null);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route path="/" element={<><AddRide userId={userId} /><RecentlyRatedRides /></>} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} setUserId={setUserId} />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard userId={userId} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
