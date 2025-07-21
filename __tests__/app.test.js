const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);

        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles).toBeInstanceOf(Array);

        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;

        expect(users).toBeInstanceOf(Array);

        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(article).toBeInstanceOf(Object);
        expect(article.article_id).toBe(2);
        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.body).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
      });
  });
  test("status: 400, responds with an error message when passed a bad article ID", () => {
    return request(app)
      .get("/api/articles/:notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
  test("status: 404, responds with an error messgae when passed with a ID that does not exist", () => {
    return request(app)
      .get("/api/articles/1952")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
  test("responds with article and comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("comment_count");
        expect(typeof body.article.comment_count).toBe("number");
        expect(body.article.comment_count).toBeGreaterThanOrEqual(0);
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status 200, responds with an array of comments objects for the article ID", () => {
    return (
      request(app)
        //querie about path
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBeInstanceOf(Array);
          expect(comments.length).toBeGreaterThan(1);
          // ask for help to set up
          expect(comments).toBeSortedBy("created_at", { descending: true });
          comments.forEach((comment) => {
            expect(comment.article_id).toBe(1);
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
            expect(typeof comment.article_id).toBe("number");
          });
        })
      // .catch((err) => {
      //   console.log("Errorr", err);
      // })
    );
  });
  test("status: 400, responds with an error message when passed a bad article ID", () => {
    return request(app)
      .get("/api/articles/notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
  test("status: 404, responds with an error messgae when passed with a ID that does not exist", () => {
    return request(app)
      .get("/api/articles/1952")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status: 201, add a comment to the article comment table", () => {
    const newComment = {
      username: "rogersop",
      body: "YOU SHALL NOT PASS!!",
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.article_id).toBe(3);
        expect(typeof comment.comment_id).toBe("number");
        expect(typeof comment.votes).toBe("number");
        expect(typeof comment.created_at).toBe("string");
        expect(typeof comment.author).toBe("string");
        expect(typeof comment.body).toBe("string");
      });
  });
  test("status: 404, responds with error when article_id is valid but does not exist", () => {
    const newComment = {
      username: "gandalf",
      body: "This article does not exist.",
    };

    // cant get this test to work ask for assistance
    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
  test("status: 400, responds with error when username is missing", () => {
    const newComment = {
      body: "No username",
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
  test("status: 400, responds with error when body is missing", () => {
    const newComment = {
      username: "gandalf",
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test(" status 200: responds with the article updated", () => {
    const voteUpdate = { inc_votes: 5 };

    return request(app)
      .patch("/api/articles/2")
      .send(voteUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("votes");
        expect(typeof body.article.votes).toBe("number");
      });
  });
  test("status 400: bad request when inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "five" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
  test("status 400: send article not found when article_id when invalid ID is inserted", () => {
    return request(app)
      .patch("/api/articles/not-a-number")
      .send({ inc_votes: 3 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with the given comment ID deleted", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  test("status: 400, responds with an error message when passed a bad article ID", () => {
    return request(app)
      .delete("/api/comments/:notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
  test("status: 404, responds with an error messgae when attemping to delete a ID that does not exist", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
});

describe("GET /api/articles (with sort_by & order queries)", () => {
  test("200: returns articles sorted by date (default)", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200: sorts by author in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author", { ascending: true });
      });
  });

  test("400: responds with an error if sort_by is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=not_a_column")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });

  test("400: responds with an error if order is invalid", () => {
    return request(app)
      .get("/api/articles?order=sideways")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("200: filters articles by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBeGreaterThan(0);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });

  test("200: returns empty array if no articles match topic", () => {
    return request(app)
      .get("/api/articles?topic=notarealtopic")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test(" status 200: responds with the comment updated", () => {
    const voteUpdate = { inc_votes: 5 };

    return request(app)
      .patch("/api/comments/2")
      .send(voteUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty("votes");
        expect(typeof body.comment.votes).toBe("number");
      });
  });
  test("status 400: bad request when inc_votes is not a number", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "five" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
  test("status 400: send article not found when comment_id when invalid ID is inserted", () => {
    return request(app)
      .patch("/api/comments/not-a-number")
      .send({ inc_votes: 3 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
});

describe("/api/users/:username", () => {
  test("status 200: responds with the correct user object", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual(
          expect.objectContaining({
            username: "butter_bridge",
            name: "jonny",
            avatar_url: expect.any(String),
          })
        );
      });
  });

  test("status 404: responds with 'User not found' when username does not exist", () => {
    return request(app)
      .get("/api/users/nonexistent_user")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });

  test("status 400: responds with '400 Bad Request' when username is invalid format", () => {
    return request(app)
      .get("/api/users/!@#$%")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
});

describe("POST /api/users", () => {
  test("status 201: creates a new user and returns the user object", () => {
    const newUser = {
      username: "new_user_123",
      name: "New User",
      avatar_url:
        "https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg",
    };

    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.user).toEqual(
          expect.objectContaining({
            username: "new_user_123",
            name: "New User",
            avatar_url:
              "https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg",
          })
        );
      });
  });

  test("status 400: missing fields in request body", () => {
    const badUser = {
      name: "Missing Username",
      avatar_url:
        "https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg",
    };

    return request(app)
      .post("/api/users")
      .send(badUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request: Missing fields");
      });
  });

  test("status 400: username already exists", () => {
    const duplicateUser = {
      username: "butter_bridge", // Assuming this user already exists in your test seed
      name: "Duplicate",
      avatar_url:
        "https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg",
    };

    return request(app)
      .post("/api/users")
      .send(duplicateUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Username already exists");
      });
  });
});
