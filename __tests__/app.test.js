const request = require("supertest")
const db = require("../db/connection")
const data = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed")
const app = require("../app")

beforeEach(() => seed(data))

afterAll(() => db.end())

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


    test("status:404, responds with 404 when the topics table is empty", () => {
        return  db.query(`TRUNCATE TABLE topics CASCADE`)
        .then (() => {
        return request(app)
            .get("/api/topics")
            .expect(404)
            .then( ({ body: { msg } }) => {
                expect(msg).toEqual("No topics found")
            })
        })
        
        
    })

})

    
