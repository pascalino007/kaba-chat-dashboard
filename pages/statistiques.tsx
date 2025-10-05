import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/dashboard/StatCard';
import { Users, CreditCard, TrendingUp, DollarSign, BarChart3, PieChart , Download, Calendar, FileText,  } from 'lucide-react';
import axios from 'axios';
/* import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'; */

const StatistiquesPage: React.FC = () => {

   const repartitionData = [
    { name: 'Premium', value: 45, color: '#3b82f6' },
    { name: 'Standard', value: 35, color: '#10b981' },
    { name: 'Basic', value: 20, color: '#8b5cf6' },
  ];

 

// Remove the duplicate component declaration above and move the state/hooks to the top-level component

const [periode, setPeriode] = useState<{debut: string, fin: string}>({
  debut: '', fin: ''
});
const [stats, setStats] = useState<any>(null);
const [loading, setLoading] = useState(false);


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

useEffect(() => {
  if (!periode.debut || !periode.fin) return;
  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/statistiques', { params: { debut: periode.debut, fin: periode.fin } });
      setStats(res.data);
    } catch (error) {
      // Vous pouvez afficher une notification ou un message d'erreur ici si besoin
      setStats(null);
    } finally {
      setLoading(false);
    }
  };
  fetchStats();
}, [periode]);


return (
  <Layout>
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
        <p className="text-gray-600 mt-1">Analyses détaillées de vos performances</p>
      </div>
         <div className="flex items-center space-x-4">
          <input
            type="date"
            value={periode.debut}
            onChange={e => setPeriode(p => ({...p, debut: e.target.value}))}
            className="border text-black rounded px-2 py-1"
          />
          <span className='text-black'>à</span>
          <input
            type="date"
            value={periode.fin}
            onChange={e => setPeriode(p => ({...p, fin: e.target.value}))}
            className="border text-black rounded px-2 py-1"
          />
        </div>
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Abonnements ce mois"
            value={stats?.nbAbonnements ?? '--'}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Chiffre d'affaires"
            value={stats?.chiffreAffaires ? `XOF${stats.chiffreAffaires}` : '--'}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Frais de livraison"
            value={stats?.fraisLivraison ? `XOF${stats.fraisLivraison}` : '--'}
            icon={CreditCard}
            color="orange"
          />
          <StatCard
            title="Nombre de commandes"
            value={stats?.nbCommandes ?? '--'}
            icon={BarChart3}
            color="purple"
          />
        </div>

      {/* Graphiques principaux */}
           {/* Tableau de synthèse par abonnement */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Abonnement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Souscriptions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frais Livraison</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commandes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Souscripteurs parrainés</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">Chargement...</td>
                  </tr>
                ) : stats?.parAbonnement?.length ? (
                  stats.parAbonnement.map((ab: any) => (
                    <tr key={ab.nom}>
                      <td className="px-6 py-4">{ab.nom}</td>
                      <td className="px-6 py-4">{ab.nbSouscriptions}</td>
                      <td className="px-6 py-4">{ab.ca}</td>
                      <td className="px-6 py-4">{ab.fraisLivraison}</td>
                      <td className="px-6 py-4">{ab.nbCommandes}</td>
                      <td className="px-6 py-4">{ab.nbParraines}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">Aucune donnée</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      {/* Graphique de conversion */}

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
}

export default StatistiquesPage;
