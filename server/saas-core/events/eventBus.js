const events = {};

function on(event, fn) {
  if (!events[event]) events[event] = [];
  events[event].push(fn);
}

function emit(event, data) {
  if (events[event]) {
    events[event].forEach(fn => fn(data));
  }
}

function initEvents() {
  console.log("📡 Event system ativo");
}

module.exports = { on, emit, initEvents };
