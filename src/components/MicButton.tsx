import React from 'react';
import { Mic } from 'lucide-react';
import { RoboState } from '../types';
import { cn } from '../lib/utils';

interface MicButtonProps {
  state: RoboState;
  isBusy: boolean;
  onClick: () => void;
}

const MicButton: React.FC<MicButtonProps> = ({ state, isBusy, onClick }) => {
  const buttonClasses = cn(
    "w-20 h-52 rounded-lg font-bold text-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
    {
      "bg-[#1a2a4a] text-[#00d4ff] border-2 border-[#00d4ff] hover:bg-[#00d4ff] hover:text-black": !isBusy && state === 'idle',
      "bg-[#00ff88] text-[#0a3020] border-3 border-white scale-105": state === 'listening',
      "opacity-50 cursor-not-allowed bg-gray-600": isBusy && state !== 'listening',
    }
  );

  return (
    <button disabled={isBusy} onClick={onClick} className={buttonClasses}>
      <Mic size={48} />
      <span>MIC</span>
    </button>
  );
};

export default MicButton;
