#ifndef MAGASIN_H
#define MAGASIN_H

#include <string>
#include <bsoncxx/builder/stream/document.hpp>
#include <bsoncxx/json.hpp>

class Magasin
{
public:
    std::string nom;
    std::string adresse;
    std::string ville;
    std::string email;
    std::string telephone;
    std::string responsable_nom;
    std::string responsable_email;
    int current_stock;
    int capacite_stock;

Magasin(std::string nom, std::string adresse, std::string ville,
        std::string email, std::string telephone,
        std::string responsable_nom, std::string responsable_email,
        int capacite_stock, int current_stock);


    bsoncxx::document::value to_bson() const;
};

#endif
