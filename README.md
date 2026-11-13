# 🔐 Autenticação com Google Identity Services (GIS) e Sessão Segura

Aplicação web full-stack desenvolvida para demonstrar o fluxo completo de autenticação utilizando **Google Identity Services (GIS)**, validação criptográfica de **ID Token (JWT)** no servidor e gerenciamento seguro de sessão local.

🌐 **Aplicação em Produção:** [https://google-api-gray.vercel.app](https://google-api-gray.vercel.app)

---

## ✅ Checklist de Implementação

- [x] **Projeto, tela de consentimento e contas de teste configurados:** Projeto dedicado criado no Google Cloud Console com Google Auth Platform, escopos básicos (`openid`, `userinfo.email`, `userinfo.profile`) e gerenciamento de público/contas de teste.
- [x] **Client ID, origens e callbacks correspondem ao ambiente utilizado:** Origens JavaScript autorizadas configuradas corretamente tanto para desenvolvimento local (`http://localhost:3000`) quanto para produção (`https://google-api-gray.vercel.app`).
- [x] **ID token validado no servidor; sessão local criada com segurança:** O navegador apenas captura a credencial JWT e a envia via `POST` para o backend, onde a assinatura, emissor, expiração e audiência (`Client ID`) são validados pela biblioteca oficial `google-auth-library`. Após validado, uma sessão protegida via cookie `HttpOnly` é criada.
- [x] **Saída invalida a sessão; escopos e segredos são tratados corretamente:** Rota dedicada de logout (`/api/logout`) limpa o cookie de sessão no servidor, e todas as chaves sensíveis (`GOOGLE_CLIENT_ID` e `SESSION_SECRET`) são isoladas via variáveis de ambiente (`.env` / Vercel Environment Variables).

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3, JavaScript (Vanilla) e SDK oficial do Google Identity Services (`https://accounts.google.com/gsi/client`).
* **Backend:** Node.js com Express.
* **Segurança & Autenticação:**
  * `google-auth-library` (validação criptográfica do ID Token no servidor).
  * `cookie-session` (sessão stateless criptografada e assinada em cookie `HttpOnly` e `SameSite=lax`, compatível com arquitetura Serverless).
  * `dotenv` (gerenciamento de variáveis de ambiente).
* **Hospedagem / Deploy:** Vercel.

---

## 📁 Estrutura do Projeto

```text
├── public/
│   └── index.html        # Interface de login e exibição do perfil autenticado
├── .env.example          # Modelo das variáveis de ambiente necessárias
├── .gitignore            # Impede o envio de segredos (.env) e dependências (node_modules)
├── package.json          # Dependências e scripts do projeto
├── package-lock.json     # Trava de versões exatas das dependências instaladas
└── server.js             # Servidor Express, rotas de API, validação do token e sessão
