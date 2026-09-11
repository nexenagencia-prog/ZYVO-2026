'use client';

import {useEffect} from 'react';

export default function OpenAnalysisOnMount(){
  useEffect(()=>{
    let cancelled=false;
    let timer:number|undefined;
    let attempts=0;

    const openAnalysis=()=>{
      if(cancelled)return;
      if(document.querySelector('.full-analysis'))return;

      const button=document.querySelector<HTMLButtonElement>('.skills-analysis-button');
      if(button){
        button.click();
        timer=window.setTimeout(openAnalysis,80);
        return;
      }

      attempts+=1;
      if(attempts<25)timer=window.setTimeout(openAnalysis,80);
    };

    openAnalysis();

    return()=>{
      cancelled=true;
      if(timer)window.clearTimeout(timer);
    };
  },[]);

  return null;
}
