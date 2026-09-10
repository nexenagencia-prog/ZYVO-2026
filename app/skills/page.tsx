'use client';

import Link from 'next/link';
import {BarChart3,Bell,Check,ChevronRight,CircleHelp,Ear,FileText,Lightbulb,MessageCircle,Play,Search,ShieldCheck,Sparkles,SunMedium,Target,Users,AlertCircle} from 'lucide-react';
import AppSidebar from '../AppSidebar';
import '../refine.css';
import '../cms-home.css';
import '../home-overrides.css';
import './skills.css';
import './skills-fix.css';
import './skills-progress-motion.css';

const metrics=[
  {label:'Comunicação',value:88,Icon:MessageCircle},
  {label:'Clareza',value:91,Icon:SunMedium},
  {label:'Escuta',value:84,Icon:Ear},
  {label:'Objetividade',value:76,Icon:Target},
  {label:'Perguntas',value:89,Icon:CircleHelp},
  {label:'Argumentação',value:81,Icon:BarChart3},
  {label:'Condução',value:85,Icon:Users},
];

const moments=[
  {time:'12:43',title:'Objeção sobre preço',text:'Cliente levantou uma preocupação importante.',pos:'44% 38%'},
  {time:'18:27',title:'Oportunidade identificada',text:'Interesse em implementar ainda este ano.',pos:'52% 46%'},
  {time:'31:10',title:'Decisão',text:'Alinhamento para próxima etapa.',pos:'58% 42%'},
];

const skillsArtwork='/skills-card.png';

export default function SkillsPage(){
  return <main className="app-shell skills-page">
    <AppSidebar />
    <section className="content skills-site-content">
      <header className="topbar skills-site-topbar">
        <div className="zyvo-brand" aria-label="ZYVO"><span className="zyvo-mark">Z</span><span className="zyvo-word">ZYVO</span></div>
        <div className="search-box"><Search size={24}/><span>Buscar reunião, pessoa ou gravação...</span><kbd>⌘ K</kbd></div>
        <nav className="topnav"><Link href="/" prefetch>Início</Link><Link href="/skills" prefetch className="current">Skills</Link><Link href="/agenda" prefetch>Agenda</Link><Link href="/planos" prefetch>Planos e Preços</Link></nav>
        <div className="next-meeting"><span>Sua próxima Reunião</span><strong>14:00 — 30 Set 2026</strong></div>
        <div className="notification-wrap"><button className="notification-button" aria-label="Notificações"><Bell/></button></div>
      </header>

      <section className="skills-stage">
        <div className="skills-top-grid">
          <section className="skills-intro"><span className="skills-kicker">SKILLS</span><h1>Veja aqui o<br/>resultado da<br/>última reunião.</h1><p>Sua performance em detalhes,<br/>com insights da IA.</p><button className="skills-highlight"><span><Play fill="currentColor"/></span>Reproduzir highlights</button></section>
          <article className="skills-photo-card" aria-label="Conversas que geram evolução"><img src={skillsArtwork} alt="Conversas que geram evolução — ZYVO"/><div className="skills-photo-glass"/></article>
          <article className="skills-score-card glass-card"><button className="skills-more" aria-label="Mais opções">•••</button><h2>Seu desempenho</h2><div className="skills-score-content"><div className="skills-ring"><div className="skills-ring-inner"><div><strong>86</strong><span>/100</span></div><b>↑ +7%</b><small>em relação<br/>à última reunião</small></div></div><div className="skills-score-copy"><strong>Ótima evolução!</strong><p>Você foi mais objetivo e fez<br/>perguntas mais estratégicas<br/>nesta reunião.</p><button className="skills-analysis-button">Ver análise completa <ChevronRight/></button></div></div></article>
        </div>

        <div className="skills-metrics">{metrics.map(({label,value,Icon})=><article className="skills-metric glass-card" key={label}><div className="skills-metric-label"><span><Icon/></span>{label}</div><strong>{value}%</strong><div className="skills-progress"><i style={{width:`${value}%`}}/></div></article>)}</div>

        <div className="skills-bottom-grid">
          <article className="skills-detail-card glass-card"><header><span><Sparkles/></span><h3>Principais insights da IA</h3><button><ChevronRight/></button></header><div className="skills-row"><span className="skills-status success">↑</span><div><strong>Sua clareza aumentou 12%</strong><p>em relação às últimas 5 reuniões.</p></div></div><div className="skills-row"><span className="skills-status warm"><AlertCircle/></span><div><strong>Você interrompeu 3 vezes</strong><p>Tente dar mais espaço para o outro.</p></div></div><div className="skills-row"><span className="skills-status warm"><Lightbulb/></span><div><strong>O cliente demonstrou alto interesse</strong><p>quando você falou sobre a proposta.</p></div></div></article>
          <article className="skills-detail-card glass-card"><header><span><FileText/></span><h3>Momentos importantes</h3><button><ChevronRight/></button></header>{moments.map((moment)=><div className="skills-moment" key={moment.time}><button className="skills-video-thumb" aria-label={`Reproduzir momento ${moment.time}`} style={{backgroundPosition:moment.pos,backgroundImage:`linear-gradient(180deg,rgba(10,18,28,.03),rgba(7,14,22,.34)),url(${skillsArtwork})`}}><span><Play fill="currentColor"/></span></button><time>{moment.time}</time><div><strong>{moment.title}</strong><p>{moment.text}</p></div></div>)}</article>
          <article className="skills-detail-card glass-card"><header><span><ShieldCheck/></span><h3>Próximas ações</h3><button><ChevronRight/></button></header><label className="skills-action"><input type="checkbox" defaultChecked/><span><Check/></span><div><strong>Enviar proposta</strong><p>Sandro · até sexta-feira</p></div></label><label className="skills-action"><input type="checkbox"/><span><Check/></span><div><strong>Revisar contrato</strong><p>Cliente · 15/09</p></div></label><label className="skills-action"><input type="checkbox"/><span><Check/></span><div><strong>Agendar nova reunião</strong><p>Sandro · 22/09</p></div></label></article>
        </div>
      </section>
    </section>
  </main>
}
