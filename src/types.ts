
export type RoboState = "idle" | "listening" | "thinking" | "speaking" | "error";

export interface ChatMessage {
  sender: "ROBO" | "YOU" | "ERROR" | "INFO";
  message: string;
}

