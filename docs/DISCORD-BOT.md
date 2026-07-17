# Null and Void Discord Bot — Setup Guide

## Overview

Bot de Discord que envia **desafios QA diários** e mantém **leaderboard** da comunidade.

**Features:**
- `/daily` — Recebe desafio do dia
- `/submit <answer>` — Submete resposta
- `/leaderboard` — Ranking semanal
- `/stats` — Seu progresso

## Instalação Rápida

### 1. Criar Aplicação no Discord Developer Portal

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique "New Application"
3. Nome: "Null and Void QA Bot"
4. Na seção "Bot", clique "Add Bot"
5. Copie o **TOKEN** (guarde com segurança)

### 2. Permissões

Na seção "OAuth2" → "URL Generator":
- Scopes: `bot`
- Permissions:
  - Send Messages
  - Embed Links
  - Add Reactions
  - Manage Messages

Gera URL de convite e compartilha no servidor Discord.

### 3. Variáveis de Ambiente

Crie `.env`:

```env
DISCORD_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=seu_client_id
DISCORD_SERVER_ID=seu_server_id (opcional)
DATABASE_URL=postgresql://... (se usar BD)
```

### 4. Rodar o Bot

**Usando Node.js + discord.js:**

```bash
npm install discord.js dotenv
node bot.js
```

**Arquivo: bot.js**

```javascript
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

client.once('ready', () => {
  console.log(`✓ Bot logado como ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'daily') {
    const challenge = getDailyChallenge();
    const embed = new EmbedBuilder()
      .setColor(0x10b981)
      .setTitle('🎯 Desafio do Dia')
      .setDescription(challenge.question)
      .addFields(
        { name: 'Dificuldade', value: challenge.difficulty, inline: true },
        { name: 'Pontos', value: `${challenge.points}`, inline: true }
      );
    
    await interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.DISCORD_TOKEN);
```

## Desafios Diários

Cada desafio tem:
- ID único
- Pergunta
- Resposta esperada
- Pontos (1-10)
- Dificuldade

**Exemplo:**

```json
{
  "id": "ch-001",
  "date": "2024-01-15",
  "question": "Qual é a diferença entre QA e QC?",
  "correctAnswer": "QA é preventivo (processos), QC é reativo (verificação)",
  "points": 5,
  "difficulty": "easy",
  "category": "fundamentals"
}
```

## Leaderboard

Armazena pontos por usuário:

```json
{
  "user_id": "12345",
  "username": "tester_john",
  "points": 250,
  "challenges_completed": 45,
  "streak": 7,
  "level": "intermediate"
}
```

**Reset semanal:** Toda segunda-feira, leaderboard se reseta.

## Webhook para Atualizar Coursework

Quando alguém completa um desafio no Discord, pode atualizar o progresso no curso:

```javascript
// POST para webhook
fetch('https://seu-servidor.com/api/discord-complete', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: '12345',
    username: 'tester_john',
    challengeId: 'ch-001',
    points: 5,
    timestamp: new Date().toISOString()
  })
});
```

## Comandos Disponíveis

| Comando | O que faz |
|---------|-----------|
| `/daily` | Mostra desafio do dia |
| `/submit <answer>` | Valida resposta |
| `/leaderboard` | Ranking semanal (top 10) |
| `/stats` | Seu progresso pessoal |
| `/hint` | Dica (custa 1 ponto) |
| `/streak` | Sua sequência atual |

## Hosting

**Opções:**

1. **Heroku** (free tier descontinuado, mas Railway/Render grátis)
2. **Repl.it** (simples, keep-alive fácil)
3. **Seu servidor** (VPS + PM2)

**Comando PM2:**

```bash
pm2 start bot.js --name "null-void-bot"
pm2 startup
pm2 save
```

## Troubleshooting

**"Bot offline"**
- Verifica TOKEN no `.env`
- Verifica permissões no Discord Portal

**"Comando não funciona"**
- Slash commands precisam de ~1 min pra aparecer
- Tenta `/` pra ver lista de comandos

**"Sem permissão"**
- Vai em Role Management
- Dá permissão ao bot

## Próximos Passos

1. Cria BD com desafios
2. Implementa validação de respostas
3. Integra com nosso curso
4. Deploy em produção
5. Monitora com Discord Logs

---

**Links Úteis:**
- [discord.js Docs](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers)
- [Node.js Hosting](https://github.com/hosts)
