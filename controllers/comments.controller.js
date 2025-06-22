const { fetchTopics } = require("../models/topics.model");

const { removeCommentById } = require("../models/comments.model");

const getTopics = (request, response) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

const deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;

  removeCommentById(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch(next);
};

module.exports = { getTopics, deleteCommentById };
