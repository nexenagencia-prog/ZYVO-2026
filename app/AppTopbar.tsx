'use client';

import Link from 'next/link';
import { Bell, Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import './app-topbar.css';

const nav=[['Início','/'],['Skills','/skills'],['Agenda','/agenda'],['Planos e Preços','/planos']] as const;

export default function AppTopbar(){
  const pathname=usePathname();
  const router=useRouter();
  useEffect(()=>{if(pathname!=='/')router.prefetch('/')},[pathname,router]);
  return <header className="shared-topbar">
    <Link className="shared-brand" href="/" prefetch={true} aria-label="ZYVO"><img src="/zyvo-logo.svg" alt="ZYVO" /></Link>
    <div className="shared-search"><Search/><span>Buscar reunião, pessoa ou gravação...</span><kbd>⌘ K</kbd></div>
    <nav>{nav.map(([label,href])=><Link key={href} href={href} prefetch={true} className={pathname===href?'active':''}>{label}</Link>)}</nav>
    <div className="shared-next"><span>Sua próxima Reunião</span><strong>14:00 — 30 Set 2026</strong></div>
    <button className="shared-bell" aria-label="Notificações"><Bell/></button>
  </header>;
}
