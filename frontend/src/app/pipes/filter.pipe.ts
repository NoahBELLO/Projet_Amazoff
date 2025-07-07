import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchText)
      );
    });
  }
}
@Pipe({
  name: 'filterMagasins',
  standalone: true
})
export class FilterMagasinsPipe implements PipeTransform {
  transform(magasins: any[], searchTerm: string): any[] {
    if (!magasins || !searchTerm) {
      return magasins;
    }
    const lowerTerm = searchTerm.toLowerCase();
    return magasins.filter(magasin =>
      magasin.nom.toLowerCase().includes(lowerTerm) ||
      magasin.ville.toLowerCase().includes(lowerTerm) ||
      magasin.adresse.toLowerCase().includes(lowerTerm)
    );
  }
}