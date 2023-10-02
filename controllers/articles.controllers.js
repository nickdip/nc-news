
const { fetchArticleById } = require('../models/models.articles')

exports.getArticleById = (req, res, next) => {
    fetchArticleById(req.params.article_id).then( (result) => {
        if (result.article) res.status(200).send(result.article)
        next(result)
})}

