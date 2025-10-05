import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-4 lg:px-6 py-4 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            © 2025 Kaba Abonnements. Tous droits réservés.
          </span>
        </div>
        
        <div className="flex items-center space-x-4 lg:space-x-6">
          <a href="#" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
            Confidentialité
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
            Conditions d'utilisation
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
