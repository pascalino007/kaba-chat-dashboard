import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { MobileMenuProvider } from '../../contexts/MobileMenuContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <MobileMenuProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        
        <div className="lg:ml-64 flex flex-col min-h-screen">
          <Header />
          
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
          
          <Footer />
        </div>
      </div>
    </MobileMenuProvider>
  );
};

export default Layout;
