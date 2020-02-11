const moderationRouter = require('express').Router();
const Mute = require('../models/mute.js');


moderationRouter.get('/', async (request, response) => {
  response.send('Hello moderation');
});

moderationRouter.post('/mute', async (request, response) => {
  try {
    const data = request.body;
    const { username, global, postId } = data;
    if (username && (global || postId)) {
      if (global) {
        Mute.create({ user: username, global: true });
      } else {
        Mute.create({ user: username, postId });
      }
      response.status(200).json({ status: 200 });
    }
  } catch (error) {
    response.status(500).json({ status: 500 });
  }
});

moderationRouter.post('/unmute', async (request, response) => {
  try {
    const data = request.body;
    const { username, global, postId } = data;
    if (username && (global || postId)) {
      if (global) {
        await Mute.destroy({ where: { user: username, global: true } });
      } else {
        await Mute.destroy({ where: { user: username, post: postId } });
      }
      response.status(200).json({ status: 200 });
    }
  } catch (error) {
    response.status(500).json({ status: 500 });
  }
});


module.exports = moderationRouter;
