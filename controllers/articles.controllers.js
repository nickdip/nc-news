
const { fetchArticleById, fetchArticles, fetchCommentsByArticleId } = require('../models/models.articles')

exports.getArticleById = (req, res, next) => {
    fetchArticleById(req.params.article_id).then( ( result ) => {
        return res.status(200).send( result )
    })
    .catch( (err) => {
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    fetchArticles().then( (result) => res.status(200).send(result))
  }

exports.getCommentsByArticleId = (req, res, next) => {
    fetchCommentsByArticleId(req.params.article_id).then( (result) => {
        return res.status(200).send(result)
    }).catch( (err) => next(err) )
}

