'use client';

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  ChevronRight,
  CirclePlus,
  DoorOpen,
  Grid2X2,
  Lightbulb,
  Menu,
  Mic2,
  Play,
  Search,
  Settings,
  Star,
  Users,
  Video,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { icon: Grid2X2, label: 'Início' },
  { icon: CirclePlus, label: 'Criar reunião' },
  { icon: CalendarDays, label: 'Agenda' },
  { icon: BarChart3, label: 'Skills' },
  { icon: Users, label: 'Contatos' },
  { icon: Bell, label: 'Notificações' },
  { icon: Video, label: 'Gravações' },
  { icon: Settings, label: 'Configurações' },
  { icon: DoorOpen, label: 'Sair' },
];

export default function Home() {
  const [expanded, setExpanded] = useState(false);

  return (
    <main className="app-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <aside className={`sidebar ${expanded ? 'expanded' : ''}`}>
        <div className="avatar-wrap">
          <div className="avatar">SB</div>
          {expanded && <div className="avatar-meta"><strong>Sandro</strong><span>ZYVO Pro</span></div>}
        </div>

        <div className="side-nav">
          {navItems.map(({ icon: Icon, label }, index) => (
            <button className={`side-item ${index === 0 ? 'active' : ''}`} key={label} aria-label={label}>
              <Icon size={24} strokeWidth={1.8} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <button className="sidebar-toggle" onClick={() => setExpanded((v) => !v)} aria-label={expanded ? 'Encolher menu' : 'Expandir menu'}>
          {expanded ? <X size={21} /> : <Menu size={21} />}
          <span>{expanded ? 'Encolher' : 'Menu'}</span>
        </button>
      </aside>

      <section className={`content ${expanded ? 'shifted' : ''}`}>
        <header className="topbar">
          <div className="brand">ZYVO</div>
          <nav className="topnav">
            <a className="current" href="#">Início</a>
            <a href="#skills">Skills</a>
            <a href="#agenda">Agenda</a>
            <a href="#planos">Planos e Preços</a>
          </nav>
          <div className="next-meeting">
            <span>Seu próximo encontro</span>
            <strong>14:00 — 30 Set 2026</strong>
          </div>
          <button className="menu-top" onClick={() => setExpanded((v) => !v)}>
            <Menu size={21}/><span>MENU</span>
          </button>
        </header>

        <div className="search-box">
          <Search size={31} strokeWidth={1.7} />
          <span>Buscar reunião, pessoa ou gravação...</span>
          <kbd>⌘ K</kbd>
        </div>

        <section className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">| Videoconferência de alta performance</div>
            <h1>Converse, <span>evolua,</span><br/>e alcance <span>resultados</span><br/>em cada <span>reunião.</span></h1>
            <div className="rating-line">
              <div className="stars">
                {[0,1,2,3,4].map((n) => <Star key={n} size={24} fill="currentColor" strokeWidth={1.4} />)}
              </div>
              <span>Mais performance em reuniões.</span>
            </div>
            <div className="hero-actions">
              <button className="primary-btn">Criar reunião <span><ChevronRight size={21}/></span></button>
              <button className="secondary-btn">Ver recursos</button>
            </div>
          </div>

          <div className="hero-feature">
            <div className="feature-glow" />
            <div className="feature-card">
              <div className="feature-logo">Z</div>
              <div className="feature-text">Mais do<br/>que reuniões.<br/>Evolução.</div>
              <div className="feature-dot" />
              <div className="slider-dashes"><i/><i/><i/></div>
              <div className="feature-arrows">
                <button><ArrowLeft size={22}/></button>
                <button><ArrowRight size={22}/></button>
              </div>
            </div>
          </div>
        </section>

        <section className="cards-grid">
          <article className="info-card skills-card" id="skills">
            <div className="card-light" />
            <div className="card-dot" />
            <Mic2 className="card-icon" size={42} strokeWidth={1.9}/>
            <h2>Skills</h2>
            <p>Analise suas reuniões, receba<br/>feedback e evolua com IA.</p>
            <div className="ai-art">AI</div>
            <div className="card-bottom"><span>Explorar</span><button><ArrowRight size={23}/></button></div>
          </article>

          <article className="info-card recordings-card">
            <div className="card-light" />
            <div className="card-dot" />
            <Play className="card-icon circled" size={43} strokeWidth={1.8}/>
            <h2>Gravações</h2>
            <p>Reviva conversas, identifique<br/>pontos-chave e gere insights.</p>
            <div className="phone-art">
              <div className="phone-lens one"/><div className="phone-lens two"/><div className="phone-lens three"/>
            </div>
            <div className="card-bottom"><span>Explorar</span><button><ArrowRight size={23}/></button></div>
          </article>

          <article className="info-card insights-card">
            <div className="card-light" />
            <div className="card-dot" />
            <Lightbulb className="card-icon" size={42} strokeWidth={1.8}/>
            <h2>Insights</h2>
            <p>Transforme conversas em<br/>decisões mais inteligentes.</p>
            <div className="chart-art">
              <svg viewBox="0 0 220 130" role="img" aria-label="Gráfico de performance">
                <path d="M4 101 C35 60, 45 123, 76 86 S116 56, 138 73 S177 45, 214 40" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div className="bars"><i/><i/><i/><i/></div>
            </div>
            <div className="card-bottom"><span>Explorar</span><button><ArrowRight size={23}/></button></div>
          </article>
        </section>
      </section>
    </main>
  );
}
