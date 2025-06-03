const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  const articleIDValue = {};

  // console.log(topicData);
  // console.log(userData);
  // console.log(articleData);
  // console.log(commentData);

  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => db.query(`DROP TABLE IF EXISTS articles;`))
    .then(() => db.query(`DROP TABLE IF EXISTS users;`))
    .then(() => db.query(`DROP TABLE IF EXISTS topics;`))

    .then(() => {
      return db.query(`
        CREATE TABLE topics (
          slug VARCHAR(255) PRIMARY KEY,
          description VARCHAR(255) NOT NULL,
          img_url VARCHAR(1000)
        );
      `);
    })

    .then(() => {
      return db.query(`
        CREATE TABLE users (
          username VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          avatar_url VARCHAR(1000)
        );
      `);
    })

    .then(() => {
      return db.query(`
        CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          topic VARCHAR(255) REFERENCES topics(slug) ON DELETE CASCADE,
          author VARCHAR(255) REFERENCES users(username) ON DELETE CASCADE,
          body TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          votes INT DEFAULT 0,
          article_img_url VARCHAR(1000)
        );
      `);
    })

    .then(() => {
      return db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
          body TEXT NOT NULL,
          votes INT DEFAULT 0,
          author VARCHAR(255) REFERENCES users(username) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    })
    .then(() => {
      const formattedTopics = topicData.map(
        ({ slug, description, img_url }) => {
          return [slug, description, img_url];
        }
      );
      const insertTopicsQuery = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;`,
        formattedTopics
      );

      return db.query(insertTopicsQuery);
    })

    .then(() => {
      const formattedUsers = userData.map(({ username, name, avatar_url }) => {
        return [username, name, avatar_url];
      });

      const insertUsersQuery = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`,
        formattedUsers
      );

      return db.query(insertUsersQuery);
    })

    .then(() => {
      const formattedArticleswithTimeStamp = articleData.map(
        convertTimestampToDate
      );

      const formattedArticles = formattedArticleswithTimeStamp.map(
        ({
          title,
          topic,
          author,
          body,
          created_at,
          votes,
          article_img_url,
        }) => {
          return [
            title,
            topic,
            author,
            body,
            created_at,
            votes,
            article_img_url,
          ];
        }
      );

      const insertArticlesQuery = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`,
        formattedArticles
      );
      return db.query(insertArticlesQuery).then((outcome) => {
        const insertedArticles = outcome.rows;
        // console.log(insertArticlesQuery);
        // console.log("rows", insertedArticles);
        // console.log("outcome", outcome);

        // const articleIDValue = {};
        for (let i = 0; i < insertedArticles.length; i++) {
          const article = insertedArticles[i];
          articleIDValue[article.title] = article.article_id;
        }
        // console.log(articleIDValue);
      });
    })

    .then(() => {
      const formattedCommentWithTimeStamp = commentData.map(
        convertTimestampToDate
      );

      const formattedComment = formattedCommentWithTimeStamp.map(
        ({ article_title, body, votes = 0, author, created_at }) => {
          // console.log("comment", commentData);
          const article_id = articleIDValue[article_title];
          return [article_id, body, votes, author, created_at];
        }
      );
      console.log("changed artical title", formattedComment);

      const insertCommentsQuery = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *;`,
        formattedComment
      );

      return db.query(insertCommentsQuery);
    });
};

module.exports = seed;
