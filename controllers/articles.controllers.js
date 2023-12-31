
const { fetchArticleById, fetchArticles, fetchCommentsByArticleId, updateArticleById, insertComment, insertArticle,  deleteArticleById } = require('../models/articles.models')

exports.getArticleById = (req, res, next) => {
    fetchArticleById(req.params.article_id).then( ( result ) => {
        return res.status(200).send( result )
    })
    .catch( (err) => next(err) )
}

exports.getArticles = (req, res, next) => {
    fetchArticles(req.query).then( (result) => res.status(200).send(result))
    .catch( (err) => next(err) )
  }

exports.getCommentsByArticleId = (req, res, next) => {
    fetchCommentsByArticleId(req.query, req.params.article_id).then( (result) => {
        return res.status(200).send(result)})
      .catch( (err) => next(err))
}


exports.patchArticleById = (req, res, next) => {
    if (!req.body.inc_votes) next({status: 400, msg: "inc_votes key not found"})
    if (Object.keys(req.body).length != 1) next({status: 400, msg: "Invalid object (must only have one key)"})
    updateArticleById(req.params.article_id, req.body.inc_votes).then( (result) => {
        res.status(200).send(result)
    })
    .catch( (err) => next(err) )
}

exports.postComment = (req, res, next) => {
    const newComment = req.body
    newComment.article_id = req.params.article_id
    newComment.created_at = new Date()
    newComment.votes = 0
    insertComment(newComment).then( (result) => {
        res.status(201).send(result)
    })
    .catch( (err) => {
        next(err)
    })
}

exports.postArticle = (req, res, next) => {
    insertArticle(req.body).then( (result) => {
        res.status(201).send(result)
    })
    .catch( (err) => {
        next(err)
    })
}

exports.removeArticleById = (req, res, next) => {
    deleteArticleById(req.params.article_id).then( (result) => {
        res.status(204).send(result)
    })
    .catch( (err) => next(err) )

}
