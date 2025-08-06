import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      // Simulate API call
      setTimeout(() => {
        // In a real app, you would make an API call here
        // const response = await axios.post('http://localhost:4000/api/auth/login', formData);
        // localStorage.setItem('token', response.data.token);
        
        setIsLoading(false);
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      setErrors({
        ...errors,
        general: error.response?.data?.message || 'Login failed. Please try again.'
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
    <div className="auth-page login-page">
      <motion.div 
        className="auth-card"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="auth-header" variants={itemVariants}>
          <h1>Welcome Back</h1>
          <p>Log in to continue your health journey</p>
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
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
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
                  <FaSignInAlt /> Log In
                </>
              )}
            </motion.button>
            
            <p className="auth-redirect">
              Don't have an account? <Link to="/register">Sign up</Link>
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

export default Login;