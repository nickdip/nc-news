const express = require("express")
const app = express()

const controllers = require("./controllers/index.controllers")

app.get("/api/topics", controllers.topics.getTopics)

app.get("/api", controllers.api.getDiscriptions)

app.get("/api/articles/:article_id", controllers.articles.getArticleById)


app.use(controllers.errors.handleCustomErrors)
app.use(controllers.errors.handlePSQLErrors)
app.use(controllers.errors.handle500Errors)


app.all("*", (req, res) => {
    res.status(404).send({ msg: "Path not found"})
})



module.exports = app