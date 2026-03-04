import React, { useState, useEffect, useRef } from 'react';
import RobotFace from './RobotFace';
import ChatLog from './ChatLog';
import InputBar from './InputBar';
import MicButton from './MicButton';
import { RoboState, ChatMessage } from '../types';
import { GoogleGenAI } from '@google/genai';

const STATE_CONFIG = {
  idle: { color: "#90caf9", label: "READY" },
  listening: { color: "#00ff88", label: "LISTENING" },
  thinking: { color: "#ff9800", label: "THINKING" },
  speaking: { color: "#ffeb3b", label: "SPEAKING" },
  error: { color: "#ff5252", label: "ERROR" },
};

const SYSTEM_PROMPT =
  "You are ROBO, a helpful voice assistant. " +
  "You were created and designed by Durga Praveen. " +
  "If anyone asks who created or designed you, always answer that it was Durga Praveen. " +
  "Reply in 1-2 short sentences. Plain text only. No symbols or markdown.";

// @ts-ignore
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function RoboAiApp() {
  const [state, setState] = useState<RoboState>('idle');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const aiRef = useRef<GoogleGenAI | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      aiRef.current = new GoogleGenAI({ apiKey });
    } else {
      handleError("Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.")
    }
    addChatMessage("ROBO", "Hi! I am ROBO AI. Type a question or press MIC to speak!");
    addChatMessage("INFO", `TTS:ON  MIC:ON  API:${apiKey ? 'Connected' : 'Disconnected'}`);
  }, []);

  const addChatMessage = (sender: ChatMessage['sender'], message: string) => {
    setChatLog(prev => [...prev, { sender, message }]);
  };

  const handleError = (message: string) => {
    addChatMessage("ERROR", message);
    setState('error');
    setTimeout(() => {
      setState('idle');
      setIsBusy(false);
    }, 2000);
  };

  const speak = (text: string) => {
    try {
      setState('speaking');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1.2;
      utterance.volume = 1;
      
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('English')));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onend = () => {
        setState('idle');
        setIsBusy(false);
      };
      utterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        handleError("Sorry, I couldn't speak.");
      };
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech synthesis failed", e)
      handleError("Text-to-speech is not supported.")
    }
  };

  const askGemini = async (question: string) => {
    if (!aiRef.current) {
      return handleError("Gemini AI is not initialized.");
    }
    try {
      const model = aiRef.current.models;
      const result = await model.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: question }] }],
        config: {
          systemInstruction: SYSTEM_PROMPT,
        }
      });
      const answer = result.text.trim();
      addChatMessage("ROBO", answer);
      speak(answer);
    } catch (e: any) {
      console.error(e);
      let errorMessage = "Failed to get response from AI.";
      
      const rawMessage = e.message || "";
      if (rawMessage.includes("503")) {
        errorMessage = "Google's servers are overloaded (503). Please wait 10 seconds and try again.";
      } else if (rawMessage.includes("429")) {
        // Try to extract the retry time if present
        const retryMatch = rawMessage.match(/retry in ([\d.]+)s/);
        const seconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 30;
        errorMessage = `Quota exceeded (Rate Limit). Please wait ${seconds} seconds and try again.`;
      } else if (rawMessage.includes("403") || rawMessage.includes("401")) {
        errorMessage = "Invalid API Key or Permission denied.";
      } else if (rawMessage) {
        errorMessage = `AI Error: ${rawMessage.substring(0, 60)}...`;
      }
      
      handleError(errorMessage);
    }
  };

  const handleSendText = (text: string) => {
    if (!text.trim() || isBusy) return;
    setIsBusy(true);
    addChatMessage("YOU", text);
    setState('thinking');
    askGemini(text);
  };

  const handleMicClick = () => {
    if (isBusy) return;
    if (!SpeechRecognition) {
      return handleError("Speech recognition not supported.");
    }

    setIsBusy(true);
    setState('listening');
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.start();

    recognitionRef.current.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      addChatMessage("YOU", speechResult);
      setState('thinking');
      askGemini(speechResult);
    };

    recognitionRef.current.onspeechend = () => {
      recognitionRef.current.stop();
    };

    recognitionRef.current.onerror = (event: any) => {
      handleError(`Speech recognition error: ${event.error}`);
    };
    
    recognitionRef.current.onend = () => {
      if (state === 'listening') { // Ended without result
        setState('idle');
        setIsBusy(false);
      }
    };
  };

  return (
    <div className="min-h-screen bg-[#060a1a] text-white font-sans flex flex-col items-center p-4">
      <header className="text-center my-4">
        <h1 className="text-5xl font-bold text-[#00d4ff] tracking-[4px]">ROBO AI</h1>
        <p className="text-[#304060] font-mono text-sm">Voice AI Assistant | Speak or Type your question</p>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center">
        <div className="flex w-full justify-center items-center space-x-4">
          <RobotFace state={state} />
          <MicButton state={state} isBusy={isBusy} onClick={handleMicClick} />
        </div>

        <div className="w-full max-w-3xl mt-4 space-y-2">
          <ChatLog messages={chatLog} />
          <InputBar isBusy={isBusy} onSend={handleSendText} />
          <div className="flex justify-between items-center h-6 text-sm font-mono font-bold">
            <div style={{ color: STATE_CONFIG[state].color }}>
              ● {STATE_CONFIG[state].label}
            </div>
            <div className="text-[#304060] opacity-70">
              Designed by Durga Praveen
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
