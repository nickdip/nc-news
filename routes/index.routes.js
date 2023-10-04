const express = require("express")
const router = express.Router()

const { getDescriptions } = require("../controllers/api.controllers")

router.get("/", getDescriptions)

module.exports = router