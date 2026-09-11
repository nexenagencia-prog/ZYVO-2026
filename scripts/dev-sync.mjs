import {spawn,execFile} from 'node:child_process';

const cwd=process.cwd();
let syncing=false;

function syncDev(){
  if(syncing)return;
  syncing=true;
  execFile('git',['pull','--ff-only','origin','dev'],{cwd},(error,stdout,stderr)=>{
    syncing=false;
    if(error){
      const message=(stderr||stdout||error.message).trim();
      console.error(`[ZYVO auto-sync] ${message}`);
      return;
    }
    const message=stdout.trim();
    if(message&&message!=='Already up to date.')console.log(`[ZYVO auto-sync] ${message}`);
  });
}

syncDev();
const timer=setInterval(syncDev,3000);

const next=spawn(process.execPath,['node_modules/next/dist/bin/next','dev'],{
  cwd,
  stdio:'inherit',
  env:process.env
});

function shutdown(signal){
  clearInterval(timer);
  if(!next.killed)next.kill(signal);
}

process.on('SIGINT',()=>shutdown('SIGINT'));
process.on('SIGTERM',()=>shutdown('SIGTERM'));

next.on('exit',(code,signal)=>{
  clearInterval(timer);
  if(signal)process.kill(process.pid,signal);
  else process.exit(code??0);
});
