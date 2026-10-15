import { projects } from './projects'

type GuideDocument = { title: string; body: string; to: string }

const guideDocuments: GuideDocument[] = [
  { title: 'Home and project catalog', to: '/', body: 'Home page with ten interactive project cards, project overview, skills, builder profile placeholder, activity and GitHub repository pending. All projects catalog.' },
  { title: 'Overview and roadmap', to: '/overview', body: 'Roadmap Stage 1 foundation is current. Stage 2 core interactions starts with Developer Analytics Dashboard. Stage 3 integrations and release readiness.' },
  ...projects.map((project) => ({ title: project.navTitle, to: `/projects/${project.slug}`, body: `${project.description} ${project.category} ${project.stack.join(' ')} Stage 1 shell only; features planned.` })),
  { title: 'About me', to: '/about', body: 'About the builder. Replace editable profile name and biography placeholders with real professional details.' },
  { title: 'Activity', to: '/activity', body: 'Activity page contains a labeled demo project timeline with implementation milestones.' },
  { title: 'Settings', to: '/settings', body: 'Settings page toggles dark and light theme. Theme preference is stored locally in this browser. Global search opens using Control K or Command K.' },
  { title: 'Contact', to: '/contact', body: 'Contact page has placeholders for email LinkedIn and GitHub. Add your own public contact information when ready.' },
  { title: 'Site assistant', to: '/assistant', body: 'Assistant page answers questions about website content. Local guide mode works without credentials. Model-backed responses require server-side OPENAI_API_KEY, OPENAI_MODEL, and OPENAI_CHAT_ENABLED=true; no secret belongs in browser code.' },
  { title: 'Enterprise AI chatbot guide', to: '/guides/enterprise-ai-chatbots', body: 'Tutorial about enterprise chatbot use cases, architecture, retrieval augmented generation, document access controls, security, evaluation, rollout, monitoring, and operations.' },
  { title: 'Project limitations and setup', to: '/', body: 'Vite React TypeScript static app. Install with npm install; run npm run dev; checks npm test, npm run lint, npm run build. There is no authentication, database, live GitHub data, or project-specific integration implemented yet.' },
]

const stopWords = new Set(['the', 'and', 'for', 'how', 'what', 'where', 'when', 'does', 'can', 'this', 'that', 'with', 'about', 'tell', 'show', 'are', 'you', 'your', 'from', 'page', 'pages', 'website', 'site', 'please', 'could', 'would', 'me', 'project', 'projects', 'its', 'is', 'it', 'today', 'work', 'works', 'working', 'do', 'does', 'include', 'included', 'available', 'here', 'explain', 'tell', 'give', 'information', 'details', 'manage'])

export function answerFromSiteGuide(query: string) {
  const normalized = query.trim().toLowerCase()
  const terms = normalized.split(/[^a-z0-9]+/).filter((term) => term.length > 1 && !stopWords.has(term))
  if (/all (the )?projects|list (the )?projects|how many projects|projects? (?:are )?(?:included|available|here)/.test(normalized)) {
    return {
      answer: `There are ${projects.length} project spaces:\n${projects.map((project, index) => `${index + 1}. ${project.navTitle}`).join('\n')}\n\nThey currently show Stage 1 route briefs. Their working features are planned for later stages.`,
      sources: [{ title: 'All projects', to: '/projects' }, { title: 'Roadmap', to: '/overview' }],
    }
  }
  if (/(what|which).*(implemented|works|working|planned|next)|what (?:is|has) implemented|what works today/.test(normalized)) {
    return {
      answer: 'The shared Stage 1 shell is implemented: responsive navigation, ten project routes, global search, saved dark/light theme, and the site guide with its enterprise chatbot tutorial. The project routes are briefs only; their project-specific tools and live integrations are planned next, starting with Developer Analytics Dashboard.',
      sources: [{ title: 'Overview and roadmap', to: '/overview' }, { title: 'All projects', to: '/projects' }],
    }
  }
  if (!terms.length) return { answer: 'Ask me about a project, the roadmap, setup, theme settings, contact placeholders, or the enterprise chatbot guide.', sources: [{ title: 'All projects', to: '/projects' }] }

  const ranked = guideDocuments.map((document) => {
    const words = new Set(`${document.title} ${document.body}`.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean))
    const titleWords = new Set(document.title.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean))
    const score = terms.reduce((sum, term) => {
      const matches = words.has(term) || (term.endsWith('s') && words.has(term.slice(0, -1)))
      return sum + (matches ? (titleWords.has(term) || (term.endsWith('s') && titleWords.has(term.slice(0, -1))) ? 3 : 1) : 0)
    }, 0)
    return { ...document, score }
  }).filter((document) => document.score > 0).sort((a, b) => b.score - a.score).slice(0, 3)

  if (!ranked.length) return { answer: 'I couldn’t find that in the site guide. I can answer questions about the ten project routes, the implementation roadmap, setup, theme and search, contact placeholders, or the enterprise AI tutorial.', sources: [{ title: 'All projects', to: '/projects' }, { title: 'Enterprise AI guide', to: '/guides/enterprise-ai-chatbots' }] }

  const lead = ranked[0]
  const details = lead.title === 'Project limitations and setup'
    ? 'This is the Stage 1 foundation. The ten project pages are route briefs; project-specific tools, live data, authentication, and database storage have not been implemented.'
    : `${lead.body}`
  const related = ranked.slice(1).map((item) => item.title)
  return {
    answer: related.length ? `${lead.title}: ${details}\n\nRelated pages: ${related.join(', ')}.` : `${lead.title}: ${details}`,
    sources: ranked.map(({ title, to }) => ({ title, to })),
  }
}
