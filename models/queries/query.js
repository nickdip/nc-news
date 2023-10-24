

class Query {

    constructor(userQuery, psqlQuery) {
        this.userQuery = userQuery
        this.psqlQuery = { initial: psqlQuery }
    }


    limit() {

        if (this.userQuery.limit) {
            if (isNaN(this.userQuery.limit)) return Promise.reject({status: 400, msg: "Invalid limit query"})
        }
        else this.userQuery.limit = 10
            
        this.psqlQuery.limit = ` LIMIT ${this.userQuery.limit}`

        return Promise.resolve() 

    }

    offset() {

        if (this.userQuery.p) {
            if (isNaN(this.userQuery.p)) return Promise.reject({status: 400, msg: "Invalid p query"})
            this.psqlQuery.offset = ` OFFSET ${(((this.userQuery.p - 1) * this.userQuery.limit))}`
        }

        return Promise.resolve()
    }

    printQueries(executionOrder) {
       let output = ""
       while (executionOrder.length) {
        let current = executionOrder.shift() 
        if (current in this.psqlQuery) output += this.psqlQuery[current]
       }
       return output
    }

    printQueryAll() {
        return this.printQueries(["initial", "where", "group_by", "sort_by", "order", "limit", "offset" ])
    }
    
    printQueriesNoPagination() {
        return this.printQueries(["initial", "where", "group_by", "sort_by", "order" ])
    }

}



module.exports = Query
