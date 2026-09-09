'use client';

import {BarChart3,Check,ChevronRight,CircleHelp,Ear,FileText,Lightbulb,MessageCircle,Play,ShieldCheck,Sparkles,SunMedium,Target,Users,AlertCircle} from 'lucide-react';
import AppSidebar from '../AppSidebar';
import AppTopbar from '../AppTopbar';
import './skills.css';

const metrics=[
  {label:'Comunicação',value:88,Icon:MessageCircle},
  {label:'Clareza',value:91,Icon:SunMedium},
  {label:'Escuta',value:84,Icon:Ear},
  {label:'Objetividade',value:76,Icon:Target},
  {label:'Perguntas',value:89,Icon:CircleHelp},
  {label:'Argumentação',value:81,Icon:BarChart3},
  {label:'Condução',value:85,Icon:Users},
];

export default function SkillsPage(){
  return <main className="skills-page">
    <AppSidebar />
    <AppTopbar />
    <section className="skills-stage">
      <div className="skills-top-grid">
        <section className="skills-intro">
          <span className="skills-kicker">SKILLS</span>
          <h1>Veja aqui o<br/>resultado da<br/>última reunião.</h1>
          <p>Sua performance em detalhes,<br/>com insights da IA.</p>
          <button className="skills-highlight"><span><Play fill="currentColor"/></span>Reproduzir highlights</button>
        </section>

        <article className="skills-photo-card" aria-label="Conversas que geram evolução">
          <img src="/skills-card.jpg" alt="Retrato com efeito de vidro" />
          <div className="skills-photo-glass"/>
        </article>

        <article className="skills-score-card glass-card">
          <button className="skills-more" aria-label="Mais opções">•••</button>
          <h2>Seu desempenho</h2>
          <div className="skills-score-content">
            <div className="skills-ring"><div className="skills-ring-inner"><div><strong>86</strong><span>/100</span></div><b>↑ +7%</b><small>em relação à<br/>última reunião</small></div></div>
            <div className="skills-score-copy"><strong>Ótima evolução!</strong><p>Você foi mais objetivo e fez<br/>perguntas mais estratégicas<br/>nesta reunião.</p></div>
          </div>
        </article>
      </div>

      <div className="skills-metrics">
        {metrics.map(({label,value,Icon})=><article className="skills-metric glass-card" key={label}>
          <div className="skills-metric-label"><span><Icon/></span>{label}</div>
          <strong>{value}%</strong>
          <div className="skills-progress"><i style={{width:`${value}%`}}/></div>
        </article>)}
      </div>

      <div className="skills-bottom-grid">
        <article className="skills-detail-card glass-card">
          <header><span><Sparkles/></span><h3>Principais insights da IA</h3><button><ChevronRight/></button></header>
          <div className="skills-row"><span className="skills-status success">↑</span><div><strong>Sua clareza aumentou 12%</strong><p>em relação às últimas 5 reuniões.</p></div></div>
          <div className="skills-row"><span className="skills-status warm"><AlertCircle/></span><div><strong>Você interrompeu 3 vezes</strong><p>Tente dar mais espaço para o outro.</p></div></div>
          <div className="skills-row"><span className="skills-status warm"><Lightbulb/></span><div><strong>O cliente demonstrou alto interesse</strong><p>quando você falou sobre a proposta.</p></div></div>
        </article>

        <article className="skills-detail-card glass-card">
          <header><span><FileText/></span><h3>Momentos importantes</h3><button><ChevronRight/></button></header>
          <div className="skills-moment"><button><Play fill="currentColor"/></button><time>12:43</time><div><strong>Objeção sobre preço</strong><p>Cliente levantou uma preocupação importante.</p></div></div>
          <div className="skills-moment"><button><Play fill="currentColor"/></button><time>18:27</time><div><strong>Oportunidade identificada</strong><p>Interesse em implementar ainda este ano.</p></div></div>
          <div className="skills-moment"><button><Play fill="currentColor"/></button><time>31:10</time><div><strong>Decisão</strong><p>Alinhamento para próxima etapa.</p></div></div>
        </article>

        <article className="skills-detail-card glass-card">
          <header><span><ShieldCheck/></span><h3>Próximas ações</h3><button><ChevronRight/></button></header>
          <label className="skills-action"><input type="checkbox" defaultChecked/><span><Check/></span><div><strong>Enviar proposta</strong><p>Sandro · até sexta-feira</p></div></label>
          <label className="skills-action"><input type="checkbox"/><span><Check/></span><div><strong>Revisar contrato</strong><p>Cliente · 15/09</p></div></label>
          <label className="skills-action"><input type="checkbox"/><span><Check/></span><div><strong>Agendar nova reunião</strong><p>Sandro · 22/09</p></div></label>
        </article>
      </div>
    </section>
  </main>
}
