# Casos de Teste Manual — Sauce Demo

## Test Case #1: Login com credenciais válidas

**App:** [Sauce Demo](https://www.saucedemo.com)

**Precondições:**
- Navegador Chrome ou Firefox
- Acesso a https://www.saucedemo.com

**Steps:**
1. Abra https://www.saucedemo.com
2. Preencha Username: `standard_user`
3. Preencha Password: `secret_sauce`
4. Clique no botão "Login"

**Expected Result:**
- Redirecionado para página de inventário
- URL muda para `/inventory.html`
- Título da página é "Products"

**Actual Result:**
[Complete após testar]

**Status:** ⬜ Não testado / ✅ Pass / ❌ Fail

**Screenshot/Evidence:**
[Cole aqui]

---

## Test Case #2: Login com password incorreta

**Steps:**
1. Abra https://www.saucedemo.com
2. Preencha Username: `standard_user`
3. Preencha Password: `wrong123`
4. Clique Login

**Expected Result:**
- Mensagem de erro é exibida
- Permanece na página de login

**Actual Result:**
[Complete]

**Status:** ⬜ Não testado / ✅ Pass / ❌ Fail

---

## Test Case #3: Adicionar produto ao carrinho

**Precondições:** Já logado como standard_user

**Steps:**
1. Na página de inventário, clique em "Sauce Labs Backpack"
2. Clique no botão "Add to Cart"
3. Observe o ícone do carrinho no topo

**Expected Result:**
- Badge no carrinho mostra "1"
- Produto é adicionado

**Actual Result:**
[Complete]

**Status:** ⬜ Não testado / ✅ Pass / ❌ Fail

---

## Test Case #4: Remover produto do carrinho

**Precondições:** Tem 1 produto no carrinho

**Steps:**
1. Clique no botão "Remove" do produto
2. Observe o badge do carrinho

**Expected Result:**
- Badge desaparece ou mostra "0"
- Carrinho fica vazio

**Actual Result:**
[Complete]

**Status:** ⬜ Não testado / ✅ Pass / ❌ Fail

---

## Test Case #5: Checkout — Preencher informações

**Precondições:** Tem 1+ produtos, está no carrinho

**Steps:**
1. Clique "Checkout"
2. Preencha First Name: `John`
3. Preencha Last Name: `Doe`
4. Preencha Zip Code: `12345`
5. Clique "Continue"

**Expected Result:**
- Vai para página de revisão
- URL muda para `/checkout-step-two.html`

**Actual Result:**
[Complete]

**Status:** ⬜ Não testado / ✅ Pass / ❌ Fail

---

## Test Case #6: Finalizar compra

**Precondições:** Na página de revisão do checkout

**Steps:**
1. Clique "Finish"

**Expected Result:**
- Página de confirmação é exibida
- Mensagem "Thank you for your order"

**Actual Result:**
[Complete]

**Status:** ⬜ Não testado / ✅ Pass / ❌ Fail

---

## Test Case #7: Filtrar produtos por preço

**Precondições:** Na página de inventário

**Steps:**
1. Clique no dropdown "Sort"
2. Selecione "Price (low to high)"
3. Observe a ordem dos produtos

**Expected Result:**
- Produtos são reordenados do mais barato para o mais caro

**Actual Result:**
[Complete]

**Status:** ⬜ Não testado / ✅ Pass / ❌ Fail

---

## Test Case #8: Logout

**Precondições:** Logado

**Steps:**
1. Clique no menu hambúrguer (☰) no canto superior esquerdo
2. Clique "Logout"

**Expected Result:**
- Redirecionado para página de login
- Session é encerrada

**Actual Result:**
[Complete]

**Status:** ⬜ Não testado / ✅ Pass / ❌ Fail

---

## Test Case #9: Verficar responsividade em mobile

**Precondições:** Abrir em dispositivo mobile ou devtools (320px width)

**Steps:**
1. Abra https://www.saucedemo.com em mobile
2. Navegue por algumas páginas

**Expected Result:**
- Layout se adapta ao mobile
- Todos os elementos são clicáveis
- Sem scroll horizontal

**Actual Result:**
[Complete]

**Status:** ⬜ Não testado / ✅ Pass / ❌ Fail

---

## Test Case #10: Validar breadcrumb de navegação

**Precondições:** Na página de checkout-complete

**Steps:**
1. Observe o breadcrumb (caminho) na página
2. Clique em "Back Home" se disponível

**Expected Result:**
- Breadcrumb mostra o caminho que você tomou
- Clique funciona e volta para a home

**Actual Result:**
[Complete]

**Status:** ⬜ Não testado / ✅ Pass / ❌ Fail

---

## Resumo

| # | Caso de Teste | Status |
|---|---|---|
| 1 | Login válido | ⬜ |
| 2 | Password errada | ⬜ |
| 3 | Adicionar carrinho | ⬜ |
| 4 | Remover carrinho | ⬜ |
| 5 | Checkout | ⬜ |
| 6 | Finalizar | ⬜ |
| 7 | Filtrar | ⬜ |
| 8 | Logout | ⬜ |
| 9 | Responsivo | ⬜ |
| 10 | Navegação | ⬜ |

**Total:** 0/10 completados
