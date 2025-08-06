import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <motion.nav 
      className={`navbar ${isScrolled ? 'scrolled' : ''} ${location.pathname === '/' ? 'transparent' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            CalorieTracker
          </motion.div>
        </Link>

        <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <motion.ul 
          className={`nav-menu ${isMenuOpen ? 'active' : ''}`}
          variants={{
            open: { opacity: 1, x: 0 },
            closed: { opacity: 0, x: isMenuOpen ? 0 : 100 }
          }}
          animate={isMenuOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3 }}
        >
          <li className="nav-item">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                Home
              </motion.div>
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    Dashboard
                  </motion.div>
                </Link>
              </li>
              <li className="nav-item">
                <motion.button 
                  className="logout-button"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaSignOutAlt /> Logout
                </motion.button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    Login
                  </motion.div>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>
                  <motion.div 
                    className="register-button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaUser /> Register
                  </motion.div>
                </Link>
              </li>
            </>
          )}
        </motion.ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;