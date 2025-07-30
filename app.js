const cors = require("cors");
const express = require("express");
const app = express();
const path = require("path");
const db = require("./db/connection.js");
const endpoints = require("./endpoints.json");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/", express.static("Public"));

// === Controllers ===
const { getTopics, postTopics } = require("./controllers/topic.controllers.js");

const {
  getArticles,
  getArticleID,
  getArticleIDComments,
  postArticleComment,
  postArticle,
  patchArticleVote,
  deleteArticleByID,
} = require("./controllers/articles.controller.js");

const {
  getUsers,
  getUserName,
  postNewUser,
} = require("./controllers/users.controller.js");

const {
  deleteCommentById,
  patchCommentVote,
} = require("./controllers/comments.controller.js");

// === Routes ===

// Root API
app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

// Topics
app.get("/api/topics", getTopics);
app.post("/api/topics", postTopics);

// Users
app.get("/api/users", getUsers);
app.get("/api/users/:username", getUserName);
app.post("/api/users", postNewUser);

// Articles
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleID);
app.patch("/api/articles/:article_id", patchArticleVote);
app.get("/api/articles/:article_id/comments", getArticleIDComments);
app.post("/api/articles/:article_id/comments", postArticleComment);
app.post("/api/articles", postArticle);
app.delete("/api/articles/:article_id", deleteArticleByID);

// Comments
app.patch("/api/comments/:comment_id", patchCommentVote);
app.delete("/api/comments/:comment_id", deleteCommentById);

// === Error Handling ===

app.use((err, req, res, next) => {
  console.error("Error caught by middleware:", err);

  if (err.status) {
    return res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "400 Bad Request" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
