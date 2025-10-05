export interface Pack {
  id: string;                // Identifiant unique de l'abonnement
  pack: string;              // Nom ou identifiant du pack souscrit
  userId: string;            // Identifiant de l'utilisateur/client
  status: 'actif' | 'inactif' | 'expiré' | string; // Statut de l'abonnement
  nbLivraison: number;       // Nombre de livraisons incluses ou restantes
  dateDebut: string;         // Date de début de l'abonnement (ISO string)
  dateFin?: string;          // Date de fin de l'abonnement (optionnel, ISO string)
  montant: number;           // Montant payé ou à payer
  minOrderAmount?: number;   // Montant minimum de commande (optionnel)
  rayonLivraison?: number;   // Rayon de livraison en km (optionnel)
  isShareable?: boolean;     // Peut être partagé (optionnel)
  maxSharedUsers?: number;   // Nombre max d'utilisateurs partagés (optionnel)
  discountOnOrder?: number;  // Réduction sur commande en % (optionnel)
  otherBenefits?: string;    // Autres
}