const { fetchTopics } = require("../models/topics.model");

const getTopics = (request, response) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

module.exports = { getTopics };
