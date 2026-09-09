'use client';

import './floating-ai-chat.css';

export default function FloatingAIChat(){
  return (
    <button className="zyvo-ai-chat" type="button" aria-label="Abrir chat inteligente">
      <img src="/zyvo-chat-icon.webp" alt="" aria-hidden="true" />
      <span className="zyvo-ai-chat-dot" aria-hidden="true" />
    </button>
  );
}
