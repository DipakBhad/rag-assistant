const sessions = {};

function getSession(sessionId) {
  if (!sessions[sessionId]) {
    sessions[sessionId] = [];
  }
  return sessions[sessionId];
}

function addMessage(sessionId, role, content) {
  sessions[sessionId].push({ role, content });
}

module.exports = { getSession, addMessage };