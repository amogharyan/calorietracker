'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaUser, FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

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
        general: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="auth-page register-page bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <motion.div
        className="auth-card"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="auth-header" variants={itemVariants}>
          <h1>Create Account</h1>
          <p>Join us and start your health journey today</p>
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
            <label htmlFor="name" className="flex items-center text-gray-200 mb-2">
              <FaUser className="text-darkgreen-400 mr-2" /> Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className={`bg-gray-900 border ${errors.name ? 'border-red-500' : 'border-darkgreen-800'} rounded-lg px-4 py-3 w-full text-white focus:outline-none focus:border-darkgreen-500 focus:ring-1 focus:ring-darkgreen-500 transition-all`}
            />
            {errors.name && <div className="error-message text-red-400 text-sm mt-1">{errors.name}</div>}
          </motion.div>

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
              placeholder="Create a password"
              className={`bg-gray-900 border ${errors.password ? 'border-red-500' : 'border-darkgreen-800'} rounded-lg px-4 py-3 w-full text-white focus:outline-none focus:border-darkgreen-500 focus:ring-1 focus:ring-darkgreen-500 transition-all`}
            />
            {errors.password && <div className="error-message text-red-400 text-sm mt-1">{errors.password}</div>}
          </motion.div>

          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="confirmPassword" className="flex items-center text-gray-200 mb-2">
              <FaLock className="text-darkgreen-400 mr-2" /> Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`bg-gray-900 border ${errors.confirmPassword ? 'border-red-500' : 'border-darkgreen-800'} rounded-lg px-4 py-3 w-full text-white focus:outline-none focus:border-darkgreen-500 focus:ring-1 focus:ring-darkgreen-500 transition-all`}
            />
            {errors.confirmPassword && <div className="error-message text-red-400 text-sm mt-1">{errors.confirmPassword}</div>}
          </motion.div>

          <motion.div className="form-footer" variants={itemVariants}>
            <motion.button
              type="submit"
              className="primary-button bg-gradient-to-r from-darkgreen-600 to-darkgreen-800 hover:from-darkgreen-500 hover:to-darkgreen-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg"
              disabled={isLoading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <FaUserPlus className="mr-2" /> Create Account
                </>
              )}
            </motion.button>

            <p className="auth-redirect">
              Already have an account? <Link href="/login" className="text-darkgreen-400 hover:text-darkgreen-300">Log in</Link>
            </p>
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

export default Register;
