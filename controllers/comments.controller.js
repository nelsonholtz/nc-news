const { fetchTopics } = require("../models/topics.model");

const { removeCommentById } = require("../models/comments.model");

const { updateCommentVote } = require("../models/comments.model");

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

const patchCommentVote = (request, response, next) => {
  const { comment_id } = request.params;
  const { inc_votes } = request.body;

  updateCommentVote(comment_id, inc_votes)
    .then((comment) => {
      response.status(200).send({ comment: comment });
    })
    .catch(next);
};

module.exports = { getTopics, deleteCommentById, patchCommentVote };
