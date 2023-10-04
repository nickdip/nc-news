const db = require('../db/connection');
const data = require('../db/data/test-data')

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

exports.fetchArticles = async (userQuery) => {

    function topicQuery() {
        if (userQuery.topic) {
            if (!validTopics.includes(userQuery.topic)) return Promise.reject({status: 404, msg: "Topic not found"})
            psqlQuery += ` WHERE topic = $1 `
            params.push(userQuery.topic)
        }
        psqlQuery += `GROUP BY articles.article_id`
        return Promise.resolve()
    } 


    function sortbyQuery() {
        if (userQuery.sort_by) {
            if (!validSortBy.includes(userQuery.sort_by)) return Promise.reject({status: 400, msg: "Invalid sort_by query"})
            psqlQuery += ` ORDER BY ${userQuery.sort_by} `
        }
        return Promise.resolve()
    }
    function orderQuery() {
        if (userQuery.order) {
            if (userQuery.order !== 'asc' && userQuery.order !== 'desc') return Promise.reject({status: 400, msg: "Invalid order query"})
            psqlQuery += ` ${userQuery.order} `
        }
        return Promise.resolve()
    }


    validTopics = data.topicData.map( (topic) => topic.slug)
    validSortBy = Object.keys(data.articleData[0])

    const params = []

    let psqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id `

    return Promise.all([topicQuery(), sortbyQuery(), orderQuery()])
            .then( () => db.query(psqlQuery, params))
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