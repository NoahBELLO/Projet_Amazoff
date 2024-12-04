const ArticleModel = require('./articleModel');


let articleModel;

exports.init = (collection) => {
    articleModel = new ArticleModel(collection);
};

exports.getAllArticles = async (req, res) => {
    try {
        const articles = await articleModel.getAll();
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des articles' });
    }
};

exports.getArticle = async (req, res) => {
    try {
        const id = req.params.id;
        const article = await articleModel.getById(id);
        if (article) {
            res.json(article);
        } else {
            res.status(404).json({ message: 'Article non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération du article' });
    }
};

exports.createArticle = async (req, res) => {
    try {
        const newArticle = {
            name: req.body.name,
            description: req.body.description,
        };

        if (req.body.prix) {
            newArticle.prix = parseFloat(req.body.prix);
        }
        if (req.body.reduction) {
            newArticle.reduction = parseFloat(req.body.reduction);
        }
        if (req.body.prix_kg) {
            newArticle.prix_kg = parseFloat(req.body.prix_kg);
        }
        //inspection des données
        if (articleModel.checkDatas(newArticle) === true) {
            const createdArticle = await articleModel.create(newArticle);
            res.status(201).json(createdArticle);
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.updateArticle = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedFields = {
            name: req.body.name,
            description: req.body.description,
        };

        if (req.body.prix) {
            updatedFields.prix = parseFloat(req.body.prix);
        }
        if (req.body.reduction) {
            updatedFields.reduction = parseFloat(req.body.reduction);
        }
        if (req.body.prix_kg) {
            updatedFields.prix_kg = parseFloat(req.body.prix_kg);
        }

        if (articleModel.checkDatas(updatedFields) === true) {
            const updatedArticle = await articleModel.updateById(id, updatedFields);
            if (updatedArticle === true) {
                res.status(201).json({ message: "Article mis à jour avec succès" });
            }
        } 
    }
    catch (err) {
            res.status(500).json({ error: err });
        }
    };

    exports.deleteArticle = async (req, res) => {
        try {
            const id = req.params.id;
            const success = await articleModel.deleteById(id);
            if (!success) {
                res.status(404).json({ message: 'Article non trouvé' });
            } else {
                res.status(200).json({ message: 'Article supprimé' });
            }
        } catch (err) {
            res.status(500).json({ message: 'Erreur lors de la suppression de l\'article' });
        }
    };




