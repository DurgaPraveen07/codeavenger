import React, { useState, useEffect } from 'react';
import { RoboState } from '../types';

interface RobotFaceProps {
  state: RoboState;
}

const STATE_CONFIG = {
  idle: { color: "#90caf9" },
  listening: { color: "#00ff88" },
  thinking: { color: "#ff9800" },
  speaking: { color: "#ffeb3b" },
  error: { color: "#ff5252" },
};

const RobotFace: React.FC<RobotFaceProps> = ({ state }) => {
  const [glowPhase, setGlowPhase] = useState(0);
  const [mouthPhase, setMouthPhase] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const tick = () => {
      setGlowPhase(prev => (prev + 4) % 360);
      if (state === 'speaking') {
        setMouthPhase(prev => (prev + 22) % 360);
      } else {
        setMouthPhase(0);
      }
    };
    const interval = setInterval(tick, 50);
    return () => clearInterval(interval);
  }, [state]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 300); 
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  const eyeColor = STATE_CONFIG[state].color;
  const glowIntensity = 0.55 + 0.45 * Math.sin((glowPhase * Math.PI) / 180);

  const eyeBlinkTransform = isBlinking ? 'scaleY(0.1)' : 'scaleY(1)';

  const Brows = () => {
    const commonProps = { stroke: eyeColor, strokeWidth: 5, strokeLinecap: 'round' as const };
    const [lx, rx, by, off] = [162, 418, 130, 32];
    switch (state) {
      case 'listening':
        return <><line x1={lx-off} y1={by-16} x2={lx+off} y2={by-16} {...commonProps} /><line x1={rx-off} y1={by-16} x2={rx+off} y2={by-16} {...commonProps} /></>;
      case 'thinking':
        return <><line x1={lx-off} y1={by-6} x2={lx+off} y2={by+6} {...commonProps} /><line x1={rx-off} y1={by-18} x2={rx+off} y2={by-18} {...commonProps} /></>;
      case 'error':
        return <><line x1={lx-off} y1={by-10} x2={lx+off} y2={by+10} {...commonProps} /><line x1={rx-off} y1={by+10} x2={rx+off} y2={by-10} {...commonProps} /></>;
      default:
        return <><line x1={lx-off} y1={by} x2={lx+off} y2={by} {...commonProps} /><line x1={rx-off} y1={by} x2={rx+off} y2={by} {...commonProps} /></>;
    }
  };

  const Mouth = () => {
    const [cx, cy, mw, mh] = [290, 367, 140, 56];
    const commonProps = { stroke: eyeColor, strokeWidth: 6, strokeLinecap: 'round' as const, fill: 'none' };
    switch (state) {
      case 'speaking':
        const oh = 12 + Math.abs(Math.sin((mouthPhase * Math.PI) / 180)) * 38;
        return <ellipse cx={cx} cy={cy} rx={32} ry={oh / 2} fill={eyeColor} />;
      case 'listening':
        return <ellipse cx={cx} cy={cy - 4} rx={22} ry={25} fill={eyeColor} />;
      case 'thinking':
        return <path d={`M ${cx - 50} ${cy + 8} A 50 22 0 0 0 ${cx + 50} ${cy - 15}`} {...commonProps} />;
      case 'error':
        return <line x1={cx - mw / 2} y1={cy + 6} x2={cx + mw / 2} y2={cy + 6} {...commonProps} />;
      default:
        return <path d={`M ${cx - mw / 2} ${cy} A ${mw/2} ${mh/2} 0 0 0 ${cx + mw / 2} ${cy}`} {...commonProps} />;
    }
  };

  return (
    <div className="relative w-[740px] h-[555px]">
      <svg viewBox="0 0 740 555" className="absolute inset-0 w-full h-full">
        {/* Glow Effect */}
        {[6, 5, 4, 3, 2, 1].map(i => (
          <rect key={i} x={80 - i*5} y={22.5 - i*5} width={580 + i*10} height={510 + i*10} rx={25} ry={25}
            stroke={eyeColor} strokeWidth={i*3} fill="none" opacity={0.1 * i * glowIntensity} />
        ))}
        {/* Panel */}
        <rect x="80" y="22.5" width="580" height="510" rx="25" ry="25" fill="#0d1529" />
        <rect x="80" y="22.5" width="580" height="510" rx="25" ry="25" stroke={eyeColor} strokeWidth="3" fill="none" opacity={0.5 * glowIntensity + 0.5} />
        <text x="50%" y="60" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="12" fontFamily="Consolas">-- ROBO AI | VOICE ASSISTANT --</text>
        
        {/* Face */}
        <g transform="translate(80, 22.5)">
          <Brows />
          {/* Eyes */}
          {[162, 418].map(cx => (
            <g key={cx} transform={`translate(${cx}, 194)`}>
              <g style={{ transformOrigin: 'center', transition: 'transform 0.1s ease-out', transform: eyeBlinkTransform }}>
                <circle r={68} fill={eyeColor} opacity={0.15} />
                <circle r={58} fill={eyeColor} opacity={0.2} />
                <circle r={48} fill={eyeColor} opacity={0.25} />
                <circle r={38} stroke={eyeColor} strokeWidth={4} fill={eyeColor} />
                <circle r={24} fill="#0d1529" />
                <circle r={17} fill={eyeColor} fillOpacity={0.8} />
                <circle r={8} fill="#050810" transform={state === 'thinking' ? 'translate(-10, -8)' : ''} />
                <circle cx={-10} cy={-10} r={6} fill="rgba(255,255,255,0.8)" />
              </g>
            </g>
          ))}
          <Mouth />
        </g>
      </svg>
    </div>
  );
};

export default RobotFace;
