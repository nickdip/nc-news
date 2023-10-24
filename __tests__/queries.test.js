
const Query = require('../models/queries/query')
const articleQuery = require('../models/queries/article.query')

describe("Query", () => {
    
    test("returns a query object", () => {
        expect( new Query('','') ).toBeInstanceOf(Query)
    })

    test("constructor assigns the correct values", () => {
        const testQuery = new Query('test1', 'test2')
        expect(testQuery.userQuery ).toBe('test1')
        expect(testQuery.psqlQuery.initial).toBe('test2')
    })

    describe("limit()", () => {

        test("limit() returns a promise", () => {
            const testQuery = new Query({}, 'SELECT * FROM articles')
            expect(testQuery.limit()).toBeInstanceOf(Promise)
        })

        test("limit() returns a rejected promise if limit is not a number", () => {
            const testQuery = new Query({limit: 'test1'}, 'SELECT * FROM articles')
            return expect(testQuery.limit() ).rejects.toEqual({status: 400, msg: "Invalid limit query"})
        })

        test("limit() returns a resolved promise if limit is a number", () => {
            const testQuery = new Query({limit: 10}, 'SELECT * FROM articles')
            return expect(testQuery.limit()).resolves.toBeUndefined()
        })

        test("limit() sets the correct limit in the psqlQuery object", () => {
            const testQuery = new Query({limit: 10}, 'SELECT * FROM articles')
            testQuery.limit()
            expect(testQuery.psqlQuery.limit).toBe(` LIMIT 10`)
        })
    
    })

    describe("offset()", () => { 

        test("offset() returns a promise", () => {
            const testQuery = new Query({}, 'SELECT * FROM articles')
            expect(testQuery.offset()).toBeInstanceOf(Promise)
        })

        test("offset() returns a rejected promise if p is not a number", () => {
            const testQuery = new Query({p: 'test1'}, 'SELECT * FROM articles')
            return expect(testQuery.offset() ).rejects.toEqual({status: 400, msg: "Invalid p query"})
        })

        test("offset() returns a resolved promise if p is a number", () => {
            const testQuery = new Query({p: 1}, 'SELECT * FROM articles')
            return expect(testQuery.offset()).resolves.toBeUndefined()
        })

        test("offset() sets the correct offset in the psqlQuery object when given 'p", () => {
            const testQuery = new Query({p: 1}, 'SELECT * FROM articles')
            testQuery.limit()
            testQuery.offset()
            expect(testQuery.psqlQuery.offset).toBe(` OFFSET 0`)
        })

        test("offset() sets the correct offset in the psqlQuery object when giving 'p' and 'limit'", () => {
            const testQuery = new Query({p: 2, limit: 10}, 'SELECT * FROM articles')
            testQuery.limit()
            testQuery.offset()
            expect(testQuery.psqlQuery.offset).toBe(` OFFSET 10`)
        })
    
    })



    describe("printQueries()", () => {


        test("printQueries() returns an empty string when an empty array is inputted", () => {
            const testQuery = new Query({}, 'SELECT * FROM articles')
            expect(testQuery.printQueries([])).toBe("")
        })

        test("printQueries() returns a string", () => {
            const testQuery = new Query({}, 'SELECT * FROM articles')
            expect(typeof testQuery.printQueries(["initial", "where", "group_by", "sort_by", "order", "limit", "offset" ])).toBe("string")
        })

        test("printQueries() returns the correct string when no methods are invoked", () => {
            const testQuery = new Query({}, 'SELECT * FROM articles')
            expect(testQuery.printQueries(["initial", "where", "group_by", "sort_by", "order", "limit", "offset" ])).toBe("SELECT * FROM articles")
        })

        test("printQueries() returns the correct string when limit() is invoked", () => {
            const testQuery = new Query({limit: 10}, 'SELECT * FROM articles')
            testQuery.limit()
            expect(testQuery.printQueries(["initial", "where", "group_by", "sort_by", "order", "limit", "offset" ])).toBe("SELECT * FROM articles LIMIT 10")
        })

        test("printQueries() returns the correct string when limit() and offset() are invoked", () => {
            const testQuery = new Query({limit: 10, p: 2}, 'SELECT * FROM articles')
            testQuery.limit()
            testQuery.offset()
            expect(testQuery.printQueries(["initial", "where", "group_by", "sort_by", "order", "limit", "offset" ])).toBe("SELECT * FROM articles LIMIT 10 OFFSET 10")
        })

    })

})

describe("articleQuery", () => {

    test("returns an articleQuery object", () => {
        expect( new articleQuery('','') ).toBeInstanceOf(articleQuery)
    })

    test("constructor assigns the correct values", () => {
        const testQuery = new articleQuery('test1', 'test2')
        expect(testQuery.userQuery ).toBe('test1')
        expect(testQuery.psqlQuery.initial).toBe('test2')
    })

    describe("topic()", () => {

        test("topic() returns a promise", () => {
            const testQuery = new articleQuery({}, 'SELECT * FROM articles')
            expect(testQuery.topic()).toBeInstanceOf(Promise)
        })


        test("topic() sets the correct where in the psqlQuery object when given a valid topic", () => {
            const testQuery = new articleQuery({topic: 'mitch'}, 'SELECT * FROM articles')
            testQuery.topic()
            expect(testQuery.psqlQuery.where).toBe(` WHERE topic = 'mitch'`)
        })

    })

    describe("sortby()", () => {
        test("sortby() returns a promise", () => {
            const testQuery = new articleQuery({}, 'SELECT * FROM articles')
            expect(testQuery.sortby()).toBeInstanceOf(Promise)
        })

        test("sortby() returns a resolved promise if sort_by is not given", () => {
            const testQuery = new articleQuery({}, 'SELECT * FROM articles')
            return expect(testQuery.sortby()).resolves.toBeUndefined()
        })

        test("sortby() returns a resolved promise if sort_by is a valid column", () => {
            const testQuery = new articleQuery({sort_by: 'title'}, 'SELECT * FROM articles')
            return expect(testQuery.sortby()).resolves.toBeUndefined()
        })

        test("sortby() returns a rejected promise if sort_by is not a valid column", () => {
            const testQuery = new articleQuery({sort_by: 'test1'}, 'SELECT * FROM articles')
            return expect(testQuery.sortby() ).rejects.toEqual({status: 400, msg: "Invalid sort_by query"})
        })

        test("sortby() sets the correct sort_by in the psqlQuery object when given a valid column", () => {
            const testQuery = new articleQuery({sort_by: 'title'}, 'SELECT * FROM articles')
            testQuery.sortby()
            expect(testQuery.psqlQuery.sort_by).toBe(` ORDER BY title`)
        })

        test("sortby() sets the correct sort_by in the psqlQuery object when given a valid column", () => {
            const testQuery = new articleQuery({sort_by: 'title'}, 'SELECT * FROM articles')
            testQuery.sortby()
            expect(testQuery.psqlQuery.sort_by).toBe(` ORDER BY title`)
        })

        test("sortby sets the order as 'desc' if order is not given", () => {
            const testQuery = new articleQuery({sort_by: 'title'}, 'SELECT * FROM articles')
            testQuery.sortby()
            expect(testQuery.psqlQuery.order).toBe(` desc`)
        })
        
        test("sortby() sets the correct sort_by in the psqlQuery object when ascending order is given", () => {
            const testQuery = new articleQuery({sort_by: 'title', order: 'asc'}, 'SELECT * FROM articles')
            testQuery.sortby()
            expect(testQuery.psqlQuery.sort_by).toBe(` ORDER BY title`)
            expect(testQuery.psqlQuery.order).toBe(` asc`)
        })

        test("sortby() sets the correct sort_by in the psqlQuery object when descending order is given", () => {
            const testQuery = new articleQuery({sort_by: 'title', order: 'desc'}, 'SELECT * FROM articles')
            testQuery.sortby()
            expect(testQuery.psqlQuery.sort_by).toBe(` ORDER BY title`)
            expect(testQuery.psqlQuery.order).toBe(` desc`)
        })

        test("sortby() returns a rejected promise if order is not 'asc' or 'desc'", () => {
            const testQuery = new articleQuery({sort_by: 'title', order: 'test1'}, 'SELECT * FROM articles')
            return expect(testQuery.sortby() ).rejects.toEqual({status: 400, msg: "Invalid order query"})
        })
    })

    describe("printQueryAll()", () => {
        test("printQueryAll() returns a complete query", () => {
            const testQuery = new articleQuery({sort_by: 'title', order: 'desc', limit: 10, p: 2, topic: "mitch"}, 'SELECT * FROM articles')
            testQuery.topic()
            testQuery.sortby()
            testQuery.limit()
            testQuery.offset()
            expect(testQuery.printQueryAll()).toBe("SELECT * FROM articles WHERE topic = 'mitch' GROUP BY articles.article_id ORDER BY title desc LIMIT 10 OFFSET 10")
        })
    })

    describe("printQueriesNoPagination()", () => {
        test("printQueriesNoPagination() returns a complete query without pagination", () => {
            const testQuery = new articleQuery({sort_by: 'title', order: 'desc', limit: 10, p: 2, topic: "mitch"}, 'SELECT * FROM articles')
            testQuery.topic()
            testQuery.sortby()
            testQuery.limit()
            testQuery.offset()
            expect(testQuery.printQueriesNoPagination()).toBe("SELECT * FROM articles WHERE topic = 'mitch' GROUP BY articles.article_id ORDER BY title desc")
        })
    })
})