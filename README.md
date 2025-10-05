# Kaba Abonnements Dashboard

Un dashboard moderne et élégant pour la gestion des abonnements clients, construit avec Next.js, TypeScript, Tailwind CSS et Recharts.

## 🚀 Fonctionnalités

### Dashboard Principal
- **Vue d'ensemble** : Statistiques clés en temps réel
- **Graphiques interactifs** : Évolution des abonnements avec Recharts
- **Tableau des clients** : Liste complète avec statuts et actions
- **Métriques de performance** : Taux de conversion, revenus, etc.

### Pages Disponibles
- **Dashboard** (`/`) : Vue d'ensemble principale
- **Liste des Abonnements** (`/abonnements`) : Gestion complète des abonnements
- **Clients** (`/clients`) : Base de données clients avec gestion
- **Statistiques** (`/statistiques`) : Analyses détaillées et graphiques
- **Rapports** (`/rapports`) : Génération et consultation de rapports
- **Analytics** (`/analytics`) : Métriques avancées et performance

### Composants Réutilisables
- **Layout** : Structure principale avec Header, Sidebar et Footer
- **StatCard** : Cartes de statistiques avec icônes et couleurs
- **SubscriptionChart** : Graphiques d'évolution des abonnements
- **ClientTable** : Tableau interactif des clients

## 🎨 Design

- **Interface moderne** : Design épuré avec Tailwind CSS
- **Responsive** : Compatible mobile, tablette et desktop
- **Couleurs harmonieuses** : Palette bleu/violet professionnelle
- **Animations subtiles** : Transitions fluides et hover effects
- **Icônes Lucide** : Icônes modernes et cohérentes

## 🛠️ Technologies Utilisées

- **Next.js 15** : Framework React avec SSR
- **TypeScript** : Typage statique pour la robustesse
- **Tailwind CSS 4** : Framework CSS utilitaire
- **Recharts** : Bibliothèque de graphiques React
- **Lucide React** : Icônes modernes

## 📦 Installation

1. **Cloner le projet** :
```bash
git clone <repository-url>
cd kaba-abn
```

2. **Installer les dépendances** :
```bash
npm install
```

3. **Lancer le serveur de développement** :
```bash
npm run dev
```

4. **Ouvrir dans le navigateur** :
```
http://localhost:3000
```

## 📁 Structure du Projet

```
kaba-abn/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── dashboard/
│       ├── StatCard.tsx
│       ├── SubscriptionChart.tsx
│       └── ClientTable.tsx
├── pages/
│   ├── index.tsx (Dashboard)
│   ├── abonnements.tsx
│   ├── clients.tsx
│   ├── statistiques.tsx
│   ├── rapports.tsx
│   └── analytics.tsx
├── styles/
│   └── globals.css
└── package.json
```

## 🎯 Fonctionnalités Clés

### Navigation
- **Sidebar fixe** avec navigation principale
- **Header** avec recherche et profil utilisateur
- **Breadcrumbs** pour la navigation contextuelle

### Données
- **Statistiques en temps réel** : Clients, abonnements, revenus
- **Graphiques interactifs** : Évolution mensuelle, répartition par service
- **Tableaux de données** : Clients, abonnements avec filtres

### Actions
- **CRUD complet** : Créer, lire, modifier, supprimer
- **Filtres avancés** : Recherche et tri par critères
- **Export de données** : Rapports en PDF/Excel
- **Notifications** : Système d'alertes intégré

## 🎨 Personnalisation

### Couleurs
Les couleurs principales sont définies dans Tailwind :
- **Bleu** : `#3b82f6` (Primary)
- **Vert** : `#10b981` (Success)
- **Violet** : `#8b5cf6` (Secondary)
- **Orange** : `#f59e0b` (Warning)
- **Rouge** : `#ef4444` (Error)

### Composants
Tous les composants sont modulaires et réutilisables. Vous pouvez facilement :
- Modifier les couleurs dans `StatCard.tsx`
- Ajouter de nouveaux graphiques dans `SubscriptionChart.tsx`
- Étendre les tableaux dans `ClientTable.tsx`

## 📊 Métriques Disponibles

- **Clients** : Total, actifs, inactifs, nouveaux
- **Abonnements** : Actifs, expirés, en attente
- **Revenus** : Mensuels, annuels, par service
- **Performance** : Taux de conversion, rétention, satisfaction

## 🔧 Scripts Disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Vérification du code
```

## 📱 Responsive Design

Le dashboard est entièrement responsive :
- **Mobile** : Navigation adaptée, cartes empilées
- **Tablette** : Layout intermédiaire optimisé
- **Desktop** : Interface complète avec sidebar fixe

## 🚀 Déploiement

Le projet est prêt pour le déploiement sur :
- **Vercel** (recommandé pour Next.js)
- **Netlify**
- **AWS Amplify**
- **Serveur VPS** classique

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**Kaba Abonnements Dashboard** - Gestion moderne des abonnements clients
