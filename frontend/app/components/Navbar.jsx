"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaSignOutAlt, FaUser, FaUtensils, FaChartLine } from 'react-icons/fa';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : pathname === '/' 
            ? 'bg-transparent' 
            : 'bg-white/95 backdrop-blur-md shadow-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <FaUtensils className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                CalorieTracker
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                pathname === '/' 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Home
                {pathname === '/' && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                    layoutId="navbar-underline"
                  />
                )}
              </motion.div>
            </Link>

            <Link 
              href="/menu" 
              className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                pathname === '/menu' 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Menu
                {pathname === '/menu' && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                    layoutId="navbar-underline"
                  />
                )}
              </motion.div>
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === '/dashboard' 
                      ? 'text-green-600' 
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  <motion.div 
                    className="flex items-center space-x-1"
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaChartLine className="w-4 h-4" />
                    <span>Dashboard</span>
                    {pathname === '/dashboard' && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                        layoutId="navbar-underline"
                      />
                    )}
                  </motion.div>
                </Link>
                <motion.button 
                  className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === '/login' 
                      ? 'text-green-600' 
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Login
                    {pathname === '/login' && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                        layoutId="navbar-underline"
                      />
                    )}
                  </motion.div>
                </Link>
                <Link href="/register">
                  <motion.div 
                    className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm ${
                      pathname === '/register' ? 'ring-2 ring-green-300' : ''
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaUser className="w-4 h-4" />
                    <span>Register</span>
                  </motion.div>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              className="p-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMenuOpen ? 1 : 0, 
            height: isMenuOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="py-4 space-y-2 bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-lg">
            <Link 
              href="/" 
              className={`block px-4 py-2 text-sm font-medium transition-colors ${
                pathname === '/' 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/menu" 
              className={`block px-4 py-2 text-sm font-medium transition-colors ${
                pathname === '/menu' 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              Menu
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
                    pathname === '/dashboard' 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  <FaChartLine className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-left"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={`block px-4 py-2 text-sm font-medium transition-colors ${
                    pathname === '/login' 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="block px-4 py-2"
                >
                  <div className="flex items-center space-x-2 px-3 py-2 text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all">
                    <FaUser className="w-4 h-4" />
                    <span>Register</span>
                  </div>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;