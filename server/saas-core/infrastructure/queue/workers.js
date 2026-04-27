const { paymentQueue } = require("./queue");
const { updateUserPlan } = require("../../modules/users/userService");

paymentQueue.process(async (job) => {
  const { userId, plan } = job.data;
  
  console.log(`💎 [WORKER] Processando assinatura: Usuário ${userId} -> Plano ${plan}`);
  
  try {
    await updateUserPlan(userId, plan);
    console.log(`✅ [WORKER] Assinatura ativada com sucesso!`);
  } catch (err) {
    console.error(`❌ [WORKER] Erro ao processar assinatura:`, err);
    throw err; // Permite que o Bull tente novamente (retry)
  }
});
