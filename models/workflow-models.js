const db = require('../database/dbConfig');

const find = filter => db('workflows').where(filter);

const userFlows = async userId => {
  const {
    rows,
  } = await db.raw(`SELECT workflows.id, workflows.user_id, name, categories.category
          FROM workflows
          JOIN categories
          ON workflows.category = categories.id
          WHERE workflows.user_id = ${userId};`);

  return rows;
};

function getBy(filter) {
  return db('workflows').where(filter);
}

function getById(id) {
  return db('workflows')
    .where({ id })
    .first();
}

const add = async ({ user_id, name, category, client_id }) => {
  const [id] = await db('categories')
    .insert({ user_id, category })
    .returning('id');

  await db('workflows')
    .insert({ user_id, name, category: id, client_id })
    .catch(err => console.error(err));

  return userFlows(user_id);
};

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
