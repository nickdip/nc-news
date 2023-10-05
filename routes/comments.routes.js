const express = require("express")
const router = express.Router()

const { deleteCommentById, patchVotesByCommentId } = require("../controllers/comments.controllers")

router.delete("/:comment_id", deleteCommentById)
router.patch("/:comment_id", patchVotesByCommentId)


module.exports = router

