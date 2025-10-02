import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          List Distribution
        </Link>
        
        <ul className="navbar-nav">
          {user?.role === 'admin' && (
            <>
              <li>
                <Link 
                  to="/" 
                  className={location.pathname === '/' ? 'active' : ''}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/agents" 
                  className={location.pathname === '/agents' ? 'active' : ''}
                >
                  Agents
                </Link>
              </li>
              <li>
                <Link 
                  to="/upload" 
                  className={location.pathname === '/upload' ? 'active' : ''}
                >
                  Upload List
                </Link>
              </li>
              <li>
                <Link 
                  to="/distributions" 
                  className={location.pathname === '/distributions' ? 'active' : ''}
                >
                  Distributions
                </Link>
              </li>
            </>
          )}
          <li>
            <Link 
              to="/my-lists" 
              className={location.pathname === '/my-lists' ? 'active' : ''}
            >
              My Lists
            </Link>
          </li>
          <li>
            <span className="navbar-user">
              Welcome, {user?.name} ({user?.role})
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;