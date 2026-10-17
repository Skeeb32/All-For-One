import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

function renderApp(path = '/') {
  return render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></MemoryRouter>)
}

describe('All For One Stage 1 shell', () => {
  it('shows the landing page and all ten project cards', () => {
    renderApp()
    expect(screen.getByRole('heading', { name: /good software/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /open .*$/i })).toHaveLength(10)
    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute('href', '#main-content')
    expect(document.getElementById('main-content')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view the public source repository/i })).toHaveAttribute('href', 'https://github.com/Skeeb32/All-For-One')
  })

  it('renders a dedicated project brief for every project route', () => {
    const paths = ['/projects/dev-analytics', '/projects/document-assistant', '/projects/finance', '/projects/pipeline-monitor', '/projects/api-workbench', '/projects/security-analyzer', '/projects/ml-tracker', '/projects/taskboard', '/projects/dev-cli', '/projects/codebase-map']
    for (const path of paths) {
      const { unmount } = renderApp(path)
      expect(screen.getByText('Demo content only')).toBeInTheDocument()
      expect(screen.getByText('Stage 1 · Shell')).toBeInTheDocument()
      unmount()
    }
  })

  it('opens global search with the keyboard shortcut and filters destinations', async () => {
    const user = userEvent.setup()
    renderApp()
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    const dialog = screen.getByRole('dialog', { name: /search workspace/i })
    const input = within(dialog).getByPlaceholderText(/search projects/i)
    await user.type(input, 'pipeline')
    expect(within(dialog).getByRole('button', { name: /ci\/cd pipeline monitor/i })).toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: /finance/i })).not.toBeInTheDocument()
  })

  it('switches and saves the appearance preference', async () => {
    const user = userEvent.setup()
    renderApp('/settings')
    await user.click(screen.getByRole('button', { name: /switch to light theme/i }))
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(localStorage.getItem('afo-theme')).toBe('light')
  })

  it('answers a site question in labeled local guide mode', async () => {
    const user = userEvent.setup()
    renderApp('/assistant')
    expect(await screen.findByText('LOCAL SITE GUIDE')).toBeInTheDocument()
    expect(document.title).toBe('Site assistant | All For One')
    await user.click(screen.getByRole('button', { name: /what projects are included/i }))
    const conversation = within(screen.getByRole('log'))
    expect(await conversation.findByText(/Developer Analytics Dashboard/)).toBeInTheDocument()
    expect(conversation.getByText(/Stage 1 route briefs/)).toBeInTheDocument()
  })

  it('renders the enterprise chatbot tutorial with linked primary sources', () => {
    renderApp('/guides/enterprise-ai-chatbots')
    expect(screen.getByRole('heading', { name: /build an ai chatbot/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /make identity part of the data path/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /owasp genai llm top 10 for 2026/i })).toHaveAttribute('href', 'https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/')
  })

  it('links the published repository from the contact page', () => {
    renderApp('/contact')
    expect(screen.getByRole('link', { name: /github · all for one/i })).toHaveAttribute('href', 'https://github.com/Skeeb32/All-For-One')
  })
})
