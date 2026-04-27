const { bootstrap } = require("./bootstrap");
const { paymentQueue } = require("./infrastructure/queue/queue");

// Iniciar Workers se estivermos em ambiente de produção ou se for desejado
// Normalmente você pode querer rodar workers em um processo separado, 
// mas para o RotaPro podemos rodar junto por enquanto.
require("./infrastructure/queue/workers");

function initSaaS(app) {
  bootstrap(app);
  console.log("💎 [SAAS CORE] Enterprise Engine Pronto!");
}

module.exports = { initSaaS };
