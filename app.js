const express = require("express")
const app = express()

const controllers = require("./controllers/index.controllers")

app.get("/api/topics", controllers.topics.getTopics)

app.use(controllers.errors.handleCustomErrors)
app.use(controllers.errors.handlePSQLErrors)
app.use(controllers.errors.handle500Errors)

module.exports = app