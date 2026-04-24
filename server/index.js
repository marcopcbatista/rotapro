const express = require('express');
const { MercadoPagoConfig, Preference, PreApproval } = require('mercadopago');
const cors = require('cors');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// --- CONFIGURAÇÃO FIREBASE ADMIN ---
try {
  const serviceAccount = require("./firebase-admin-config.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin Inicializado! ✅");
} catch (err) {
  console.warn("⚠️ firebase-admin-config.json não encontrado. Webhooks de liberação não funcionarão até que seja configurado.");
}

const db = admin.firestore();

// --- CONFIGURAÇÃO MERCADO PAGO ---
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || 'SEU_ACCESS_TOKEN' 
});

// --- CONFIGURAÇÃO NODEMAILER ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- ROTA: CRIAR ASSINATURA (PRE-APPROVAL) ---
app.post("/api/create-subscription", async (req, res) => {
  try {
    const { email, userId } = req.body;

    const preApproval = new PreApproval(client);
    const result = await preApproval.create({
      body: {
        reason: "RotaPro Premium - Assinatura Mensal",
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

// --- ROTA: WEBHOOK (MERCADO PAGO) ---
app.post("/api/webhook", async (req, res) => {
  const { action, data, type } = req.body;

  console.log("📨 Webhook MP recebido:", { action, type, id: data?.id });

  try {
    // Verifica eventos de assinatura
    if (type === 'subscription_preapproval' || type === 'subscription_authorized_payment') {
      
      // Buscar detalhes da assinatura no Mercado Pago
      const preApproval = new PreApproval(client);
      const subscription = await preApproval.get({ id: data.id });
      
      const userId = subscription.external_reference;
      const status = subscription.status;

      console.log(`📋 Assinatura ${data.id}: status=${status}, userId=${userId}`);

      if (!userId) {
        console.warn("⚠️ external_reference (userId) não encontrado na assinatura.");
        return res.sendStatus(200);
      }

      const userRef = db.collection('users').doc(userId);

      if (status === 'authorized') {
        // LIBERAR PRO ✅
        await userRef.set({
          isPaid: true,
          subscriptionId: data.id,
          subscriptionStatus: status,
          paidAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        console.log(`✅ Usuário ${userId} agora é PRO!`);
        
        // Enviar email de boas-vindas PRO
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        if (userData?.email) {
          await sendNotification(userData.email, 
            "🎉 Parabéns! Sua assinatura RotaPro Premium foi ativada! Agora você tem rotas ilimitadas, OCR avançado e suporte prioritário. Aproveite!"
          );
        }

      } else if (status === 'paused' || status === 'cancelled') {
        // REVOGAR PRO ❌
        await userRef.set({
          isPaid: false,
          hasEverPaid: true,
          subscriptionStatus: status,
          cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        console.log(`❌ Assinatura do usuário ${userId} foi ${status}.`);
      }
    }
  } catch (err) {
    console.error("Erro no webhook:", err);
  }

  // Sempre responde 200 para o MP não reenviar
  res.sendStatus(200);
});

// --- ROTA: VERIFICAR STATUS PRO (usado pelo frontend) ---
app.get("/api/check-pro/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.json({ isPro: false });
    }

    const userData = userDoc.data();
    res.json({ 
      isPro: userData.isPaid === true,
      subscriptionStatus: userData.subscriptionStatus || null
    });
  } catch (err) {
    console.error("Erro ao verificar PRO:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- ROTA: HEALTH CHECK ---
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    service: "RotaPro API",
    timestamp: new Date().toISOString()
  });
});

// --- AUX: ENVIAR EMAIL ---
async function sendNotification(email, message) {
  try {
    await transporter.sendMail({
      from: '"RotaPro SaaS" <suporte@rotapro.app>',
      to: email,
      subject: "Atualização da sua Conta RotaPro",
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #0f172a; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #3b82f6; font-size: 28px; margin: 0;">📦 RotaPro</h1>
          </div>
          <div style="background: #1e293b; border-radius: 12px; padding: 32px; color: #f1f5f9; font-size: 16px; line-height: 1.6;">
            ${message}
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">
            © 2026 RotaPro — Roteirização Inteligente de Entregas
          </p>
        </div>
      `
    });
    console.log(`📧 Email enviado para ${email}`);
  } catch (err) {
    console.error("Erro Email:", err);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor RotaPro rodando na porta ${PORT}`));
