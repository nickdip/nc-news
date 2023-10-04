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
            testArticle.article_id = 1
            expect(article.article_id).toBe(testArticle.article_id)
            expect(article.title).toBe(testArticle.title)
            expect(article.body).toBe(testArticle.body)
            expect(article.votes).toBe(testArticle.votes)
            expect(article.topic).toBe(testArticle.topic)
            expect(article.author).toBe(testArticle.author)
            expect(article.created_at).toBe(testArticle.created_at)
            
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
            expect(msg).toBe("PSQL Error inserting data")
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
            expect(msg).toBe("PSQL Error inserting data")
        })})
})

describe("POST /api/articles/:article_id/comments", () => {
    test("status:201, responds with posted comment", () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "rogersop", body: "test comment"})
        .expect(201)
        .then( ( { body: { comment } } ) => {
            expect(comment[0].comment_id).toBe(19)
            expect(comment[0].body).toBe("test comment")
            expect(comment[0].article_id).toBe(1)
            expect(comment[0].author).toBe("rogersop")
            expect(comment[0].votes).toBe(0)
            const datePattern =  /20\d\d-\d\d-\d\d\w\d\d:\d\d:\d\d.\d\d\d\w/
            expect(comment[0].created_at).toMatch(datePattern)
        })

    })

    test("status:400, invalid article_id", () => {
        return request(app)
        .post("/api/articles/what/comments")
        .send({ username: "rogersop", body: "test comment"})
        .expect(400)
        .then( ( { body: { msg } } ) => {
            expect(msg).toBe("PSQL Error inserting data")
        })
    })
    test("status:400, article id not in database", () => {
        return request(app) 
        .post("/api/articles/400/comments")     
        .send({ username: "rogersop", body: "test comment"})
        .expect(400)
        .then( ( { body: { msg } } ) => {
            expect(msg).toBe("PSQL Error inserting data")
        })})
  
    test("status: 400, username not found", () => {
        return request(app)
        .post("/api/articles/1/comments")  
        .send({ username: "nickdip", body: "test comment"})
        .expect(400)
        .then( ( { body: { msg } } ) => {
            expect(msg).toBe("PSQL Error inserting data")
        })}
    )

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
            expect(msg).toBe("PSQL Error inserting data")
        })
    })
})


describe("GET /api/users", () => {
    
    test("200: responds with an array of users", () => {
        return request(app)
        .get("/api/users/")
        .expect(200)
        .then( ( { body: { users} } ) => {
            expect(users).toEqual(data.userData)
        })
    })

})
        

describe("PATCH /api/articles/:article_id", () => {
    test("200: responds with updated article", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then( ( { body: { article } } ) => {
            expect(article.votes).toBe(101)
        })
    })

    test("400: inc_votes key not found", () => {
        return request(app)
        .patch("/api/articles/2")
        .send({ votes: 1 })
        .expect(400)
        .then( ( { body: { msg } } ) => {
            expect(msg).toBe("inc_votes key not found")
        })
    })

    test("400: inc_votes is not a valid number", () => {
        return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: "a" })
        .expect(400)
        .then( ( { body: { msg } } ) => {
            expect(msg).toBe( "PSQL Error inserting data")
        })
    })
    test("400: object has more than one key", () => {
        return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: 1, name: "Nick" })
        .expect(400)
        .then( ( { body: { msg } } ) => {
            expect(msg).toBe("Invalid object (must only have one key)")
        })
        })

    })

describe("GET /api/articles (topic query)", () => {
    test("200: responds with an array of articles filtered by topic", () => {
        return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)   
        .then( ( { body: { articles } } ) => {
            expect(articles).toHaveLength(12)
            articles.forEach( (article) => {
                expect(article.topic).toBe("mitch")
            })

        })
    })

    test("200: responds with an an empty array if a valid topic has no associated articles", () => {
        return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)   
        .then( ( { body: { articles } } ) => {
            expect(articles).toEqual([])
        })
    })

    test("404: responds with an empty array if topic has no articles", () => {
        return request(app)
        .get("/api/articles?topic=viscount")
        .expect(404)
        .then( ( { body: { msg } } ) => {
            expect(msg).toBe("Topic not found")
        })
    })
})

describe("NEW FEATURE: get comment_count from article_id", () => {
    test("200: responds with the article comment_count", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then( ( { body: { article } }) => {
            expect(article.comment_count).toBe("11")
        })
    })
})