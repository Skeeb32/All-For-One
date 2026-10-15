import { useEffect, useMemo, useState } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  Activity, ArrowRight, ArrowUpRight, Bell, Check, ChevronDown,
  ChevronLeft, Command, Github, GitBranch, Menu, Moon, Search, Settings2,
  Sun, X,
} from 'lucide-react'
import { mainNavigation, personalNavigation, projectBySlug, projects } from './data/projects'

type Theme = 'dark' | 'light'

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('afo-theme') as Theme) || 'dark')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('afo-theme', theme)
  }, [theme])
  return { theme, toggle: () => setTheme((current) => current === 'dark' ? 'light' : 'dark') }
}

function App() {
  const { theme, toggle } = useTheme()
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('afo-sidebar') === 'collapsed')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => { setMobileOpen(false); setSearchOpen(false) }, [location.pathname])
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(true) }
      if (event.key === 'Escape') { setSearchOpen(false); setMobileOpen(false) }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const toggleSidebar = () => setCollapsed((current) => {
    localStorage.setItem('afo-sidebar', current ? 'expanded' : 'collapsed')
    return !current
  })

  const allNav = [...mainNavigation, ...projects.map((project) => ({ label: project.navTitle, to: `/projects/${project.slug}`, icon: project.icon })), ...personalNavigation]
  const pageTitle = location.pathname === '/' ? 'Home' : allNav.find((item) => item.to === location.pathname)?.label ?? 'Workspace'

  return <div className={`app-frame ${collapsed ? 'is-collapsed' : ''}`}>
    {mobileOpen && <button className="mobile-scrim visible" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`} aria-label="Main navigation">
      <div className="brand-row">
        <NavLink to="/" className="brand" aria-label="All For One home">
          <span className="brand-mark"><span /><span /><span /><span /></span>
          <span className="brand-name">all for one<span className="brand-period">.</span></span>
        </NavLink>
        <button className="icon-button sidebar-collapse" onClick={toggleSidebar} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}><ChevronLeft size={16} /></button>
        <button className="icon-button mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18} /></button>
      </div>
      <div className="workspace-switcher">
        <div className="workspace-avatar">A</div>
        <div className="workspace-copy"><strong>Personal workspace</strong><span>Free plan</span></div>
        <ChevronDown size={15} className="muted-icon" />
      </div>
      <nav className="side-nav">
        <NavSection label="Workspace" items={mainNavigation} />
        <NavSection label="Developer tools" items={projects.map((project) => ({ label: project.navTitle, to: `/projects/${project.slug}`, icon: project.icon }))} />
        <NavSection label="Personal" items={personalNavigation} />
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note"><span className="note-spark">✳</span><strong>Your command center</strong><p>One place for the tools you build and the work you care about.</p><NavLink to="/about">Meet the builder <ArrowRight size={13} /></NavLink></div>
        <button className="profile-switch" onClick={() => navigate('/about')}>
          <span className="profile-avatar">S</span><span className="profile-info"><strong>Your profile</strong><small>Personal workspace</small></span><Settings2 size={16} className="muted-icon" />
        </button>
      </div>
    </aside>

    <main className="main-column">
      <header className="topbar">
        <button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={19} /></button>
        <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{pageTitle}</strong></div>
        <div className="topbar-actions">
          <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search projects and pages"><Search size={15} /><span>Search anything...</span><kbd><Command size={11} /> K</kbd></button>
          <span className="topbar-divider" />
          <button className="icon-button" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
          <button className="icon-button notification-button" onClick={() => navigate('/activity')} aria-label="View activity"><Bell size={17} /><i /></button>
          <button className="top-avatar" onClick={() => navigate('/about')} aria-label="Open profile">S</button>
        </div>
      </header>
      <div className="page-content"><Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/settings" element={<SettingsPage theme={theme} onToggleTheme={toggle} />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes></div>
      <footer className="footer"><span>All For One <span className="brand-period">●</span> Stage 1 foundation</span><span>Made for curious minds <span className="footer-star">✳</span></span></footer>
    </main>
    {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} onNavigate={navigate} />}
  </div>
}

function NavSection({ label, items }: { label: string; items: { label: string; to: string; icon: typeof Activity }[] }) {
  return <section className="nav-section"><h2>{label}</h2>{items.map(({ label: itemLabel, to, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title={itemLabel}><Icon size={16} strokeWidth={1.8} /><span>{itemLabel}</span></NavLink>)}</section>
}

function Eyebrow({ children }: { children: React.ReactNode }) { return <div className="eyebrow"><span className="eyebrow-mark" />{children}</div> }

function HomePage() {
  const navigate = useNavigate()
  return <div className="home-page">
    <section className="hero-panel">
      <div className="hero-copy">
        <Eyebrow>PERSONAL DEVELOPER COMMAND CENTER</Eyebrow>
        <h1>Good software<br />starts with <em>curiosity.</em></h1>
        <p className="hero-description">A growing collection of thoughtful tools, experiments, and useful software — brought together in one place.</p>
        <div className="hero-actions"><button className="button button-primary" onClick={() => navigate('/projects')}>Explore the projects <ArrowRight size={16} /></button><button className="button button-secondary" onClick={() => navigate('/about')}>About the builder <ArrowUpRight size={15} /></button></div>
        <div className="hero-meta"><span className="live-dot" />A living portfolio <span className="meta-separator">·</span> Built one useful thing at a time</div>
      </div>
      <div className="hero-art" aria-label="Illustration of connected developer tools">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="orbit-node node-analytics"><Activity size={17} /></div><div className="orbit-node node-ai"><span>✳</span></div><div className="orbit-node node-code"><GitBranch size={16} /></div><div className="orbit-node node-board"><span className="mini-board"><i /><i /><i /></span></div>
        <div className="center-hub"><span className="hub-mark"><span /><span /><span /><span /></span><small>ONE WORKSPACE</small></div>
        <span className="art-caption caption-left">IDEAS → TOOLS</span><span className="art-caption caption-right">10 PROJECTS</span>
      </div>
      <div className="hero-index"><span>01</span><i /><span>04</span></div>
    </section>

    <section className="stats-row" aria-label="Workspace overview">
      <StatCard value="10" label="Projects in the workshop" icon={<GitBranch size={16} />} note="A little bit of everything" />
      <StatCard value="04" label="Areas of exploration" icon={<Activity size={16} />} note="Build · analyze · automate" />
      <StatCard value="01" label="Shared design system" icon={<Command size={16} />} note="One home for every tool" />
      <StatCard value="∞" label="Room to keep building" icon={<ArrowUpRight size={16} />} note="The best part is what’s next" />
    </section>

    <section className="projects-section" id="projects">
      <div className="section-heading"><div><Eyebrow>THE WORKSHOP</Eyebrow><h2>Ten ideas, one home.</h2><p>Each project explores a different corner of building software.</p></div><button className="text-button" onClick={() => navigate('/projects')}>View all projects <ArrowRight size={15} /></button></div>
      <div className="project-grid">{projects.map((project, i) => <ProjectCard key={project.slug} project={project} index={i} />)}</div>
    </section>

    <section className="home-bottom-grid">
      <div className="about-card panel"><Eyebrow>A NOTE FROM THE BUILDER</Eyebrow><h2>Software should<br />feel <em>considered.</em></h2><p>This space is a work in progress: a place to explore ideas in developer tooling, data, AI, and the small details that make software useful.</p><button className="text-button" onClick={() => navigate('/about')}>A little more about me <ArrowRight size={15} /></button></div>
      <div className="stack-card panel"><div className="stack-card-top"><div><Eyebrow>THE TOOLBOX</Eyebrow><h2>Tools of the trade</h2></div><span className="stack-orbit">✳</span></div><div className="skill-list">{['TypeScript', 'React', 'Python', 'PostgreSQL', 'Node.js', 'GitHub Actions', 'FastAPI', 'Data visualization'].map((skill, i) => <span className="skill-pill" key={skill}><i className={`skill-dot skill-${i % 4}`} />{skill}</span>)}</div><p className="demo-caption"><span className="demo-dot" />Editable skills overview · sample content</p></div>
    </section>
    <section className="github-strip"><div className="github-icon"><Github size={20} /></div><div><strong>Built in the open, one piece at a time.</strong><span>The source repository will be linked here when it’s published.</span></div><span className="github-status"><i />IN DEVELOPMENT</span></section>
  </div>
}

function StatCard({ value, label, icon, note }: { value: string; label: string; icon: React.ReactNode; note: string }) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><div className="stat-value">{value}</div><div className="stat-label">{label}</div><div className="stat-note">{note}</div></div>
}

function ProjectCard({ project, index }: { project: typeof projects[number]; index: number }) {
  const navigate = useNavigate()
  const Icon = project.icon
  return <article className={`project-card accent-${project.accent}`} onClick={() => navigate(`/projects/${project.slug}`)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') navigate(`/projects/${project.slug}`) }} tabIndex={0} role="link" aria-label={`Open ${project.title}`}>
    <div className="project-card-top"><div className="project-icon"><Icon size={19} strokeWidth={1.7} /></div><span className="project-number">{String(index + 1).padStart(2, '0')}</span></div>
    <div className="project-category">{project.category}</div><h3>{project.title}</h3><p>{project.description}</p>
    <div className="project-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
    <div className="project-card-footer"><span className="stage-chip"><i />Stage 1 · Shell</span><span className="launch-link">Explore <ArrowUpRight size={14} /></span></div>
  </article>
}

function ProjectsPage() {
  return <div className="content-page"><PageIntro eyebrow="THE WORKSHOP" title="All projects" description="Ten small worlds, sharing one thoughtful foundation. Each page has its own destination and its own work ahead." /><div className="project-grid projects-page-grid">{projects.map((project, i) => <ProjectCard key={project.slug} project={project} index={i} />)}</div></div>
}

function ProjectPage() {
  const { slug } = useParams()
  const project = slug ? projectBySlug[slug] : undefined
  if (!project) return <NotFound />
  const Icon = project.icon
  return <div className="content-page project-detail-page">
    <PageIntro eyebrow={`${String(projects.findIndex((item) => item.slug === slug) + 1).padStart(2, '0')} / 10  ·  ${project.category.toUpperCase()}`} title={project.title} description={project.description} />
    <div className={`project-overview-banner accent-${project.accent}`}><div className="detail-icon"><Icon size={25} /></div><div className="detail-copy"><span className="detail-kicker">PROJECT WORKSPACE</span><h2>A clear place to build this idea.</h2><p>This route is part of the Stage 1 foundation. The application shell, navigation, and project identity are in place; its working features are scheduled for a later implementation stage.</p></div><span className="detail-stage"><i />Stage 1 · Shell</span></div>
    <div className="detail-columns"><section className="panel detail-panel"><Eyebrow>PROJECT BRIEF</Eyebrow><h3>What this project explores</h3><p>{project.description}</p><div className="detail-list"><div><span>Purpose</span><strong>{project.category}</strong></div><div><span>Current state</span><strong>Application shell</strong></div><div><span>Data source</span><strong>Demo content only</strong></div><div><span>Next step</span><strong>Core interactions</strong></div></div></section><section className="panel detail-panel"><Eyebrow>PLANNED TOOLBOX</Eyebrow><h3>Designed to work with</h3><p>These technologies describe the intended direction, not connected services or shipped integrations.</p><div className="detail-stack">{project.stack.map((item) => <span className="skill-pill" key={item}>{item}</span>)}</div><div className="detail-callout"><span className="callout-dot" /><span>Integrations and credentials will be documented when that work is implemented.</span></div></section></div>
  </div>
}

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="page-intro"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{description}</p></div>
}

function OverviewPage() {
  return <div className="content-page"><PageIntro eyebrow="WORKSPACE OVERVIEW" title="A view of the whole workshop." description="A quick map of what’s here today and what’s coming next. All numbers below describe the project plan, not live account activity." /><section className="overview-metrics"><StatCard value="10" label="Project routes" icon={<GitBranch size={16} />} note="All routes available" /><StatCard value="00" label="Live integrations" icon={<Activity size={16} />} note="None configured yet" /><StatCard value="01" label="Shared shell" icon={<Command size={16} />} note="Theme, search, navigation" /></section><div className="panel roadmap-panel"><div className="panel-heading"><div><Eyebrow>IMPLEMENTATION ROADMAP</Eyebrow><h2>From foundation to working tools</h2></div><span className="roadmap-tag">STAGE 1 OF 3</span></div><div className="roadmap-steps"><RoadmapStep number="01" title="Foundation" description="Shared design system, responsive application shell, landing page, and all project routes." state="Current stage" active /><RoadmapStep number="02" title="Core interactions" description="Build each project’s real workflows one at a time, starting with Developer Analytics." state="Next" /><RoadmapStep number="03" title="Integrations & readiness" description="Connect external services where configured, then complete quality and release preparation." state="Planned" /></div></div></div>
}

function RoadmapStep({ number, title, description, state, active = false }: { number: string; title: string; description: string; state: string; active?: boolean }) {
  return <div className={`roadmap-step ${active ? 'active' : ''}`}><span className="roadmap-number">{number}</span><div className="roadmap-copy"><strong>{title}</strong><p>{description}</p></div><span className="roadmap-state">{active && <i />}{state}</span></div>
}

function AboutPage() {
  return <div className="content-page"><PageIntro eyebrow="ABOUT THE BUILDER" title="A little context." description="This portfolio is designed to make the work easy to explore and the details easy to update." /><div className="about-page-grid"><section className="panel about-profile"><div className="large-profile-avatar">S</div><div><span className="detail-kicker">DEVELOPER · BUILDER · CURIOUS PERSON</span><h2>Your name goes here.</h2><p>This profile is intentionally editable. Add a short introduction, a few things you care about, and the kind of work you want to do next.</p></div></section><section className="panel interest-panel"><Eyebrow>AREAS OF INTEREST</Eyebrow><h3>Things worth exploring</h3><div className="interest-list">{['Developer experience', 'Data and visualization', 'AI that helps people work', 'Reliable, well-crafted software'].map((item) => <span key={item}><Check size={14} />{item}</span>)}</div></section></div><div className="profile-note"><span className="demo-dot" />Profile text is sample content. Replace it with your own before publishing.</div></div>
}

function ActivityPage() {
  const activity = [{ date: 'Today', title: 'The workshop took shape', detail: 'Shared shell and route map established', tag: 'FOUNDATION' }, { date: 'Stage 1', title: 'Ten project spaces mapped', detail: 'Each project has a dedicated route and brief', tag: 'NAVIGATION' }, { date: 'Next up', title: 'Developer Analytics Dashboard', detail: 'First project to receive core interactions', tag: 'PLANNED' }]
  return <div className="content-page"><PageIntro eyebrow="BUILD LOG" title="A work in progress." description="A transparent view of the portfolio’s implementation, with planned work clearly labeled." /><div className="panel activity-panel"><div className="panel-heading"><div><Eyebrow>PROJECT ACTIVITY</Eyebrow><h2>Recent milestones</h2></div><span className="demo-label"><i />DEMO TIMELINE</span></div><div className="activity-timeline">{activity.map((item) => <div className="timeline-row" key={item.title}><span className="timeline-date">{item.date}</span><span className="timeline-line"><i /></span><div className="timeline-copy"><strong>{item.title}</strong><p>{item.detail}</p></div><span className="timeline-tag">{item.tag}</span></div>)}</div></div></div>
}

function SettingsPage({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  return <div className="content-page"><PageIntro eyebrow="PREFERENCES" title="Make yourself at home." description="A few workspace preferences. Changes to the appearance are saved on this device." /><div className="settings-list panel"><div className="settings-row"><div className="settings-symbol"><Sun size={17} /></div><div className="settings-copy"><strong>Color theme</strong><p>Choose a comfortable appearance for the workspace.</p></div><button className="setting-select" onClick={onToggleTheme}>{theme === 'dark' ? 'Dark' : 'Light'} <ChevronDown size={14} /></button></div><div className="settings-row"><div className="settings-symbol"><Search size={17} /></div><div className="settings-copy"><strong>Global search</strong><p>Find project pages from anywhere with ⌘ K or Ctrl K.</p></div><span className="setting-status"><Check size={13} />Available</span></div><div className="settings-row"><div className="settings-symbol"><GitBranch size={17} /></div><div className="settings-copy"><strong>Connected services</strong><p>No external services are connected in Stage 1.</p></div><span className="setting-status setting-demo">Not configured</span></div></div><div className="profile-note"><span className="demo-dot" />Your theme preference is stored locally in this browser.</div></div>
}

function ContactPage() {
  return <div className="content-page"><PageIntro eyebrow="SAY HELLO" title="Good work starts with a conversation." description="Add your preferred contact details and professional profile links here when you’re ready to share this portfolio." /><section className="contact-panel panel"><div className="contact-mark"><span className="brand-mark"><span /><span /><span /><span /></span></div><div><span className="detail-kicker">CONTACT DETAILS</span><h2>Your links, your way.</h2><p>Email, LinkedIn, and other professional links are intentionally left blank until you provide the right details.</p><div className="contact-chips"><span>Email · add your address</span><span>LinkedIn · add your profile</span><span>GitHub · repository pending</span></div></div></section></div>
}

function NotFound() {
  const navigate = useNavigate()
  return <div className="not-found panel"><span className="not-found-code">404</span><h1>This page hasn’t been mapped.</h1><p>Head back to the workshop and pick up where you left off.</p><button className="button button-primary" onClick={() => navigate('/')}>Back to home <ArrowRight size={15} /></button></div>
}

function SearchDialog({ onClose, onNavigate }: { onClose: () => void; onNavigate: (path: string) => void }) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => {
    const items = [
      { label: 'Home', detail: 'Workspace', to: '/', icon: Activity },
      { label: 'Overview', detail: 'Workspace', to: '/overview', icon: GitBranch },
      { label: 'All projects', detail: 'Workspace', to: '/projects', icon: GitBranch },
      ...projects.map((project) => ({ label: project.navTitle, detail: project.category, to: `/projects/${project.slug}`, icon: project.icon })),
      ...personalNavigation.map((page) => ({ label: page.label, detail: 'Personal', to: page.to, icon: page.icon })),
    ]
    return items.filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(query.toLowerCase().trim())).slice(0, 8)
  }, [query])
  return <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="search-dialog" role="dialog" aria-modal="true" aria-label="Search workspace"><div className="search-dialog-input"><Search size={18} /><input autoFocus placeholder="Search projects and pages..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>ESC</kbd></div><div className="search-results">{results.length ? results.map((item) => { const Icon = item.icon; return <button key={item.to} onClick={() => onNavigate(item.to)}><span className="search-result-icon"><Icon size={16} /></span><span className="search-result-copy"><strong>{item.label}</strong><small>{item.detail}</small></span><ArrowRight size={14} className="search-result-arrow" /></button> }) : <div className="search-empty">No pages match “{query}”.</div>}</div><div className="search-dialog-footer"><span><kbd>↑</kbd><kbd>↓</kbd> to browse</span><span><kbd>↵</kbd> to open</span><span>All For One search</span></div></section></div>
}

export default App
