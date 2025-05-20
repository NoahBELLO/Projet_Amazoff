export interface Article {
    id: string;
    name: string;
    image?: string; 
    prix: number;
    stars: number;
    reduction?: number; 
    description: string; 
    sous_total?: number;
    stock: number;
    quantite_utilisateur?: number;
  }