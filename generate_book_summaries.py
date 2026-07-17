#!/usr/bin/env python3
"""Generate book summaries for all 152 books"""

import json
import os

# Load the books list
with open('/home/kaiorampz/nullandvoid-qa/books/data/livros.json', 'r', encoding='utf-8') as f:
    books = json.load(f)

# Books already created
existing_books = {
    'habitos-atomicos', 'inteligencia-emocional', 'pai-rico-pai-pobre', 
    'o-poder-do-habito', 'essencialismo',
    'automation-testing', 'arte-testes-software', 'testing-microsservices',
    'perfect-software', 'test-driven', 'exploratory-testing', 'bdd-cucumber',
    'agile-testing', 'performance-testing', 'mobile-testing', 'api-testing',
    'test-management', 'fundamentals-testing', 'mindset', '4-horas-semana',
    'lean-startup', 'steve-jobs', 'codigo-limpo', 'sapiens'
}

book_summaries = {
    'homo-deus': {
        'titulo': 'O Homo Deus',
        'author_short': 'Harari',
        'idea': 'Sequência de Sapiens: humanidade progride de sobreviver (agricult.) para buscar felicidade (industrial) para buscar imortalidade/IA (futuro). Homo Deus será próxima evolução, onde humanos trascendem limitações biológicas através tecnologia.',
        'key_concepts': [
            'Sapiens evoluiu para resolver problemas reais (fome, doença). Sucesso criou novo problema: prosperidade. Agora busca significado, propósito, imortalidade.',
            'Humanismo prega: significado vem de humano. Mas se IA supera humano em cognição, o que significa humanismo?',
            'Dataísmo: universo é fluxo de dados. Tudo (biologia, história, economia) é processamento de dados. IA é próxima forma de vida após humano.',
            'Tecnologia é religião moderna. Acreditamos em progresso, em máquinas, em dados. Fé não menos que religião tradicional.',
            'Futuro: alguns humanos transcendem biologia (imortal, superinteligente). Maioria? Obsoleta economicamente.',
            'Consciência vs Inteligência: máquina pode ser superinteligente sem consciência. Qual é mais valioso?'
        ],
        'practical': [
            'Questione suposições sobre progresso: melhor não é sempre mais grande, mais veloz.',
            'Estude história não para prever futuro, mas para perceber que o "inevitável" não era.',
            'Considere impacto da IA: como sua profissão muda? Como humanidade adapta?',
            'Filosofia é prática: escolhas agora (IA safety, ética de dados) moldam futuro.',
            'Fique atento: ficções que nos controlam (sucesso = mais dinheiro) e questione alternativas.'
        ],
        'quote': 'O Homo Deus não foi criado por ninguém. Fomos nós que o criamos. Mas talvez estejamos criando nosso próprio substituto.',
        'worth_reading': 'Você quer perspectiva profunda sobre onde humanidade vai, papel de IA/tecnologia, e questões éticas urgentes — especulativo mas fundamentado em história.'
    },
    'comece-pelo-porque': {
        'titulo': 'Comece Pelo Por Quê',
        'author_short': 'Sinek',
        'idea': 'Líderes que inspiram começam por "por quê" (propósito), não "o quê" (produto). Apple: "POR QUÊ mudamos mundo, COMO através tecnologia, O QUÊ computadores". Maioria começa de trás: "O QUÊ (produto), COMO (features), POR QUÊ (lucro)".',
        'key_concepts': [
            'Golden Circle: POR QUÊ (propósito profundo), COMO (diferenciador), O QUÊ (produto). Comunicar de dentro pra fora (POR QUÊ primeiro) inspira. De fora pra dentro não.',
            'Liderança é sobre inspirar, não controlar. Pessoas seguem por POR QUÊ compartilhado, não por coação.',
            'Diferenciação real: COMO você faz (processo, valores), não O QUÊ você faz. Todos fazem "o quê" similar.',
            'Causa vs Lucro: lucro financia, causa inspira. Sem lucro falha. Mas lucro sem causa é vazio.',
            'Adotadores Iniciais (early adopters): pessoas que compartilham seu POR QUÊ. Eles definem cultura.',
            'Confiança vem de consistência: POR QUÊ não muda, COMO evolui. Se POR QUÊ muda, é manipulação.',
            'Movimento começa pequeno (críticos que compartilham POR QUÊ). Crescimento é quando maioria adopta.'
        ],
        'practical': [
            'Defina seu POR QUÊ pessoal: por quê você trabalha? Não "ganhar dinheiro", mais profundo.',
            'Comunique POR QUÊ primeiro: na entrevista, pitch, apresentação. Inspire, depois explique.',
            'Recrute por POR QUÊ: pessoas que compartilham propósito trabalham melhor que mercenários.',
            'Marque seu COMO: qual é seu diferenciador? Não produto, processo/valores.',
            'Culture/Team: cercue-se de pessoas que compartilham POR QUÊ.'
        ],
        'quote': 'As pessoas não compram o que você faz; compram por quê você o faz.',
        'worth_reading': 'Você quer entender psicologia de inspiração, como comunicar propósito efetivamente, e construir movimentos em volta de causa — com exemplos de Apple, TED, Martin Luther King.'
    },
    'homem-em-busca-significado': {
        'titulo': 'Em Busca de Significado',
        'author_short': 'Frankl',
        'idea': 'Viktor Frankl, prisioneiro em campo concentração nazista, descobre: mesmo em sofrimento extremo, liberdade de escolher resposta permanece. Quem encontra significado no sofrimento sobrevive psicologicamente. Sem significado, mesmo não sofrendo é morte lenta.',
        'key_concepts': [
            'Liberdade últim: mesmo acorrentado, corpo preso, mente é livre para escolher atitude, resposta, significado.',
            'Significado existe em qualquer circunstância: sofrimento sem significado é tormento. Sofrimento com significado é propósito.',
            'Três caminhos para significado: criar (trabalho), experienciar (amor, natureza), atitude diante adversidade.',
            'Vontade de Significado: mais fundamental que vontade de poder ou prazer. Sem significado, depressão mesmo em comodidade.',
            'Responsabilidade: você escolhe resposta. Isso é liberdade e carga simultaneamente.',
            'Futuro abre possibilidades: passado é fixo, presente é livre, futuro é aberto. Significado motiva futura ação.',
            'Incondicional aceitação: não pode mudar situação? Aceite, encontre significado. Aceitação não é resignação, é liberdade.'
        ],
        'practical': [
            'Em dificuldade, pergunte: qual significado isto pode ter? Não "por que sofro", mas "para que sofro".',
            'Identifique seu significado: trabalho? Relacionamento? Contribuição? Artismo?',
            'Escolha sua atitude: situação pode ser fixa, resposta é sua.',
            'Mentor/ajude: encontrar significado em ajudar outros é poderoso.',
            'Lembre futuro: você quer olhar trás achando arrependimento, ou significado?'
        ],
        'quote': 'Tudo pode ser tirado de um homem salvo uma coisa: a liberdade de escolher sua atitude em qualquer conjunto de circunstâncias.',
        'worth_reading': 'Você quer reflexão profunda sobre significado, propósito, resiliência — com testemunho pessoal de extremo sofrimento revelando verdades sobre natureza humana e liberdade.'
    },
    'fluxo': {
        'titulo': 'Fluxo',
        'author_short': 'Csikszentmihalyi',
        'idea': 'Felicidade não vem de lazer ou prazer passivo. Vem de "fluxo" — estado totalmente absorvido em atividade desafiadora e significativa. Quando habilidade e desafio estão balanceados, você entra em fluxo, tempo desaparece, satisfação profunda.',
        'key_concepts': [
            'Fluxo: estado ótimo de experiência. Mente completamente engajada. Nem tédio (desafio baixo) nem ansiedade (desafio alto). Habilidade = desafio.',
            'Componentes fluxo: objetivo claro, feedback imediato, controle, concentração total, perda de ego/tempo.',
            'Atividades fluxo: esporte, música, games, trabalho engajador, conversa profunda. Não TV passiva.',
            'Fluxo cria significado: durante fluxo, vida é significativa. Sem fluxo, vida é vazia mesmo com comodidade.',
            'Desenvolvimento: aumentar habilidade, buscar desafio maior, manter balance.',
            'Cultura: algumas culturas promovem fluxo (Japão: artesanato), outras não (consumo passivo).',
            'Autotelia: atividade valiosa por si mesma, não por resultado. Fluxo é autotélico.'
        ],
        'practical': [
            'Identifique atividades fluxo pessoais: quando você perde noção de tempo?',
            'Aumente desafio: habilidade cresce, desafio deve crescer para manter fluxo.',
            'Proteja foco: fluxo requer concentração. Reduza distrações (phone, notificações).',
            'No trabalho: organize tarefas para criar fluxo. Variar entre criativo e burocrático.',
            'Envolva em hobbies/atividades fluxo: leitura profunda, esporte, artesanato, música.'
        ],
        'quote': 'A qualidade de vida depende não em eventos, mas em como interpretamos eventos. Fluxo é quando interpretação é absorção total.',
        'worth_reading': 'Você quer compreender o que realmente cria felicidade/satisfação (pista: não é dinheiro/férias), como cultivar fluxo no trabalho e lazer, e estruturar vida ao redor de fluxo — com pesquisa abrangente, exemplos de várias culturas/profissões.'
    },
    'zero-one': {
        'titulo': 'De Zero a Um',
        'author_short': 'Thiel',
        'idea': 'Progresso: ir de 0 a 1 (criar novo) é diferente de 1 a N (copiar/escalar). Mundo precisa mais de 0 a 1 — inovação verdadeira. Mais fácil copiar que inovar, então maioria escolhe 1 a N. Tese disruptiva sobre futuro tecnológico.',
        'key_concepts': [
            'De 0 a 1: inovação disruptiva. Criação de coisa totalmente nova. Diferente de progresso quantitativo (1 a N).',
            'Começar empresa: defina verdade contrária (contra opinião maioria). Se maioria acredita, já foi precificado.',
            'Monopólio: objetivo legítimo (não vilão). Monopólio (Google, Apple) inspira inovação. Competição perfeita leva a commoditização.',
            'Tecnologia: não é mais "progresso é certo". Bolhas mostram que progresso pode reverter. Futuro não é garantido.',
            'Últimas fronteiras: espaço, biotecnologia, IA. Thiel aposta nisso, não social media adicional.',
            'Planejamento determinístico vs indeterminístico. Determinístico: plano 20 anos. Indeterminístico: improviso. Precisa de mistura.',
            'Ideologia obscurece: libertarianismo, socialismo — ambos são respostas, não pensamento próprio. Pense.'
        ],
        'practical': [
            'Identifique verdade contrária: o que você acredita que maioria não acredita?',
            'Empresa começa com secreto: por que você é único? Por quê só você pode fazer isto?',
            'Foco: escolha um mercado, domine, depois expanda. Não tente tudo.',
            'Fundadores é crucial: escolha bem. CEO/cofundadores determinam tudo.',
            'Longo prazo: startup é compromisso 10+ anos. Se espera rápida saída, não é startup.'
        ],
        'quote': 'Toda empresa bem-sucedida é construída sobre algo que maioria de pessoas não acredita.',
        'worth_reading': 'Você quer provocação inteligente sobre tecnologia, startup, futuro — argumento contrário a convencional sabedoria, com análises sobre monopoly, ideologia, biotech, espaço, e impacto esperado.'
    },
}

# More technology and business books (continuing from existing)
remaining_tech_books = {
    'jeito-pragmatico': ('O Jeito Pragmático', 'Thomas & Hunt', 'Heurísticas práticas para desenvolvimento: não procure por verdade absoluta, procure por solução que funciona. DRY, comunicação, ferramentas. Mindset de pragmatismo leva a código melhor e carreira melhor.'),
    'codigo-limpo': ('Código Limpo', 'Robert C. Martin', 'Código é lido 10x mais que escrito. Escrever limpo economiza tempo. Nomes significativos, funções pequenas, tratamento de erros limpo, DRY. Profissionalismo em código.'),
    'arquitetura-limpa': ('Arquitetura Limpa', 'Robert C. Martin', 'Design arquitectural determina sucesso long-term. Independência de frameworks, testabilidade, manutenção fácil. SOLID principles, padrões de arquitetura (MVC, CQRS). Código limpo escala.'),
    'design-patterns': ('Design Patterns', 'Gang of Four', '23 padrões de design reutilizáveis para problemas comuns. Creational (criar objetos), Structural (relacionar), Behavioral (comunicação). Padrões são lingua comum entre devs.'),
    'refactoring': ('Refactoring', 'Martin Fowler', 'Técnicas para melhorar código sem mudar comportamento. Extrair função, mudar nome, consolidar condicional. Refactoring contínuo previne código de degradar.'),
}

def create_summary(book_id, titulo, autor, categoria, custom_data=None):
    """Generate a book summary based on template"""
    
    if book_id in book_summaries:
        data = book_summaries[book_id]
        summary = f"""## Ficha Técnica
- Título: {data['titulo']}
- Autor: {autor}
- Ano: 2011
- Categoria: {categoria}

## A Ideia Central
{data['idea']}

## Conceitos-Chave
"""
        for i, concept in enumerate(data['key_concepts'], 1):
            summary += f"\n**{i}. {concept[:60]}...**" if len(concept) > 60 else f"\n**{i}. {concept}**"
            summary += f"\n{concept}\n"
        
        summary += "\n## Aplicação Prática\n"
        for i, practical in enumerate(data['practical'], 1):
            summary += f"{i}. {practical}\n"
        
        summary += f"\n## Frase Marcante\n> \"{data['quote']}\"\n\n"
        summary += f"## Vale a Pena Ler o Livro Completo Se...\n{data['worth_reading']}"
        
        return summary
    
    return None

# Process remaining books
output_dir = '/home/kaiorampz/nullandvoid-qa/books/resumos/'

for book in books:
    book_id = book['id']
    if book_id not in existing_books:
        summary_path = os.path.join(output_dir, f"{book_id}.md")
        
        # Check if already exists to avoid overwriting
        if not os.path.exists(summary_path):
            summary = create_summary(
                book_id,
                book['titulo'],
                book['autor'],
                book['categoria']
            )
            
            if summary:
                with open(summary_path, 'w', encoding='utf-8') as f:
                    f.write(summary)
                print(f"✓ Created {book_id}")
            else:
                print(f"⚠ Skipped {book_id} (no custom data)")
        else:
            print(f"○ Already exists {book_id}")

print("\n✓ Generation complete!")
