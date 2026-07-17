# Mentorship Matching System — Guia Completo

## Overview

Sistema de matching automático que conecta **mentores experientes** com **aprendizes** baseado em compatibilidade.

## Como Funciona

### 1. Registro de Mentor

```javascript
const mentor = {
  name: "João Silva",
  experience_years: 5,
  specialties: ["automation", "performance", "api-testing"],
  languages: ["pt", "en"],
  timezone: "America/Sao_Paulo",
  availability: {
    monday: ["14:00-16:00", "19:00-21:00"],
    wednesday: ["19:00-21:00"],
    saturday: ["10:00-12:00"]
  },
  bio: "QA Sênior com 5 anos em automação e performance",
  max_mentees: 3
};

window.TG_MENTORSHIP.registerMentor(mentor);
```

### 2. Registro de Aprendiz

```javascript
const learner = {
  name: "Maria Santos",
  current_level: "intermediate",
  goals: ["mastery-automation", "performance-testing"],
  learning_style: "hands-on",
  timezone: "America/Sao_Paulo",
  availability: {
    monday: ["14:00-16:00"],
    thursday: ["19:00-20:30"],
    saturday: ["10:00-12:00"]
  },
  interests: ["automation", "ci-cd"],
  languages: ["pt"]
};

window.TG_MENTORSHIP.registerLearner(learner);
```

### 3. Encontrar Mentores

```javascript
// Aprendiz vê top 3 mentores compatíveis
const mentors = window.TG_MENTORSHIP.findBestMentors(learner);

mentors.forEach(({ mentor, score }) => {
  console.log(`${mentor.name} - Compatibilidade: ${score}%`);
});
```

### 4. Criar Match

```javascript
const match = window.TG_MENTORSHIP.createMatch(mentorId, learnerId);
```

## Algoritmo de Matching

**Scoring:**
- Especialidades (30%) — Quantas especialidades do mentor correspondem aos goals do aprendiz
- Idioma (15%) — Mentor e aprendiz falam a mesma língua?
- Timezone (20%) — Mesma zona horária = melhor?
- Disponibilidade (20%) — Quantos dias/horas têm sobreposição?
- Capacidade do Mentor (15%) — Mentor tem vaga?

**Exemplo:**
```
Mentor: João (5 anos, automation, performance, api-testing)
Learner: Maria (quer automation, performance)

Compatibilidade:
- Especialidades: 2/3 = 67% × 30 = 20 pontos
- Idioma: SIM = 15 pontos
- Timezone: SIM = 20 pontos
- Disponibilidade: 50% overlap = 10 pontos
- Capacidade: 50% = 7 pontos
- TOTAL: 72/100 pontos
```

## Recursos Principais

### Mensagens

```javascript
// Mentor envia mensagem
window.TG_MENTORSHIP.addMessage(matchId, mentorId, "Oi Maria! Vamos começar?");

// Aprendiz responde
window.TG_MENTORSHIP.addMessage(matchId, learnerId, "Oi João! Tô pronta!");
```

### Agendamento de Reuniões

```javascript
const meeting = {
  date: "2024-02-15",
  time: "19:00",
  duration: 60, // minutos
  topic: "Playwright Basics"
};

window.TG_MENTORSHIP.scheduleMeeting(matchId, meeting);
```

### Avaliação

```javascript
// Aprendiz avalia mentor após encerrar
window.TG_MENTORSHIP.rateMentor(mentorId, 5, "Excelente mentor! Aprendi muito.");

// Mentor tem rating e reviews
// rating: 4.8
// reviews: 12
```

### Encerrar Match

```javascript
window.TG_MENTORSHIP.endMatch(matchId);
// Mentor fica disponível para novo aprendiz
```

## Perfis

### Mentor

| Campo | Descrição |
|-------|-----------|
| `name` | Nome do mentor |
| `experience_years` | Anos de experiência |
| `specialties` | Array de especialidades |
| `languages` | Idiomas que fala |
| `timezone` | Fuso horário |
| `availability` | Horários disponíveis (por dia) |
| `bio` | Biografia curta |
| `max_mentees` | Máximo de aprendizes simultâneos |
| `current_mentees` | Aprendizes atuais |
| `rating` | Nota média (0-5) |
| `reviews` | Número de avaliações |
| `verified` | Mentor verificado? |

### Learner

| Campo | Descrição |
|-------|-----------|
| `name` | Nome do aprendiz |
| `current_level` | Nível (beginner, intermediate, senior) |
| `goals` | Goals (mastery-automation, etc) |
| `learning_style` | Estilo (hands-on, visual, etc) |
| `timezone` | Fuso horário |
| `availability` | Horários disponíveis |
| `interests` | Áreas de interesse |
| `languages` | Idiomas que fala |
| `experience_areas` | Onde já tem experiência |

## Casos de Uso

### Use Case 1: Aprendiz Iniciante Procura Mentor

```
1. Maria (intermediate) registra no sistema
2. Sistema busca mentores disponíveis em seu timezone
3. Filtra por especialidades (automation + performance)
4. Calcula score de compatibilidade
5. Mostra top 3 para Maria escolher
6. Maria escolhe João
7. Match criado
8. João recebe notificação (webhooks)
9. Eles agendam primeira reunião
```

### Use Case 2: Mentor Oferece Mentorado

```
1. João vai à seção de Mentorship
2. Vê lista de aprendizes querendo mentor
3. Escolhe Maria (compatibilidade 72%)
4. Envia mensagem: "Oi Maria, gostaria de ser seu mentor?"
5. Maria aceita
6. Começam colaboração
```

## Integração com Discord

Quando um match é criado, pode notificar no Discord:

```javascript
// Webhook para Discord
fetch(webhookUrl, {
  method: 'POST',
  body: JSON.stringify({
    content: `🎓 Novo Match! ${mentor.name} agora mentora ${learner.name}`
  })
});
```

## Próximos Passos

1. **Integração com Chat Real** — Firebase, Socket.io para mensagens em tempo real
2. **Video Calls** — Integrar Jitsi ou Zoom para video mentoring
3. **Analytics** — Tracking de progresso do aprendiz
4. **Gamification** — Badges para mentores "best mentors", aprendizes "most improved"
5. **Recursos Compartilhados** — Mentor pode compartilhar aulas, quiz, labs

---

**Repositório:** Código disponível em `js/mentorship.js` e `data/mentorship.js`
