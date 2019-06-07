const router = require('express').Router();
const Workflows = require('../models/workflow-models');

router.get('/', async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/workflows', async (req, res) => {
  try {
    const workflows = await Workflows.getBy({ id: req.user.id });
    res.status(200).json(workflows);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve the workflows' });
  }
});

module.exports = router;
