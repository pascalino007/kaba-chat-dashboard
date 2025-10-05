import React, { useEffect } from 'react';
import { LogOut, ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/router';

const LogoutPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Optional: Add any logout logic here (clear tokens, etc.)
    // For example: localStorage.removeItem('token');
  }, []);

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          {/* Logout Icon */}
          <div className="mx-auto w-12 h-12 bg-[#CD1F45] rounded-full flex items-center justify-center mb-4">
            <LogOut className="w-6 h-6 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Déconnexion réussie
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Vous avez été déconnecté avec succès de votre compte Kaba Abonnement. 
            Merci d'avoir utilisé nos services.
          </p>

          {/* Login Button */}
          <button
            onClick={handleLoginRedirect}
            className="w-full bg-[#CD1F45] hover:bg-[#b01a3a] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 group"
          >
            <span>Se reconnecter</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>

          {/* Additional Info */}
          <p className="text-sm text-gray-500 mt-6">
            Vous pouvez également cliquer sur le bouton ci-dessus pour accéder à la page de connexion
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2025 Kaba Abonnement. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
