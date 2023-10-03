const express = require("express")
const app = express()

const { api, articles, errors, topics } = require("./controllers")

app.get("/api/topics", topics.getTopics)

app.get("/api", api.getDiscriptions)

app.get("/api/articles/:article_id", articles.getArticleById)

app.get("/api/articles/:article_id/comments", articles.getCommentsByArticleId)

app.get("/api/articles", articles.getArticles)

app.all("*", (req, res) => {
    res.status(404).send({ msg: "Path not found"})
})

app.use(errors.handleCustomErrors)
app.use(errors.handlePSQLErrors)
app.use(errors.handle500Errors)


module.exports = app