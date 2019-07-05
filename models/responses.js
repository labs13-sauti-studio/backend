const db = require('../database/dbConfig');
const Promise = require('bluebird');
/* Example of object
{ id: 1, title: 'example', parent: null, workflow: 1, index: 1 } */

const getIndex = async ({ parent: filter, workflow }) => {
  let parent = filter;
  if (!parent) parent = null;
  const { count: index } = await db('responses')
    .where({ parent, workflow })
    .count()
    .first()
    .catch(err => err);
  return Number(index) + 1;
};

const find = filter =>
  db('responses')
    .where(filter)
    .orderBy('index', 'asc');

const getById = id => find({ id }).first();

// Add new value
const add = async values => {
  const [id] = await db('responses')
    .insert({ ...values, index: await getIndex(values) })
    .returning('id');

  return {
    added: await getById(id),
    total: await find({ workflow: values.workflow }),
  };
};

const update = async values => {
  const [id] = await db('responses')
    .where({ id: values.id })
    .update(values)
    .returning('id');

  return {
    added: await getById(id),
    total: await find({ workflow: values.workflow }),
  };
};

const save = values =>
  db('responses')
    .where({ id: values.id })
    .update(values);

const remove = async id => {
  const [workflow] = await db('responses')
    .select('workflow')
    .where({ id });

  const items = await db('responses')
    .where({ id })
    .del()
    .then(() => find(workflow));

  return items;
};

module.exports = {
  find,
  getById,
  add,
  update,
  remove,
  save,
};
