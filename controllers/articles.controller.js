const { response } = require("../app");
const {
  fetchArticles,
  fetchArticleID,
  fetchArticleIDComments,
  sendArticleComment,
  sendArticle,
  updateArticleVote,
} = require("../models/articles.model");

const getArticles = (request, response, next) => {
  const { sort_by, order, topic } = request.query;
  fetchArticles(sort_by, order, topic)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch(next);
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
  const { sort_by = "created_at", order = "desc" } = request.query;

  fetchArticleIDComments(article_id, sort_by, order)
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

const postArticle = (request, response, next) => {
  const { author, title, body, topic, article_img_url } = request.body;

  if (!author || !title || !body || !topic) {
    return response
      .status(400)
      .send({ msg: "400 Bad Request: Missing fields" });
  }

  sendArticle({ author, title, body, topic, article_img_url })
    .then((newArticle) => {
      response.status(201).send({ article: newArticle });
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
  postArticle,
  patchArticleVote,
};
