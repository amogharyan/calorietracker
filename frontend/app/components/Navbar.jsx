"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <motion.nav 
      className={`navbar ${isScrolled ? 'scrolled' : ''} ${pathname === '/' ? 'transparent' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
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
            <Link href="/" className={pathname === '/' ? 'active' : ''}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                Home
              </motion.div>
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link href="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}>
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
                <Link href="/login" className={pathname === '/login' ? 'active' : ''}>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    Login
                  </motion.div>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/register" className={pathname === '/register' ? 'active' : ''}>
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