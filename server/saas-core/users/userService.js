const admin = require('firebase-admin');

async function getUserById(userId) {
  const doc = await admin.firestore().collection('users').doc(userId).get();
  return doc.exists ? doc.data() : null;
}

async function updateUserPlan(userId, plan) {
  await admin.firestore().collection('users').doc(userId).set({
    plan: plan,
    isPaid: plan !== 'free',
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
  
  console.log(`👤 Usuário ${userId} atualizado para o plano ${plan}`);
}

module.exports = {
  getUserById,
  updateUserPlan
};
