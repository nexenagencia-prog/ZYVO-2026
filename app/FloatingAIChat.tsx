'use client';

import './floating-ai-chat.css';
import { ZYVO_CHAT_ICON } from './chat-icon-data';

export default function FloatingAIChat(){
  return (
    <button className="zyvo-ai-chat" type="button" aria-label="Abrir chat inteligente">
      <img src={ZYVO_CHAT_ICON} alt="" aria-hidden="true" />
      <span className="zyvo-ai-chat-dot" aria-hidden="true" />
    </button>
  );
}
