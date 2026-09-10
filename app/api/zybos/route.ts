import { NextResponse } from 'next/server';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const SYSTEM_PROMPT = `Você é a ZYVO, a inteligência de negócios da plataforma ZYVO. Responda em português do Brasil por padrão, a menos que o usuário use outro idioma. Você é especialmente forte em negócios, vendas, persuasão ética, negociação, marketing, posicionamento, gestão, estratégia, produtividade, comunicação, reuniões e tomada de decisão. Seja pragmática, inteligente, direta e útil. Evite clichês e respostas genéricas. Quando fizer sentido, ofereça estruturas, argumentos, scripts, planos, comparações e próximos passos concretos. Não diga que é ChatGPT e não use branding de terceiros na resposta. Não invente fatos, números ou fontes. Se algo exigir dados atuais, deixe claro quando não puder verificar em tempo real.`;

function extractText(payload: any){
  if(typeof payload?.output_text==='string'&&payload.output_text.trim())return payload.output_text.trim();
  const chunks:string[]=[];
  for(const item of payload?.output||[]){
    for(const part of item?.content||[]){
      if(typeof part?.text==='string'&&part.text.trim())chunks.push(part.text.trim());
    }
  }
  return chunks.join('\n').trim();
}

export async function POST(request: Request){
  try{
    const apiKey=process.env.OPENAI_API_KEY;
    if(!apiKey){
      return NextResponse.json({error:'A ZYVO está pronta, mas a chave de IA ainda não foi configurada no servidor.'},{status:503});
    }

    const body=await request.json();
    const rawMessages=Array.isArray(body?.messages)?body.messages:[];
    const messages:ChatMessage[]=rawMessages
      .filter((message:any)=>message&&(message.role==='user'||message.role==='assistant')&&typeof message.content==='string')
      .slice(-14)
      .map((message:any)=>({role:message.role,content:message.content.slice(0,5000)}));

    if(!messages.some(message=>message.role==='user')){
      return NextResponse.json({error:'Envie uma mensagem para conversar com a ZYVO.'},{status:400});
    }

    const response=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{
        'Authorization':`Bearer ${apiKey}`,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        model:process.env.ZYVO_MODEL||'gpt-5.6-luna',
        instructions:SYSTEM_PROMPT,
        input:messages.map(message=>({
          role:message.role,
          content:[{type:'input_text',text:message.content}]
        })),
        max_output_tokens:1400,
        store:false
      })
    });

    const data=await response.json().catch(()=>null);
    if(!response.ok){
      console.error('ZYVO provider error',response.status,data?.error?.message||data);
      return NextResponse.json({error:'A ZYVO não conseguiu responder agora. Tente novamente em instantes.'},{status:502});
    }

    const answer=extractText(data);
    if(!answer){
      return NextResponse.json({error:'A ZYVO não conseguiu gerar uma resposta agora.'},{status:502});
    }

    return NextResponse.json({answer});
  }catch(error){
    console.error('ZYVO route error',error);
    return NextResponse.json({error:'A ZYVO encontrou um erro ao processar sua mensagem.'},{status:500});
  }
}
