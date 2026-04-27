const { getSubscription } = require("../subscriptions/subscriptionService");

function planGuard(featureLimit) {
  return (req, res, next) => {
    const user = req.user;
    const sub = getSubscription(user.id);

    if (!sub || sub.usage >= featureLimit) {
      return res.status(403).json({
        error: "Limite do plano atingido"
      });
    }

    next();
  };
}

module.exports = { planGuard };
