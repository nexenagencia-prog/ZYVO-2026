# ZYVO 2026 — CMS + autenticação

Data: 2026-09-08

## Objetivo
Adicionar ao projeto `ZYVO-2026` um CMS interno para editar todo o conteúdo da Home sem alterar o layout manualmente. O CMS deve usar Supabase para autenticação, banco e armazenamento de imagens, com acesso administrativo por e-mail e senha.

Administrador inicial: `sandrobellomind@gmail.com`.

## Escopo do CMS
O painel ficará em `/cms` e permitirá editar:

- Hero: eyebrow, título, subtítulo, textos de apoio, labels e textos dos botões.
- Performance principal: percentual, label, valor numérico exibido e meta visual.
- Próxima reunião: label, data, hora e texto auxiliar.
- Carrossel superior: imagens, texto associado, ordem, ativação/desativação e intervalo automático de 4 segundos por padrão.
- Cards: título, descrição, percentual, imagem de fundo, ordem, status de publicação e CTA.
- Perfil: nome exibido e foto.
- Navegação: labels visíveis dos itens da Home.

Não fará parte desta primeira versão a edição livre de CSS, fontes, espaçamentos ou estrutura dos componentes. Isso evita quebra acidental do layout.

## Arquitetura
### Frontend
- Next.js 15 App Router, mantendo a Home atual.
- `/cms/login`: login por e-mail e senha.
- `/cms`: painel protegido.
- `/cms/reset-password`: definição de nova senha após recuperação por e-mail.
- `/auth/callback`: tratamento de links de recuperação/retorno do Supabase.
- Componentes de formulário separados por seção: Hero, Performance, Carrossel, Cards, Perfil e Navegação.

### Supabase
Usar o projeto Supabase já existente e saudável na região `sa-east-1`.

Serviços:
- Supabase Auth para login, sessão, recuperação de senha e troca de senha.
- PostgreSQL para conteúdo editável.
- Supabase Storage para imagens da Hero, cards, carrossel e avatar.

## Modelo de dados
### `site_content`
Uma linha por chave editável, permitindo leitura simples pela Home e atualização independente pelo CMS.

Campos sugeridos:
- `id uuid primary key`
- `section text not null`
- `key text not null`
- `value jsonb not null`
- `updated_at timestamptz default now()`
- `updated_by uuid null references auth.users(id)`
- unique (`section`, `key`)

Exemplos:
- (`hero`, `title`, `"Reuniões com performance de verdade."`)
- (`performance`, `main_percentage`, `69`)
- (`next_meeting`, `time`, `"14:00"`)

### `carousel_items`
- `id uuid primary key`
- `title text`
- `subtitle text`
- `image_url text`
- `sort_order int`
- `is_active boolean default true`
- `created_at timestamptz`
- `updated_at timestamptz`

### `home_cards`
- `id uuid primary key`
- `slug text unique`
- `title text`
- `description text`
- `percentage int check (percentage between 0 and 100)`
- `image_url text`
- `cta_label text`
- `sort_order int`
- `is_active boolean default true`
- `updated_at timestamptz`

## Segurança e permissões
- RLS habilitado nas tabelas.
- Home pública: somente `select` dos conteúdos publicados.
- CMS: `select/insert/update/delete` apenas para usuário autenticado com e-mail administrativo autorizado.
- Uploads de imagem: escrita somente pelo administrador autenticado.
- Bucket de mídia com leitura pública ou URL assinada, conforme compatibilidade com a Home.
- Nenhuma service-role key será exposta ao browser.

## Autenticação
### Login
Usuário inicial: `sandrobellomind@gmail.com`.

Será criada uma senha temporária forte aleatória, com no mínimo 20 caracteres e mistura de maiúsculas, minúsculas, números e símbolos. A senha temporária não será gravada no repositório.

### Primeiro acesso
No primeiro login o administrador será direcionado a definir uma nova senha antes de usar o painel normalmente. O estado de “senha temporária ainda ativa” será controlado por metadata do usuário ou por um registro administrativo no banco.

### Esqueci minha senha
Fluxo obrigatório:
1. Usuário informa o e-mail em `/cms/login`.
2. Supabase envia link de recuperação.
3. Link retorna para `/auth/callback` no domínio do ZYVO.
4. Sessão de recuperação é criada corretamente.
5. Usuário é enviado a `/cms/reset-password`.
6. Nova senha é validada e salva via Auth.
7. Sessão continua válida e o usuário retorna ao `/cms`.

### Definir nova senha
A tela deve:
- exigir senha e confirmação;
- validar tamanho mínimo e igualdade;
- exibir feedback de erro claro;
- impedir submissão duplicada;
- redirecionar somente após confirmação real do Supabase;
- remover o estado de “senha temporária” quando aplicável.

## Fluxo de conteúdo
1. Home carrega dados do Supabase.
2. Se algum dado estiver ausente, usa fallback seguro definido em código para não quebrar a Home.
3. CMS carrega o mesmo conjunto de dados.
4. Administrador edita um campo.
5. Salvar persiste no Supabase.
6. Home reflete a mudança sem necessidade de alterar código.

## Upload de imagens
- Aceitar JPEG, PNG e WebP.
- Validar tipo e tamanho antes do envio.
- Gerar nome de arquivo único.
- Exibir preview antes de salvar.
- Atualizar o registro de conteúdo apenas depois de o upload terminar com sucesso.
- Não apagar a imagem anterior até o novo upload e a atualização do banco terem sido confirmados.

## Animações existentes
- A barra principal de performance continua animando ao entrar na Home.
- As barras dos cards também carregam ao entrar na tela.
- O carrossel superior troca automaticamente a cada 4 segundos por padrão e mantém navegação manual pelas setas.
- O CMS altera os valores e mídias, não remove esses comportamentos.

## Tratamento de erros
- Falha de leitura da Home: mostrar fallback estável em vez de tela vazia.
- Falha de login: mensagem específica sem expor detalhes internos.
- Falha de recuperação de senha: permitir novo envio com cooldown visual.
- Falha de upload: manter imagem anterior e permitir tentar novamente.
- Falha ao salvar: não fechar a edição nem mostrar sucesso falso.
- Sessão expirada: redirecionar ao login preservando indicação de que a sessão expirou.

## Testes
### Auth
- login válido;
- login inválido;
- primeiro acesso com senha temporária;
- recuperação de senha;
- callback de recuperação;
- nova senha válida;
- confirmação divergente;
- sessão expirada;
- rota `/cms` protegida.

### CMS
- carregar conteúdo existente;
- editar texto;
- editar percentual;
- validar percentuais 0–100;
- upload de imagem;
- erro de upload sem perder imagem atual;
- salvar cards;
- reordenar carrossel;
- atualização refletida na Home.

### Build e deploy
- `npm run build` deve terminar com exit code 0 antes de qualquer afirmação de conclusão.
- Conferir o deploy de produção da Vercel após o commit final.

## Migração da Home atual
Os textos, percentuais e imagens que estão hoje em código serão usados como valores iniciais do banco. Depois da migração, a Home consumirá os dados do CMS com fallback para os valores atuais.

## Critérios de aceite
- `/cms` exige autenticação.
- `sandrobellomind@gmail.com` consegue entrar com senha temporária e é obrigado a definir nova senha.
- “Esqueci minha senha” funciona ponta a ponta.
- Todos os textos principais, percentuais, imagens dos cards, imagens do carrossel e avatar são editáveis.
- Alterações salvas aparecem na Home sem novo commit.
- RLS impede edição por visitante não autenticado.
- Home continua funcional mesmo se o Supabase estiver temporariamente indisponível.
- Build de produção passa sem erros.
