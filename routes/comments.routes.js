const express = require("express")
const router = express.Router()

const { deleteCommentById } = require("../controllers/comments.controllers")

router.delete("/:comment_id", deleteCommentById)

module.exports = router

