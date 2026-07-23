# Mensagem de Recrutamento para Betas

Olá! Estamos recolhendo feedback rápido (5–10 minutos) sobre algumas aulas de QA para garantir qualidade antes do lançamento.

O que pedimos:
- Teste 5 aulas (enviaremos links) e responda o formulário com suas impressões.
- Opcional: aceite participar de uma rápida entrevista de 15 minutos.

Modelo de mensagem a postar/enviar:

Olá pessoal — estamos testando uma versão beta curta das aulas do curso de QA. Procuramos 5 pessoas para testar e dar feedback prático. Leva ~10 minutos. Você recebe acesso antecipado e um certificado de participação.

Se interessar, responda aqui com seu e-mail/discord e eu envio o link para o formulário.

Instruções internas para o time:
- Enviar links das 5 aulas prioritárias (use `reports/lesson-samples.md` como referência).
- Registrar respostas em `reports/beta-feedback.json` (cada resposta é um objeto JSON).
- Após 5 respostas, rodar `node scripts/summarize-feedback.js` para gerar `reports/beta-feedback-summary.json`.
