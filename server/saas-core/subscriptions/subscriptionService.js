const plans = require("../config/plans");

const userSubscriptions = new Map();

function createSubscription(userId, plan) {
  userSubscriptions.set(userId, {
    plan,
    usage: 0,
    limit: plans[plan].limit
  });
}

function getSubscription(userId) {
  return userSubscriptions.get(userId);
}

function initSubscriptions() {
  console.log("💎 Subscription engine ativo");
}

module.exports = {
  createSubscription,
  getSubscription,
  initSubscriptions
};
