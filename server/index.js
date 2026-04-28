const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { MercadoPagoConfig, PreApproval } = require('mercadopago');
const fs = require('fs');
const path = require('path');
const { initSaaS } = require('./saas-core');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

console.log('🚀 Starting server...');

// ================= FIREBASE INITIALIZATION =================
let db;

try {
  let serviceAccount = null;
  const secretPath = '/etc/secrets/firebase.json';
  const localConfigPath = path.join(__dirname, 'firebase-admin-config.json');

  if (fs.existsSync(secretPath)) {
    console.log("📂 Usando Firebase Secret (Render)");
    serviceAccount = JSON.parse(fs.readFileSync(secretPath, 'utf8'));
  } else if (process.env.FIREBASE_CONFIG) {
    console.log("📂 Usando FIREBASE_CONFIG do Env");
    serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
  } else if (fs.existsSync(localConfigPath)) {
    console.log("📂 Usando Config Local");
    serviceAccount = JSON.parse(fs.readFileSync(localConfigPath, 'utf8'));
  }

  if (serviceAccount) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
    db = admin.firestore();
    console.log("✅ Firebase conectado!");
  } else {
    console.error("❌ ERRO: Nenhuma configuração de Firebase encontrada (Secret, Env ou Local).");
    console.warn("⚠️ Certifique-se de configurar a Secret no Render em /etc/secrets/firebase.json");
    // Em produção, se o DB for essencial, podemos forçar o exit:
    // process.exit(1);
  }
} catch (err) {
  console.error("❌ ERRO AO INICIALIZAR FIREBASE:", err);
}
// ==========================================================


// ================= SAAS CORE ENGINE =================
initSaaS(app);
// ====================================================


// ================= MERCADO PAGO =================
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});
// =================================================


// ================= EMAIL =================
let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  console.log("📧 Email configurado!");
} else {
  console.warn("⚠️ Email não configurado");
}
// =================================================


// ================= ROTAS =================

// HEALTH
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    firebase: true,
    timestamp: new Date().toISOString()
  });
});


// CRIAR ASSINATURA
app.post("/api/create-subscription", async (req, res) => {
  try {
    const { email, userId, amount, planName } = req.body;
    const finalAmount = parseFloat(amount) || 29.90;
    const finalPlanName = planName || "RotaPro Premium";

    const preApproval = new PreApproval(client);

    const result = await preApproval.create({
      body: {
        reason: finalPlanName,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: finalAmount,
          currency_id: "BRL"
        },
        payer_email: email,
        back_url: `${process.env.FRONTEND_URL || 'https://rotapro-alpha.vercel.app'}/sucesso`,
        external_reference: userId
      }
    });

    res.json({ url: result.init_point });

  } catch (err) {
    console.error("Erro MP:", err);
    res.status(500).json({ error: err.message });
  }
});


// WEBHOOK (Ativação Automática)
app.post("/api/webhook", async (req, res) => {
  const { type, data, action } = req.body;
  console.log(`📩 Webhook recebido: ${type || action} ID: ${data?.id || req.body?.data?.id}`);

  try {
    // 1. Caso seja uma Assinatura (PreApproval)
    if (type === 'subscription_preapproval' || action === 'subscription_preapproval.updated') {
      const id = data?.id || req.body?.data?.id;
      const preApproval = new PreApproval(client);
      const subscription = await preApproval.get({ id });

      const userId = subscription.external_reference;
      const status = subscription.status;

      if (userId && status === 'authorized') {
        await db.collection('users').doc(userId).set({
          isPaid: true,
          subscriptionId: id,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log("✅ Assinatura Ativada PRO para:", userId);
      }
    }
    
    // 2. Caso seja um Pagamento Avulso (Preference)
    if (type === 'payment' || action === 'payment.created' || action === 'payment.updated') {
      const id = data?.id || req.body?.data?.id;
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
        headers: { 'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}` }
      });
      const payment = await response.json();

      if (payment.status === 'approved') {
        const userId = payment.external_reference;
        if (userId) {
          await db.collection('users').doc(userId).set({
            isPaid: true,
            paymentId: id,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
          console.log("✅ Pagamento Aprovado PRO para:", userId);
        }
      }
    }

  } catch (err) {
    console.error("❌ Erro processando webhook:", err);
  }

  res.sendStatus(200);
});


// CHECK PRO
app.get("/api/check-pro/:userId", async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.params.userId).get();

    res.json({
      isPro: doc.exists && doc.data().isPaid === true
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= USER ROUTES =================
app.use("/api/users", require("./saas-core/api/user.routes"));


// START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});