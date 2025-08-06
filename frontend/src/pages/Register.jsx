import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
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
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
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
      // Simulate API call
      setTimeout(() => {
        // In a real app, you would make an API call here
        // const response = await axios.post('http://localhost:4000/api/auth/register', formData);
        // localStorage.setItem('token', response.data.token);
        
        setIsLoading(false);
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      setErrors({
        ...errors,
        general: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="auth-page register-page">
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
            <label htmlFor="name">
              <FaUser /> Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </motion.div>
          
          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="email">
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </motion.div>
          
          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="password">
              <FaLock /> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </motion.div>
          
          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="confirmPassword">
              <FaLock /> Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </motion.div>
          
          <motion.div className="form-footer" variants={itemVariants}>
            <motion.button 
              type="submit" 
              className="primary-button"
              disabled={isLoading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <FaUserPlus /> Create Account
                </>
              )}
            </motion.button>
            
            <p className="auth-redirect">
              Already have an account? <Link to="/login">Log in</Link>
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