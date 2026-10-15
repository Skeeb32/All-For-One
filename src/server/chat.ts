export type ChatMessage = { role: 'user' | 'assistant'; content: string }

const MAX_BODY_BYTES = 20_000
const MAX_MESSAGES = 12
const MAX_MESSAGE_LENGTH = 2_000
const MAX_OUTPUT_TOKENS = 600

type ChatConfig = { apiKey?: string; model?: string; enabled?: boolean | string }
const isEnabled = (enabled: ChatConfig['enabled']) => enabled === true || enabled === 'true'

const SITE_INSTRUCTIONS = `You are the All For One website assistant. Answer questions about this website, its routes, projects, and the linked enterprise AI chatbot tutorial. Use only the website context below. Be concise, say when the site does not provide an answer, and distinguish implemented Stage 1 shell features from planned project features. Never imply demo content is live data or that unconfigured integrations work. Do not claim this app provides enterprise security, authentication, or production AI behavior.

Website context:
- Home (/): portfolio landing page and directory of ten projects; counts and content are demo/planning information.
- Overview (/overview): implementation roadmap: Stage 1 foundation, Stage 2 core interactions, Stage 3 integrations and release readiness.
- Projects (/projects): catalog of ten tools. All project routes render briefs, but project-specific features are still planned.
- Developer Analytics Dashboard (/projects/dev-analytics): intended to analyze public GitHub repo and contribution activity; no live GitHub integration yet.
- AI Document Assistant (/projects/document-assistant): planned PDF library and grounded document Q&A; not implemented.
- Personal Finance Insights (/projects/finance): planned CSV transaction analysis; no bank connection and no finance workflow implemented.
- CI/CD Pipeline Monitor (/projects/pipeline-monitor): planned GitHub Actions activity; not connected.
- API Workbench (/projects/api-workbench): planned HTTP request workspace; not implemented.
- Security Log Analyzer (/projects/security-analyzer): planned synthetic log analysis; not implemented.
- ML Experiment Tracker (/projects/ml-tracker): planned experiment comparison; not implemented.
- Real-Time Task Board (/projects/taskboard): planned Kanban collaboration; no real-time service.
- Developer Productivity CLI (/projects/dev-cli): planned CLI showcase; browser cannot run a visitor's local CLI.
- Codebase Architecture Visualizer (/projects/codebase-map): planned source dependency analysis.
- About (/about), Activity (/activity), Settings (/settings), Contact (/contact): sample profile/activity, local theme preference, and editable contact placeholders.
- Site assistant (/assistant): can run in local site-guide mode; real model answers need server-side OPENAI_API_KEY and OPENAI_MODEL configuration. Conversations are held in page memory only.
- Enterprise AI chatbot guide (/guides/enterprise-ai-chatbots): practical tutorial covering use-case design, data and access controls, retrieval, model/API layer, security, evaluation, rollout, and operations.
- Search opens from the top bar or Ctrl/Command+K. Theme changes are saved in the current browser. The sidebar collapses on desktop and becomes a drawer on mobile.`

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } })
}

function validatePayload(value: unknown): ChatMessage[] | null {
  if (!value || typeof value !== 'object' || !Array.isArray((value as { messages?: unknown }).messages)) return null
  const raw = (value as { messages: unknown[] }).messages
  if (raw.length < 1 || raw.length > MAX_MESSAGES) return null
  const messages: ChatMessage[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') return null
    const { role, content } = item as { role?: unknown; content?: unknown }
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null
    const trimmed = content.trim()
    if (!trimmed || trimmed.length > MAX_MESSAGE_LENGTH) return null
    messages.push({ role, content: trimmed })
  }
  if (messages.at(-1)?.role !== 'user') return null
  return messages
}

export async function handleChatRequest(request: Request, config: ChatConfig = {}) {
  if (request.method !== 'POST') return json({ error: 'Use POST to send a chat message.' }, 405)
  const origin = request.headers.get('origin')
  if (!origin || origin !== new URL(request.url).origin) return json({ error: 'Request origin is not allowed.' }, 403)
  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().includes('application/json')) return json({ error: 'Send a JSON request body.' }, 415)
  const declaredSize = Number(request.headers.get('content-length') ?? 0)
  if (declaredSize > MAX_BODY_BYTES) return json({ error: 'The chat request is too large.' }, 413)

  let payload: unknown
  try {
    const reader = request.body?.getReader()
    if (!reader) return json({ error: 'A JSON request body is required.' }, 400)
    const chunks: Uint8Array[] = []
    let totalBytes = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      totalBytes += value.byteLength
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel()
        return json({ error: 'The chat request is too large.' }, 413)
      }
      chunks.push(value)
    }
    const body = new Uint8Array(totalBytes)
    let offset = 0
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength }
    payload = JSON.parse(new TextDecoder().decode(body))
  } catch { return json({ error: 'The request body is not valid JSON.' }, 400) }
  const messages = validatePayload(payload)
  if (!messages) return json({ error: 'Provide 1–12 non-empty user/assistant messages, with the latest message from the user and each message under 2,000 characters.' }, 400)
  if (!isEnabled(config.enabled) || !config.apiKey || !config.model) return json({ error: 'Model chat is disabled or not configured. The site guide is still available.' }, 503)

  try {
    const providerResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { authorization: `Bearer ${config.apiKey}`, 'content-type': 'application/json' },
      signal: AbortSignal.timeout(20_000),
      body: JSON.stringify({
        model: config.model,
        instructions: SITE_INSTRUCTIONS,
        input: messages,
        max_output_tokens: MAX_OUTPUT_TOKENS,
        store: false,
      }),
    })
    if (!providerResponse.ok) return json({ error: 'The AI provider could not complete the request. Try again or use the site guide.' }, 502)
    const result = await providerResponse.json() as { output?: { type?: string; content?: { type?: string; text?: string }[] }[] }
    const answer = result.output?.flatMap((item) => item.type === 'message' ? item.content ?? [] : []).filter((item) => item.type === 'output_text').map((item) => item.text ?? '').join('\n').trim()
    if (!answer) return json({ error: 'The AI provider returned an empty answer. Try again or use the site guide.' }, 502)
    return json({ answer, mode: 'model' })
  } catch {
    return json({ error: 'The AI provider is temporarily unavailable. Try again or use the site guide.' }, 502)
  }
}

export function getChatStatus(config: ChatConfig = {}) {
  const configured = isEnabled(config.enabled) && Boolean(config.apiKey && config.model)
  return json({ configured, mode: configured ? 'model' : 'guide' })
}
