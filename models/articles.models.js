const db = require('../db/connection');
const Query = require("./utils.js")

exports.fetchArticleById = (articleId) => {  
    return db.query(`SELECT articles.*,
                    COUNT(comments.article_id) AS comment_count 
                    FROM articles
                    LEFT JOIN comments
                    ON comments.article_id = articles.article_id
                    WHERE articles.article_id = $1
                    GROUP BY articles.article_id;`, [articleId]).then( ( { rows }) => {
        if (!rows.length) return Promise.reject({status: 404, msg: "Article not found"})
        return { article: rows[0] }
    })}

exports.fetchArticles = (userQuery) => {

    newQuery = new Query(userQuery)

    return Promise.all([newQuery.topic(), newQuery.sortby(), newQuery.order(), newQuery.limit(), newQuery.offset()])
            .then( () => db.query(newQuery.psqlQuery, newQuery.params))
            .then( ( { rows }) => { return { articles: rows } } )

    
}
  

exports.insertComment = ({ username, article_id, votes, created_at, body}) => {
    return db.query(`INSERT INTO comments (author, article_id, votes, created_at, body) params ($1, $2, $3, $4, $5) RETURNING *`, [username, +article_id, votes, created_at, body])
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

exports.insertArticle = ({ title, body, topic, author, article_img_url }) => {

    if (!(title && body && topic && author)) return Promise.reject({status: 400, msg: "Invalid object (must have title, body, topic and author keys)"})

    //some default picture here
    if (!article_img_url) article_img_url = "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"

    created_at = new Date()

    console.log(created_at)
    
    return db.query(`INSERT INTO articles (title, body, topic, author, article_img_url, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [title, body, topic, author, article_img_url, created_at])
    .then(( { rows }) => {
        return { article: { comment_count: 0,
                            ...rows[0]
                        }
                    }})

}

