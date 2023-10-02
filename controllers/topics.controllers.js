const { fetchTopics } = require("../models/topics.models")


exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then( (result) => {
        if (result.status === 200) res.status(200).send( { topics: result.topics })
        else return Promise.reject(result)
    })
    .catch( (err) => {
        next(err)})
}