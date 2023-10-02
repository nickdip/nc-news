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
        .then(({ body: { topics } }) => {
            expect(topics).toHaveLength(3)
            topics.forEach( (topic, index) => {
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
    
