import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bot, Check, RotateCcw, Send, ShieldCheck, Sparkles } from 'lucide-react'
import { answerFromSiteGuide } from '../data/siteGuide'

type Message = { role: 'user' | 'assistant'; content: string; sources?: { title: string; to: string }[]; fallback?: boolean }

const suggestions = [
  'What projects are included?',
  'What works today and what is planned?',
  'How do I set up this project?',
  'How would I build an enterprise chatbot?',
]

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: 'Hi, I’m the All For One guide. Ask me about the project spaces, what’s implemented, how to get started, or the enterprise chatbot tutorial.\n\nI can answer from the site guide without a model connection.' }])
  const [input, setInput] = useState('')
  const [configured, setConfigured] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true
    fetch('/api/chat/status').then((response) => response.ok ? response.json() : null).then((status) => {
      if (active && status?.configured === true) setConfigured(true)
    }).catch(() => { if (active) setConfigured(false) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (typeof endRef.current?.scrollIntoView === 'function') {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages, sending])

  async function sendMessage(event?: FormEvent, suggestion?: string) {
    event?.preventDefault()
    const content = (suggestion ?? input).trim()
    if (!content || sending || content.length > 2000) return
    const nextMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(nextMessages)
    setInput('')
    setError('')
    if (!configured) {
      const answer = answerFromSiteGuide(content)
      setMessages([...nextMessages, { role: 'assistant', content: answer.answer, sources: answer.sources }])
      return
    }
    setSending(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.slice(-12).map(({ role, content: text }) => ({ role, content: text })) }),
      })
      const result = await response.json() as { answer?: string; error?: string }
      if (!response.ok || !result.answer) throw new Error(result.error ?? 'The AI response was unavailable.')
      setMessages([...nextMessages, { role: 'assistant', content: result.answer }])
    } catch (cause) {
      const answer = answerFromSiteGuide(content)
      setError('The model connection failed, so this reply uses the local site guide.')
      setMessages([...nextMessages, { role: 'assistant', content: answer.answer, sources: answer.sources, fallback: true }])
      if (cause instanceof Error && cause.message === 'Failed to fetch') setError('The model endpoint is unavailable. This reply uses the local site guide.')
    } finally {
      setSending(false)
    }
  }

  function resetChat() {
    setMessages([{ role: 'assistant', content: 'New conversation started. Ask me about the project spaces, current implementation, setup, or enterprise chatbot tutorial.' }])
    setInput('')
    setError('')
  }

  return <div className="content-page assistant-page">
    <div className="assistant-heading"><div><div className="eyebrow"><span className="eyebrow-mark" />YOUR WEBSITE GUIDE</div><h1>Ask your way around.</h1><p>Get a quick, grounded tour of the projects, roadmap, setup, and enterprise AI guide.</p></div><span className={`assistant-mode ${configured ? 'mode-connected' : ''}`}><i />{configured ? 'MODEL CONNECTED' : 'LOCAL SITE GUIDE'}</span></div>
    <div className="assistant-layout">
      <section className="chat-panel panel" aria-label="All For One assistant">
        <div className="chat-topbar"><div className="chat-identity"><span className="chat-avatar"><Bot size={17} /></span><span><strong>All For One guide</strong><small>{configured ? 'Model responses enabled · site context' : 'Guide mode · no model connection'}</small></span></div><button className="chat-reset" onClick={resetChat}><RotateCcw size={13} />New chat</button></div>
        <div className="chat-messages" role="log" aria-live="polite" aria-label="Conversation">
          <div className="chat-date">JUST FOR THIS VISIT</div>
          {messages.map((message, index) => <div className={`chat-message ${message.role === 'user' ? 'from-user' : 'from-assistant'}`} key={`${index}-${message.role}`}>
            {message.role === 'assistant' && <span className="message-avatar"><Sparkles size={13} /></span>}
            <div className="message-body"><div className="message-bubble">{message.content}</div>{message.sources?.length ? <div className="message-sources"><span>Site guide</span>{message.sources.map((source) => <Link key={`${index}-${source.to}`} to={source.to}>{source.title}<ArrowRight size={11} /></Link>)}</div> : null}{message.fallback && <span className="message-note">Local guide fallback</span>}</div>
          </div>)}
          {sending && <div className="chat-message from-assistant"><span className="message-avatar"><Sparkles size={13} /></span><div className="message-bubble typing-bubble"><i /><i /><i /><span>Checking the site context</span></div></div>}
          <div ref={endRef} />
        </div>
        {error && <div className="chat-error" role="status"><span>{error}</span></div>}
        {messages.length === 1 && <div className="suggestions"><span>TRY ASKING</span><div>{suggestions.map((suggestion) => <button key={suggestion} onClick={() => void sendMessage(undefined, suggestion)}>{suggestion}<ArrowRight size={12} /></button>)}</div></div>}
        <form className="chat-composer" onSubmit={(event) => void sendMessage(event)}>
          <label className="sr-only" htmlFor="assistant-question">Ask a question about All For One</label>
          <textarea id="assistant-question" value={input} maxLength={2000} rows={2} placeholder="Ask about a project, page, or the roadmap…" onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void sendMessage() } }} />
          <div className="composer-footer"><span><ShieldCheck size={12} />Avoid entering confidential information</span><span className="composer-count">{input.length}/2000</span><button className="send-button" type="submit" aria-label="Send question" disabled={!input.trim() || sending || input.length > 2000}><Send size={15} /></button></div>
        </form>
      </section>
      <aside className="assistant-sidebar">
        <section className="panel assistant-info-card"><div className="assistant-info-icon"><Sparkles size={17} /></div><span className="detail-kicker">HONEST BY DESIGN</span><h2>Know what’s behind the answer.</h2><p>{configured ? 'Model answers use the site context and are generated on the configured server. They can still be wrong; check the linked pages.' : 'This local guide searches the site’s own project descriptions and setup notes. It is useful without credentials and does not pretend to be a connected model.'}</p><div className="assistant-mode-detail"><i />{configured ? 'Model + site context' : 'Rule-based site guide'}</div></section>
        <section className="panel assistant-topics"><div className="eyebrow"><span className="eyebrow-mark" />I CAN HELP WITH</div><Link to="/projects"><span className="topic-icon"><ArrowRight size={13} /></span><span><strong>Project directory</strong><small>Ten tools and their current status</small></span><ArrowRight size={13} /></Link><Link to="/overview"><span className="topic-icon"><Check size={13} /></span><span><strong>Roadmap</strong><small>What’s implemented and what’s next</small></span><ArrowRight size={13} /></Link><Link to="/guides/enterprise-ai-chatbots"><span className="topic-icon"><Bot size={13} /></span><span><strong>Enterprise AI guide</strong><small>Plan, secure, and evaluate a chatbot</small></span><ArrowRight size={13} /></Link></section>
        <div className="assistant-privacy"><ShieldCheck size={14} /><p>Messages stay in this page session. Model mode sends recent chat messages to the configured AI provider. Don’t share secrets or confidential company information.</p></div>
      </aside>
    </div>
  </div>
}
