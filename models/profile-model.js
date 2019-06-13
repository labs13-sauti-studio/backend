const db = require('../database/dbConfig');

function getById(id) {
  return db('users').where({ id });
}

function updateUser(id, info) {
  return db('users')
    .where({ id })
    .update(info);
}

module.exports = {
  getById,
  updateUser,
};
