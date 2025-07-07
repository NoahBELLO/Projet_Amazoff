import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Magasin {
capacite_stock: any;
ville: any;
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
  private apiUrl = 'http://localhost:7001/magasins'; 

  constructor(private http: HttpClient) {}

  getMagasins(): Observable<Magasin[]> {
    return this.http.get<Magasin[]>(this.apiUrl);
  }
}
