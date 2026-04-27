const createCheckoutSession = (req, res) => {
  const { plan } = req.body;

  // aqui você conecta Stripe ou MercadoPago depois
  return res.json({
    url: `https://checkout.fake/${plan}`
  });
};

function initBilling(app) {
  app.post("/api/checkout", createCheckoutSession);
}

module.exports = { initBilling };
