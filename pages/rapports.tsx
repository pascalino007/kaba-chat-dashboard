import React from 'react';
import Layout from '../components/layout/Layout';
import { Download, Calendar, FileText, BarChart3 } from 'lucide-react';

const RapportsPage: React.FC = () => {
  const rapports = [
    {
      id: '1',
      titre: 'Rapport Mensuel - Mars 2024',
      type: 'Mensuel',
      date: '2024-03-31',
      statut: 'Généré',
      taille: '2.3 MB'
    },
    {
      id: '2',
      titre: 'Analyse des Abonnements Q1 2024',
      type: 'Trimestriel',
      date: '2024-03-31',
      statut: 'Généré',
      taille: '4.1 MB'
    },
    {
      id: '3',
      titre: 'Rapport Clients Actifs',
      type: 'Hebdomadaire',
      date: '2024-03-24',
      statut: 'Généré',
      taille: '1.8 MB'
    },
    {
      id: '4',
      titre: 'Analyse des Revenus',
      type: 'Mensuel',
      date: '2024-02-29',
      statut: 'Généré',
      taille: '3.2 MB'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
            <p className="text-gray-600 mt-1">Générez et consultez vos rapports détaillés</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <FileText className="w-4 h-4" />
            <span>Nouveau Rapport</span>
          </button>
        </div>

        {/* Types de rapports */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Rapport Mensuel</h3>
            </div>
            <p className="text-gray-600 mb-4">Résumé complet des activités du mois avec statistiques détaillées</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">Générer →</button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Analyse Financière</h3>
            </div>
            <p className="text-gray-600 mb-4">Analyse détaillée des revenus, coûts et marges bénéficiaires</p>
            <button className="text-green-600 hover:text-green-700 font-medium">Générer →</button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Rapport Clients</h3>
            </div>
            <p className="text-gray-600 mb-4">Analyse du comportement client et taux de rétention</p>
            <button className="text-purple-600 hover:text-purple-700 font-medium">Générer →</button>
          </div>
        </div>

        {/* Rapports récents */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Rapports Récents</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taille
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rapports.map((rapport) => (
                  <tr key={rapport.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{rapport.titre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {rapport.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(rapport.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {rapport.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rapport.taille}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>Télécharger</span>
                        </button>
                        <button className="text-green-600 hover:text-green-900">Voir</button>
                        <button className="text-red-600 hover:text-red-900">Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RapportsPage;
