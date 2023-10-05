const express = require("express")
const router = express.Router()

const { getArticles, postArticle, getArticleById, getCommentsByArticleId, patchArticleById, postComment, removeArticleById } = require("../controllers/articles.controllers")

router.get("/", getArticles)
router.post("/", postArticle)
router.get("/:article_id", getArticleById)
router.get("/:article_id/comments", getCommentsByArticleId)
router.patch("/:article_id", patchArticleById)
router.post("/:article_id/comments", postComment)
router.delete("/:article_id", removeArticleById)

module.exports = router