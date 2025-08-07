'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaUtensils, FaChartLine, FaMobileAlt } from 'react-icons/fa';
import Link from 'next/link';

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <FaUtensils size={40} />,
      title: 'Easy Meal Tracking',
      description: 'Log your meals with just a few taps. Our intuitive interface makes calorie tracking simple and fast.',
    },
    {
      icon: <FaChartLine size={40} />,
      title: 'Detailed Analytics',
      description: 'Visualize your nutrition journey with comprehensive charts and insights to help you reach your goals.',
    },
    {
      icon: <FaMobileAlt size={40} />,
      title: 'Access Anywhere',
      description: 'Track your calories on any device. Your data syncs automatically across all your devices.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.section
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 50 }}
          >
            Track Your Calories, <br />
            <span className="highlight">Transform Your Life</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            The simplest way to track your nutrition and achieve your health goals.
            Start your journey to a healthier you today.
          </motion.p>

          <motion.div
            className="cta-buttons"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link href="/login">
              <motion.button
                className="primary-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started <FaArrowRight className="icon" />
              </motion.button>
            </Link>

            <Link href="/register">
              <motion.button
                className="secondary-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Account
              </motion.button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="hero-image"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 50 }}
        >
          <img src="/hero-image.png" alt="Calorie tracking app" />
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="features-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.h2 variants={itemVariants}>Powerful Features</motion.h2>
        <motion.p variants={itemVariants} className="section-subtitle">
          Everything you need to maintain a healthy lifestyle
        </motion.p>

        <div className="features-container">
          <div className="features-tabs">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`feature-tab ${activeFeature === index ? 'active' : ''}`}
                onClick={() => setActiveFeature(index)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                variants={itemVariants}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="feature-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key={activeFeature}
          >
            <h3>{features[activeFeature].title}</h3>
            <p>{features[activeFeature].description}</p>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="how-it-works-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.h2 variants={itemVariants}>How It Works</motion.h2>
        <motion.p variants={itemVariants} className="section-subtitle">
          Three simple steps to start your health journey
        </motion.p>

        <div className="steps-container">
          {[
            {
              number: '01',
              title: 'Create an account',
              description: 'Sign up in seconds and set your health goals',
            },
            {
              number: '02',
              title: 'Log your meals',
              description: 'Easily record what you eat throughout the day',
            },
            {
              number: '03',
              title: 'Track progress',
              description: 'Monitor your nutrition and achieve your goals',
            },
          ].map((step, index) => (
            <motion.div className="step-card" key={index} variants={itemVariants}>
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        className="cta-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2>Ready to Start Your Journey?</h2>
        <p>Join thousands of users who have transformed their lives with our app</p>
        <Link href="/register">
          <motion.button
            className="primary-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
          </motion.button>
        </Link>
      </motion.section>
    </div>
  );
};

export default Home;
