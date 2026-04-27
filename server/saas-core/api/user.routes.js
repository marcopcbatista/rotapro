const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth/middleware');
const { getUserById } = require('../users/userService');
const { getSubscription } = require('../subscriptions/subscriptionService');

// Rota protegida para perfil do usuário
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userData = await getUserById(req.user.id);
    const subscription = getSubscription(req.user.id);

    res.json({
      user: userData,
      auth: req.user,
      subscription: subscription || { plan: 'free', status: 'active' }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
