export interface Article {
    id: string;
    name: string;
    image?: string; 
    prix: number;
    stars: number;
    reduction?: number; 
    description: string; 
  }