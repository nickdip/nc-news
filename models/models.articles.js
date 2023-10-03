const db = require('../db/connection');

exports.fetchArticleById = (articleId) => {  
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [articleId]).then( ( { rows }) => {
        if (!rows.length) return Promise.reject({status: 404, msg: "Article not found"})
        return { article: rows[0] }
    })}
