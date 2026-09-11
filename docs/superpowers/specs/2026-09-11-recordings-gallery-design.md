# Gravações — design

Objetivo: criar a rota `/gravacoes` com o mesmo padrão visual do layout de referência fornecido pelo usuário, preservando o menu lateral e a topbar canônica da ZYVO.

Requisitos: carrossel horizontal suave controlável por trackpad, roda do mouse e arraste; card principal grande com cards adjacentes visíveis; duas fileiras menores; ações sobre cada miniatura para assistir, analisar, excluir, editar dados e trocar miniatura; estrelas de performance; edição de título, frase, família tipográfica e tamanho do título; persistência local imediata; botão inferior `Voltar ao menu`; sem alterar outras páginas.

Arquitetura: página client-side isolada em `app/gravacoes/page.tsx`, estilos em `app/gravacoes/gravacoes.css`, persistência em `localStorage` na chave `zyvo-recordings`, e navegação habilitada no `AppSidebar`. O arraste usa Pointer Events e `scrollLeft`, sem dependências novas.

Sucesso: `/gravacoes` abre pelo item Gravações da sidebar, mantém os menus existentes, permite editar os cards, trocar miniaturas e navegar horizontalmente de forma suave.