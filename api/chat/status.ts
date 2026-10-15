import { getChatStatus } from '../../src/server/chat'

export const config = { runtime: 'edge' }

export default function handler() {
  return getChatStatus({ apiKey: process.env.OPENAI_API_KEY, model: process.env.OPENAI_MODEL, enabled: process.env.OPENAI_CHAT_ENABLED })
}
