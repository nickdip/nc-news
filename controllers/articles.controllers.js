
const { fetchArticleById, fetchArticles, fetchCommentsByArticleId, updateArticleById } = require('../models/articles.models')

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

exports.patchArticleById = (req, res, next) => {
    if (!req.body.inc_votes) next({status: 400, msg: "inc_votes key not found"})
    if (Object.keys(req.body).length != 1) next({status: 400, msg: "Invalid object (must only have one key)"})
    updateArticleById(req.params.article_id, req.body.inc_votes).then( (result) => {
        res.status(200).send(result)
    })
    .catch( (err) => next(err) )
}