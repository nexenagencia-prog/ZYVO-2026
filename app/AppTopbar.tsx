'use client';

import Link from 'next/link';
import { Bell, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

const nav=[['Início','/'],['Skills','/skills'],['Agenda','/agenda'],['Planos e Preços','/planos']] as const;

export default function AppTopbar(){
  const pathname=usePathname();
  return <header className="shared-topbar">
    <Link className="shared-brand" href="/" aria-label="ZYVO"><span>Z</span><b>ZYVO</b></Link>
    <div className="shared-search"><Search/><span>Buscar reunião, pessoa ou gravação...</span><kbd>⌘ K</kbd></div>
    <nav>{nav.map(([label,href])=><Link key={href} href={href} className={pathname===href?'active':''}>{label}</Link>)}</nav>
    <div className="shared-next"><span>Sua próxima Reunião</span><strong>14:00 — 30 Set 2026</strong></div>
    <button className="shared-bell" aria-label="Notificações"><Bell/></button>
  </header>;
}
