const db = require("../db/connection");

const fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

const removeCommentById = (comment_id) => {
  const comment_id_toNumber = Number(comment_id);
  if (isNaN(comment_id_toNumber)) {
    return Promise.reject({ status: 400, msg: "400 Bad Request" });
  }

  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id_toNumber,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      }
      return;
    });
};
module.exports = { fetchTopics, removeCommentById };
