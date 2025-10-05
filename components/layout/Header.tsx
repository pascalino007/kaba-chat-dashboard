import React, { useState } from 'react';
import { Bell, Search, User, Menu, X, LogOut } from 'lucide-react';
import { useMobileMenu } from '../../contexts/MobileMenuContext';
import { useChatMode } from '../../contexts/ChatModeContext';
import { useRouter } from 'next/router';

const Header: React.FC = () => {
  const { isMobileMenuOpen, toggleMobileMenu } = useMobileMenu();
  const { chatMode, setChatMode } = useChatMode();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // ✅ Handle logout
  const handleLogout = () => {
    // Remove jwt token
    localStorage.removeItem('jwt');
    sessionStorage.clear();
    document.cookie = 'jwt=; Max-Age=0; path=/;';

    // Redirect to logout page
    router.push('/logout');
  };

  return (
    <header className="bg-white px-4 lg:px-6 py-4 ml-5 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo + mobile toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden w-8 h-8 bg-[#CD1F45] rounded-lg flex items-center justify-center hover:bg-[#b01a3a] transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 text-white" />
            ) : (
              <Menu className="w-4 h-4 text-white" />
            )}
          </button>

          <div className="hidden lg:flex w-8 h-8 bg-[#CD1F45] rounded-lg items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>

          <h1 className="hidden sm:block text-xl font-semibold text-gray-800">
            Kaba Customer Service
          </h1>
        </div>

        {/* Barre de recherche */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher clients, abonnements..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notification */}
          <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Toggle AI / Real */}
          <div className="flex items-center border rounded-lg overflow-hidden bg-gray-100">
            <button
              onClick={() => setChatMode('AI')}
              className={`px-3 py-1 text-sm font-medium transition-colors ${
                chatMode === 'AI' ? 'bg-white text-red-500' : 'text-gray-500'
              }`}
            >
              🤖 AI
            </button>
            <button
              onClick={() => setChatMode('Real')}
              className={`px-3 py-1 text-sm font-medium transition-colors ${
                chatMode === 'Real' ? 'bg-white text-green-600' : 'text-gray-500'
              }`}
            >
              👤 Real
            </button>
          </div>

          {/* Mode actuel */}
          <span className="text-sm text-gray-600 ml-4">
            Mode actuel:{' '}
            <b>
              {chatMode === 'AI'
                ? '🤖 IA Chatbot'
                : '👤 Service Client (Joseph)'}
            </b>
          </span>

          {/* User avatar with dropdown */}
          <div className="relative">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 bg-[#CD1F45] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                Admin
              </span>
            </div>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
