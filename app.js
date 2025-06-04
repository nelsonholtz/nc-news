const express = require("express");
const app = express();
const db = require("./db/connection.js");
const endpoints = require("./endpoints.json");

const { getTopics } = require("./controllers/topic.controllers.js");

// console.log(endpoints);

app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

// app.get("/api/topics", (request, response) => {
//   db.query("SELECT * FROM topic").then({ rows });
//   response.status(200).send({ endpoints });
// });

module.exports = app;
