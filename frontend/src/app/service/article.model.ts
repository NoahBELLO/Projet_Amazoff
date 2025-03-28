export interface Article {
    id: string;
    name: string;
    image?: string; // Champ optionnel
    prix: number;
    stars: number;
    reduction?: number; // Champ optionnel
    description: string; // Champ optionnel
  }