# 🛠️ Guia de Preparação e Execução: RotaPro

Para rodar o seu SaaS profissionalmente, você precisa configurar algumas "peças" essenciais que não ficam salvas no código por segurança (as chaves de acesso).

## 1. O que você precisa baixar/instalar no PC
- **Node.js**: Se ainda não tiver, baixe e instale a versão LTS do [node-js.org](https://nodejs.org/). É ele quem faz o App e o Servidor funcionarem.
- **VS Code**: Recomendado para abrir a pasta do projeto e editar as chaves.

---

## 2. As "Chaves" que você precisa conseguir (Gratuito para começar)

### 🗺️ Google Maps (Para o Mapa e Rotas)
1. Vá ao [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um projeto e ative: **Maps JavaScript API**, **Directions API** e **Geocoding API**.
3. Crie uma **API Key** e coloque no arquivo [.env](file:///f:/novo%20backup/Documents/rota-pro/.env).

### 🔥 Firebase (Para Login e Banco de Dados)
1. Vá ao [Firebase Console](https://console.firebase.google.com/).
2. Crie um projeto "RotaPro".
3. Ative **Authentication** (Email/Senha) e o **Cloud Firestore** (Banco de Dados).
4. No menu lateral, clique na engrenagem (Configurações do Projeto) -> **Suas Apps** -> Escolha Web `</>`.
5. Copie as chaves e cole no arquivo [src/services/firebase.js](file:///f:/novo%20backup/Documents/rota-pro/src/services/firebase.js).

### 💳 Mercado Pago (Para os Pagamentos)
1. Vá ao [Mercado Pago Developers](https://www.mercadopago.com.br/developers/panel).
2. Vá em **Suas Aplicações** -> Crie uma.
3. Clique em **Credenciais de Produção** (ou Teste inicialmente).
4. Copie o **Access Token** e cole no arquivo [server/.env](file:///f:/novo%20backup/Documents/rota-pro/server/.env).

---

## 3. Passo a Passo para Rodar

### Passo 1: Instalar dependências
Abra o terminal na pasta do projeto e rode:
```bash
npm install
```
E depois entre na pasta do servidor e instale lá também:
```bash
cd server
npm install
cd ..
```

### Passo 2: Configurar o Google do Backend (Obrigatório para Webhooks)
1. No Console do Firebase -> Configurações do Projeto -> **Contas de Serviço**.
2. Clique em **Gerar nova chave privada**.
3. Um arquivo `.json` será baixado. Renomeie ele para `firebase-admin-config.json`.
4. Mova esse arquivo para dentro da pasta `server/`.

### Passo 3: Ligar o Motor
Você vai precisar de **dois terminais** abertos:

**Terminal 1 (Frontend - Visual):**
```bash
npm run dev
```

**Terminal 2 (Backend - Pagamentos):**
```bash
cd server
node index.js
```

---

## 🚀 Resumo de Arquivos que você deve editar:

1.  **Frontend API**: [.env](file:///f:/novo%20backup/Documents/rota-pro/.env) (Google Maps Key)
2.  **Firebase Sync**: [src/services/firebase.js](file:///f:/novo%20backup/Documents/rota-pro/src/services/firebase.js) (Config do App)
3.  **Payment Keys**: [server/.env](file:///f:/novo%20backup/Documents/rota-pro/server/.env) (Token MP e Email)
4.  **Admin Key**: `server/firebase-admin-config.json` (O arquivo que você baixará do Firebase)

> [!TIP]
> Para testar o **Webhook** (liberação automática) no seu PC antes de colocar na internet, você terá que usar o **ngrok**, que cria um link temporário para o seu servidor local.
