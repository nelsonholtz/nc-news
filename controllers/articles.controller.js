const { response } = require("../app");
const articles = require("../db/data/test-data/articles");
const comments = require("../db/data/test-data/comments");
const {
  fetchArticles,
  fetchArticleID,
  fetchArticleIDComments,
  sendArticleComment,
  updateArticleVote,
} = require("../models/articles.model");

const getArticles = (request, response) => {
  fetchArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};

const getArticleID = (request, response, next) => {
  const { article_id } = request.params;

  fetchArticleID(article_id)
    .then((article) => {
      response.status(200).send({ article: article });
    })
    .catch(next);
};

const getArticleIDComments = (request, response, next) => {
  const { article_id } = request.params;

  fetchArticleIDComments(article_id)
    .then((comments) => {
      response.status(200).send({ comments: comments });
    })
    .catch(next);
};

const postArticleComment = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;

  if (!username || !body) {
    return response.status(400).send({ msg: "400 Bad Request" });
  }

  fetchArticleID(article_id)
    .then(() => {
      return sendArticleComment(body, article_id, username);
    })
    .then((newComment) => {
      response.status(201).send({ comment: newComment });
    })
    .catch(next);
};

const patchArticleVote = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  updateArticleVote(article_id, inc_votes)
    .then((article) => {
      response.status(200).send({ article: article });
    })
    .catch(next);
};

module.exports = {
  getArticles,
  getArticleID,
  getArticleIDComments,
  postArticleComment,
  patchArticleVote,
};
