require('jest-sorted')
const request = require("supertest")
const db = require("../db/connection")
const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed")
const app = require("../app")
const { readFile } = require('fs').promises


beforeEach(() => seed(data))

afterAll(() => db.end())


describe("Invalid", () => {
    test("invalid path", () => {
        return request(app)
            .get("/api/topix")
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Path not found")
            })
        })

})

describe("GET /api/topics", () => {
    test("status:200, responds with an array of topic objects", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
            expect(body).toHaveLength(3)
            body.forEach( (topic, index) => {
                expect(topic.description).toEqual(data.topicData[index].description)
                expect(topic.slug).toEqual(data.topicData[index].slug)
            })
        })
    })
})

describe("GET /api", () => { 
    test("status:200, responds with an object of endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then( ( { body: { endpoints } } ) => {
            readFile("./endpoints.json", "utf8").then( (file) => {
                expect(endpoints).toEqual(JSON.parse(file))
            })
        })
})

})

describe("GET /api/articles/:article_id", () => { 
    test("status:200, responds with article with a given id", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then( ( { body: { article } }) => {
            testArticle = data.articleData[0]
            testArticle.created_at = "2020-07-09T20:11:00.000Z"
            expect(article).toEqual( { 
                                    article_id: 1,
                                    ...testArticle
                                })
        })
    })

    test("status: 404, article not found", () => {
        return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then( ( { body: { msg } } ) => {
            expect(msg).toBe("Article not found")
        })
        })

    test("status: 400: invalid article_id", () => {
        return request(app)
        .get("/api/articles/what")
        .expect(400)
        .then( ( { body: { msg } } ) => {
            expect(msg).toBe("Invalid article_id")
        })
        })




})

describe("GET /api/articles", () => {
    test("status:200, responds with an array of article objects", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then( ( { body: { articles } } ) => {
            dates = articles.map( (article) => article.created_at = Date.parse(article.created_at ))
            const articleIdOrder = [3, 6, 2, 12, 13, 5, 1, 9, 10, 4, 8, 11, 7]
            expect(articles).toHaveLength(13)
            expect(dates).toBeSorted({ descending: true })
            articles.forEach( (article, index) => {
                expect(article).toHaveProperty("author")
                expect(article).toHaveProperty("title")
                expect(article).toHaveProperty("article_id")
                expect(article).toHaveProperty("topic")
                expect(article).toHaveProperty("created_at")
                expect(article).toHaveProperty("votes")
                expect(article).toHaveProperty("comment_count")
                expect(article).not.toHaveProperty("body")
                expect(article.article_id).toBe(articleIdOrder[index])
            })
            
    })

    })})

describe("GET /api/articles", () => {
    test("status:200, responds with an array of article objects", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then( ( { body: { articles } } ) => {
            dates = articles.map( (article) => article.created_at = Date.parse(article.created_at ))
            const articleIdOrder = [3, 6, 2, 12, 13, 5, 1, 9, 10, 4, 8, 11, 7]
            expect(articles).toHaveLength(13)
            expect(dates).toBeSorted({ descending: true })
            articles.forEach( (article, index) => {
                expect(article).toHaveProperty("author")
                expect(article).toHaveProperty("title")
                expect(article).toHaveProperty("article_id")
                expect(article).toHaveProperty("topic")
                expect(article).toHaveProperty("created_at")
                expect(article).toHaveProperty("votes")
                expect(article).toHaveProperty("comment_count")
                expect(article).not.toHaveProperty("body")
                expect(article.article_id).toBe(articleIdOrder[index])
            })
            
    })

    })})

describe("GET /api/articles/:articleid/comments", () => {
    test("200: responds with an array of comments for a given article_id", () => {
        return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then( ( { body: { comments } } ) => {
            expected =  [
                        {
                        comment_id: 11,
                        body: 'Ambidextrous marsupial',
                        article_id: 3,
                        author: 'icellusedkars',
                        votes: 0,
                        created_at: '2020-09-19T23:10:00.000Z'
                        },
                        {
                        comment_id: 10,
                        body: 'git push origin master',
                        article_id: 3,
                        author: 'icellusedkars',
                        votes: 0,
                        created_at: '2020-06-20T07:24:00.000Z'
                        }
                    ]
            expect(comments).toHaveLength(2)
            expect(comments).toEqual(expected)
        })
    })
    test("404: article not found", () => {
        return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then( ( { body: { msg } } ) => {
            expect(msg).toBe("Article not found")
        })})
    test("400: invalid article_id", () => {
        return request(app)
        .get("/api/articles/northcoders/comments")
        .expect(400)
        .then( ( { body: { msg } } ) => {
            expect(msg).toBe("Invalid article_id")
        })})
})

describe("DELETE /api/comments/:comment_id", () => {
    test("204: deletes comment with given comment_id", () => {
        return request(app)
        .delete("/api/comments/1")
        .expect(204)
    })
    test("404: comment not found", () => {
        return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then( ( { body: { msg } } ) => {
            expect(msg).toBe("Comment not found")
        })})
        
    test("400: invalid comment_id", () => {
        return request(app)
        .delete("/api/comments/northcoders")
        .expect(400)
        .then( ( { body: { msg } } ) => {
            expect(msg).toBe("Invalid comment_id")
        })
    })
})