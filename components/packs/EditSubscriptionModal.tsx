import { Package, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface EditSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: any;
  onSubmit?: (data: any) => void;
}

const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({
  isOpen,
  onClose,
  initialValues,
  onSubmit,
}) => {
  const [form, setForm] = useState(initialValues || {});

  useEffect(() => {
    setForm(initialValues || {});
  }, [initialValues, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `http://localhost:4040/dashboard/update/`,
        {
          ...form,
          price: Number(form.price),
          deliverylimit: form.deliverylimit ? Number(form.deliverylimit) : null,
          radius_km: Number(form.radius_km),
          min_order_amount: Number(form.min_order_amount),
          duration_days: Number(form.duration_days),
          max_shared_users: form.max_shared_users
            ? Number(form.max_shared_users)
            : null,
          discount_on_order: Number(form.discount_on_order),
        }
      );

      if (onSubmit) {
        onSubmit(response.data);
      }

      onClose();
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      if (error.response) {
        alert(`Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        alert('Network error: Could not reach the server.');
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-5">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg h-[90vh] overflow-y-auto p-6 relative">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#CD1F45] rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Modifier Abonnement</h2>
              <p className="text-sm text-gray-600">Mettre à jour les informations de l'abonnement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-black mt-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">Nom du Pack</label>
            <input
              id="name"
              name="name"
              value={form.name || ''}
              onChange={handleChange}
              placeholder="Nom du Pack"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="price" className="block mb-1 font-medium">Prix</label>
            <input
              id="price"
              name="price"
              type="number"
              value={form.price || ''}
              onChange={handleChange}
              placeholder="Prix"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="price" className="block mb-1 font-medium">Code Couleur</label>
            <input
              id="color"
              name="color"
              type="text"
              value={form.color || ''}
              onChange={handleChange}
              placeholder="Color #eb850b"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={form.is_active || false}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="is_active" className="font-medium">Actif</label>
          </div>

          <div>
            <label htmlFor="deliverylimit" className="block mb-1 font-medium">Nombre de Livraisons</label>
            <input
              id="deliverylimit"
              name="deliverylimit"
              type="number"
              value={form.deliverylimit || ''}
              onChange={handleChange}
              placeholder="Nombre de Livraisons"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="min_order_amount" className="block mb-1 font-medium">Montant minimum de commande</label>
            <input
              id="min_order_amount"
              name="min_order_amount"
              type="number"
              value={form.min_order_amount || ''}
              onChange={handleChange}
              placeholder="Montant minimum de commande"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="radius_km" className="block mb-1 font-medium">Rayon de livraison (km)</label>
            <input
              id="radius_km"
              name="radius_km"
              type="number"
              value={form.radius_km || ''}
              onChange={handleChange}
              placeholder="Rayon de livraison (km)"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="duration_days" className="block mb-1 font-medium">Durée de validité (jours)</label>
            <input
              id="duration_days"
              name="duration_days"
              type="number"
              value={form.duration_days || ''}
              onChange={handleChange}
              placeholder="Durée de validité (jours)"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center">
            <input
              id="is_shareable"
              name="is_shareable"
              type="checkbox"
              checked={form.is_shareable || false}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="is_shareable" className="font-medium">Partageable</label>
          </div>

          <div>
            <label htmlFor="max_shared_users" className="block mb-1 font-medium">Utilisateurs max partagés</label>
            <input
              id="max_shared_users"
              name="max_shared_users"
              type="number"
              value={form.max_shared_users || ''}
              onChange={handleChange}
              placeholder="Utilisateurs max partagés"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="discount_on_order" className="block mb-1 font-medium">Réduction sur commande (%)</label>
            <input
              id="discount_on_order"
              name="discount_on_order"
              type="number"
              value={form.discount_on_order || 0}
              onChange={handleChange}
              placeholder="Réduction sur commande (%)"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="other_benefits" className="block mb-1 font-medium">Autres avantages</label>
            <input
              id="other_benefits"
              name="other_benefits"
              value={form.other_benefits || ''}
              onChange={handleChange}
              placeholder="Autres avantages"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Modifier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubscriptionModal;
