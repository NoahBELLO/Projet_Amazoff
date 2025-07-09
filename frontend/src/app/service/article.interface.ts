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

//@ todo flo refaire les réponses des avis pour coller avec les tables
//interface de notation d'un article 
export interface RatingData {
  articleId: string;
  comment: string;
  id_maria?: number,
  stars: number,
  user_id?: string
  date_publication?: string,
  fname?: string,
  name?: string,

}

export interface Notifications {
  userId: string;
  message?: string;
  title?: string;
  type: string;
  requestId: string;
  redirectUrl: string
  data: object;
  status: string;
  createdAt: Date
};