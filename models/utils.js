
const data = require('../db/data/test-data')


class Query {

    constructor(userQuery) {
        this.userQuery = userQuery
        this.psqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id `
        this.params = []
    }

    topic() {
        const validTopics = data.topicData.map( (topic) => topic.slug)

        if (this.userQuery.topic) {
            if (!validTopics.includes(this.userQuery.topic)) return Promise.reject({status: 404, msg: "Topic not found"})
            this.psqlQuery += ` WHERE topic = $1 `
            this.params.push(this.userQuery.topic)
        }
        this.psqlQuery += `GROUP BY articles.article_id`

        return Promise.resolve()
    }

    sortby() {
        const validSortBy = Object.keys(data.articleData[0])
        if (this.userQuery.sort_by) {
            if (!validSortBy.includes(this.userQuery.sort_by)) return Promise.reject({status: 400, msg: "Invalid sort_by query"})
            this.psqlQuery += ` ORDER BY ${this.userQuery.sort_by} `
        }
        else this.psqlQuery += ` ORDER BY created_at `
        return Promise.resolve()
    }
    
    order() {
        if (this.userQuery.order) {
            if (this.userQuery.order !== 'asc' && this.userQuery.order !== 'desc') return Promise.reject({status: 400, msg: "Invalid order query"})
            this.psqlQuery += ` ${this.userQuery.order} `
        }
        else {
            this.psqlQuery += ` DESC `
        }
        return Promise.resolve()
    }

    limit() {
        if (this.userQuery.limit) {
            if (isNaN(this.userQuery.limit)) return Promise.reject({status: 400, msg: "Invalid limit query"})
        }
        else this.userQuery.limit = 10
        this.psqlQuery += ` LIMIT ${this.userQuery.limit}`
        return Promise.resolve() 

    }

    offset() {
        if (this.userQuery.p) {
            if (isNaN(this.userQuery.p)) return Promise.reject({status: 400, msg: "Invalid p query"})
            console.log(((this.userQuery.p - 1) * this.userQuery.limit) + 1)
            this.psqlQuery += ` OFFSET ${(((this.userQuery.p - 1) * this.userQuery.limit))}`
        }
        return Promise.resolve()
    }



}

module.exports = Query
