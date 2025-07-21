const { fetchUsers, fetchUserByUserName } = require("../models/users.model");

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

module.exports = { getUsers, getUserName };
