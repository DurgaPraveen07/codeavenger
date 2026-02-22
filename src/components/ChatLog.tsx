import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

interface ChatLogProps {
  messages: ChatMessage[];
}

const senderColors: Record<ChatMessage['sender'], string> = {
  ROBO: "#00d4ff",
  YOU: "#ffeb3b",
  ERROR: "#ff5252",
  INFO: "#888888",
};

const ChatLog: React.FC<ChatLogProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={scrollRef}
      className="w-full h-[165px] bg-[#070d1f] text-[#c8d8ff] border-2 border-[#1a3060] rounded-lg p-3 font-mono text-xs overflow-y-auto"
    >
      {messages.map((msg, index) => (
        <div key={index} className="whitespace-pre-wrap">
          <span style={{ color: senderColors[msg.sender], fontWeight: 'bold' }}>
            [{msg.sender}]
          </span>
          <span className="text-[#c8d8ff]"> {msg.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatLog;
