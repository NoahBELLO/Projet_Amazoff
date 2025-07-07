#ifndef CORS_MIDDLEWARE_H
#define CORS_MIDDLEWARE_H

#include <crow.h>

struct CORS
{
    struct context {};

    void before_handle(crow::request& req, crow::response& res, context&)
    {
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type");
        if (req.method == crow::HTTPMethod::Options)
        {
            res.end();
        }
    }

    void after_handle(crow::request&, crow::response& res, context&)
    {
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type");
    }
};

#endif // CORS_MIDDLEWARE_H
