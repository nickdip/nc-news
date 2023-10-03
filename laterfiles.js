

// exports.fetchArticles = () => {
//     return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
//     FROM articles
//     LEFT JOIN comments ON articles.article_id = comments.article_id
//     GROUP BY articles.article_id
//     ORDER BY articles.created_at DESC;`)
//     .then( ( { rows }) => {
//         return { articles: rows }
//     })
// }


// describe("GET /api/articles", () => {
//     test("status:200, responds with an array of article objects", () => {
//         return request(app)
//         .get("/api/articles")
//         .expect(200)
//         .then( ( { body: { articles } } ) => {
//             dates = articles.map( (article) => article.created_at = Date.parse(article.created_at ))
//             const articleIdOrder = [3, 6, 2, 12, 13, 5, 1, 9, 10, 4, 8, 11, 7]
//             expect(articles).toHaveLength(13)
//             expect(dates).toBeSorted({ descending: true })
//             articles.forEach( (article, index) => {
//                 expect(article).toHaveProperty("author")
//                 expect(article).toHaveProperty("title")
//                 expect(article).toHaveProperty("article_id")
//                 expect(article).toHaveProperty("topic")
//                 expect(article).toHaveProperty("created_at")
//                 expect(article).toHaveProperty("votes")
//                 expect(article).toHaveProperty("comment_count")
//                 expect(article).not.toHaveProperty("body")
//                 expect(article.article_id).toBe(articleIdOrder[index])
//             })
            
//     })

//     })})



//     exports.getArticles = (req, res, next) => {
//         fetchArticleById(req.params).then( (result) => {
//             if (result.article) res.status(200).send(result)
//             next(result)
//         })}


    