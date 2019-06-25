// Dependencies
const router = require('express').Router();

// Models
const Questions = require('../models/question-models');
const Responses = require('../models/responses');

// Middleware

const restricted = require('../controllers/authCheck');

router.get('/:workflow', async (req, res) => {
  const { workflow } = req.params;
  // const { id: user_id } = req.user;
  try {
    res.status(200).json(await Responses.getBase({ workflow }));
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve the user responses' });
  }
});

router.get('/:workflow/:owner', async (req, res) => {
  const { workflow, owner } = req.params;
  const { id: user_id } = req.user;
  try {
    res.status(200).json(await Responses.find({ workflow, owner }));
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve the user responses' });
  }
});

router.post('/:workflow', async (req, res) => {
  const { workflow } = req.params;
  const { text, index } = req.body;
  // const { id: user_id } = req.user;
  try {
    res.status(200).json(await Responses.add({ workflow, text, index }));
  } catch (e) {
    res.status(500).json(e);
  }
});

// UPDATES THE Questions
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { text, owner, workflow, index } = req.body;
  const values = { id, text, owner, workflow, index };
  try {
    res.status(200).json(await Responses.update(values));
  } catch (error) {
    res.status(500).json({
      message: `Unable to update the question ${id}`,
    });
  }
});

// DELETE QUestions
router.delete('/:id', async (req, res) => {
  try {
    const deleteQuestion = await Questions.removeQuestion(req.params.id);
    if (deleteQuestion)
      res
        .status(200)
        .json({ message: 'You have successfully deleted the Question' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete this Answer.' });
  }
});

module.exports = router;