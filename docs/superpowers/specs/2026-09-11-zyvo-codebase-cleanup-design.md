# ZYVO Codebase Cleanup Design

## Objetivo

Organizar a branch `dev` para reduzir travamentos, remover código morto e deixar cada área do app isolada, previsível e leve, sem alterar o visual atualmente aprovado e sem tocar na `main` ou fazer deploy na Vercel.

## Princípios

1. Remover código não utilizado, duplicado ou substituído por implementações mais novas.
2. Eliminar `MutationObserver`, polling recorrente, enhancers globais e manipulação direta do DOM sempre que houver uma alternativa normal em React/Next.
3. Carregar lógica apenas na rota onde ela é necessária.
4. Preservar os fluxos ativos do produto e os dados persistidos no navegador, incluindo gravações, capas, anotações e avatar/perfil.
5. Manter `AppSidebar` e `AppTopbar` compartilhados como componentes centrais.
6. Evitar reescrita total. A limpeza será incremental e conservadora.

## Escopo de limpeza

### Runtime global

O `app/layout.tsx` deve permanecer mínimo. Componentes globais só podem ficar nele se forem realmente necessários em todas as rotas. Ferramentas flutuantes usadas globalmente podem continuar, desde que não mantenham observers, timers ou listeners sem cleanup.

Arquivos de enhancer/bridge antigos que não estiverem mais importados devem ser removidos do repositório depois de confirmar que nenhuma rota depende deles.

### Gravações

A aba `app/gravacoes` continuará responsável por:

- listar gravações;
- editar título, frase, capa e preferências visuais;
- persistir dados locais;
- selecionar uma gravação;
- navegar para a análise da gravação selecionada.

O botão `Analisar` deve salvar apenas o identificador/dados necessários e navegar pela API normal do Next, sem listeners globais de captura e sem scripts que observem o DOM.

### Análise de Reuniões

`/analise-reunioes` deve abrir diretamente a interface completa de análise, sem primeiro renderizar a visão geral de Skills e depois simular clique em botão.

A análise deve consumir a gravação selecionada por estado persistido/parametrização explícita. O conteúdo da reunião, miniatura/vídeo e indicadores visíveis devem ser gerenciados por React, sem `querySelector`, alteração de `textContent`, `style` imperativo ou bridge global.

### Skills

A rota `/skills` continua sendo a visão geral de performance. O botão `Ver análise completa` deve navegar para a tela de análise por fluxo explícito, não por automação do DOM.

A lógica compartilhada entre Skills e análise deve ser extraída apenas quando isso reduzir duplicação real e deixar responsabilidades claras.

### CSS

CSS deve ficar o mais próximo possível da área que usa seus seletores. Imports globais de CSS específicos de páginas devem ser removidos de `app/layout.tsx` quando puderem ser importados na própria rota/componente.

Arquivos CSS antigos, substituídos ou sem referência devem ser removidos após verificação de uso.

### Ferramentas flutuantes

Calculadora, bloco de notas e chat podem permanecer globais apenas se forem necessários dessa forma. Cada ferramenta deve:

- instalar listeners somente uma vez;
- remover listeners no cleanup;
- não observar `document.body`;
- não iniciar loops ou polling contínuo;
- não renderizar trabalho pesado quando estiver fechada.

## Estrutura desejada

A organização deve seguir responsabilidade funcional, mantendo o padrão atual de Next App Router:

- `app/layout.tsx`: shell global mínimo.
- `app/AppSidebar.tsx`: navegação lateral compartilhada.
- `app/AppTopbar.tsx`: barra superior compartilhada.
- `app/gravacoes/*`: página, componentes e estilos de gravações.
- `app/skills/*`: visão geral de Skills e estilos próprios.
- `app/analise-reunioes/*`: tela e lógica exclusiva da análise.
- `app/anotacoes/*`, `app/agenda/*`, `app/contatos/*`: responsabilidades isoladas por rota.
- componentes globais apenas para funcionalidades realmente globais.

Não será feita uma reorganização agressiva de pastas apenas por estética; arquivos serão movidos somente quando isso reduzir acoplamento ou remover duplicação.

## Código a investigar e potencialmente remover

Os seguintes arquivos já foram identificados como suspeitos/legados e devem ser auditados antes da remoção:

- `app/HeroSlidePhotoEnhancer.tsx`
- `app/SelectedRecordingAnalysisBridge.tsx`
- `app/AnalysisVideoControls.tsx`
- `app/analise-reunioes/OpenAnalysisOnMount.tsx`

Outros arquivos serão removidos somente após confirmar que não são importados por nenhuma rota ativa.

## Performance

A limpeza deve reduzir trabalho no main thread e evitar efeitos contínuos. Critérios:

- nenhum `MutationObserver` global;
- nenhum polling recorrente usado para descobrir elementos da interface;
- nenhuma duplicação artificial de DOM via script global;
- listeners com cleanup;
- sem componentes pesados globais desnecessários;
- navegação entre páginas via Next Router/Link;
- persistência local sem ciclos de escrita/leitura desnecessários.

## Compatibilidade de dados

As chaves já usadas no navegador devem ser preservadas sempre que continuam relevantes, incluindo:

- `zyvo-recordings`
- `zyvo-recording-preferences-v2`
- `zyvo-selected-analysis`
- dados de capas em IndexedDB
- dados atuais de perfil/avatar e anotações

Se uma chave deixar de ser necessária, ela não será apagada automaticamente nesta limpeza para não destruir dados do usuário.

## Segurança da mudança

- Trabalhar somente na branch `dev`.
- Não alterar `main`.
- Não realizar deploy na Vercel.
- Fazer mudanças em blocos pequenos e revisáveis.
- Evitar alterações visuais não solicitadas.
- Remover um arquivo somente após confirmar ausência de dependências.

## Validação

A limpeza será considerada concluída quando:

1. Home, Skills, Gravações, Análise de Reuniões, Agenda, Contatos e Anotações continuarem navegáveis.
2. O fluxo `Gravações → Analisar → Análise de Reuniões` funcionar sem bridge global ou clique simulado.
3. Não existirem `MutationObserver` globais nem polling contínuo para manipular UI.
4. Código morto identificado estiver removido.
5. CSS específico não estiver sendo carregado globalmente sem necessidade.
6. Dados locais existentes continuarem compatíveis.
7. O projeto permanecer visualmente fiel ao estado atual, salvo correções estritamente necessárias para funcionamento.

## Fora do escopo

- redesign visual;
- mudança de preços, copy ou branding;
- migração de persistência local para Supabase;
- criação de backend real de IA para análise de reunião;
- deploy de produção;
- alterações na branch `main`.
