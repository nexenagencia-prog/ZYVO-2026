# ZYVO Codebase Cleanup Design

## Objetivo

Organizar a branch `dev` para reduzir travamentos, remover código morto e deixar cada área do app isolada, previsível e leve, sem alterar o visual atualmente aprovado e sem tocar na `main` ou fazer deploy na Vercel.

## Diagnóstico confirmado

O travamento do ambiente local não é causado pelo estado `Ready` do Next nem por um erro visual da Home. O Next 15 está inferindo `/Users/pietromedeiros` como raiz do workspace por encontrar um `package-lock.json` acima do projeto. Com isso, o watcher tenta acompanhar uma árvore muito maior que o repositório e registra repetidamente `EMFILE: too many open files, watch`. Em uma execução controlada, a primeira requisição demorou 12,7 segundos e retornou 404; a rota de análise permaneceu sem resposta por mais de 30 segundos.

O problema é ampliado por três fontes de trabalho desnecessário:

1. `scripts/dev-sync.mjs` executa `git pull --ff-only origin dev` a cada três segundos durante o desenvolvimento.
2. `INICIAR-ZYVO.command` mantém outro loop de sincronização a cada vinte segundos.
3. Gravações renderiza três cópias completas de cada item em cada trilho inferior, incluindo todos os controles interativos.

O clique `Gravações → Analisar` já grava `zyvo-selected-analysis` e chama o roteador do Next, mas a navegação não termina quando o runtime está saturado. A rota `/analise-reunioes` também deve ser validada isoladamente depois da correção da raiz do watcher.

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

O Next deve receber a raiz absoluta do próprio repositório em sua configuração. O comando `npm run dev` deve iniciar somente o servidor de desenvolvimento, sem operações de Git, polling ou sincronização automática. Atualizações da branch permanecem uma ação explícita do desenvolvedor.

### Gravações

A aba `app/gravacoes` continuará responsável por:

- listar gravações;
- editar título, frase, capa e preferências visuais;
- persistir dados locais;
- selecionar uma gravação;
- navegar para a análise da gravação selecionada.

O botão `Analisar` deve salvar apenas o identificador/dados necessários e navegar pela API normal do Next, sem listeners globais de captura e sem scripts que observem o DOM.

Os trilhos inferiores devem renderizar uma única instância de cada gravação por trilho. A rolagem horizontal, as larguras alternadas, as ações e o aspecto visual permanecem; continuidade artificial não justifica triplicar toda a árvore interativa. O retorno ao card principal deve usar uma referência React da própria seção, sem `document.querySelector`.

### Análise de Reuniões

`/analise-reunioes` deve abrir diretamente a interface completa de análise, sem primeiro renderizar a visão geral de Skills e depois simular clique em botão.

A análise deve consumir a gravação selecionada por estado persistido/parametrização explícita. O conteúdo da reunião, miniatura/vídeo e indicadores visíveis devem ser gerenciados por React, sem `querySelector`, alteração de `textContent`, `style` imperativo ou bridge global.

### Skills

A rota `/skills` continua sendo a visão geral de performance. O botão `Ver análise completa` deve navegar para a tela de análise por fluxo explícito, não por automação do DOM.

A lógica compartilhada entre Skills e análise deve ser extraída apenas quando isso reduzir duplicação real e deixar responsabilidades claras.

As três linhas de “Próximas ações” devem existir diretamente no JSX/dados da página. `SkillsActionsEnhancer.tsx`, seu `MutationObserver`, clonagem de nós e o layout criado somente para montar esse enhancer devem ser removidos sem alterar o conteúdo visível aprovado.

### CSS

CSS deve ficar o mais próximo possível da área que usa seus seletores. Imports globais de CSS específicos de páginas devem ser removidos de `app/layout.tsx` quando puderem ser importados na própria rota/componente.

Arquivos CSS antigos, substituídos ou sem referência devem ser removidos após verificação de uso.

Os overrides `recordings-spacing.css` e `recordings-final-fixes.css` devem ser consolidados em `gravacoes.css` na mesma ordem efetiva da cascata. Declarações sobrepostas serão reduzidas somente quando o valor final permanecer idêntico. A página será comparada visualmente antes e depois da consolidação.

## Higiene do repositório

- Adicionar regras de ignore para `.next/`, `node_modules/` e artefatos locais gerados.
- Manter no repositório os arquivos de configuração e lock necessários para instalação e build determinísticos.
- Remover a cópia aninhada não rastreada `ZYVO-2026/`, que contém um clone antigo de 3,7 MB e um `.git` próprio dentro do projeto.
- Preservar a permissão executável já aplicada localmente a `INICIAR-ZYVO.command`.

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
- `app/skills/SkillsActionsEnhancer.tsx`
- `app/skills/layout.tsx`, caso não reste outra responsabilidade após remover o enhancer
- `scripts/dev-sync.mjs`
- `app/gravacoes/recordings-spacing.css` e `app/gravacoes/recordings-final-fixes.css`, depois da consolidação fiel em `gravacoes.css`

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
8. O Next iniciar sem aviso de raiz incorreta e sem `EMFILE`.
9. `npm run dev` não executar comandos Git nem criar timers de sincronização.
10. Cada gravação aparecer uma única vez por trilho inferior no DOM.
11. A análise selecionada abrir pelo botão `Analisar`, refletir o id da URL e continuar acessível por abertura direta da rota.
12. Testes automatizados e `npm run build` encerrarem com código zero.

## Fora do escopo

- redesign visual;
- mudança de preços, copy ou branding;
- migração de persistência local para Supabase;
- criação de backend real de IA para análise de reunião;
- deploy de produção;
- alterações na branch `main`.
