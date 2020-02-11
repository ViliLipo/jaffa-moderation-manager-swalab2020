const Mute = require('../models/mute.js');
const { mqSend } = require('./machinequeue.js');

const checkContent = (content) => content.length >= 1;

const userHasGlobalMute = async (user) => {
  const muteInstances = await Mute.findAll({ where: { user, global: true } });
  return (muteInstances.length >= 1);
};

const userMutedOnPost = async (user, post) => {
  const muteInstances = await Mute.findAll({ where: { user, post } });
  return (muteInstances.length >= 1);
};


const moderateComment = async (user, id, content, targetId) => {
  const globalMute = await userHasGlobalMute(user);
  const mutedOnPost = await userMutedOnPost(user, targetId);
  const passed = !(globalMute || mutedOnPost);
  const reply = JSON.stringify({ type: 'comment', id, passed });
  await mqSend(reply, 'content_event_queue');
};

const moderatePost = async (user, id, title, content) => {
  const globalMute = await userHasGlobalMute(user);
  const contentCheck = checkContent(content);
  const titleCheck = checkContent(title);
  const passed = (!globalMute && contentCheck && titleCheck);
  const reply = JSON.stringify({ type: 'post', id, passed });
  await mqSend(reply, 'content_event_queue');
};

const moderateEvent = async (eventData) => {
  const {
    type, content, title, user, id, targetId,
  } = eventData;
  if (type === 'comment') {
    await moderateComment(user, id, content, targetId);
  } else if (type === 'post') {
    await moderatePost(user, id, title, content);
  }
};

const moderationEventReceiver = async (message) => {
  const { content } = message;
  const data = JSON.parse(content.toString());
  await moderateEvent(data);
};

module.exports = moderationEventReceiver;
