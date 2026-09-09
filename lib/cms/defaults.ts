import type { HomeContent } from './types';

const ASSET_BASE = 'https://raw.githubusercontent.com/nexenagencia-prog/ZYVO-2026/fa1814b2cdf961ad2327098e3d77581babb9f157/public';

export const DEFAULT_HOME_CONTENT: HomeContent = {
  hero: {
    eyebrow: '| Videoconferência de alta performance',
    title: 'Converse, evolua\ne alcance resultados\nem cada reunião.',
    ratingText: 'Maior performance em reuniões.',
    performancePercent: 69,
    performanceLabel: 'de performance',
    primaryButton: 'Criar reunião',
    secondaryButton: 'Entrar',
    imageUrl: ''
  },
  nextMeeting: { label: 'Sua próxima Reunião', dateTime: '14:00 — 30 Set 2026' },
  profile: { name: 'Sandro Bello', avatarUrl: '', planLabel: 'ZYVO Pro' },
  navigation: {
    searchPlaceholder: 'Buscar reunião, pessoa ou gravação...',
    top: ['Início', 'Skills', 'Agenda', 'Planos e Preços'],
    sidebar: ['Início','Criar reunião','Agenda','Skills','Contatos','Notificações','Gravações','Configurações','Sair']
  },
  carouselIntervalMs: 4000,
  carousel: [
    { title: 'Mais do que reuniões.', subtitle: 'Evolução.', imageUrl: '', sortOrder: 0, isActive: true },
    { title: 'Performance que evolui', subtitle: 'com você.', imageUrl: '', sortOrder: 1, isActive: true },
    { title: 'Dados que viram', subtitle: 'melhores decisões.', imageUrl: '', sortOrder: 2, isActive: true }
  ],
  cards: [
    { slug: 'skills', title: 'Skills', description: 'Analise suas reuniões, receba feedback e evolua com IA.', percentage: 82, imageUrl: `${ASSET_BASE}/card-skills.webp`, ctaLabel: 'Explorar', sortOrder: 0, isActive: true },
    { slug: 'recordings', title: 'Gravações', description: 'Reviva conversas, identifique pontos-chave e gere insights.', percentage: 54, imageUrl: `${ASSET_BASE}/card-recordings.webp`, ctaLabel: 'Explorar', sortOrder: 1, isActive: true },
    { slug: 'insights', title: 'Insights', description: 'Transforme conversas em decisões mais inteligentes.', percentage: 76, imageUrl: `${ASSET_BASE}/card-insights.webp`, ctaLabel: 'Explorar', sortOrder: 2, isActive: true }
  ]
};
