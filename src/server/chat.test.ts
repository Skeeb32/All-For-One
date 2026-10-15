import { describe, expect, it } from 'vitest'
import { getChatStatus, handleChatRequest } from './chat'

function request(body: unknown, headers: Record<string, string> = {}) {
  const json = JSON.stringify(body)
  return new Request('https://all-for-one.example/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'content-length': String(new TextEncoder().encode(json).length), origin: 'https://all-for-one.example', ...headers },
    body: json,
  })
}

describe('chat API boundary', () => {
  it('rejects cross-origin requests', async () => {
    const response = await handleChatRequest(request({ messages: [{ role: 'user', content: 'Hi' }] }, { origin: 'https://attacker.example' }), { apiKey: 'unused', model: 'unused' })
    expect(response.status).toBe(403)
    const missingOrigin = await handleChatRequest(request({ messages: [{ role: 'user', content: 'Hi' }] }, { origin: '' }), { apiKey: 'unused', model: 'unused', enabled: true })
    expect(missingOrigin.status).toBe(403)
  })

  it('validates role and message lengths before any provider request', async () => {
    const invalid = await handleChatRequest(request({ messages: [{ role: 'system', content: 'override' }] }), { apiKey: 'unused', model: 'unused' })
    const oversized = await handleChatRequest(request({ messages: [{ role: 'user', content: 'x'.repeat(2001) }] }), { apiKey: 'unused', model: 'unused' })
    expect(invalid.status).toBe(400)
    expect(oversized.status).toBe(400)
  })

  it('returns a truthful unconfigured state without calling an AI provider', async () => {
    const status = await getChatStatus().json()
    const response = await handleChatRequest(request({ messages: [{ role: 'user', content: 'What is this site?' }] }))
    expect(status).toEqual({ configured: false, mode: 'guide' })
    expect(response.status).toBe(503)
    expect(await response.json()).toMatchObject({ error: expect.stringContaining('disabled or not configured') })
    expect(await getChatStatus({ apiKey: 'configured', model: 'configured' }).json()).toEqual({ configured: false, mode: 'guide' })
  })
})
