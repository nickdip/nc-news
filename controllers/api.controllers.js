const { readFile } = require('fs').promises


exports.getDescriptions = (req, res) => {
    readFile("./endpoints.json", "utf8").then( (file) => {
        res.status(200).send({ endpoints: JSON.parse(file) })
    })
}