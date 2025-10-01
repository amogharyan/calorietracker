// app/layout.jsx
'use client';

import './globals.css';
import Navbar from './components/Navbar';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on page load
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="min-h-screen">
          <Navbar 
            isAuthenticated={isAuthenticated} 
            setIsAuthenticated={setIsAuthenticated} 
          />
          <main className="pt-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
