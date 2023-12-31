const Query = require("./query.js")

class articleQuery extends Query {

    constructor(userQuery, psqlQuery) {
        super(userQuery, psqlQuery)
    }

    topic() {

        if (this.userQuery.topic) {
            this.psqlQuery.where = ` WHERE topic = '${this.userQuery.topic}'`
        }
        this.psqlQuery.group_by = ` GROUP BY articles.article_id`


        return Promise.resolve()
    }

    sortby() {

        const order = () => {

            if (this.userQuery.order) {
                if (this.userQuery.order !== 'asc' && this.userQuery.order !== 'desc') return Promise.reject({status: 400, msg: "Invalid order query"})
                this.psqlQuery.order = ` ${this.userQuery.order}`
            }
            else {
                this.psqlQuery.order = ` desc`
            }
    
            return Promise.resolve()
        }

        const validSortBy = ["title", "author", "article_id", "topic", "created_at", "votes", "comment_count"]
        if (this.userQuery.sort_by) {
            if (!validSortBy.includes(this.userQuery.sort_by)) return Promise.reject({status: 400, msg: "Invalid sort_by query"})
            this.psqlQuery.sort_by = ` ORDER BY ${this.userQuery.sort_by}`
        }
        else this.psqlQuery.sort_by = ` ORDER BY created_at`

        return order()
    }
    
}

module.exports = articleQuery