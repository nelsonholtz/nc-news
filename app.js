const express = require("express");
const app = express();
const db = require("./db/connection.js");
const endpoints = require("./endpoints.json");

const { getTopics } = require("./controllers/topic.controllers.js");
const { getArticles } = require("./controllers/articles.controller.js");
const { getUsers } = require("./controllers/users.controller.js");

// console.log(endpoints);

app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);
module.exports = app;
