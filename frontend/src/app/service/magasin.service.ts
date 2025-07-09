import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Magasin {
  capacite_stock: any;
  current_stock?: any;
  ville: any;
  email: string;
  telephone: string;
  responsable_email: string;
  _id?: string;
  nom: string;
  adresse: string;
  responsable: string;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class MagasinService {
  private apiUrl = 'http://localhost:3001/magasins/';

  constructor(private http: HttpClient) { }

  getMagasins(): Observable<Magasin[]> {
    return this.http.get<Magasin[]>(`${this.apiUrl}magasins`);
  }

  /* updateMagasin(magasin: Magasin): Observable<Magasin> {
    const id = magasin._id || (magasin as any).id;
    return this.http.put<Magasin>(`${this.apiUrl}magasins/update/${id}`, magasin);
  } */
}
