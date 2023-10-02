const request = require("supertest")
const db = require("../db/connection")
const data = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed")
const app = require("../app")

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
        .then(({ body: { msg } }) => {
            expect(msg).toHaveLength(3)
            expect(msg[0].description).toEqual('The man, the Mitch, the legend')
            expect(msg[0].slug).toEqual('mitch')
        })
    })

    

})

    
