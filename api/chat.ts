import { handleChatRequest } from '../src/server/chat'

export const config = { runtime: 'edge' }

export default async function handler(request: Request) {
  return handleChatRequest(request, { apiKey: process.env.OPENAI_API_KEY, model: process.env.OPENAI_MODEL, enabled: process.env.OPENAI_CHAT_ENABLED })
}
