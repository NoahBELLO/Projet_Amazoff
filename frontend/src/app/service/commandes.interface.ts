export interface CommandeEnCours {
  date_publication: string;
  paiement: string;
  total: number;
  user_id: string;
  commandes: ArticleCommande[];
  numero_commande: number;
}

export interface CommandeLivrees {
  date_publication: string;
  date_livraison: string;
  paiement: string;
  total: number;
  user_id: string;
  commandes: ArticleCommande[];
  numero_commande: number;
}

export interface ArticleCommande {
  article_id: string;
  image: string;
  name: string;
  prix: number;
  quantite: number;
  reduction: number;
  sous_total: number;
}
