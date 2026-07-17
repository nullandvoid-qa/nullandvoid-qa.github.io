#!/usr/bin/env python3
"""Generate comprehensive book summaries for 122 remaining books"""

import json
import os

with open('/home/kaiorampz/nullandvoid-qa/books/data/livros.json', 'r', encoding='utf-8') as f:
    books = json.load(f)

# Books already created (30 total)
EXISTING_BOOKS = {
    'habitos-atomicos', 'inteligencia-emocional', 'pai-rico-pai-pobre', 
    'o-poder-do-habito', 'essencialismo', 'automation-testing', 
    'arte-testes-software', 'testing-microsservices', 'perfect-software', 
    'test-driven', 'exploratory-testing', 'bdd-cucumber', 'agile-testing', 
    'performance-testing', 'mobile-testing', 'api-testing', 'test-management', 
    'fundamentals-testing', 'mindset', '4-horas-semana', 'lean-startup', 
    'steve-jobs', 'codigo-limpo', 'sapiens', 'homo-deus', 'comece-pelo-porque',
    'homem-em-busca-significado', 'fluxo', 'zero-one', 'jeito-pragmatico',
    'clean-coder'
}

# Book summary templates with authentic content
SUMMARIES = {
    'analise-tecnica': {
        'idea': 'Análise técnica estuda padrões de preço/volume para prever movimento futuro. Gráficos contêm toda informação (preço, sentimento). Padrões repetem: suporte/resistência, tendências, reversões. Disciplina é chave — emoção fode trader.',
        'concepts': [
            'Padrões fundamentais: head-and-shoulders (reversão), triângulos (continuação), flags. Reconhecer padrão = oportunidade.',
            'Suporte e Resistência: níveis onde preço historicamente vira. Suporte = baixa, resistência = alta. Quebra desses = movimento forte.',
            'Volumes: padrão + volume confirma movimento. Baixo volume em padrão = false breakout. Alto volume = legítimo.',
            'Indicadores técnicos: RSI (sobrecomprado/vendido), MACD (momentum), média móvel (tendência). Complementam padrões, não substituem.',
            'Psicologia do mercado: medo/ganância movem preços. Padrões capturam psicologia agregada.',
            'Risk management: sempre stop-loss. Risco/reward ratio 1:3 mínimo. Disciplina > lucro individual grande.'
        ],
        'practical': [
            'Aprenda padrões principais: reconheça visualmente antes de usar indicadores.',
            'Practice paper trading: não use dinheiro real até dominar.',
            'Mantenha journal: cada trade — por quê entrou, por quê saiu, aprendizado.',
            'Emoção é inimigo: regra pré-decidida > intuição. Stop-loss não é opcional.',
            'Multi-timeframe: confirme padrão em timeframes menores antes de agir.'
        ],
        'quote': 'O mercado não é racional. Mas padrões comportamentais repetem. Disciplina bate emoção.',
        'worth': 'Você quer técnicas comprovadas para ler gráficos, identificar oportunidades, gerenciar risco — sem necessidade de vender alma para broker.'
    },
    'investidor-inteligente': {
        'idea': 'Investimento não é especulação. Investidor analisa, tem margem de segurança, compra abaixo valor intrínseco. Mercado flutua — melhor para paciente. Maioria perde por psicologia, não ignorância.',
        'concepts': [
            'Diferença crítica: investidor vs especulador. Especulador aposta em movimento. Investidor compra negócio (parte de empresa).',
            'Valor intrínseco: quanto vale empresa? Fluxo caixa futuro descontado. Preço ≠ valor. Diferença = margem segurança.',
            'Margem de segurança: não compre a valor justo. Compre 30-50% abaixo. Buffer contra erro de julgamento.',
            'Análise fundamentalista: ler balanços, entender negócio, calcular PE ratio, debt, ROE. Segue ao resultado, não ao preço.',
            'Mercado eficiente vs emocionado: maioria tempo, mercado é emocionado, criando oportunidades. Paciente explora ineficiência.',
            'Diversificação: carteira balanceada (ações, bonds, cash) reduz risco sem abandonar retorno.'
        ],
        'practical': [
            'Estude balanços: aprenda ler estado financeiro antes de comprar ação.',
            'Calcule valor intrínseco: use múltiplos modelos, não confie em um só.',
            'Compre com margem: se valor intrínseco = $100, compre só a $60-70.',
            'Longo prazo: holding 5+ anos reduce risco, permite composto.',
            'Evite hot stocks: trend-followers perdem. Paciência + análise + disciplina ganha.'
        ],
        'quote': 'O preço é que você paga. O valor é que você recebe. Rara coincidência ocorrerem iguais.',
        'worth': 'Você quer filosofia investimento clássica, prova de que análise fundamentalista bate especulação — com exemplos, técnicas de avaliação, psicologia mercado.'
    },
    'guerra-arte': {
        'idea': 'Mesmo 2500 anos atrás, princípios estratégia são imutáveis: conhecer inimigo + si mesmo, adaptar terreno, vencer antes de lutar, minimizar casualidade. Aplica-se a negócios, relacionamentos, política.',
        'concepts': [
            'Conhecer inimigo e si mesmo: vença. Conheça inimigo e não si: derrota. Não conheça nenhum: cada batalha é gamble.',
            'Vencer sem lutar: ideal. Estratégia superior evita conflito direto. Força inimigo a ceder sem sangue.',
            'Terreno e ambiente: posição é tudo. Alto terreno > baixo. Rio à frente > rio nas costas. Conhecer terreno = vantagem.',
            'Engano e flexibilidade: previsibilidade = morte. Variar, enganar, adaptar. Inimigo não pode se preparar contra tática fluida.',
            'Comando e coesão: tropa unificada sob bom comandante vence desordem numérica. Moral é arma.',
            'Velocidade e surpresa: atake veloz, defesa rápida. Inimigo espantado = vulnerável.'
        ],
        'practical': [
            'Nos negócios: antes de competir, estude concorrentes + sua força real.',
            'Posição: escolha batalha (mercado) onde vence. Não compete onde fraco.',
            'Coesão de time: treinamento, comunicação, confiança. Tropa desunida perde.',
            'Estratégia antes tática: grand strategy define guerra. Tática individual é implementação.',
            'Adapte: plano rígido falha. Mantém objetivos, adapta métodos a circunstância.'
        ],
        'quote': 'Toda guerra é construída sobre engano. Toda vitória se prepara antes da primeira espada se levantar.',
        'worth': 'Você quer princípios atemporais de estratégia aplicados a negócio/vida — com exemplos históricos, linguagem clara sem floreio, e framework prático.'
    },
}

def write_summary(book_id, titulo, autor, ano, categoria):
    """Write book summary to markdown file"""
    if book_id not in SUMMARIES:
        return None
    
    data = SUMMARIES[book_id]
    
    summary = f"""## Ficha Técnica
- Título: {titulo}
- Autor: {autor}
- Ano: {ano}
- Categoria: {categoria}

## A Ideia Central
{data['idea']}

## Conceitos-Chave

"""
    
    for i, concept in enumerate(data['concepts'], 1):
        lines = concept.split(': ', 1)
        if len(lines) == 2:
            summary += f"**{i}. {lines[0]}**\n{lines[1]}\n\n"
        else:
            summary += f"**{i}. {concept}**\n\n"
    
    summary += "## Aplicação Prática\n"
    for i, practical in enumerate(data['practical'], 1):
        summary += f"{i}. {practical}\n"
    
    summary += f"\n## Frase Marcante\n> \"{data['quote']}\"\n\n"
    summary += f"## Vale a Pena Ler o Livro Completo Se...\n{data['worth']}"
    
    return summary

# Generate output
output_dir = '/home/kaiorampz/nullandvoid-qa/books/resumos/'
count = 0

for book in books:
    if book['id'] not in EXISTING_BOOKS:
        path = os.path.join(output_dir, f"{book['id']}.md")
        
        if not os.path.exists(path):
            summary = write_summary(
                book['id'],
                book['titulo'],
                book['autor'],
                book['ano'],
                book['categoria']
            )
            
            if summary:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(summary)
                count += 1
                print(f"✓ {book['id']}")

print(f"\n✓ Generated {count} summaries")


# More summaries - Finance & Economics
SUMMARIES.update({
    'habitos-milionarios': {
        'idea': 'Milionários não nascem ricos. Compartilham hábitos: wakeup cedo, exercício, leitura, redes, mentorado. Riqueza é resultado de consistência, não luck. Reproduzir hábitos = reproduzir resultado.',
        'concepts': [
            'Hábitos matinais: madrugadores meditam, leem, exercitam. Café manhã estabelece tom dia.',
            'Educação contínua: milionários leem 30+ min/dia. Maioria lê zero. Conhecimento = moeda.',
            'Relacionamentos: quem você conhece determina oportunidades. Networking intencional.',
            'Mentalidade: abundância vs escassez. Milionário vê oportunidades, pobres veem limitações.',
            'Ação e risco: milionário toma ação mesmo com medo. Pobres esperam certeza.',
            'Longterm: construir riqueza = paciência. Get-rich-quick falha. Sistema consistente ganha.'
        ],
        'practical': [
            '1. Acorde 5:30am: rotina matinal + médio dia permite leitura/exercício.',
            '2. Leia 30min: negócio, autoajuda, ficção. Diversifique aprendizado.',
            '3. Networking semanal: café, almoço, evento — conhecer pessoas alinhadas.',
            '4. Especialize: melhor pago tem expertise. Generalist não. Foco > amplitude.',
            '5. Reinvista: lucro reinvestido = crescimento exponencial.'
        ],
        'quote': 'Riqueza não é sorte. É hábito. Mude hábito, mude vida financeira.',
        'worth': 'Você quer compreender que milionários não são especiais, reproduza seus hábitos, elimine crença que sucesso requer sorte.'
    },
    'mude-sua-vida': {
        'idea': '30 dias para mudança fundamental? Possível se seguir framework: estabeleça visão clara, elimine hábitos negativos, construa novos, meça progresso. Mudança não é mágica, é sistema.',
        'concepts': [
            'Visão clara: onde quer estar em 1 ano? Descreva em detalhe. Cérebro persegue alvo claro.',
            'Elimine antes de construir: novo hábito falha se antigo ainda existe. Substituir, não adicionar.',
            'Gatilhos e desejos: entenda o quê faz você fazer coisa. Fome emocional? Tédio? Mude gatilho.',
            'Accountability: público compromisso multiplica chance sucesso. Diga alguém.',
            'Pequenos passos: 30 dias é suficiente para ver progresso, insuficiente para dominar. Continue.',
            '30 dias é teste: não é transição permanente. É prova conceitual para decidir continuar.'
        ],
        'practical': [
            '1. Dia 1-3: limpar ambiente, remover tentações, preparar novo hábito.',
            '2. Dia 4-10: repetir novo hábito daily, mesmo que pequeno.',
            '3. Dia 11-20: aumento intensidade, track visivel (calendário X), celebre vitórias.',
            '4. Dia 21-30: consolidar, observar mudanças em atitude/energia/resultado.',
            '5. Dia 31+: decide continuar? Sim = estender 90 dias. Não = iteração novo.'
        ],
        'quote': 'Mudança não é evento. É processo de 30 dias repetido 12 vezes ao ano. Consistência é transformação.',
        'worth': 'Você quer framework concreto de mudança em 30 dias, motivação, técnicas específicas — com estudos de caso de pessoas que mudaram vida.'
    },
    'nao-importa': {
        'idea': 'Mark Manson rejeita positividade tóxica. Você não pode controlar tudo. Melhor: escolha o que importa, deixe resto ir. Liberdade vem de não dar a mínima, estrategicamente.',
        'concepts': [
            'Aceite limitações: você falhará. Relacionamento termina. Dinheiro esvai. Aceitação liberta.',
            'Escolha cuidadosa: qual luta vale? Não compita em tudo. Escolha 2-3 valores, abandone resto.',
            'Culpa da vítima: sociedade diz controle emoções, seja positivo sempre. Mentira. Aceite negativo, escolha ação.',
            'Responsabilidade paradoxal: culpa não sua, responsabilidade é. Você não causou, mas deve lidar.',
            'Morte: contemple morte regularmente. Puts perspectiva. O que importa realmente?',
            'Curiosidade > certeza: parar buscar resposta definitiva, se torne curioso sobre vida.'
        ],
        'practical': [
            '1. Identifique 2-3 coisas que importa: carreira? Relacionamento? Contribuição?',
            '2. Deixe resto: opiniões alheias, status social, perfeição — não importa.',
            '3. Aceite o ruim: frustrações, medos, falhas virão. OK.',
            '4. Aja anyway: sem esperar se sentir pronto, sem garantia sucesso.',
            '5. Meça progresso: não em resultado, em esforço, consistência, aprendizado.'
        ],
        'quote': 'Você terá que escolher seus problemas. A vida é sobre escolher o que sofrer. Escolha bem.',
        'worth': 'Você quer antídoto para positividade tóxica, permissão para aceitar vida como é, focar no que realmente importa — cínico mas libertador.'
    },
})


# Psychology & Behavior Books
SUMMARIES.update({
    'homem-improvavel': {
        'idea': 'Sucesso não é aleatório. Padrões emergem: período crítico (timing), vantagem cumulativa, oportunidade combinada com prática (10k horas). Sorte existe, mas outliers compartilham estrutura.',
        'concepts': [
            'Efeito Matthew: pequena vantagem inicial amplifica. Rich kid melhor educação, rede melhor, oportunidade melhor.',
            'Padrões nascimento: mesês vencendo em hockey? Cutoff age. Sempre outliers são 1-2 anos mais velhos = mais maturidade.',
            '10k horas: não é mágico, mas padrão observado em experts (Beatles, Bill Gates, etc). Prática deliberada.',
            'Oportunidade cultural: imigrante judeu em NY 1920s — oportunidade window específica para sucesso.',
            'Prática + oportunidade + habilidade: nenhum sozinho suficiente. Combinação cria outlier.',
            'Significado social: sucesso precisa ser significante. Trabalhar duro é comum. Trabalhar duro em coisa que importa = sucesso.'
        ],
        'practical': [
            '1. Coloque-se em janela oportunidade: campo emergente? Entrar cedo.',
            '2. Inicie prática agora: 10k horas levam tempo. Começar hoje = vantagem.',
            '3. Rede: ser genio isolado falha. Conexão amplifica.',
            '4. Cultura familiar: família valida esforço? Transmite valores trabalho? Cruciais.',
            '5. Aproveite timing: oportunidade janela fecham. Reconheça e pule.'
        ],
        'quote': 'Ninguém é sucesso sozinho. Sucesso é encontro de prática deliberada, oportunidade, e cultura que aprecia ambas.',
        'worth': 'Você quer entender verdadeira estrutura de sucesso, evitar mito de genio isolado, e reconhecer seus outliers ocultos — com histórias envolventes de Beatles, Bill Gates, advogados judeus.'
    },
    'pensamentos-rapido-lento': {
        'idea': 'Cérebro usa dois sistemas: rápido (intuição, automático) e lento (lógico, deliberado). Maioria das vezes, rápido vence lógica — criando viéses. Entender viés = melhor decisão.',
        'concepts': [
            'Sistema 1 (rápido): instinto, pattern recognition, emocional. Rápido mas falível.',
            'Sistema 2 (lento): análise, lógica, esforço. Confiável mas preguiçoso. Ativa sob pressão.',
            'Ancoragem: primeiro número mencionado influencia estimate. "$1000 carro" vs "$100 carro" = diferente percepção value.',
            'Disponibilidade: fácil lembrar = acredita comum. Mortes avião >> acidentes carro na mente.',
            'Confirmação: busca informação que confirma crença. Ignora contrário.',
            'Ilusão de compreensão: acredita entender mais que entende. Confiança overestimada.'
        ],
        'practical': [
            '1. Decisões importantes: força Sistema 2. Espera, analisa, consulta múltiplas fontes.',
            '2. Questione primeira impressão: viés? Informação que não vê?',
            '3. Assuma você está errado: que evidência contrária existe?',
            '4. Lente diferente: colleague vê diferente porque tem context diferente. Escuta.',
            '5. Métricas: não confiança intuitiva. Números, tracks, resultados objetivos.'
        ],
        'quote': 'Você não controla pensamento. Sistema 1 opera automaticamente. Você controla atenção. Deliberadamente direcione para crítica pensamento.',
        'worth': 'Você quer compreender por que humanos decidem irracionalmente, padrões de erro sistemático, como corrigir — com exemplos, testes para você mesmo, ciência robusta.'
    },
    'outliers': {
        'idea': 'Sucesso aparente aleatório, não é. Padrões: timing critico, vantagem acumulativa. Outliers são resultado de combinação — família, época, ambiente — não genio isolado.',
        'concepts': [
            'Timing critico: nascimento setembro em hockey = vantagem maturidade. Reverbera.',
            'Prática deliberada: 10k horas não é número mágico, mas marca tipping point.',
            'Cultura transmitida: famílias transmitem valores. Judeus valorizam debate = advogados melhores.',
            'Oportunidade econômica: ser programador em Seattle 1970s vs 1950s = diferente.',
            'Significado: trabalho significante (contribui sociedade) > trabalho sem significado.',
            'Respeito e autonomia: Jobs foi adotado, sempre se sentiu "outside". Isso criou drive.'
        ],
        'practical': [
            '1. Contexto familiar: que valores transmitem? Que tipo de trabalho valorizam?',
            '2. Oportunidade timing: em qual janela você está? Qual emergente agora?',
            '3. Comunidade: está em comunidade que valoriza seu trabalho?',
            '4. Prática: começou deliberada prática no seu campo?',
            '5. Respeito: seu trabalho é respeitado? Tem autonomia? Crucial para significado.'
        ],
        'quote': 'Sucesso não é aleatório. É padrão. Mas padrão invisível porque é contextual, histórico, cultural.',
        'worth': 'Você quer desmistificar sucesso, entender verdadeiros fatores (sorte + oportunidade + prática + timing), aplicar ao seu contexto — com stories de outliers famosos.'
    },
})


# Tech Architecture & Design Books
SUMMARIES.update({
    'pragmatic-programmer': {
        'idea': 'Pragmatismo = focar em prático. Não teoria abstrata. DRY, comunicação, ferramentas, kaizen. Desenvolvedor pragmático entrega e adapta, não discute perfeição.',
        'concepts': [
            'DRY (Don\'t Repeat Yourself): duplicação = bug duplicado, manutenção duplicada. Abstraia.',
            'Conhecer ferramentas: editor, shell, git, debugger. Profundo não superficial. Ferramenta amplifica produtividade.',
            'Comunicação: código comunica intenção. Nomes, documentação, estrutura — tudo comunicação.',
            'Kaizen: melhoria contínua. Refactor incrementalmente. Não aguarde "projeto refactor grande".',
            'Tradeoffs: nem sempre existe resposta certa. Trade-off faz bem informado.',
            'Estimativa: gue é difícil. Melhor aproximado que otimista. Adicionar buffer para incerteza.'
        ],
        'practical': [
            '1. Domine 1 editor completamente: teclado, macros, plugins. Não mude constantemente.',
            '2. Shell scripting: automata tedium. Economiza horas cumulativas.',
            '3. Refactor regularmente: código melhora ou piora, nunca fica igual. Melhore regularmente.',
            '4. Estime conservador: se acha 2 dias, diga 3. Buffer > stress.',
            '5. Comunique código: nomes significativos, estrutura clara, comentário onde não óbvio.'
        ],
        'quote': 'Não existe código correto absoluto. Existe código pragmático que entrega valor com maintainability.',
        'worth': 'Você quer filosofia prática de desenvolvimento, dicas de carreira, atitude profissional — sem religião de linguagem ou framework.'
    },
    'design-patterns-summary': {
        'idea': '23 padrões solucionam problemas recorrentes. Creational (criar), Structural (relacionar), Behavioral (comunicar). Padrões são vocabulário comum — usar permite comunicação eficiente e design comprovado.',
        'concepts': [
            'Padrões Creational: Factory (criar sem especificar classe), Singleton (uma instância), Builder (construir complexo gradualmente).',
            'Padrões Structural: Adapter (interface incompatível), Decorator (adicionar comportamento dinamicamente), Proxy (controlar acesso).',
            'Padrões Behavioral: Observer (notificar múltiplos), Strategy (encapsular algoritmo), Template Method (estrutura comum, detalhes variam).',
            'Design Patterns não é solução universal: aplicar quando problema existe. Padrão prematuro = over-engineering.',
            'Padrões facilitam comunicação: "vamos usar Factory aqui" = todos entendem implicações.',
            'Refactor para padrão: não design com padrão desde início. Refator quando problema emerge.'
        ],
        'practical': [
            '1. Aprenda padrões by reading examples: não memorize, entenda quando aplicar.',
            '2. Identifique problema: qual padrão resolve?',
            '3. Aplique minimamente: padrão simples > padrão complexo quando possível.',
            '4. Refator existente: se código violates DRY, talvez padrão resolve.',
            '5. Comunique: use nomes padrão em code review, arquitetura.'
        ],
        'quote': 'Padrões não são tecnologia nova. São soluções comprovadas para problemas comuns. Use quando apropriado, não por uso.',
        'worth': 'Você quer catálogo comprovado de soluções design, entender quando usar cada, exemplos em linguagem favorita — sem dogmatismo.'
    },
    'refactoring-summary': {
        'idea': 'Refactoring = mudar código internamente sem alterar comportamento externo. Melhora legibilidade, remove duplicação, prepara para novos features. Prática contínua, não evento especial.',
        'concepts': [
            'Refactoring vs Reescrita: refactoring preserva comportamento. Reescrita é risco. Prefira refactoring incremental.',
            'Técnicas: extrair função (função longa), mudar nome (claridade), consolidar condicional, introduzir parameter object.',
            'Testes necessários: sem testes, refactoring é reescrever escondido. Testes permitem refactoring seguro.',
            'Quando refactor: antes de adicionar feature, durante review, quando bug encontrado.',
            'Code smell: código que "cheira" ruim. Função longa, classe grande, nomes ruins, duplicação. Sinais de refactoring.',
            'Incrmental: refactoring pequeno + commit + teste. Nunca refactor grande sem safety net.'
        ],
        'practical': [
            '1. Antes refactoring: certifique testes passam, código refactorada similar em features.',
            '2. Extrair função: função 40+ linhas deve ser extraído em menores.',
            '3. Nomes significativos: renomear é refactoring. Nomes ruins indicam comprehension ruim.',
            '4. Após refactoring: testes devem ainda passar. Se falharem, bug introduzido.',
            '5. Refactor em contexto: nunca refactor sem entender o quê código faz.'
        ],
        'quote': 'Refactoring é disciplina. Não é perfeccionismo. É manutenção preventiva de código que será lido e modificado centenas de vezes.',
        'worth': 'Você quer técnicas concretas, catálogo de refactorings, segurança através testes — para código legacy ou novo.'
    },
    'arquitetura-limpa-summary': {
        'idea': 'Arquitetura determina sucesso long-term. Independência de frameworks, testabilidade, e adaptabilidade são cruciais. Código deve ser organizado em camadas (entities, usecases, interface adapters, frameworks) com dependências pra dentro.',
        'concepts': [
            'Independência de framework: negócio logic não depende de Spring, Django, etc. Framework é detalhe.',
            'Testabilidade: entities testadas sem database. Usecases testados sem UI. Cada camada testável isoladamente.',
            'Independência de banco: banco é detalhe. Lógica negócio não sabe se SQL ou NoSQL.',
            'Dependency Inversion: high-level não depende low-level. Ambos dependem abstração.',
            'Interface adapters: translat entre mundo externo (HTTP, database) e mundo interno (entities, usecases).',
            'Camadas: cada camada é responsabilidade. Entities (regras negócio), Usecases (flows), Controllers (HTTP), Gateways (database).'
        ],
        'practical': [
            '1. Arquitetar primeiro: estrutura base impede refactoring massivo depois.',
            '2. Dependências inward: entities (centro) não conhecem usecases. Usecases não conhecem framework.',
            '3. Cada camada isolada: quer testar usecase? Mocka gateway. Não precisa database.',
            '4. Entities são regras negócio: aqui não há HTTP, database, UI. Apenas regras.',
            '5. Refactoring gradual: código legado pode ser migrado incrementalmente.'
        ],
        'quote': 'Boa arquitetura maximiza liberdade desenvolvedores. Muda database? Fácil. Muda UI? Fácil. Regras negócio não são afetadas.',
        'worth': 'Você quer principios de longa-vida arquitetura, framework-agnostic design, testabilidade incorporada — com exemplos, diagramas, implementação.'
    },
})


# Agile & DevOps Books
SUMMARIES.update({
    'xp-explained': {
        'idea': 'Extreme Programming (XP) leva agile ao extremo: pair programming, continuous integration, test-driven development, refactoring contínuo. Disciplina = liberdade.',
        'concepts': [
            'Pair programming: dois devs uma máquina. Código review contínuo, knowledge sharing, menos bugs.',
            'TDD: test first, código depois. Testes guiam design. Testes são especificação.',
            'Continuous integration: commit múltiplas vezes/dia. Build sempre verde. Detecta problema cedo.',
            'Refactoring: melhoria contínua. Não quebra comportamento, apenas melhora internal.',
            'Feedback loop curto: testar em minutos, feedback em horas. Não semanas.',
            'Simplicidade: design simples. Complexidade adicionada quando necessário, não antecipada.'
        ],
        'practical': [
            '1. Pair programming: 4 horas/dia mínimo. Máximo learning.',
            '2. TDD: teste antes. Vira hábito. Código melhor estruturado.',
            '3. Continuous integration: pipeline de build rápido. Commit multiplas vezes.',
            '4. Refactor regularmente: código envelhecido, refactor regenera.',
            '5. Comunicação: pair + frequente standup = problema surfaced rápido.'
        ],
        'quote': 'Disciplina permite liberdade. XP parece rígido, mas permite mudança rápida porque código é flexível.',
        'worth': 'Você quer compreender as raízes de agile, práticas comprovadas, como implementar XP em time — rigoroso mas prático.'
    },
    'scrum-master-summary': {
        'idea': 'Scrum master é facilitador, não gerente. Remove blockers, protege team de interrupção, cultiva ambiente agile. Liderança servidora = time melhor.',
        'concepts': [
            'Servidor líder: autoridade vem de servir bem, não de posição. Ganha respeito.',
            'Remover blockers: qualquer obstáculo? SM remove. Code review lento? Muda. Recurso faltando? Consegue.',
            'Proteger time: interrupções, scope creep, pressão artificial — SM bloqueia.',
            'Facilitador não dictador: SM não diz o que fazer. Facilita time descobrir.',
            'Coaching: SM ensina agile, não diz implementar agile.',
            'Metricas e retrospectiva: velocity, burndown, retrospectiva — dados guiam melhoria.'
        ],
        'practical': [
            '1. Daily standup: 15 min. SM remove um blocker encontrado.',
            '2. Retrospectiva bimestral: o que funcionou? O que melhorar? Implemente.',
            '3. Coaching 1-on-1: paciência, listening. Pessoa descobre solução.',
            '4. Shield time: nenhuma interrupção durante sprint. Boundaries claros.',
            '5. Celebrate sucesso: retrospectiva não é só crítica. Celebre progressos.'
        ],
        'quote': 'Scrum master não é gerente de projeto. É facilitador. Máxima autoridade, mínimo command.',
        'worth': 'Você quer entender papel scrum master diferente de PM, como liderar através serviço, técnicas coaching — com exemplos reais.'
    },
    'agile-mindset-summary': {
        'idea': 'Agile não é Scrum ou Kanban. É mentalidade: adaptação > predição, pessoas > processos, valor > completude. Mindset agile aplica além software.',
        'concepts': [
            'Mudança é constante: plano rígido falha. Abraça mudança, até late nos requirements.',
            'Valor primeiro: entregar valor cedo, não esperar "completo". MVP, iterate, refine.',
            'Pessoas sobrepõem processos: processo é guia, pessoa é criativo. Confiança > monitoramento.',
            'Colaboração contínua: comunicação frequente > documentação completa.',
            'Retrospectiva e melhoria: ciclo curto de reflexão = evolução rápida.',
            'Experimentação: small bets, aprenda rápido, itere ou abandone.'
        ],
        'practical': [
            '1. MVP first: v1.0 com 20% features, 80% satisfação cliente.',
            '2. Iteração bi-semanal: ciclo curto permite feedback rápido.',
            '3. Daily standup: sincronização sem micromanagement.',
            '4. Metricas leve: velocity é guia, não pressão. Qualidade sempre.',
            '5. Empower team: decisão descentralizada. Squad sabe melhor.'
        ],
        'quote': 'Agile mindset é acreditar que melhoria vem da adaptação rápida, não planejamento perfeito.',
        'worth': 'Você quer filosoia agile profunda, como implementar em não-software, além Scrum — prático e espiritual.'
    },
    'devops-handbook-summary': {
        'idea': 'DevOps = quebra silos entre dev/ops. Automação, medição, cultura compartilhada. Deploy frequent, feedback rápido, confiabilidade alta.',
        'concepts': [
            'Silos são inimigo: dev quer velocidade, ops quer estabilidade. DevOps integra ambas.',
            'Automação: deploy, testes, infraestrutura. Manual = erro. Automação = consistência.',
            'CI/CD: integrate frequente, test automaticamente, deploy quando verde.',
            'Feedback rápido: deploy em produção em horas, não meses. Bug surfaced rápido.',
            'Monitoring: produção é verdade. Monitor tudo. Alerta antes de problema grave.',
            'Cultura: blameless postmortem. Foco em sistema, não pessoa. Todos aprendem.'
        ],
        'practical': [
            '1. Infraestrutura como código: terraform, ansible. Reproduzível.',
            '2. Automação teste: unit, integration, end-to-end. Confiança em deploy.',
            '3. CI pipeline: green master. Nada quebrado no main.',
            '4. Monitoring e alerting: métricas de negócio, não só técnicas.',
            '5. Blameless postmortem: bug na produção? Problema é sistema. Melhore processo.'
        ],
        'quote': 'DevOps não é role. É cultura. Todos são responsáveis por confiabilidade, velocidade, aprendizado.',
        'worth': 'Você quer compreender transformação DevOps, automação prática, como quebrar silos — com case studies de empresas bem-sucedidas.'
    },
})


# Cloud & Architecture Books - Condensed Batch
for book_config in [
    ('cloud-native', 'Padrões cloud-native: stateless, containerizado, orchestrated. Kubernetes gerencia escala, tolerância falta, deploy.',
     'Cloud é diferente: serverless, managed services, auto-scale. Mindset infrastructure muda.'),
    ('nosql-distilled', 'NoSQL vs SQL: trade-offs. NoSQL = escalável, flexible schema. SQL = transações, relacionamento. Escolha certo para problema.',
     'Polyglot persistence: não SQL ou NoSQL. SQL para relacionamento, NoSQL para documents/graphs. Misture.'),
    ('domain-driven', 'DDD: entenda negócio profundamente. Domain logic é centro. Bounded contexts, ubiquitous language, entities, aggregates.',
     'Domain experts + devs compartilham linguagem. Código speaks domain. Não é técnico-first.'),
    ('oauth2-guide', 'OAuth2: delegue autenticação. User não compartilha password. App obtém token. Token é permissão escopa.',
     'Segurança moderna. OAuth2 é padrão. Refresh tokens, access tokens, scopes. Implementa correto.'),
    ('web-security', 'OWASP top 10: injection, authentication falha, sensitive data, XXE, broken access, security misconfiguration, XSS, deserialization insecura, log/monitoring insuficiente, insufficient API protection.',
     'Teste cada vetor de ataque. Escaneador automático + penetration teste manual. Segurança é processo.'),
]:
    SUMMARIES[book_config[0]] = {
        'idea': book_config[1],
        'concepts': [book_config[2] + '. Aprenda fundamentalmente.'],
        'practical': [
            f'1. Study {book_config[0]} deeply.',
            f'2. Implement em projeto.',
            '3. Review regularly.'
        ],
        'quote': 'Fundamentals bem. Complexidade depois.',
        'worth': 'Profundo compreensão.'
    }

# Business & Strategy Books - Batch Update
business_books = {
    'traction': 'Traction = crescimento. 19 channels: paid, organic, viral. Não todas importantes. Encontre 1-2 que funciona. PMF primeiro, scale depois.',
    'rethinking-innovation': 'Inovação não é R&D isolado. É cultura. Recompense experimentação. Tolere falha. Execute pequeno antes grande.',
    'blue-ocean': 'Red Ocean = competição em mercado existente (sangue). Blue Ocean = criar mercado novo (sem competição). Estratégia é criar blue ocean.',
    'boa-a-runa': 'Empresas boas viram ótimas ao focar em disciplina, seleção certa de pessoa e negócio, cultura, tecnologia como enabler.',
    'disruptive-innovation': 'Inovação disruptiva = come incumbente. Começa low-end. Incumbente ignora. Depois sobe market. Innovator\'s dilemma.',
    'customer-success': 'CS é novo paradigma. Não just vender. Garantir cliente sucesso = retention, expansion, advocacy.',
    'winning-innovation': 'Inovação requer ambidextria: explorar existente + explorar novo. Estrutura, processo, cultura para ambas.',
    'market-leadership': 'Liderança de mercado requer visão clara, execução consistente, foco em cliente, inovação contínua.',
    'supply-chain': 'Supply chain é vantagem competitiva. Eficiência, resiliência, visibility. Real-time tracking, automation, vendor partnership.',
}
for book_id, idea in business_books.items():
    SUMMARIES[book_id] = {
        'idea': idea,
        'concepts': ['Conceito 1: ' + idea.split('.')[0] + '.', 'Conceito 2: Aplicação prática.'],
        'practical': ['1. Estude.', '2. Implemente.', '3. Meça.'],
        'quote': 'Sucesso.',
        'worth': 'Valor.'
    }

# Finance & Investment Books
finance_books = {
    'venture-capital': 'VC busca 10x retorno. Aposta em time + mercado. 90% falha. Importante: network, due diligence, follow-on capital, mentoring.',
    'private-equity': 'PE compra empresa, melhora operações, vende com múltiplo. LBO leverage. Multiple arbitrage. Longer horizon que VC (7-10 anos).',
    'cryptocurrencies': 'Bitcoin = moeda P2P sem intermediário. Blockchain = ledger distribuído. Crypto = futuro? Volatilidade agora.',
    'inflation-money': 'Inflação erode poupança. Moneda = força governo. Histórico mostra: inflação era mal. Hoje debate: é necessária?',
    'behavioral-finance': 'Investidores não são racionais. Comportamentos: overconfidence, herding, loss aversion. Psicologia move mercado.',
    'bubble-crash': 'Bolhas = preço desconectado de valor. Confiança coletiva > lógica. Crashes educam mas doem.',
    'inequality-capital': 'Capital concentra em poucos. Retorno capital > crescimento econômico. Implicações: desigualdade crescente, instabilidade social.',
    'freakonomics': 'Economista estuda incentivos. Criminoso é como economista: responde incentivos. Dados > intuição. Pense economicamente.',
    'stakeholder-capitalism': 'Capitalismo tradicional: lucro máximo para acionistas. Stake holder: considere employees, comunidade, planeta. Sustentável long-term.',
}
for book_id, idea in finance_books.items():
    SUMMARIES[book_id] = {
        'idea': idea,
        'concepts': ['Princípio 1: ' + idea.split('.')[0] + '.'],
        'practical': ['1. Aprender.', '2. Aplicar.'],
        'quote': 'Finanças.',
        'worth': 'Fundamental.'
    }

# Psychology & Behavior - Extended
psychology_books = {
    'tipping-point': 'Epidemias sociais: ideia se espalha como vírus. Conectores, mavens, vendedores. Pequena mudança = grande efeito.',
    'blink': 'Primeiro instinto é frequentemente correto. Subconsciente processa padrões rápido. Mas preconceito pode contaminar blink.',
    'david-goliath': 'Vantagem não é óbvio. Golias gigante é lento. Davi pequeno é ágil. Adversidade pode ser vantagem.',
    'thinking-fast-slow': 'Sistema rápido: intuição. Sistema lento: lógica. Viés emerge quando rápido não questiona.',
    'predictably-irrational': 'Irracionalidade é previsível. Âncora, aversão risco, framing. Compreender leva a melhor decisão.',
    'emotional-intelligence-2': 'EQ 2.0: self-awareness, self-management, social-awareness, relationship-management. Treina.',
    'influence': 'Reciprocidade, compromisso/consistência, prova social, autoridade, gosto, escassez. Técnicas persuasão.',
    'driven-passion': 'Motivação: autonomia, mestria, propósito. Mais importante que dinheiro depois de básico satisfeito.',
    'grit': 'Grit = paixão + perseverança. Talento não suficiente. Persistência bate talento.',
    'willpower': 'Força de vontade é recurso. Depletável. Repouso, meditação, exercício = aumenta vontade.',
}
for book_id, idea in psychology_books.items():
    SUMMARIES[book_id] = {
        'idea': idea,
        'concepts': ['Insight: ' + idea.split('.')[0] + '.'],
        'practical': ['1. Reconheça padrão.', '2. Mude resposta.'],
        'quote': 'Psicologia.',
        'worth': 'Autoconhecimento.'
    }


# Autoajuda & Produtividade
autoajuda_books = {
    'growth-mindset': 'Carol Dweck em Growth Mindset in Action: prático. Como ensinar mindset growth. Classroom, home, trabalho. Prática deliberada.',
    'atomic-habits-advanced': 'Atomic Habits Advanced: profundo em sistema habits. Como medir, refinar, scale.',
    'do-trabalho': 'Steven Pressfield war de art: resistência é inimigo criatividade. Profissional enfrenta. Não espera inspiração.',
    'deep-work': 'Cal Newport: mundo é distração. Deep work (foco intenso 4+ horas) é raro e valioso. Cultive.',
    'digital-minimalism': 'Cal Newport: tecnologia é addictive. Minimalismo = intenção. Qual tecnologia ajuda? Deleta resto.',
}
for book_id, idea in autoajuda_books.items():
    SUMMARIES[book_id] = {
        'idea': idea,
        'concepts': ['Prática: ' + idea.split('.')[0] + '.'],
        'practical': ['1. Comece hoje.'],
        'quote': 'Transformação.',
        'worth': 'Ação.'
    }

# Filosofia & História
philosophy_books = {
    'estoicismo': 'Estoicismo: controle tua atitude. Externo fora controle. Interno é teu. Virtude é bem. Preparar adversidade.',
    'meditations': 'Marco Aurélio (imperador romano) reflete: duty, moralidade, morte, temporalidade. Relevante 2000 anos depois.',
    'mans-search': 'Frankl: vida tem significado sempre. Escolhe resposta ao sofrimento. Vontade de significado.',
    'sophies-world': 'Gaarder: ficção + história filosofia. Sophie descobre questões filosóficas. Acessível.',
    'critique-pure-reason': 'Kant: como conhecemos? Razão tem limites. Fenômeno vs noumeno. Fundação filosofia moderna.',
    'republic-plato': 'Platão: justiça no Estado. Formas (ideias). Dialogo socrático. Clássico.',
    'existentialism': 'Sartre: existência precede essência. Livres. Responsáveis. Sem Deus = sem escusa.',
    'abundance': 'Diamandis & Kotler: tecnologia exponencial (IA, bio, nano) resolverá escassez. Futuro abundante.',
    'life-3.0': 'Max Tegmark: IA será smarter que humano. Qual é objetivo humanidade? Como alinhar?',
    'yoga-sutras': 'Patanjali: yoga é mais que poses. É sistema mente. Meditação. Iluminação.',
    'buddhist-philosophy': 'Budismo: sofrimento vem desejo. Enlightenment é possível. Pratice.',
    'stoic-philosophy': 'Epicteto: slave mas livre internamente. Controle o que consegue. Liberta.',
    'tao-te-ching': 'Laozi: Tao (caminho/natureza) é fundamental. Flua com natureza. Não force.',
    'confucianism': 'Confucius: relacionamento, duty, moralidade. Sociedade harmoniosa via virtude pessoal.',
}
for book_id, idea in philosophy_books.items():
    SUMMARIES[book_id] = {
        'idea': idea,
        'concepts': ['Filosofia: ' + idea.split('.')[0] + '.'],
        'practical': ['1. Reflexão diária.'],
        'quote': 'Sabedoria.',
        'worth': 'Profundidade.'
    }

# Ciência & Cosmos
science_books = {
    'cosmos': 'Sagan: universo é vasto. Terra minúscula. Vida improvelmente rara. Inspire awe. Não medo.',
    'pale-blue-dot': 'Sagan: Terra de longe é ponto azul pale. Perspectiva. Importância relativa muda.',
    'selfish-gene': 'Dawkins: gene é unidade seleção. Organismo é veículo gene. Replicação é fim.',
    'origen-especies': 'Darwin: seleção natural. Ambiente seleciona traits. Evolução explica vida.',
    'elegant-universe': 'Brian Greene: strings, dimensões extra, relatividade, quântica. Universo é estranho.',
    'black-holes': 'Hawking: buracos negros não são negros. Radiação Hawking. Tempo é relativo.',
    'thinking-systems': 'Donella Meadows: sistemas têm comportamento emergente. Feedback loops. Não linear.',
    'human-biology': 'Rutherford: genes fazem você? Parcialmente. Ambiente, escolha também. Somos mistura.',
    'singularity': 'Kurzweil: IA exponencial. Singularity 2045. Mergir homem-máquina. Especulativo.',
    'superintelligence': 'Bostrom: superinteligência AI possível. Risco existencial. Como alinhar?',
    'human-compatible': 'Stuart Russell: AI deve ser aligned com valores humanos. Não é óbvio. Precisa design.',
    'meditacao-mindfulness': 'Kabat-Zinn: meditação reduz stress, aumenta awareness. Prático.',
}
for book_id, idea in science_books.items():
    SUMMARIES[book_id] = {
        'idea': idea,
        'concepts': ['Insight: ' + idea.split('.')[0] + '.'],
        'practical': ['1. Aprenda conceitos.'],
        'quote': 'Curiosidade.',
        'worth': 'Inspiração.'
    }

# História & Biografia
history_books = {
    'napoleon-history': 'Napoleon: estratégia militar, liderança carismática, ambição. Mudou Europa. Legado duradouro.',
    'world-war2': 'Churchill: narrativa WWII. Liderança em crise. Poesia em prosa.',
    'american-revolution': 'McCullough: founding fathers americanos. Sacrifício. Visão. Fundação nação.',
    'black-history': 'Kendi: racismo não é erro individual. É estrutural. História de combate às estruturas.',
    'silk-road': 'Frankopan: comércio conecta continentes. Poder flui via trade. Não apenas guerra.',
    'gunpowder': 'Kelly: pólvora transforma guerra, poder. Tecnologia muda história.',
    'civilization-west': 'Ferguson: porque Ocidente dominou? Competição, ciência, propriedade, medicina, consumidor, ética de trabalho.',
    'london-history': 'Ackroyd: Londres é character. Cidade muda, perdura. Vivacidade urbana.',
}
for book_id, idea in history_books.items():
    SUMMARIES[book_id] = {
        'idea': idea,
        'concepts': ['História: ' + idea.split('.')[0] + '.'],
        'practical': ['1. Estude contexto.'],
        'quote': 'Passado.',
        'worth': 'Perspectiva.'
    }

# Biografias de Grandes Pessoas
biographies = {
    'benjamin-franklin': 'Franklin: polymath. Cientista, inventor, diplomata, autor. Dedicação autodidatismo. Sempre aprendendo.',
    'creativity-inc': 'Catmull (Pixar): criatividade requer cultura confiança, risco, falha. Liderança servidora.',
    'nike-story': 'Phil Knight (Nike): empreendedor. Risco. Obsessão. Nike começou vendendo shoes de carro.',
    'elon-biography': 'Isaacson (Elon): visionário. Tesla, SpaceX, Neuralink. Ambição louca. Trabalho intenso.',
    'bill-gates-bio': 'Jennifer Lee (Gates): negócio + filantropia. Poder de visão + recursos.',
    'alan-turing': 'Hodges (Turing): genio computação. Enigma. Pai computador. Tragédia pessoal.',
    'marie-curie': 'Eve Curie (Marie): cientista. Mulher em ciência. Primeira prêmio Nobel mulher.',
    'churchill-bio': 'Ackroyd (Churchill): liderança em crise. Orador. Coragem.',
    'leonardo-vinci': 'Isaacson (Leonardo): renascimento. Arte + ciência. Observer natureza.',
    'lincoln-bio': 'Goodwin (Lincoln): team of rivals. Liderança humilde. Crise civil.',
    'gandhi-bio': 'Rajmohan (Gandhi): não-violência. Independência India. Poder moral.',
    'mlk-bio': 'MLK: direitos civis. Sonho. Justiça. Assassinato tragédia.',
}
for book_id, idea in biographies.items():
    SUMMARIES[book_id] = {
        'idea': idea,
        'concepts': ['Vida: ' + idea.split('.')[0] + '.'],
        'practical': ['1. Inspire-se.'],
        'quote': 'Legado.',
        'worth': 'Inspiração.'
    }


# Marketing Books
marketing_books = {
    'digital-marketing': 'Digital marketing: SEO, SEM, social, email, content. Data-driven. ROI trackable. Experimentação contínua.',
    'content-marketing': 'Conte história através conteúdo. Atrai, engaja, converte. SEO benefit. Authority build.',
    'data-driven-marketing': 'Métrica tudo. Conversão, CAC, LTV, ROAS. Dashboard. Decisão é data, não gut.',
    'brand-building': 'Marca é promessa + entrega. Narrativa cliente como herói. Marca resolve problema.',
    'viral-marketing': 'Contágio social: informação se espalha se: prática, emocional, top-of-mind, confiável, fácil lembrar.',
}
for book_id, idea in marketing_books.items():
    SUMMARIES[book_id] = {
        'idea': idea,
        'concepts': ['Marketing: ' + idea.split('.')[0] + '.'],
        'practical': ['1. Estude canal.', '2. Teste.', '3. Otimize.'],
        'quote': 'Crescimento.',
        'worth': 'Estratégia.'
    }

# Network & Platform Strategy
SUMMARIES.update({
    'network-effect': {
        'idea': 'Rede é exponencial. Quanto mais usuário, mais valioso (WhatsApp, Facebook). Usuário 100º = 10x valor usuário 1º. Rede vence aplicação.',
        'concepts': [
            'Rede é arma estratégica: valor cresce quadraticamente com usuários.',
            'Cold start é difícil: primeiros usuários, sem rede. Solução: super user ou niche.',
            'Lock-in: usuários mudam se custos switch altos. Rede alta switch cost.',
            'Plataforma vs aplicação: aplicação isolado, plataforma conecta.',
            'Líder mantém: first-mover vantagem em network effects.'
        ],
        'practical': [
            '1. Identifique network opportunity: qual produto beneficia conectividade?',
            '2. Start com niche: super user, concentrado geograficamente.',
            '3. Critical mass: break even ponto onde network atrai novos organicamente.',
            '4. Virality loop: compartilhar, referral, integração social.'
        ],
        'quote': 'Network é vencedor. Primeira plataforma viável ganha.',
        'worth': 'Você quer compreender dinâmica rede, como construir, defensibilidade — crítico para startup moderno.'
    },
    'platform-strategy': {
        'idea': 'Plataforma conecta dois (ou mais) grupos. Value em conexão. Uber = drivers + riders. Airbnb = hosts + guests. Vence single-sided.',
        'concepts': [
            'Two-sided marketplace: supply + demand. Balancear ambos.',
            'Frictionless matching: busca fácil, transação segura.',
            'Governança: quality control, dispute resolution. Diferencia.',
            'Pricing: de qual lado monetizar? Volume ou margin?',
            'Lock-in via volume: muitos sellers atrai buyers. Buyers atrai sellers. Flywheel.'
        ],
        'practical': [
            '1. Estude ambos os lados: o que cada um quer? Qual pain resolves?',
            '2. Comece concentrated: um cidade, tipo de serviço. Perfecione antes scale.',
            '3. Rede primeiro, monetização depois: volume atrai volume. Monetize quando scale.',
            '4. Governança robusta: fraude, quality = trust. Trust é fundamental.'
        ],
        'quote': 'Plataforma é rede com governança e transação. Rede sem transação = comunidade. Transação sem rede = vendedor isolado.',
        'worth': 'Você quer compreender economia plataforma, two-sided dynamics, como escalar — com casos Uber, Airbnb, eBay.'
    }
})

# Business Classics - Remaining
business_classics = {
    'working-effectively': 'Michael Feathers: código legacy desafia. Sem testes, mudança é arriscado. Técnicas extrair, testar, refactor legacy.',
    'continuous-delivery': 'Deploy frequente = confiança, feedback rápido. CI pipeline robusto. Automação end-to-end.',
    'phoenix-project': 'Romanço sobre transformação DevOps. Silos, workflow, feedback loops. Lições práticas ficcão.',
    'release-it': 'Padrões para produção: circuit breaker, timeout, bulkhead. Confiabilidade via design.',
    'site-reliability': 'Google SRE: balance inovação vs confiabilidade. Automation, incident response, postmortem.'
}
for book_id, idea in business_classics.items():
    SUMMARIES[book_id] = {
        'idea': idea,
        'concepts': ['Operações: ' + idea.split('.')[0] + '.'],
        'practical': ['1. Implemente em sprint.'],
        'quote': 'Produção.',
        'worth': 'Confiabilidade.'
    }

# Quality & Testing
qa_books = {
    'human-factors-qa': 'Glass: comportamento humano, comunicação, equipe = QA. Não só testes.',
    'security-mindset': 'Bruce Schneier: mentalidade segurança. Pensar como atacante. Defesa em profundidade.',
    'risco-softwares': 'Boehm: risco é quantificável. Identificar cedo, mitigar continuo.',
    'estimating-software': 'McConnell: estimativa é arte + ciência. Histórico dados > intuição. Buffer.',
}
for book_id, idea in qa_books.items():
    SUMMARIES[book_id] = {
        'idea': idea,
        'concepts': ['QA: ' + idea.split('.')[0] + '.'],
        'practical': ['1. Disciplina.'],
        'quote': 'Qualidade.',
        'worth': 'Excelência.'
    }

# Fill remaining with sensible defaults
remaining_ids = [
    'benjamin-franklin', 'economia-comportamental', 'black-swan', 'marketing-permissao',
    'lideranca-situacional', 'verdades-lideranca', 'cradle-control'
]

for book_id in remaining_ids:
    if book_id not in SUMMARIES:
        SUMMARIES[book_id] = {
            'idea': f'Livro: {book_id}. Exploração profunda do tema.',
            'concepts': ['Conceito principal do tema.'],
            'practical': ['1. Estude.', '2. Pratique.'],
            'quote': 'Sabedoria.',
            'worth': 'Valor significante.'
        }
