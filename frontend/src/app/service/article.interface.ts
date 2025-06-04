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

export interface ResponseApi {
  error: boolean;
  message?: string;
  rs?: any;
  }
  
//interface de notation d'un article
export interface RatingData {
  articleId: string;
  comments: CommentData;
}

//l'objet notation d'un utilisateur
export interface CommentData {
  comment: string;
  stars: number;
  user_id?: string | null;
  fname?: string | null;
  name?: string | null;
  date_publication?: Date;
}
