const express = require("express")
const app = express()

const api  = require("./routes/index.routes")
const articles = require("./routes/articles.routes")
const comments = require("./routes/comments.routes")
const users = require("./routes/users.routes")
const topics = require("./routes/topics.routes")
const errors = require("./controllers/errors.controllers")

app.use(express.json())

app.use("/api", api)

app.use("/api/articles", articles)

app.use("/api/comments", comments)

app.use("/api/users", users)

app.use("/api/topics", topics)

app.use(errors.handleCustomErrors)
app.use(errors.handlePSQLErrors)
app.use(errors.handle500Errors)

app.all("*", (req, res) => {
    res.status(404).send({ msg: "Path not found"})
})


module.exports = app