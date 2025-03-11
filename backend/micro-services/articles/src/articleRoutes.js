const express = require('express');
const router = express.Router();
const articleController = require('./articleController');
// il faut le préfixe /

router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticle);

router.post('/createArticle', articleController.createArticle);

router.put('/updateArticle/:id', articleController.updateArticle);

router.delete('/deleteArticle/:id', articleController.deleteArticle);

module.exports = router;