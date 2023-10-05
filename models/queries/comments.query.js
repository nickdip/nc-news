const Query = require("./query.js")


class commentsQuery extends Query {

    constructor(userQuery, psqlQuery) {
        super(userQuery, psqlQuery)
    }

}

module.exports = commentsQuery