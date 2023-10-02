const express = require("express")
const app = express()

const controllers = require("./controllers/index.controllers")

app.get("/api/topics", controllers.topics.getTopics)

app.get("/api", controllers.api.getDiscriptions)

app.all("*", (req, res) => {
    res.status(404).send({ msg: "Path not found"})
})


module.exports = app