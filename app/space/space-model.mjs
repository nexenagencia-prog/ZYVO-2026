export function appendMessage(messages,body,time){
  const clean=String(body||'').trim();
  if(!clean)return messages;
  return [...messages,{id:`message-${messages.length+1}`,author:'Você',body:clean,time,mine:true}];
}

export function toggleAgendaItem(items,id){
  return items.map(item=>item.id===id?{...item,done:!item.done}:item);
}

export function upsertNote(notes,note){
  return [note,...notes.filter(item=>item.id!==note.id)];
}

export function filterParticipants(participants,filter){
  if(filter==='active')return participants.filter(item=>item.active);
  if(filter==='muted')return participants.filter(item=>item.muted);
  return participants;
}
