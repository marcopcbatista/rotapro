const EventEmitter = require("events");
const eventBus = new EventEmitter();

function emit(event, payload) {
  eventBus.emit(event, payload);
}

function on(event, handler) {
  eventBus.on(event, handler);
}

module.exports = { emit, on };
