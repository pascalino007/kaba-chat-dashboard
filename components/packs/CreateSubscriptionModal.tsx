import React, { useState } from 'react';
import { X, Save, Package } from 'lucide-react';
import axios from 'axios';

interface CreateSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubscriptionFormData) => void;
}

interface SubscriptionFormData {
  color: string 
  name: string;
  price: number;
  deliverylimit: number | null;
  radius_km: number;
  min_order_amount: number;
  duration_days: number;
  is_shareable: boolean;
  max_shared_users: number | null;
  discount_on_order: number;
  other_benefits: string;
  is_active: boolean;
  is_enterprise: boolean;
  createdAt: Date ;
  updatedAt: Date ; 
}

const CreateSubscriptionModal: React.FC<CreateSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    color : '' ,
    name: '',
    price: 0,
    deliverylimit: null,
    radius_km: 0,
    min_order_amount: 0,
    duration_days: 30,
    is_shareable: false,
    max_shared_users: null,
    discount_on_order: 0,
    other_benefits: '',
    is_active: true,
    is_enterprise: false,
    createdAt: new Date() ,
    updatedAt:  new Date(),

  });

  const [errors, setErrors] = useState<Partial<Record<keyof SubscriptionFormData, string>>>({});

  const handleInputChange = (field: keyof SubscriptionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SubscriptionFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la formule est requis';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }

    if (formData.radius_km <= 0) {
      newErrors.radius_km = 'Le rayon de livraison doit être supérieur à 0';
    }

    if (formData.min_order_amount < 0) {
      newErrors.min_order_amount = 'Le montant minimum ne peut pas être négatif';
    }

    if (formData.duration_days <= 0) {
      newErrors.duration_days = 'La durée doit être supérieure à 0';
    }

    if (formData.is_shareable && formData.max_shared_users !== null && formData.max_shared_users <= 0) {
      newErrors.max_shared_users = 'Le nombre max de partages doit être supérieur à 0';
    }

    if (formData.discount_on_order < 0 || formData.discount_on_order > 100) {
      newErrors.discount_on_order = 'La réduction doit être entre 0 et 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (validateForm()) {
    try {
      // Replace '/api/abonnements' with your actual endpoint
      const response = await axios.post('http://localhost:4040/dashboard/new_pack', formData);
      // Optionally call onSubmit to update parent state/UI
      onSubmit(response.data);
      window.location.reload();
      onClose();
    } catch (error) {
      // Handle error (show message, etc.)
      alert(error);
      console.error(error);
    }
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#EDE1DF] bg-opacity-0  flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#CD1F45] rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Nouvel Abonnement</h2>
              <p className="text-sm text-gray-600">Créer une nouvelle formule d'abonnement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la formule *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={` text-gray-900 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#CD1F45] focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300' 
                }`}
                placeholder="ex: BASIC, VIC, PREMIUM..."
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (FCFA) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                className={` text-gray-700  w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#CD1F45] focus:border-transparent ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de livraisons
              </label>
              <input
                type="number"
                value={formData.deliverylimit || ''}
                onChange={(e) => handleInputChange('deliverylimit',  parseInt(e.target.value) || null)}
                className=" text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CD1F45] focus:border-transparent"
                placeholder="Laissez vide pour illimité"
              />
              <p className="text-gray-500 text-xs mt-1">Laissez vide pour illimité</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rayon de livraison (km) *
              </label>
              <input
                type="number"
                value={formData.radius_km}
                onChange={(e) => handleInputChange('radius_km', parseInt(e.target.value) || 0)}
                className={` text-gray-700 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#CD1F45] focus:border-transparent ${
                  errors.radius_km ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.radius_km && <p className="text-red-500 text-sm mt-1">{errors.radius_km}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant minimum (FCFA)
              </label>
              <input
                type="number"
                value={formData.min_order_amount}
                onChange={(e) => handleInputChange('min_order_amount', parseInt(e.target.value) || 0)}
                className={` text-gray-700 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#CD1F45] focus:border-transparent ${
                  errors.min_order_amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.min_order_amount && <p className="text-red-500 text-sm mt-1">{errors.min_order_amount}</p>}
            </div>


              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Associee (en ) *
              </label>
              <input
                type="string"
                value={formData.color}
                onChange={(e) => handleInputChange('duration_days', parseInt(e.target.value) || 0)}
                className={` text-gray-700 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#CD1F45] focus:border-transparent ${
                  errors.color ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder=" code color  #eb850b"
              />
              {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
            </div>
          

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée de validité (jours) *
              </label>
              <input
                type="number"
                value={formData.duration_days}
                onChange={(e) => handleInputChange('duration_days', parseInt(e.target.value) || 0)}
                className={` text-gray-700 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#CD1F45] focus:border-transparent ${
                  errors.duration_days ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="30"
              />
              {errors.duration_days && <p className="text-red-500 text-sm mt-1">{errors.duration_days}</p>}
            </div>

            
          </div> 


           

        

          {/* Sharing Options */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Options de partage</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_shareable"
                  checked={formData.is_shareable}
                  onChange={(e) => handleInputChange('is_shareable', e.target.checked)}
                  className="w-4 h-4 text-[#CD1F45] border-gray-300 rounded focus:ring-[#CD1F45]"
                />
                <label htmlFor="is_shareable" className="text-sm font-medium text-gray-700">
                  Peut être partagé
                </label>
              </div>

              {formData.is_shareable && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre max de partages
                  </label>
                  <input
                    type="number"
                    value={formData.max_shared_users || ''}
                    onChange={(e) => handleInputChange('max_shared_users', e.target.value ? parseInt(e.target.value) : null)}
                    className={` text-gray-700 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#CD1F45] focus:border-transparent ${
                      errors.max_shared_users ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Laissez vide pour illimité"
                  />
                  {errors.max_shared_users && <p className="text-red-500 text-sm mt-1">{errors.max_shared_users}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Réduction sur commandes (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.discount_on_order}
                  onChange={(e) => handleInputChange('discount_on_order', parseFloat(e.target.value) || 0)}
                  className={` text-gray-700 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#CD1F45] focus:border-transparent ${
                    errors.discount_on_order ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.discount_on_order && <p className="text-red-500 text-sm mt-1">{errors.discount_on_order}</p>}
              </div>
            </div>
          </div>

          {/* Other Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Autres avantages
            </label>
            <textarea
              value={formData.other_benefits}
              onChange={(e) => handleInputChange('other_benefits', e.target.value)}
              rows={3}
              className=" text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CD1F45] focus:border-transparent"
              placeholder="Décrivez les autres avantages de cette formule..."
            />
          </div>

          {/* Status Options */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut et type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="w-4 h-4 text-[#CD1F45] border-gray-300 rounded focus:ring-[#CD1F45]"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Abonnement actif
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_enterprise"
                  checked={formData.is_enterprise}
                  onChange={(e) => handleInputChange('is_enterprise', e.target.checked)}
                  className="w-4 h-4 text-[#CD1F45] border-gray-300 rounded focus:ring-[#CD1F45]"
                />
                <label htmlFor="is_enterprise" className="text-sm font-medium text-gray-700">
                  Abonnement entreprise
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#CD1F45] text-white rounded-lg hover:bg-[#b01a3a] transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Créer l'abonnement</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubscriptionModal;
