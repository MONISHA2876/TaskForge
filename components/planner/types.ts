export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  imagePreview?: string;   // object URL for display
  imageBase64?: string;    // base64 for API
  imageMimeType?: string;
  timestamp: Date;
}
