const db = require('../db/connection')

exports.fetchTopics = (req, res, next) => {
    return db.query('SELECT * FROM topics;').then(( { rows } ) => {
        if (!rows.length) return { status: 404, msg: 'No topics found' }
        return { status: 200, topics: rows}
     })
     .catch((err) => {
        if (err.code === "42P01") return Promise.reject({code: "42P01", msg: 'Database Error: Table does not exist'})
        return Promise.reject({status: 500, msg: 'Internal Server Error'})
     })
    }
