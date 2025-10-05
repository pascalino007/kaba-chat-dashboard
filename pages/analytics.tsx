import React from 'react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/dashboard/StatCard';
import { TrendingUp, Users, DollarSign, Activity, Target, Zap } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AnalyticsPage: React.FC = () => {
  const performanceData = [
    { jour: 'Lun', revenus: 1200, clients: 45, conversion: 12 },
    { jour: 'Mar', revenus: 1400, clients: 52, conversion: 15 },
    { jour: 'Mer', revenus: 1600, clients: 58, conversion: 18 },
    { jour: 'Jeu', revenus: 1800, clients: 65, conversion: 20 },
    { jour: 'Ven', revenus: 2000, clients: 72, conversion: 22 },
    { jour: 'Sam', revenus: 2200, clients: 78, conversion: 25 },
    { jour: 'Dim', revenus: 2400, clients: 85, conversion: 28 },
  ];

  const sourcesData = [
    { name: 'Direct', value: 40, color: '#3b82f6' },
    { name: 'Réseaux sociaux', value: 25, color: '#10b981' },
    { name: 'Email', value: 20, color: '#8b5cf6' },
    { name: 'Référencement', value: 15, color: '#f59e0b' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Avancées</h1>
          <p className="text-gray-600 mt-1">Analyses approfondies et métriques de performance</p>
        </div>

        {/* Métriques clés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Taux de Conversion"
            value="24.8%"
            change="+3.2% vs semaine dernière"
            changeType="positive"
            icon={Target}
            color="blue"
          />
          <StatCard
            title="Valeur Client Moyenne"
            value="XOF156"
            change="+12% vs mois dernier"
            changeType="positive"
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Temps de Session"
            value="8m 32s"
            change="+45s vs semaine dernière"
            changeType="positive"
            icon={Activity}
            color="purple"
          />
          <StatCard
            title="Taux de Rebond"
            value="32.1%"
            change="-2.1% vs semaine dernière"
            changeType="positive"
            icon={Zap}
            color="orange"
          />
        </div>

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance hebdomadaire */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Hebdomadaire</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="jour" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenus" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="clients" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-8 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Revenus (XOF)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Clients</span>
              </div>
            </div>
          </div>

          {/* Sources de trafic */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sources de Trafic</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourcesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {sourcesData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analyses détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top produits */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Services</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Service Premium</p>
                    <p className="text-xs text-gray-500">45% des ventes</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">XOF99.99</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Service Standard</p>
                    <p className="text-xs text-gray-500">35% des ventes</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">XOF49.99</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Service Basic</p>
                    <p className="text-xs text-gray-500">20% des ventes</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">XOF29.99</span>
              </div>
            </div>
          </div>

          {/* Métriques de performance */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métriques de Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Taux de conversion</span>
                  <span className="font-medium text-gray-900">24.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '24.8%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Taux de rétention</span>
                  <span className="font-medium text-gray-900">94.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Satisfaction client</span>
                  <span className="font-medium text-gray-900">4.8/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Temps de réponse</span>
                  <span className="font-medium text-gray-900">2.3h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
