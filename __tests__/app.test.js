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
