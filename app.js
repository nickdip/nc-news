const express = require("express")
const app = express()

const controllers = require("./controllers/index.controllers")

app.use((req, res, next) => {
    validPaths = ["/api/topics"]
    if (!validPaths.includes(req.path)) res.status(404).send({ msg: "Path not found" })
    //console.log("HELLO")
    next()
})

app.get("/api/topics", controllers.topics.getTopics)

module.exports = app