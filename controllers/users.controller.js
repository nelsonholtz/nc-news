const {
  fetchUsers,
  fetchUserByUserName,
  insertUser,
} = require("../models/users.model");

const getUsers = (request, response) => {
  fetchUsers().then((users) => {
    response.status(200).send({ users });
  });
};

const getUserName = (request, response, next) => {
  const { username } = request.params;

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return response.status(400).send({ msg: "400 Bad Request" });
  }

  fetchUserByUserName(username)
    .then((user) => {
      if (!user) {
        return response.status(404).send({ msg: "User not found" });
      }
      response.status(200).send({ user });
    })
    .catch((err) => {
      if (err.code === "22P02") {
        response.status(400).send({ msg: "400 Bad Request" });
      } else {
        next(err);
      }
    });
};

const postNewUser = (request, response, next) => {
  const { username, name, avatar_url } = request.body;

  if (!username || !name || !avatar_url) {
    return response
      .status(400)
      .send({ msg: "400 Bad Request: Missing fields" });
  }

  insertUser(username, name, avatar_url)
    .then((newUser) => {
      response.status(201).send({ user: newUser });
    })
    .catch((err) => {
      if (err.code === "23505") {
        response.status(400).send({ msg: "Username already exists" });
      } else {
        next(err);
      }
    });
};

module.exports = { getUsers, getUserName, postNewUser };
