'use client';

import {useEffect} from 'react';

export default function RecordingsUXEnhancer(){
  useEffect(()=>{
    if(window.location.pathname!=='/gravacoes') return;

    const syncRail=(selector:string)=>{
      const rail=document.querySelector<HTMLElement>(selector);
      if(!rail) return;
      rail.querySelectorAll<HTMLElement>('[data-filler-clone="true"]').forEach(node=>node.remove());
      const originals=Array.from(rail.querySelectorAll<HTMLElement>('.recordings-small-card:not([data-filler-clone="true"])'));
      if(!originals.length) return;
      const cycles=4;
      for(let cycle=0;cycle<cycles;cycle++){
        originals.forEach((original,index)=>{
          const clone=original.cloneNode(true) as HTMLElement;
          clone.dataset.fillerClone='true';
          clone.dataset.sourceIndex=String(index);
          clone.setAttribute('aria-hidden','true');
          rail.appendChild(clone);
        });
      }
    };

    const sync=()=>{
      syncRail('.recordings-row-one');
      syncRail('.recordings-row-two');
    };

    const proxyClick=(event:MouseEvent)=>{
      const target=event.target as HTMLElement|null;
      const clone=target?.closest<HTMLElement>('.recordings-small-card[data-filler-clone="true"]');
      if(!clone) return;
      const rail=clone.closest<HTMLElement>('.recordings-rail');
      if(!rail) return;
      const index=Number(clone.dataset.sourceIndex||0);
      const originals=Array.from(rail.querySelectorAll<HTMLElement>('.recordings-small-card:not([data-filler-clone="true"])'));
      const original=originals[index];
      if(!original) return;
      event.preventDefault();
      event.stopPropagation();
      const tool=(target?.closest('button') as HTMLButtonElement|null)?.getAttribute('title');
      if(tool){
        const sourceButton=Array.from(original.querySelectorAll<HTMLButtonElement>('button')).find(button=>button.getAttribute('title')===tool);
        sourceButton?.click();
      }else{
        original.click();
      }
    };

    const timer=window.setTimeout(sync,60);
    window.addEventListener('zyvo:recordings-updated',sync);
    document.addEventListener('click',proxyClick,true);
    return()=>{
      window.clearTimeout(timer);
      window.removeEventListener('zyvo:recordings-updated',sync);
      document.removeEventListener('click',proxyClick,true);
    };
  },[]);

  return null;
}
