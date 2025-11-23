"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check auth status on client-side
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [pathname]); // Re-check on route change

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      window.location.href = '/login'; // Redirect to login
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 sticky top-0 z-10 bg-background-primary/95 backdrop-blur-sm">
      <div className="flex justify-between items-center py-6 border-b border-border">
        <a href="/" className="text-2xl font-bold text-text-primary">
          JS.
        </a>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="/#about" className="text-navigation-link hover:text-navigation-active transition-colors duration-200">
            About
          </a>
          <a href="/#work" className="text-navigation-link hover:text-navigation-active transition-colors duration-200">
            Work
          </a>
          <a href="/#posts" className="text-navigation-link hover:text-navigation-active transition-colors duration-200">
            Posts
          </a>
          <a href="/blogs" className="text-navigation-link hover:text-navigation-active transition-colors duration-200">
            Blogs
          </a>
          <a href="/#contact" className="text-navigation-link hover:text-navigation-active transition-colors duration-200">
            Contact
          </a>
          {isAuthenticated && (
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Logout
            </button>
          )}
        </nav>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="md:hidden mt-4">
          <a href="/#about" className="block py-2 text-navigation-link hover:text-navigation-active transition-colors duration-200">
            About
          </a>
          <a href="/#work" className="block py-2 text-navigation-link hover:text-navigation-active transition-colors duration-200">
            Work
          </a>
          <a href="/#posts" className="block py-2 text-navigation-link hover:text-navigation-active transition-colors duration-200">
            Posts
          </a>
          <a href="/blogs" className="block py-2 text-navigation-link hover:text-navigation-active transition-colors duration-200">
            Blogs
          </a>
          <a href="/#contact" className="block py-2 text-navigation-link hover:text-navigation-active transition-colors duration-200">
            Contact
          </a>
          {isAuthenticated && (
            <button 
              onClick={handleLogout}
              className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Logout
            </button>
          )}
        </nav>
      )}
    </header>
  );
}

