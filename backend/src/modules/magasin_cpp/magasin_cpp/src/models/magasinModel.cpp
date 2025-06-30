#include "magasinModel.h"

Magasin::Magasin(std::string nom, std::string adresse, std::string ville,
                 std::string email, std::string telephone,
                 std::string responsable_nom, std::string responsable_email,
                 int capacite_stock)
    : nom(nom), adresse(adresse), ville(ville),
      email(email), telephone(telephone),
      responsable_nom(responsable_nom), responsable_email(responsable_email),
      capacite_stock(capacite_stock) {}

bsoncxx::document::value Magasin::to_bson() const {
    return bsoncxx::builder::stream::document{}
        << "nom" << nom
        << "adresse" << adresse
        << "ville" << ville
        << "email" << email
        << "telephone" << telephone
        << "responsable_nom" << responsable_nom
        << "responsable_email" << responsable_email
        << "capacite_stock" << capacite_stock
        << bsoncxx::builder::stream::finalize;
}
