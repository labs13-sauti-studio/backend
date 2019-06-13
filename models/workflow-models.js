const db = require('../database/dbConfig');

function find() {
  return db('workflows');
}

function userFlows(userId) {
  return db('workflows').where({ user_id: userId });
}

function getBy(filter) {
  return db('workflows').where(filter);
}

function getById(id) {
  return db('workflows')
    .where({ id })
    .first();
}

function add(workflow) {
  return db('workflows')
    .insert(workflow, 'id')
    .then(id => find(id));
}

function updateWorkflow(id, changes) {
  return db('workflows')
    .where({ id })
    .update(changes);
}

function removeWorkflow(id) {
  return db('workflows')
    .where('id', id)
    .del();
}

module.exports = {
  find,
  userFlows,
  getBy,
  getById,
  add,
  updateWorkflow,
  removeWorkflow,
};
