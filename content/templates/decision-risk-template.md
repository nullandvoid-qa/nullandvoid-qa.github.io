---
title: Cenários de Decisão e Priorização — Template
---

# Cenários de Decisão, Risco e Priorização

## Objetivo
- Fornecer um formato reutilizável para documentar cenários de decisão, avaliação de risco e critérios de priorização.

## Estrutura sugerida
- Contexto: descrição breve do sistema/feature.
- Stakeholders: quem é impactado.
- Cenário: passo a passo que descreve a condição/fluxo.
- Impacto: quais áreas/usuários/negócios são afetados.
- Probabilidade: alta/média/baixa.
- Severidade: crítica/maior/menor.
- Mitigação: ações para reduzir risco.
- Critério de aceitação: quando considerar o risco mitigado.

## Exemplo resumido
- Contexto: Página de checkout com 3rd-party payment gateway.
- Stakeholders: Usuários, equipe de pagamentos, infra.
- Cenário: Gateway retorna timeout intermitente durante pico.
- Impacto: Transações falham, perda de receita.
- Probabilidade: Média.
- Severidade: Alta.
- Mitigação: Implementar retry com backoff e fallback para método alternativo.
- Critério de aceitação: <1% de falhas no próximo deploy, monitor com alarmes.

## Como usar
- Preencha o template durante refinement e inclua no ticket (issue) como checklist.
- Use em sessões de triagem de bugs para priorizar trabalho do sprint.
