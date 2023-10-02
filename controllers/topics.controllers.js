const { fetchTopics } = require("../models/topics.models")


exports.getTopics = (req, res) => {
    fetchTopics()
    .then( (result) => {
        res.status(result.status).send( result.topics )
    })
}