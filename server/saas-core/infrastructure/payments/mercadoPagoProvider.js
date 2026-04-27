const { PreApproval } = require('mercadopago');

/**
 * Cria um link de assinatura no Mercado Pago
 */
async function createMPCheckout(client, user, planDetails) {
    try {
        const preApproval = new PreApproval(client);
        
        const result = await preApproval.create({
            body: {
                reason: `Assinatura ${planDetails.name}`,
                auto_recurring: {
                    frequency: 1,
                    frequency_type: "months",
                    transaction_amount: planDetails.price,
                    currency_id: "BRL"
                },
                payer_email: user.email,
                back_url: `${process.env.FRONTEND_URL || 'https://rotapro-alpha.vercel.app'}/sucesso`,
                external_reference: user.id
            }
        });

        return result.init_point;
    } catch (err) {
        console.error("❌ Erro MP Provider:", err);
        throw err;
    }
}

module.exports = { createMPCheckout };
