const express = require("express");
const app = express();
const db = require("./db/connection.js");
const endpoints = require("./endpoints.json");

const { getTopics } = require("./controllers/topic.controllers.js");

const {
  getArticles,
  getArticleID,
} = require("./controllers/articles.controller.js");

const { getUsers } = require("./controllers/users.controller.js");

// console.log(endpoints);

app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleID);

app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "400 Bad Request" });
  } else next(err);
});

// app.use((err, req, res, next) => {
//   if (err.code === "22P02") {
//     res.status(404).send({ msg: "404 Not Found" });
//   } else next(err);
// });

app.use((err, request, response, next) => {
  console.log("Error :)", err);
  request.status(500).send({ msg: "Internal Sever Erro" });
});

module.exports = app;
