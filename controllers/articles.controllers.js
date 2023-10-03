
const { fetchArticleById, fetchArticles, insertComment } = require('../models/articles.models')
const { convertTimestampToDate } = require("../db/seeds/utils")

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