const db = require("../db/connection");

const fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

const insertTopic = ({ slug, description }) => {
  if (!slug || !description) {
    return Promise.reject({
      status: 400,
      msg: "Both slug and description are required",
    });
  }

  const queryStr = `
    INSERT INTO topics (slug, description)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const queryValues = [slug, description];

  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows[0];
  });
};

module.exports = { fetchTopics, insertTopic };
