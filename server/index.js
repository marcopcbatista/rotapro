const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { MercadoPagoConfig, PreApproval } = require('mercadopago');
const fs = require('fs');
const path = require('path');

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
    const { email, userId } = req.body;

    const preApproval = new PreApproval(client);

    const result = await preApproval.create({
      body: {
        reason: "RotaPro Premium",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 29.90,
          currency_id: "BRL"
        },
        payer_email: email,
        back_url: "https://rotapro.vercel.app/sucesso",
        external_reference: userId
      }
    });

    res.json({ url: result.init_point });

  } catch (err) {
    console.error("Erro MP:", err);
    res.status(500).json({ error: err.message });
  }
});


// WEBHOOK
app.post("/api/webhook", async (req, res) => {
  const { type, data } = req.body;

  try {
    if (type === 'subscription_preapproval') {

      const preApproval = new PreApproval(client);
      const subscription = await preApproval.get({ id: data.id });

      const userId = subscription.external_reference;
      const status = subscription.status;

      const userRef = db.collection('users').doc(userId);

      if (status === 'authorized') {
        await userRef.set({
          isPaid: true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        console.log("✅ Usuário virou PRO:", userId);
      }

    }

  } catch (err) {
    console.error("Erro webhook:", err);
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


// =================================================


// START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});