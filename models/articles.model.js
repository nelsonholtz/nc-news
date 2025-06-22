const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

const fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validSortBy = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const validOrder = ["asc", "desc"];

  if (
    !validSortBy.includes(sort_by) ||
    !validOrder.includes(order.toLowerCase())
  ) {
    return Promise.reject({ status: 400, msg: "400 Bad Request" });
  }

  let queryStr = `
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
    `;

  const queryValues = [];

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  queryStr += `
    GROUP BY 
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url
    ORDER BY ${sort_by} ${order.toUpperCase()};
  `;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows;
  });
};

const fetchArticleID = (article_id) => {
  return db
    .query(
      `
      SELECT 
        articles.*, 
        COUNT(comments.comment_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments 
        ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;
      `,
      [article_id]
    )
    .then(({ rows }) => {
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
