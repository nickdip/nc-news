const db = require('../db/connection');
const articleQuery = require("./queries/article.query.js")
const commentsQuery = require("./queries/comments.query.js")

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


    let initialQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`

    newQuery = new articleQuery(userQuery, initialQuery)


    return Promise.all( [ newQuery.topic(), newQuery.sortby(), newQuery.limit(), newQuery.offset() ] )
            .then( () => Promise.all([
                            db.query(newQuery.printQueriesNoPagination()),
                            db.query(newQuery.printQueryAll())
                        ]))
            .then( ( [ allData,   limitedData ]) => { 
                    return { articles: limitedData.rows,
                            total_count: allData.rows.length} 
                } )
}
  

exports.insertComment = ({ username, article_id, votes, created_at, body}) => {
    return db.query(`INSERT INTO comments (author, article_id, votes, created_at, body) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [username, +article_id, votes, created_at, body])
    .then(( { rows }) => { 
        return { comment: rows } })
}


exports.fetchCommentsByArticleId = (userQuery, articleId) => {

    let psqlQuery = `SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC`

    let newQuery = new commentsQuery(userQuery, psqlQuery)
    
    return Promise.all([ newQuery.limit(), newQuery.offset() ])
            .then( () => db.query(newQuery.printQueryAll(), [articleId]))
            .then( ( { rows }) => {
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
    
    return db.query(`INSERT INTO articles (title, body, topic, author, article_img_url, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [title, body, topic, author, article_img_url, created_at])
    .then(( { rows }) => {
        return { article: { comment_count: 0,
                            ...rows[0]
                        }
                    }})

}

exports.deleteArticleById = (articleId) => {

    if (articleId === NaN) return Promise.reject({status: 400, msg: "Invalid article_id"})

    return db.query('DELETE FROM comments WHERE article_id = $1;', [articleId])
    .then( ({ rows} ) => {
        return db.query('DELETE FROM articles WHERE article_id = $1 RETURNING *;', [articleId])
    })
    .then( ({ rows }) => {
        if (!rows.length) return Promise.reject({status: 404, msg: "Article not found"})
    })
}