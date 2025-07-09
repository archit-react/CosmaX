export type ChatMessage = {
  id: string;
  role: "user" | "bot" | "system";
  content: string;
  timestamp: string;
  // Optional metadata
  status?: "sending" | "delivered" | "error";
  error?: string;
};

export type ChatConversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
};

// For API request/response shapes
export type ChatAPIRequest = {
  prompt: string;
  conversationHistory?: ChatMessage[];
  model?: string;
  temperature?: number;
};

export type ChatAPIResponse = {
  success: boolean;
  reply: string;
  timestamp: string;
  modelUsed: string;
  tokensUsed: number;
};
