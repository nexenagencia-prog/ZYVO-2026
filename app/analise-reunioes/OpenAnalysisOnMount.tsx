'use client';

import {useEffect} from 'react';

export default function OpenAnalysisOnMount(){
  useEffect(()=>{
    let frame=0;
    frame=requestAnimationFrame(()=>{
      const button=document.querySelector<HTMLButtonElement>('.skills-analysis-button');
      button?.click();
    });
    return()=>cancelAnimationFrame(frame);
  },[]);

  return null;
}
