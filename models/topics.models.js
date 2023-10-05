const db = require('../db/connection')

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then(( { rows } ) => {
        return { topics: rows}
     })
    }

exports.insertTopic = (newTopic) => {

    if (!newTopic.slug || !newTopic.description) return Promise.reject({ status: 400, msg: "Invalid object (must have slug and description keys)" })

    return db.query('INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;', [newTopic.slug, newTopic.description])
    .then(( { rows } ) => {
        return { topic: rows[0] }
    })

}
