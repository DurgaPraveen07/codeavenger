import React, { useState } from 'react';

interface InputBarProps {
  isBusy: boolean;
  onSend: (text: string) => void;
}

const InputBar: React.FC<InputBarProps> = ({ isBusy, onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex w-full space-x-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your question and press ENTER or SEND..."
        disabled={isBusy}
        className="flex-grow bg-[#0d1a30] text-[#c8d8ff] border-2 border-[#1a3060] rounded-lg px-4 py-2 h-11 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#00d4ff] disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={isBusy}
        className="w-20 h-11 bg-[#1a2a4a] text-[#00d4ff] border-2 border-[#00d4ff] rounded-lg font-bold text-sm hover:bg-[#00d4ff] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        SEND
      </button>
    </div>
  );
};

export default InputBar;
