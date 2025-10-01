'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      setTimeout(() => {
        setIsLoading(false);
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      setErrors({
        ...errors,
        general: error.response?.data?.message || 'Login failed. Please try again.',
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };
  
  const buttonVariants = {
    hover: { scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' },
    tap: { scale: 0.98 }
  };

  return (
    <div className="auth-page login-page bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <motion.div
        className="auth-card max-w-md w-full bg-gray-900 border border-gray-800 rounded-lg p-8 shadow-2xl shadow-black/40"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="auth-header mb-6 text-center" variants={itemVariants}>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Log in to continue your health journey</p>
        </motion.div>

        {errors.general && (
          <motion.div
            className="error-message general-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errors.general}
          </motion.div>
        )}

        <motion.form onSubmit={handleSubmit} variants={containerVariants}>
          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="email" className="flex items-center text-gray-200 mb-2">
              <FaEnvelope className="text-darkgreen-400 mr-2" /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`bg-gray-900 border ${errors.email ? 'border-red-500' : 'border-darkgreen-800'} rounded-lg px-4 py-3 w-full text-white focus:outline-none focus:border-darkgreen-500 focus:ring-1 focus:ring-darkgreen-500 transition-all`}
            />
            {errors.email && <div className="error-message text-red-400 text-sm mt-1">{errors.email}</div>}
          </motion.div>

          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="password" className="flex items-center text-gray-200 mb-2">
              <FaLock className="text-darkgreen-400 mr-2" /> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`bg-gray-900 border ${errors.password ? 'border-red-500' : 'border-darkgreen-800'} rounded-lg px-4 py-3 w-full text-white focus:outline-none focus:border-darkgreen-500 focus:ring-1 focus:ring-darkgreen-500 transition-all`}
            />
            {errors.password && <div className="error-message text-red-400 text-sm mt-1">{errors.password}</div>}
          </motion.div>

                    <motion.div className="form-footer mt-6 flex flex-col items-center" variants={itemVariants}>
            <motion.button
              type="submit"
              className="bg-gradient-to-r from-darkgreen-700 to-darkgreen-500 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center w-full hover:from-darkgreen-600 hover:to-darkgreen-400 transition-all shadow-lg hover:shadow-darkgreen-700/30"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Log In <FaSignInAlt className="ml-2" />
            </motion.button>
            <motion.div className="form-link mt-4 text-gray-400" variants={itemVariants}>
              Don&apos;t have an account? <Link href="/register" className="text-darkgreen-400 hover:text-darkgreen-300 ml-1 font-medium">Register</Link>
            </motion.div>
          </motion.div>
        </motion.form>
      </motion.div>

      <motion.div
        className="auth-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className="auth-background-pattern"></div>
      </motion.div>
    </div>
  );
};

export default Login;
