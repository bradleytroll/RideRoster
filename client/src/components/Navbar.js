import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();
  
  return (
    <nav>
      <ul>
        {!isAuthenticated ? (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/">Home</Link></li>
            {location.pathname !== '/dashboard' && (
              <li><Link to="/dashboard">Dashboard</Link></li>
            )}
            <li><button onClick={onLogout}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
