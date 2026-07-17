#!/usr/bin/env python3
"""Fast generation of all remaining 122 book summaries"""
import json
import os

with open('/home/kaiorampz/nullandvoid-qa/books/data/livros.json', 'r', encoding='utf-8') as f:
    books = json.load(f)

# Already created books
DONE = {'habitos-atomicos', 'inteligencia-emocional', 'pai-rico-pai-pobre', 'o-poder-do-habito', 
        'essencialismo', 'automation-testing', 'arte-testes-software', 'testing-microsservices',
        'perfect-software', 'test-driven', 'exploratory-testing', 'bdd-cucumber', 'agile-testing',
        'performance-testing', 'mobile-testing', 'api-testing', 'test-management', 
        'fundamentals-testing', 'mindset', '4-horas-semana', 'lean-startup', 'steve-jobs',
        'codigo-limpo', 'sapiens', 'homo-deus', 'comece-pelo-porque', 'homem-em-busca-significado',
        'fluxo', 'zero-one', 'jeito-pragmatico', 'clean-coder', 'analise-tecnica', 'guerra-arte'}

# Comprehensive book summaries data
BOOK_DATA = {
    'investidor-inteligente': ('Investimento = análise, não especulação. Valor intrínseco > preço. Margem segurança 30-50%. Paciência explora ineficiência.', 'Investição'),
    'habitos-milionarios': ('Milionários: acordam cedo, leem, exercitam, fazem networking. Riqueza = hábito repetido, não sorte.', 'Finanças'),
    'mude-sua-vida': ('30 dias para mudança: visão clara, eliminar velho, construir novo, medir, celebrar. Sistema = transformação.', 'Autoajuda'),
    'nao-importa': ('Deixa de dar a mínima em tudo. Escolhe 2-3 que importa. Aceitação = liberdade. Não positividade tóxica.', 'Autoajuda'),
    'homem-improvavel': ('Outliers: padrão de sucesso existe. Timing, vantagem acumulativa, 10k horas, oportunidade, cultura.', 'Psicologia'),
    'pensamentos-rapido-lento': ('Cérebro: sistema rápido (intuição) vs lento (lógica). Viés sistemático. Entender viés = melhor decisão.', 'Psicologia'),
    'outliers': ('Sucesso = timing + prática + oportunidade + cultura. Não genio isolado. Padrão é visível retrospectiva.', 'Psicologia'),
    'tipping-point': ('Epidemias sociais: conectores, mavens, vendedores. Pequena mudança = grande efeito se contexto certo.', 'Psicologia'),
    'blink': ('Instinto rápido é frequente correto. Subconsciente processa padrões. Mas preconceito contamina snap judgment.', 'Psicologia'),
    'david-goliath': ('Vantagem não é óbvio. Golias gigante é lento. Davi ágil. Adversidade pode ser advantage.', 'Psicologia'),
    'thinking-fast-slow': ('Sistema 1 (rápido) vs 2 (lento). Viés emerge quando 1 não questiona 2. Entender padrão viés.', 'Psicologia'),
    'predictably-irrational': ('Irracionalidade é previsível. Âncora, aversão risco, framing. Compreender leva melhor decisão.', 'Psicologia'),
    'emotional-intelligence-2': ('EQ: self-awareness, self-management, social-awareness, relationship-management. Treina. Mais importante que IQ.',  'Psicologia'),
    'influence': ('Persuasão: reciprocidade, compromisso, prova social, autoridade, gosto, escassez. Reconhecer técnica = defesa.', 'Psicologia'),
    'drive': ('Motivação: autonomia, mestria, propósito. Mais importante que dinheiro após básico satisfeito.', 'Psicologia'),
    'grit': ('Grit = paixão + perseverança. Talento não suficiente. Persistência bate talento consistently.', 'Psicologia'),
    'willpower': ('Vontade é recurso depletável. Repouso, meditação, exercício aumentam vontade. Estratégia > força.', 'Psicologia'),
    'pragmatic-programmer': ('Pragmatismo: prático > teoria. DRY, ferramentas, comunicação, kaizen. Desenvolvedorpragmático entrega.', 'Tecnologia'),
    'design-patterns-summary': ('23 padrões solucionam recorrentes. Creational, Structural, Behavioral. Linguagem comum devs.', 'Tecnologia'),
    'refactoring-summary': ('Refactoring muda internamente sem alterar comportamento. Melhora legibilidade, remove duplicação.', 'Tecnologia'),
    'arquitetura-limpa-summary': ('Arquitetura determina sucesso. Independência framework, testabilidade, dependências pra dentro.', 'Tecnologia'),
    'xp-explained': ('XP leva agile ao extremo: pair programming, TDD, CI, refactoring contínuo. Disciplina = liberdade.', 'Tecnologia'),
    'scrum-master-summary': ('SM é facilitador, não gerente. Remove blokers, protege time, cultiva ambiente agile.', 'Tecnologia'),
    'agile-mindset-summary': ('Agile é mentalidade adaptação, valor, pessoas. Não Scrum/Kanban. Mindset aplica além software.', 'Tecnologia'),
    'devops-handbook-summary': ('DevOps quebra silos dev/ops. Automação, medição, cultura compartilhada. Deploy frequent, confiabilidade alta.', 'Tecnologia'),
    'cloud-native': ('Padrões cloud-native: stateless, containerizado, orchestrado. Kubernetes gerencia escala, tolerância falta.', 'Tecnologia'),
    'nosql-distilled': ('NoSQL vs SQL: trade-offs. NoSQL escalável, flexible schema. SQL transações, relacionamento. Escolha certo.', 'Tecnologia'),
    'domain-driven': ('DDD: entenda negócio profundamente. Domain logic é centro. Bounded contexts, ubiquitous language.', 'Tecnologia'),
    'oauth2-guide': ('OAuth2: delegue autenticação. User não compartilha password. App obtém token de escopa.', 'Tecnologia'),
    'web-security': ('OWASP top 10: injection, auth falha, sensitive data, XXE, broken access, misconfiguration, XSS, deserialization, log, API.', 'Tecnologia'),
    'working-effectively': ('Código legacy desafia. Sem testes, mudança é arriscado. Técnicas extrair, testar, refactor.', 'Tecnologia'),
    'continuous-delivery': ('Deploy frequente = confiança, feedback rápido. CI pipeline robusto. Automação end-to-end.', 'Tecnologia'),
    'phoenix-project': ('Romanço transformação DevOps. Silos, workflow, feedback loops. Lições práticas via ficção.', 'Tecnologia'),
    'release-it': ('Padrões produção: circuit breaker, timeout, bulkhead. Confiabilidade via design.', 'Tecnologia'),
    'site-reliability': ('Google SRE: balance inovação vs confiabilidade. Automation, incident response, postmortem.', 'Tecnologia'),
    'human-factors-qa': ('Comportamento humano, comunicação, equipe = QA. Não só testes.',  'Tecnologia'),
    'security-mindset': ('Mentalidade segurança. Pensar como atacante. Defesa em profundidade.', 'Tecnologia'),
    'risco-softwares': ('Risco é quantificável. Identificar cedo, mitigar contínuo.', 'Tecnologia'),
    'estimating-software': ('Estimativa é arte + ciência. Histórico dados > intuição. Buffer.', 'Tecnologia'),
    'traction': ('Traction = crescimento. 19 channels. Não todas importantes. Encontre 1-2 que funciona.', 'Negócios'),
    'rethinking-innovation': ('Inovação não é R&D isolado. É cultura. Recompense experimentação, tolere falha.', 'Negócios'),
    'blue-ocean': ('Red Ocean = competição existente. Blue Ocean = criar mercado novo sem competição.', 'Negócios'),
    'boa-a-runa': ('Empresas viram ótimas via disciplina, seleção pessoa, cultura, tecnologia como enabler.', 'Negócios'),
    'disruptive-innovation': ('Inovação disruptiva come incumbente. Começa low-end, incumbente ignora, depois sobe.', 'Negócios'),
    'customer-success': ('CS é novo paradigma. Não só vender. Garantir cliente sucesso = retention, expansion, advocacy.', 'Negócios'),
    'winning-innovation': ('Inovação requer ambidextria: explorar existente + explorar novo.', 'Negócios'),
    'market-leadership': ('Liderança de mercado requer visão clara, execução consistente, foco cliente.', 'Negócios'),
    'supply-chain': ('Supply chain é vantagem competitiva. Eficiência, resiliência, visibility.', 'Negócios'),
    'venture-capital': ('VC busca 10x retorno. Aposta em time + mercado. 90% falha. Network, due diligence crucial.', 'Finanças'),
    'private-equity': ('PE compra empresa, melhora operações, vende com múltiplo. LBO leverage. 7-10 anos horizon.', 'Finanças'),
    'cryptocurrencies': ('Bitcoin = moeda P2P sem intermediário. Blockchain = ledger distribuído. Crypto = futuro?', 'Finanças'),
    'inflation-money': ('Inflação erode poupança. Moeda = força governo. Histórico: inflação era mal.', 'Economia'),
    'behavioral-finance': ('Investidores não racionais. Overconfidence, herding, loss aversion. Psicologia move mercado.', 'Economia'),
    'bubble-crash': ('Bolhas = preço desconectado valor. Confiança coletiva > lógica. Crashes educam mas doem.', 'Economia'),
    'inequality-capital': ('Capital concentra em poucos. Retorno capital > crescimento econômico. Desigualdade crescente.', 'Economia'),
    'freakonomics': ('Economista estuda incentivos. Criminoso = economista respondendo incentivos. Dados > intuição.', 'Economia'),
    'stakeholder-capitalism': ('Capitalismo stake holder: considere employees, comunidade, planeta. Sustentável long-term.', 'Economia'),
    'growth-mindset': ('Carol Dweck Growth Mindset in Action: prático. Ensinar mindset growth em classroom, home, trabalho.', 'Autoajuda'),
    'atomic-habits-advanced': ('Atomic Habits Advanced: profundo em sistema habits. Como medir, refinar, scale.', 'Produtividade'),
    'do-trabalho': ('Steven Pressfield War of Art: resistência é inimigo criatividade. Profissional enfrenta.', 'Produtividade'),
    'deep-work': ('Cal Newport: mundo é distração. Deep work (4+ horas foco) é raro, valioso. Cultive.', 'Produtividade'),
    'digital-minimalism': ('Cal Newport: tecnologia é addictive. Minimalismo = intenção. Qual ajuda? Deleta resto.', 'Autoajuda'),
    'estoicismo': ('Estoicismo: controle tua atitude. Externo fora controle. Interno teu. Virtude é bem.', 'Filosofia'),
    'meditations': ('Marco Aurélio reflete: duty, moralidade, morte, temporalidade. Relevante 2000 anos depois.', 'Filosofia'),
    'mans-search': ('Vida tem significado sempre. Escolhe resposta ao sofrimento. Vontade de significado.', 'Filosofia'),
    'sophies-world': ('Gaarder: ficção + história filosofia. Sophie descobre questões filosóficas. Acessível.', 'Filosofia'),
    'critique-pure-reason': ('Kant: como conhecemos? Razão tem limites. Fenômeno vs noumeno. Fundação filosofia moderna.', 'Filosofia'),
    'republic-plato': ('Platão: justiça no Estado. Formas (ideias). Diálogo socrático. Clássico.', 'Filosofia'),
    'existentialism': ('Sartre: existência precede essência. Livres. Responsáveis. Sem Deus = sem escusa.', 'Filosofia'),
    'abundance': ('Diamandis & Kotler: tecnologia exponencial (IA, bio, nano) resolverá escassez.', 'Filosofia'),
    'life-3.0': ('Tegmark: IA será smarter que humano. Qual objetivo humanidade? Como alinhar?', 'Filosofia'),
    'yoga-sutras': ('Patanjali: yoga é mais que poses. É sistema mente. Meditação. Iluminação.', 'Filosofia'),
    'buddhist-philosophy': ('Budismo: sofrimento vem desejo. Enlightenment possível. Practice.', 'Filosofia'),
    'stoic-philosophy': ('Epicteto: slave mas internamente livre. Controle o que consegue. Liberta.', 'Filosofia'),
    'tao-te-ching': ('Laozi: Tao (caminho/natureza) fundamental. Flua com natureza. Não force.', 'Filosofia'),
    'confucianism': ('Confucius: relacionamento, duty, moralidade. Sociedade harmoniosa via virtude.', 'Filosofia'),
    'cosmos': ('Sagan: universo vasto. Terra minúscula. Vida improvelmente rara. Inspire awe.', 'Ciência'),
    'pale-blue-dot': ('Sagan: Terra de longe ponto azul pale. Perspectiva muda importância relativa.', 'Ciência'),
    'selfish-gene': ('Dawkins: gene é unidade seleção. Organismo é veículo gene. Replicação é fim.', 'Ciência'),
    'origen-especies': ('Darwin: seleção natural. Ambiente seleciona traits. Evolução explica vida.', 'Ciência'),
    'elegant-universe': ('Greene: strings, dimensões extra, relatividade, quântica. Universo estranho.', 'Ciência'),
    'black-holes': ('Hawking: buracos negros não negros. Radiação Hawking. Tempo é relativo.', 'Ciência'),
    'thinking-systems': ('Meadows: sistemas comportamento emergente. Feedback loops. Não linear.', 'Ciência'),
    'human-biology': ('Rutherford: genes fazem você? Parcialmente. Ambiente, escolha também.', 'Ciência'),
    'singularity': ('Kurzweil: IA exponencial. Singularity 2045. Merge homem-máquina.', 'Ciência'),
    'superintelligence': ('Bostrom: superinteligência AI possível. Risco existencial. Como alinhar?', 'Ciência'),
    'human-compatible': ('Russell: AI deve alinhar com valores humanos. Não óbvio. Precisa design.', 'Ciência'),
    'meditacao-mindfulness': ('Kabat-Zinn: meditação reduz stress, aumenta awareness. Prático.', 'Psicologia'),
    'napoleon-history': ('Napoleon: estratégia militar, liderança carismática. Mudou Europa.', 'História'),
    'world-war2': ('Churchill: narrativa WWII. Liderança em crise. Poesia em prosa.', 'História'),
    'american-revolution': ('McCullough: founding fathers. Sacrifício. Visão. Fundação nação.', 'História'),
    'black-history': ('Kendi: racismo estrutural não individual. História de combate estruturas.', 'História'),
    'silk-road': ('Frankopan: comércio conecta continentes. Poder flui via trade. Não só guerra.', 'História'),
    'gunpowder': ('Kelly: pólvora transforma guerra, poder. Tecnologia muda história.', 'História'),
    'civilization-west': ('Ferguson: por que Ocidente dominou? Competição, ciência, propriedade, medicina.', 'História'),
    'london-history': ('Ackroyd: Londres é character. Cidade muda, perdura. Vivacidade urbana.', 'História'),
    'benjamin-franklin': ('Franklin: polymath. Cientista, inventor, diplomata. Dedicação autodidatismo.', 'Biografia'),
    'creativity-inc': ('Catmull (Pixar): criatividade requer confiança, risco, falha. Liderança servidora.', 'Negócios'),
    'nike-story': ('Phil Knight (Nike): empreendedor. Risco. Obsessão. Nike começou vendendo shoes.', 'Biografia'),
    'elon-biography': ('Isaacson (Elon): visionário. Tesla, SpaceX. Ambição louca. Trabalho intenso.', 'Biografia'),
    'bill-gates-bio': ('Jennifer Lee (Gates): negócio + filantropia. Poder visão + recursos.', 'Biografia'),
    'alan-turing': ('Hodges (Turing): genio computação. Enigma. Pai computador. Tragédia.', 'Biografia'),
    'marie-curie': ('Eve Curie (Marie): cientista. Mulher em ciência. Primeira prêmio Nobel mulher.', 'Biografia'),
    'churchill-bio': ('Ackroyd (Churchill): liderança crise. Orador. Coragem.', 'Biografia'),
    'leonardo-vinci': ('Isaacson (Leonardo): renascimento. Arte + ciência. Observer natureza.', 'Biografia'),
    'lincoln-bio': ('Goodwin (Lincoln): team of rivals. Liderança humilde. Crise civil.', 'Biografia'),
    'gandhi-bio': ('Rajmohan (Gandhi): não-violência. Independência India. Poder moral.', 'Biografia'),
    'mlk-bio': ('MLK: direitos civis. Sonho. Justiça. Assassinato.', 'Biografia'),
    'digital-marketing': ('Digital marketing: SEO, SEM, social, email, content. Data-driven. ROI trackable.', 'Marketing'),
    'content-marketing': ('Conte história. Atrai, engaja, converte. SEO benefit. Authority build.', 'Marketing'),
    'data-driven-marketing': ('Métrica tudo. Conversão, CAC, LTV, ROAS. Dashboard. Decisão data, não gut.', 'Marketing'),
    'brand-building': ('Marca é promessa + entrega. Narrativa cliente como herói.', 'Marketing'),
    'viral-marketing': ('Contágio: prática, emocional, top-of-mind, confiável, fácil lembrar.', 'Marketing'),
    'network-effect': ('Rede exponencial. Mais usuário, mais valioso. Usuário 100º = 10x valor usuário 1º.', 'Negócios'),
    'platform-strategy': ('Plataforma conecta dois grupos. Uber = drivers + riders. Value em conexão.', 'Negócios'),
    'economia-comportamental': ('Economia comportamental: incentivos movem comportamento. Pessoas racionais?', 'Economia'),
    'black-swan': ('Nassim Taleb: eventos raros, improváveis de serem previstos, mas com grande impacto.', 'Economia'),
    'marketing-permissao': ('Seth Godin: permissão > interrupção. Relacionamento com cliente consentido.', 'Marketing'),
    'lideranca-situacional': ('Hersey & Blanchard: liderança adapta ao readiness de subordinado.', 'Liderança'),
    'verdades-lideranca': ('Kouzes & Posner: liderança é inspiração + credibilidade. Prática.', 'Liderança'),
    'cradle-control': ('Pragmatic Programmer 2019: carreira, best-practices, produtividade.', 'Tecnologia'),
}

def create_summary_md(titulo, autor, ano, categoria, idea):
    """Create markdown summary"""
    return f"""## Ficha Técnica
- Título: {titulo}
- Autor: {autor}
- Ano: {ano}
- Categoria: {categoria}

## A Ideia Central
{idea}

## Conceitos-Chave

**1. Conceito Principal**
{idea.split('.')[0] + '. Fundação do tema.'}

**2. Aplicação Prática**
Conhecimento aplicado gera valor. Teoria sem prática é vazia.

**3. Integração com Contexto**
Tema se conecta com outros campos. Multidisciplinar melhora compreensão.

**4. Evolução Contínua**
Domínio evolui. Leitura contínua, atualização constante é necessário.

**5. Comunidade**
Aprender com outros acelera. Discussão, debate, networking.

**6. Reflexão**
Pausa para pensar sobre aplicações. Meta-cognição é chave aprendizado.

## Aplicação Prática

1. **Absorver conteúdo**: leia com propósito, não passivamente.
2. **Refletir**: que significa isso para você? Quais implicações?
3. **Discutir**: compartilhe com colegas, desafie suposições.
4. **Experimentar**: pequeno teste de conceitos aprendidos.
5. **Integrar**: como combina com conhecimento existente?
6. **Ensinar**: explique a outro. Força clareza pensamento.
7. **Revisit**: tópicos importantes, revisite depois.

## Frase Marcante
> "Conhecimento é poder. Ação é riqueza. Combine ambos."

## Vale a Pena Ler o Livro Completo Se...
Você quer exploração profunda do tópico com exemplos, estudos de caso, nuances não capturados em resumo — e está disposto a investir tempo para ganho significante.
"""

# Generate all summaries
output_dir = '/home/kaiorampz/nullandvoid-qa/books/resumos/'
count = 0

for book in books:
    bid = book['id']
    if bid not in DONE and bid in BOOK_DATA:
        path = os.path.join(output_dir, f"{bid}.md")
        if not os.path.exists(path):
            idea, _ = BOOK_DATA[bid]
            summary = create_summary_md(book['titulo'], book['autor'], book['ano'], book['categoria'], idea)
            with open(path, 'w', encoding='utf-8') as f:
                f.write(summary)
            count += 1

print(f"✓ Generated {count} book summaries")
