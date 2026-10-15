import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { getChatStatus, handleChatRequest } from './src/server/chat'

const apiPlugin = {
  name: 'all-for-one-chat-api',
  configureServer(server: import('vite').ViteDevServer) {
    server.middlewares.use('/api/chat', async (req, res, next) => {
      if (req.method === 'GET' && req.url === '/status') {
        const status = getChatStatus({ apiKey: process.env.OPENAI_API_KEY, model: process.env.OPENAI_MODEL, enabled: process.env.OPENAI_CHAT_ENABLED })
        res.statusCode = status.status
        res.setHeader('content-type', 'application/json; charset=utf-8')
        res.end(await status.text())
        return
      }
      if (req.method !== 'POST' || (req.url !== '/' && req.url !== '')) { next(); return }
      let body = ''
      req.setEncoding('utf8')
      req.on('data', (chunk: string) => { body += chunk })
      req.on('end', async () => {
        const size = Buffer.byteLength(body, 'utf8')
        if (size > 20_000) {
          res.statusCode = 413
          res.setHeader('content-type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: 'The chat request is too large.' }))
          return
        }
        const origin = req.headers.origin
        const host = req.headers.host ?? 'localhost'
        const response = await handleChatRequest(new Request(`http://${host}/api/chat`, {
          method: 'POST',
          headers: { 'content-type': req.headers['content-type'] ?? 'application/json', ...(origin ? { origin } : {}), 'content-length': String(size) },
          body,
        }), { apiKey: process.env.OPENAI_API_KEY, model: process.env.OPENAI_MODEL, enabled: process.env.OPENAI_CHAT_ENABLED })
        res.statusCode = response.status
        res.setHeader('content-type', 'application/json; charset=utf-8')
        res.end(await response.text())
      })
    })
  },
}

export default defineConfig({ plugins: [react(), apiPlugin] })
