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

const fetchArticleIDComments = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  const validSortBy = [
    "comment_id",
    "votes",
    "created_at",
    "author",
    "body",
    "article_id",
  ];
  const validOrder = ["asc", "desc"];

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid sort or order query" });
  }

  const queryStr = `
    SELECT comment_id, votes, created_at, author, body, article_id 
    FROM comments 
    WHERE article_id = $1 
    ORDER BY ${sort_by} ${order.toUpperCase()};
  `;

  return db.query(queryStr, [article_id]).then(({ rows }) => {
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

const sendArticle = ({ author, title, body, topic, article_img_url }) => {
  const imageUrl =
    article_img_url ||
    "https://plus.unsplash.com/premium_photo-1707410048990-c9e0fb4e3956?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const insertQuery = `
   INSERT INTO articles (author, title, body, topic, article_img_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [author, title, body, topic, imageUrl];

  return db.query(insertQuery, values).then(({ rows }) => {
    const newArticle = rows[0];

    return db
      .query(
        `SELECT COUNT(*)::INT AS comment_count FROM comments WHERE article_id = $1;`,
        [newArticle.article_id]
      )
      .then(({ rows }) => {
        newArticle.comment_count = rows[0].comment_count;
        return newArticle;
      });
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

const removeArticleID = (article_id) => {
  const articleIDNumber = Number(article_id);
  if (isNaN(articleIDNumber)) {
    return Promise.reject({ status: 400, msg: "400 Bad Request" });
  }
  return db
    .query("DELETE FROM articles WHERE article_id = $1 RETURNING *", [
      articleIDNumber,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      }
      return;
    });
};

module.exports = {
  fetchArticles,
  fetchArticleID,
  fetchArticleIDComments,
  sendArticleComment,
  sendArticle,
  updateArticleVote,
  removeArticleID,
};
