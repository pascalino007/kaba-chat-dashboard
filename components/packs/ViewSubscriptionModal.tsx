import { Package, X } from 'lucide-react';
import React from 'react';

interface Abonnement {
  color: string;
  id: string;
  service: string;
  name: string;
  price: number;
  is_active: string;
  deliverylimit: number;
  min_order_amount: number;
  radius_km: number;
  duration_days: number;
  is_shareable: boolean;
  max_shared_users: number;
  discount_on_order: number;
  other_benefits: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  abonnement: Abonnement | null;
  onEdit: () => void;
}

const ViewSubscriptionModal: React.FC<Props> = ({ isOpen, onClose, abonnement, onEdit }) => {
  if (!isOpen || !abonnement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center   bg-opacity-10">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
         <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#CD1F45] rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Information Pack </h2>
              <p className="text-sm text-gray-600"> Formule d'abonnement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          
          <div className="flex justify-between">
            <span className="font-semibold text-black">Pack:</span>
            <span>{abonnement.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-black ">Statut:</span>
            <span>{abonnement.is_active ? 'Actif' : 'Inactif'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-black">Montant:</span>
            <span>{abonnement.price} XOF</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-black">Rayon de Livraison:</span>
            <span>{abonnement.radius_km} km</span>
          </div>

           <div className="flex justify-between">
            <span className="font-semibold text-black">Code Couleur:</span>
            <span>{abonnement.color} </span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-black">Nombre de Livraison:</span>
            <span>{abonnement.deliverylimit}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-black">Montant Minimum de Commande:</span>
            <span>{abonnement.min_order_amount} XOF</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-black">Durée de Validité:</span>
            <span>{abonnement.duration_days} jours</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-black">Partageable:</span>
            <span>{abonnement.is_shareable ? 'Oui' : 'Non'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-black ">Utilisateurs max partagés:</span>
            <span>{abonnement.max_shared_users}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-black">Réduction sur commande:</span>
            <span>{abonnement.discount_on_order > 0.0 ? abonnement.discount_on_order + '%'   : 'Non'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-black">Autres avantages:</span>
            <span>{abonnement.other_benefits}</span>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={onEdit}
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSubscriptionModal;