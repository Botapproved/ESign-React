import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  // Check if the current path is the home route
  const isHome = location.pathname === '/';

  if (isHome) {
    console.log("no footer")
    return null; // Do not render the footer if the path is '/'
  }

  return (
    <footer className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 text-center py-4">
      <p className="text-gray-500 text-sm">
        Crafted with <span className="text-red-500 mx-1">♥</span> by Sam Stephen Thomas
      </p>
    </footer>
  );
};

export default Footer;

