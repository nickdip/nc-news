
const { fetchArticleById, fetchArticles, fetchCommentsByArticleId, updateArticleById, insertComment } = require('../models/articles.models')

exports.getArticleById = (req, res, next) => {
    fetchArticleById(req.params.article_id).then( ( result ) => {
        return res.status(200).send( result )
    })
    .catch( (err) => {
        next({ msg: "Invalid article_id",
                            ...err
                            })
    })
}

exports.getArticles = (req, res, next) => {
    fetchArticles().then( (result) => res.status(200).send(result))
  }

exports.getCommentsByArticleId = (req, res, next) => {
    fetchCommentsByArticleId(req.params.article_id).then( (result) => {
        return res.status(200).send(result)})
      .catch( (err) => next({ msg: "Invalid article_id",
                            ...err
                            }))
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

