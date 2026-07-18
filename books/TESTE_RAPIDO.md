# 🧪 Guia de Teste Rápido - "Marcar como Lido"

## Como Testar

### 1. Abrir Servidor Local

```bash
cd /home/kaiorampz/nullandvoid-qa
python3 -m http.server 8080
```

Ou se já tiver um servidor rodando, use a porta disponível.

### 2. Páginas para Testar

#### Página de Teste (Diagnóstico)
```
http://localhost:8080/books/test-auth.html
```

Esta página mostra:
- ✅ Status de carregamento de todos os scripts
- ✅ Botão de login Google
- ✅ Botões de teste para marcar/desmarcar livros
- ✅ Visualização do localStorage
- ✅ Console de eventos em tempo real

#### Página Principal de Livros
```
http://localhost:8080/books/index.html
```

Esta página deve mostrar:
- ✅ Botão "Sign in with Google" no header (canto superior direito)
- ✅ Após login: foto do perfil + nome + botão de logout
- ✅ Livros com badge "✓ Lido" nos que você marcar

#### Página de Livro Individual
```
http://localhost:8080/books/livro.html?id=codigo-limpo
```

Esta página deve mostrar:
- ✅ Botão "Sign in with Google" no header
- ✅ Botão "Marcar como lido" (desabilitado antes do login)
- ✅ Após login: botão habilitado
- ✅ Após marcar: botão com checkmark ✓ e estado "Lido"

## 🔍 O que Verificar

### No Header (Todas as Páginas)

**Antes do Login:**
- [ ] Botão "Sign in with Google" visível no header
- [ ] Botão azul padrão do Google

**Após o Login:**
- [ ] Foto do perfil aparece
- [ ] Nome do usuário aparece
- [ ] Botão de logout (↪️) aparece
- [ ] Botão de login some

### Na Lista de Livros (`index.html`)

**Após Marcar Livro como Lido:**
- [ ] Badge "✓ Lido" aparece no canto superior direito do card
- [ ] Livro fica com opacidade reduzida
- [ ] Hover restaura opacidade

### Na Página do Livro (`livro.html`)

**Antes do Login:**
- [ ] Botão "Marcar como lido" está desabilitado (opaco)
- [ ] Tooltip: "Faça login para marcar livros como lidos"

**Após o Login:**
- [ ] Botão fica habilitado
- [ ] Ao clicar: toast "✓ Livro marcado como lido!"
- [ ] Botão muda para "Lido" com checkmark
- [ ] Badge ✓ aparece no canto do botão

**Clicar Novamente (Desmarcar):**
- [ ] Toast "Removido dos livros lidos"
- [ ] Botão volta ao estado normal

## 🐛 Troubleshooting

### Botão de Login Não Aparece

1. **Abra o Console do Navegador** (F12)
2. **Procure por erros:**
   - "Failed to load auth.js" → Caminho errado
   - "Google API not loaded" → Bloqueador de ads/scripts
   - "jwt_decode is not defined" → CDN bloqueado

3. **Verifique manualmente:**
```javascript
// No console do navegador:
window.NVAuth
// Deve retornar um objeto com funções

google.accounts
// Deve retornar um objeto

jwt_decode
// Deve retornar uma função
```

### Botão Não Habilita Após Login

```javascript
// No console:
window.NVAuth.isAuthenticated
// Deve retornar: true

window.NVAuth.user
// Deve retornar: { id: "...", name: "...", ... }
```

### Dados Não Persistem

```javascript
// Verifique o localStorage:
localStorage.getItem('nv_auth_user')
// Deve retornar JSON com dados do usuário

// Para ver livros lidos:
const userId = JSON.parse(localStorage.getItem('nv_auth_user')).id
localStorage.getItem(`nv_${userId}_read_books`)
// Deve retornar JSON com livros marcados
```

### Limpar Tudo e Começar de Novo

```javascript
// No console:
localStorage.clear()
location.reload()
```

## 📸 Screenshots de Referência

### Header com Login
```
[Logo] [Nav] [Theme 🌙] [🔵 Sign in with Google]
```

### Header Após Login
```
[Logo] [Nav] [Theme 🌙] [👤 Foto] [Nome] [↪️]
```

### Botão Marcado
```
┌─────────────────────┐
│   ✓                 │  <- Badge no canto
│ 📖 Lido             │
└─────────────────────┘
```

### Card com Badge
```
┌─────────────────┐
│  ✓ Lido         │  <- Badge cyan
│  [Capa do Livro]│  <- Opacidade 0.75
└─────────────────┘
```

## ✅ Checklist Completo

- [ ] Servidor rodando
- [ ] Página de teste carrega sem erros
- [ ] Login Google funciona
- [ ] Nome e foto aparecem após login
- [ ] Botão de logout funciona
- [ ] Marcar livro como lido funciona
- [ ] Badge aparece na lista
- [ ] Desmarcar livro funciona
- [ ] Badge desaparece da lista
- [ ] Dados persistem após reload
- [ ] Funciona em mobile (responsive)
- [ ] Logout limpa dados temporários

## 🎯 Teste Rápido de 2 Minutos

1. Abra `http://localhost:8080/books/test-auth.html`
2. Clique no botão azul do Google
3. Faça login com sua conta
4. Veja status mudar para "✓ Autenticado: Sim"
5. Clique em "Marcar Livro Como Lido"
6. Clique em "Ver Livros Lidos"
7. Verifique que o livro aparece na lista
8. Pronto! Está funcionando ✓

## 📞 Próximo Passo

Se tudo funcionar na página de teste, mas NÃO funcionar em `index.html` ou `livro.html`, o problema é no CSS ou no JavaScript dessas páginas específicas, não no sistema de auth.

---

**Criado em**: 17 de julho de 2026
