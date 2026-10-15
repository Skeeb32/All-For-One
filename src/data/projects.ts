import {
  Activity, Bot, BriefcaseBusiness, GitBranch, FlaskConical, KanbanSquare,
  TerminalSquare, Network, ShieldCheck, WalletCards, Workflow,
} from 'lucide-react'

export const projects = [
  { slug: 'dev-analytics', title: 'Developer Analytics', navTitle: 'Developer Analytics Dashboard', description: 'A focused view of repository health, contribution patterns, and the work behind the code.', category: 'Analytics', stack: ['React', 'GitHub API', 'Charts'], status: 'Stage 1 · Shell', icon: Activity, accent: 'mint' },
  { slug: 'document-assistant', title: 'Document Assistant', navTitle: 'AI Document Assistant', description: 'Explore a document workspace designed for grounded answers and useful citations.', category: 'AI & knowledge', stack: ['React', 'Python', 'RAG'], status: 'Stage 1 · Shell', icon: Bot, accent: 'violet' },
  { slug: 'finance', title: 'Finance Insights', navTitle: 'Personal Finance Insights', description: 'A considered workspace for understanding spending, budgets, and monthly patterns.', category: 'Personal', stack: ['TypeScript', 'Postgres', 'Charts'], status: 'Stage 1 · Shell', icon: WalletCards, accent: 'blue' },
  { slug: 'pipeline-monitor', title: 'Pipeline Monitor', navTitle: 'CI/CD Pipeline Monitor', description: 'See build history, deployment health, and the workflow signals that matter.', category: 'DevOps', stack: ['GitHub Actions', 'REST', 'Docker'], status: 'Stage 1 · Shell', icon: Workflow, accent: 'amber' },
  { slug: 'api-workbench', title: 'API Workbench', navTitle: 'API Workbench', description: 'A clear space for composing requests, inspecting responses, and documenting APIs.', category: 'Developer tools', stack: ['TypeScript', 'OpenAPI', 'Node.js'], status: 'Stage 1 · Shell', icon: BriefcaseBusiness, accent: 'blue' },
  { slug: 'security-analyzer', title: 'Security Analyzer', navTitle: 'Security Log Analyzer', description: 'Surface suspicious patterns in application logs with explainable detection rules.', category: 'Security', stack: ['Python', 'FastAPI', 'SQLite'], status: 'Stage 1 · Shell', icon: ShieldCheck, accent: 'rose' },
  { slug: 'ml-tracker', title: 'ML Experiment Tracker', navTitle: 'ML Experiment Tracker', description: 'Compare experiment runs, parameters, metrics, and model notes in one place.', category: 'Machine learning', stack: ['Python', 'scikit-learn', 'Plotly'], status: 'Stage 1 · Shell', icon: FlaskConical, accent: 'violet' },
  { slug: 'taskboard', title: 'Task Board', navTitle: 'Real-Time Task Board', description: 'A collaborative board for turning shared plans into clear, trackable work.', category: 'Collaboration', stack: ['React', 'WebSockets', 'Postgres'], status: 'Stage 1 · Shell', icon: KanbanSquare, accent: 'mint' },
  { slug: 'dev-cli', title: 'Developer CLI', navTitle: 'Developer Productivity CLI', description: 'Small command-line helpers for project setup, repository health, and release notes.', category: 'Developer tools', stack: ['Python', 'Typer', 'Git'], status: 'Stage 1 · Shell', icon: TerminalSquare, accent: 'amber' },
  { slug: 'codebase-map', title: 'Codebase Map', navTitle: 'Codebase Architecture Visualizer', description: 'Make module relationships and dependency paths easier to understand at a glance.', category: 'Architecture', stack: ['TypeScript', 'AST', 'Graph'], status: 'Stage 1 · Shell', icon: Network, accent: 'blue' },
] as const

export const projectBySlug = Object.fromEntries(projects.map((project) => [project.slug, project]))

export const mainNavigation = [
  { label: 'Home', to: '/', icon: Activity },
  { label: 'Overview', to: '/overview', icon: BriefcaseBusiness },
  { label: 'All projects', to: '/projects', icon: GitBranch },
]

export const personalNavigation = [
  { label: 'About me', to: '/about', icon: BriefcaseBusiness },
  { label: 'Activity', to: '/activity', icon: Activity },
  { label: 'Settings', to: '/settings', icon: Workflow },
  { label: 'Contact', to: '/contact', icon: Bot },
]
