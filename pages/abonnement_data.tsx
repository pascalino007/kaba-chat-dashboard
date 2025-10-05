import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { Plus, Filter, Search, Download } from 'lucide-react';
import CreateSubscriptionModal from '../components/packs/CreateSubscriptionModal';
import ViewSubscriptionModal from '../components/packs/ViewSubscriptionModal';
import EditSubscriptionModal from '../components/packs/EditSubscriptionModal';

const AbonnementsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); // NEW
  const [selectedAbonnement, setSelectedAbonnement] = useState<any>(null);
  const [editAbonnement, setEditAbonnement] = useState<any>(null); // NEW
  const [abonnements, setAbonnements] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

   useEffect(() => {
  const fetchAbonnements = async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with your actual API endpoint
      const response = await axios.get('http://localhost:4040/dashboard/abonnements');
      setAbonnements(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des abonnements.");
    } finally {
      setLoading(false);
    }
  };
  fetchAbonnements();
}, []);



  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion Abonnement</h1>
            <p className="text-gray-600 mt-1">Voici les Donnees d'abonnement </p>
          </div>
         
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un abonnement..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        {/* Tableau des abonnements */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                   <th className="px-6 py-3 text-left text-xs font-small font-serif text-gray-500  tracking-wider">
                     ID
                  </th>
                 {/*  <th className="px-6 py-3 text-left text-xs font-small text-gray-500   tracking-wider">
                  ID Commande
                  </th> */}
                 
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">
                    Pack Id
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">
                    Statut
                  </th>
                   
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">
                    Livraison Utilise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">
                   Date de Debut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">
                   Date de Fin
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">
                    Code Abonement 
                  </th>
                  
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">
                    Mode de Paiment 
                  </th>
                 
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">
                    Nombre Users Actuel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
             <tbody className="bg-white divide-y divide-gray-200">
            { loading ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-500">Chargement...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-red-500">{error}</td>
              </tr>
            ) : abonnements.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-500">Aucun abonnement trouvé.</td>
              </tr>
            ) : (
              abonnements.map((abonnement) => (
                  <tr key={abonnement.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#0125{abonnement.id}</div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{abonnement.id_command}</div>
                    </td> */}
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{abonnement.user_id}</span>
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                       {abonnement.subscription_id} 
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        abonnement.status_payement == 1 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {abonnement.status_payement == 1 ? 'Actif' : 'Pending'}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className='bg-green-100 text-green-800'>
                        {abonnement.price} XOF
                      </span>
                      
                    </td> */}
                     
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      { 0 +  ' sur '+ 15} 
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {abonnement.start_date} 
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {abonnement.end_date} 
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {abonnement.codeAbonnement} 
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {abonnement.payement_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {'  1 / 3'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => {
                            setSelectedAbonnement(abonnement);
                            setViewModalOpen(true);
                          }}
                        >
                          Voir
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() => {
                            setEditAbonnement(abonnement);
                            setEditModalOpen(true);
                          }}
                        >
                          Suspendre 
                        </button>
                        
                      </div>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de création d'abonnement */}
        <CreateSubscriptionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(data) => {
            console.log('Nouvel abonnement:', data);
            alert('Abonnement créé avec succès!');
            setIsModalOpen(false);
          }}
        />

        {/* Modal de visualisation */}
        <ViewSubscriptionModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          abonnement={selectedAbonnement}
          onEdit={() => {
            setViewModalOpen(false);
            setEditAbonnement(selectedAbonnement);
            setEditModalOpen(true);
          }}
        />

        {/* Modal de modification */}
        <EditSubscriptionModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          initialValues={editAbonnement}
          onSubmit={(data) => {
            console.log('Abonnement modifié:', data);
            alert('Abonnement modifié avec succès!');
            setEditModalOpen(false);
          }}
        />
      </div>
    </Layout>
  );
};

export default AbonnementsPage;
