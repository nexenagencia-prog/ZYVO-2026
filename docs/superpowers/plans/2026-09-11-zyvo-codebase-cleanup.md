# ZYVO Codebase Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remover runtime legado e deixar o fluxo Gravações → Análise funcionando diretamente em React/Next, com menos trabalho global e sem alterar o visual aprovado.

**Architecture:** O `RootLayout` fica mínimo e apenas ferramentas realmente globais permanecem montadas. Gravações salva a seleção e navega com `router.push`; `/analise-reunioes` passa a renderizar um client component próprio que lê a seleção e renderiza dados/indicadores via estado React, sem bridges, MutationObserver, querySelector ou clique simulado.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, node:test.

**Spec:** `docs/superpowers/specs/2026-09-11-zyvo-codebase-cleanup-design.md`

## Global Constraints

- Trabalhar somente na branch `dev`.
- Não alterar `main`.
- Não fazer deploy na Vercel.
- Preservar `zyvo-recordings`, `zyvo-recording-preferences-v2`, `zyvo-selected-analysis` e IndexedDB de capas.
- Não alterar branding, copy ou layout fora do necessário para funcionamento.
- Nenhum `MutationObserver` global e nenhum polling contínuo para descobrir UI.

---

### Task 1: Guardas de regressão do runtime

**Files:**
- Modify: `tests/recordings-page.test.mjs`
- Create: `tests/runtime-cleanup.test.mjs`

**Interfaces:**
- Consumes: estrutura atual da branch `dev`.
- Produces: testes estáticos que proíbem bridges/observers legados e exigem rota explícita de análise.

- [ ] Atualizar o teste de gravações para exigir `zyvo-selected-analysis` + `router.push('/analise-reunioes...')` dentro da própria página e parar de depender de `SelectedRecordingAnalysisBridge.tsx`.
- [ ] Criar teste que falhe enquanto os quatro arquivos legados ainda existirem e que varra arquivos TS/TSX de runtime proibindo `MutationObserver`.
- [ ] Executar `npm test` e confirmar falha antes da implementação.

### Task 2: Análise de Reuniões direta

**Files:**
- Create: `app/analise-reunioes/AnalysisPageClient.tsx`
- Modify: `app/analise-reunioes/page.tsx`

**Interfaces:**
- Consumes: `zyvo-selected-analysis` e `zyvo-recordings` do localStorage.
- Produces: tela completa de análise renderizada diretamente na rota `/analise-reunioes`.

- [ ] Implementar leitura segura da gravação selecionada em `useEffect` de montagem única.
- [ ] Calcular métricas de forma determinística a partir do id/performance sem manipular DOM.
- [ ] Renderizar thumbnail/vídeo, título, frase, score, 7 métricas, insights e navegação voltar via React.
- [ ] Atualizar `page.tsx` para montar somente `AnalysisPageClient`.

### Task 3: Remover runtime legado

**Files:**
- Delete: `app/HeroSlidePhotoEnhancer.tsx`
- Delete: `app/SelectedRecordingAnalysisBridge.tsx`
- Delete: `app/AnalysisVideoControls.tsx`
- Delete: `app/analise-reunioes/OpenAnalysisOnMount.tsx`
- Verify: `app/layout.tsx`

**Interfaces:**
- Consumes: análise direta criada na Task 2.
- Produces: runtime sem observers/bridges globais antigos.

- [ ] Confirmar que `layout.tsx` não importa nenhum arquivo legado.
- [ ] Excluir os quatro arquivos identificados como substituídos.
- [ ] Confirmar por teste estático que nenhum `MutationObserver` permanece em runtime.

### Task 4: Limpeza de CSS global e validação

**Files:**
- Modify: `app/layout.tsx` somente se houver CSS específico de página ainda global.
- Verify: `app/gravacoes/*`, `app/skills/*`, `app/analise-reunioes/*`, `app/anotacoes/*`, `app/agenda/*`, `app/contatos/*`.

**Interfaces:**
- Consumes: estrutura limpa das Tasks 1–3.
- Produces: shell global reduzido e páginas independentes.

- [ ] Remover do `RootLayout` imports CSS específicos de Gravações que já são carregados pela rota, preservando apenas CSS realmente global.
- [ ] Executar `npm test`.
- [ ] Executar `npm run build`.
- [ ] Confirmar que não há imports quebrados para os arquivos removidos.
- [ ] Confirmar fluxo esperado: Gravações → Analisar → `/analise-reunioes?analysis=<id>`.
