const db = require('../db/connection');

exports.fetchArticleById = (articleId) => {  
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [articleId]).then( ( { rows }) => {
        if (!rows.length) return Promise.reject({status: 404, msg: "Article not found"})
        return { article: rows[0] }
    })}

exports.fetchArticles = (userQuery) => {

    const values = userQuery.topic ? [userQuery.topic] : []
    let psqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id `

    if (userQuery.topic) psqlQuery += `WHERE topic = $1 `
    
    psqlQuery += `GROUP BY articles.article_id ORDER BY articles.created_at DESC;`

    return db.query(psqlQuery, values )
    .then( ( { rows } ) => {
        if (!rows.length) return Promise.reject({status: 404, msg: "Topic not found"})
        return { articles: rows } 
    })
}

exports.insertComment = ({ username, article_id, votes, created_at, body}) => {
    return db.query(`INSERT INTO comments (author, article_id, votes, created_at, body) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [username, +article_id, votes, created_at, body])
    .then(( { rows }) => {
        return { comment: rows }
    })
}


exports.fetchCommentsByArticleId = (articleId) => {
    return db.query(`SELECT * FROM comments
                    WHERE article_id = $1
                    ORDER BY created_at DESC;`, [articleId]).then( ( { rows }) => {
        if (!rows.length) return Promise.reject({status: 404, msg: "Article not found"})
        return { comments: rows }
    })
}

exports.updateArticleById = (articleId, inc_votes) => {
    return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;', [inc_votes, articleId])
    .then( ( { rows }) => {
        return { article: rows[0] }
    })

}