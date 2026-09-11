# Gravações Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir a página `/gravacoes` da ZYVO com carrossel horizontal suave, cards editáveis, troca de miniatura e performance.

**Architecture:** Página client-side isolada usando componentes já existentes `AppSidebar` e `AppTopbar`. Estado dos cards é persistido em `localStorage` com `zyvo-recordings`, e o carrossel usa Pointer Events + scroll nativo.

**Tech Stack:** Next.js 15, React 19, TypeScript, Lucide React, CSS.

**Spec:** `docs/superpowers/specs/2026-09-11-recordings-gallery-design.md`

## Global Constraints
- Preservar menu lateral e topbar atuais.
- Não alterar outras páginas.
- Sem dependências novas.
- Botão inferior: `Voltar ao menu`.

---

### Task 1: Navegação e teste estrutural
**Files:**
- Modify: `app/AppSidebar.tsx`
- Create: `tests/recordings-page.test.mjs`

- [ ] Criar teste estático verificando rota, textos principais, `zyvo-recordings`, controles de edição e navegação da sidebar.
- [ ] Executar `npm test -- tests/recordings-page.test.mjs` e confirmar falha antes da implementação.
- [ ] Adicionar navegação `Gravações -> /gravacoes` e estado ativo.

### Task 2: Página e interações
**Files:**
- Create: `app/gravacoes/page.tsx`
- Create: `app/gravacoes/gravacoes.css`

- [ ] Criar estado inicial de gravações e persistência local.
- [ ] Implementar card principal, cards laterais e duas fileiras menores.
- [ ] Implementar drag horizontal suave por mouse/trackpad.
- [ ] Implementar ações: assistir, analisar, excluir, editar e alterar miniatura.
- [ ] Implementar modal de edição de título, frase, fonte, tamanho e performance.
- [ ] Implementar `Voltar ao menu`.

### Task 3: Verificação
- [ ] Executar testes.
- [ ] Executar build Next.js.
- [ ] Conferir deployment preview da branch `dev` sem erros.