const { fetchTopics, insertTopic } = require("../models/topics.models")


exports.getTopics = (req, res) => {
    fetchTopics()
    .then( (result) => {
        res.status(result.status).send( result.topics )
    })
}

exports.postTopic = (req, res, next) => {
    insertTopic(req.body)
    .then( (result) => {
        res.status(201).send( result )
    })
    .catch( (err) => next(err) )
}