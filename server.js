require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração da sessão local segura
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Impede acesso ao cookie via JavaScript no navegador (proteção XSS)
    secure: false,  // Em produção com HTTPS, mude para true
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 // 1 hora
  }
}));

// Rota para expor apenas o Client ID público ao frontend
app.get('/api/config', (req, res) => {
  res.json({ clientId: process.env.GOOGLE_CLIENT_ID });
});

// Rota que recebe o ID Token, valida no servidor e cria a sessão
app.post('/api/auth/google', async (req, res) => {
  const { id_token } = req.body;

  if (!id_token) {
    return res.status(400).json({ error: 'ID token ausente.' });
  }

  try {
    // Validação criptográfica oficial (assinatura, expiração, emissor e audiência)
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Cria a sessão local no servidor com os dados validados
    req.session.user = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture
    };

    res.json({ ok: true, user: req.session.user });
  } catch (error) {
    console.error('Erro na validação do token:', error);
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
});

// Rota protegida para verificar quem está logado na sessão atual
app.get('/api/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ authenticated: false });
  }
  res.json({ authenticated: true, user: req.session.user });
});

// Rota de Saída (Logout): invalida a sessão no servidor e limpa o cookie
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao encerrar sessão.' });
    }
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});