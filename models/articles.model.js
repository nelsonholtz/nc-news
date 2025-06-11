const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

const fetchArticles = () => {
  const queryStr = `
    SELECT 
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY 
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url
    ORDER BY articles.created_at DESC;
  `;

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};

const fetchArticleID = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      // console.log("rose2", rows);
      // review code to possible refector
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      }
      return rows[0];
    });
};

const fetchArticleIDComments = (article_id) => {
  return db
    .query(
      "SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

const sendArticleComment = (body, article_id, username) => {
  return db
    .query(
      " INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;",
      [body, username, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

const updateArticleVote = (article_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "400 Bad Request" });
  }

  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      }
      return rows[0];
    });
};

module.exports = {
  fetchArticles,
  fetchArticleID,
  fetchArticleIDComments,
  sendArticleComment,
  updateArticleVote,
};
