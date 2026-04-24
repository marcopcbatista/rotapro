# 🔑 Guia Detalhado: Como Obter as APIs do RotaPro

Aqui está o passo a passo exato para você conseguir as chaves que faltam. Siga nesta ordem:

---

## 📅 1. Google Maps (O Coração do Roteirizador)
*Acesse: [Google Cloud Console](https://console.cloud.google.com/)*

1.  **Crie um Projeto**: No topo da tela, clique em "Selecionar projeto" -> "Novo Projeto" -> Nomeie como `RotaPro`.
2.  **Ative o Faturamento**: No menu lateral, vá em "Faturamento". Você precisará cadastrar um cartão. (O Google dá um crédito gratuito mensal generoso, dificilmente você pagará algo no começo).
3.  **Ative as APIs**: No campo de busca no topo, procure e clique em "Ativar" para estas 3 APIs:
    *   `Maps JavaScript API`
    *   `Directions API`
    *   `Geocoding API`
4.  **Crie a Chave**: Vá em **APIs e Serviços** -> **Credenciais** -> **+ Criar Credenciais** -> **Chave de API**.
5.  **Onde colar**: No arquivo [.env](file:///f:/novo%20backup/Documents/rota-pro/.env).

---

## 🔥 2. Firebase (Login e Banco de Dados)
*Acesse: [Firebase Console](https://console.firebase.google.com/)*

1.  **Criar Projeto**: Clique em "Adicionar projeto" -> Nomeie como `RotaPro`.
2.  **Configurar Web App**: No painel do projeto, clique no ícone `</>` (Web). Dê um apelido e clique em "Registrar app".
3.  **Copiar Configuração**: Ele vai te mostrar um código com `apiKey`, `authDomain`, etc.
    *   **Onde colar**: No arquivo [src/services/firebase.js](file:///f:/novo%20backup/Documents/rota-pro/src/services/firebase.js).
4.  **Ativar Recursos** (Importante!):
    *   **Authentication**: Clique em "Get Started" -> Escolha "E-mail/Senha" e ative.
    *   **Firestore Database**: Clique em "Criar banco de dados" -> Escolha "Modo de Produção" (depois ajustaremos as regras) -> Escolha a localização mais próxima (ex: `southamerica-east1`).
5.  **Chave de Admin para o Backend**:
    *   Clique na engrenagem no topo (Configurações do Projeto) -> **Contas de Serviço**.
    *   Clique em **Gerar nova chave privada**.
    *   **Onde colocar**: Mova o arquivo baixado para `server/` e renomeie para `firebase-admin-config.json`.

---

## 💰 3. Mercado Pago (Para Receber Dinheiro)
*Acesse: [Mercado Pago Developers](https://www.mercadopago.com.br/developers/)*

1.  **Criar Aplicação**: Vá em "Suas aplicações" -> "Criar aplicação".
2.  **Configurar**: Dê um nome, selecione "Pagamentos Online" e marque a opção adequada.
3.  **Pegar Token**: No menu lateral da sua aplicação, vá em **Credenciais de Produção**.
4.  **Copiar Access Token**: Procure por `Access Token`.
    *   **Onde colar**: No arquivo [server/.env](file:///f:/novo%20backup/Documents/rota-pro/server/.env).
5.  **Configurar Webhook** (Depois que o servidor estiver online):
    *   Vá em **Webhooks** na sua aplicação.
    *   Configure a URL para: `https://seu-link-do-servidor.com/api/webhook`.
    *   Marque os eventos: `payment`, `application`, `subscription`.

---

## 🛠️ DICA DE OURO: Como testar o Webhook sem pagar
Para testar se o pagamento está liberando o usuário automaticamente sem precisar gastar dinheiro real:
1. Use as **Credenciais de Teste** do Mercado Pago em vez das de produção.
2. O Mercado Pago fornece cartões de teste (Ex: `4000...`).

> [!TIP]
> Se você travar em algum desses passos, me diga exatamente em qual plataforma (Google, Firebase ou MP) que eu te guio com mais detalhes!
