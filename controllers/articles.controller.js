const articles = require("../db/data/test-data/articles");
const { fetchArticles, fetchArticleID } = require("../models/articles.model");

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

module.exports = { getArticles, getArticleID };
