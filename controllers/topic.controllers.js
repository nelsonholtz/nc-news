const { fetchTopics, insertTopic } = require("../models/topics.model");

const getTopics = (request, response) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

const postTopics = (req, res, next) => {
  insertTopic(req.body)
    .then((newTopic) => {
      res.status(201).send({ topic: newTopic });
    })
    .catch((err) => {
      if (err.code === "23505") {
        // Unique violation (if you set slug to be unique in schema)
        res.status(409).send({ msg: "Topic slug already exists" });
      } else if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
      } else {
        next(err); // Let error-handling middleware take care of it
      }
    });
};

module.exports = { getTopics, postTopics };
