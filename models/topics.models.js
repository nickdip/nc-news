const db = require('../db/connection')

exports.fetchTopics = (req, res, next) => {
    return db.query('SELECT * FROM topics;').then(( { rows } ) => {
        return { status: 200, topics: rows}
     })
    }
