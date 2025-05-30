const format = require("pg-format");
const db = require("../connection");

exports.insertTopics = (topicData) => {
  console.log(topicData);
  const formattedTopics = topicData.map(({ slug, description, img_url }) => {});

  const insertTopicsQuery = format(
    `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;`,
    formattedTopics
  );

  return db.query(insertTopicsQuery);
};

exports.insertUsers = (userData) => {
  const formattedUsers = userData.map();

  const insertUsersQuery = format(
    `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`,
    formattedUsers
  );

  return db.query(insertUsersQuery);
};

exports.insertArticles = (articleData) => {
  const formattedArticles = []; // .map articleData

  const insertArticlesQuery = format(
    `INSERT INTO articles (article_id, title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`,
    formattedArticles
  );

  return db.query(insertArticlesQuery);
};

exports.insertComments = (commentData) => {
  const commentValues = []; // .map commentData

  const insertCommentsQuery = format(
    `INSERT INTO comments (comment_id, article_id, body, votes, author, created_at) VALUES %L RETURNING *;`,
    commentValues
  );

  return db.query(insertCommentsQuery);
};
