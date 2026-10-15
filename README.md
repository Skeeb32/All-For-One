# All For One

A developer portfolio and command center for ten small software projects. The first release establishes the shared interface: a responsive shell, project directory, global search, theme preference, and a dedicated route for each project.

> **Current scope:** Stage 1 foundation plus a site-aware assistant and enterprise chatbot tutorial. The ten project pages are route-ready briefs; their project-specific workflows and integrations are not implemented yet. All counts and activity shown in the interface are planning/demo content, not live GitHub data.

## Preview

Screenshots can be added under `docs/screenshots/` and linked here as the interface evolves. Capture the landing page in both themes, one project route, and the mobile navigation. Keep sample data visibly labeled and avoid using personal or secret information in screenshots.

## Included

- Responsive desktop sidebar and mobile navigation drawer.
- Home page with ten project cards and editable profile copy.
- Dedicated routes for every project, plus overview, about, activity, settings, and contact pages.
- Global page search (`Ctrl+K` or `⌘K`), keyboard dismiss, and destination filtering.
- Dark and light themes saved in the current browser.
- Site assistant with a transparent local guide mode and optional server-side OpenAI Responses API integration.
- Enterprise chatbot tutorial with current primary-source references, architecture, access-control, security, evaluation, and rollout guidance.
- Shared design tokens and reusable page/card/navigation components.
- Stage roadmap and clear labels for demo content and unconfigured integrations.

## Project routes

| Project | Route | Planned integration |
| --- | --- | --- |
| Developer Analytics Dashboard | `/projects/dev-analytics` | GitHub REST API |
| AI Document Assistant | `/projects/document-assistant` | PDF processing and an LLM provider |
| Personal Finance Insights | `/projects/finance` | CSV import and persistent storage |
| CI/CD Pipeline Monitor | `/projects/pipeline-monitor` | GitHub Actions API |
| API Workbench | `/projects/api-workbench` | Browser requests and OpenAPI |
| Security Log Analyzer | `/projects/security-analyzer` | Local sample logs and analysis service |
| ML Experiment Tracker | `/projects/ml-tracker` | Experiment store and model tooling |
| Real-Time Task Board | `/projects/taskboard` | Authenticated WebSocket service |
| Developer Productivity CLI | `/projects/dev-cli` | Runnable CLI source and safe browser demo |
| Codebase Architecture Visualizer | `/projects/codebase-map` | Supported-language parser |
| Site assistant | `/assistant` | Local guide; optional server-side OpenAI Responses API |
| Enterprise AI chatbot guide | `/guides/enterprise-ai-chatbots` | Published guidance with linked primary sources |

All routes render in Stage 1. Listed integrations are plans only; no credentials are required to run this foundation.

## Architecture

This is a Vite + React + TypeScript single-page application. React Router handles client-side routes. Shared navigation, the theme preference, search dialog, design tokens, and page framing live in the main application; project metadata lives in `src/data/projects.ts`. The assistant includes a local retrieval-style site guide and a validated server endpoint. The optional OpenAI integration runs only server-side; Vercel Edge handlers are in `api/`, and Vite exposes the same handler during local development. Project-specific features are intended to be implemented separately in their existing routes as the work advances.

```text
src/
  data/projects.ts    Project catalog and navigation metadata
  App.tsx             Shared shell, routes, landing page, route briefs
  pages/              Site assistant and enterprise tutorial
  server/chat.ts      Validated server-side model endpoint
  App.test.tsx        Route and interaction coverage
  styles.css          Theme tokens, components, and responsive layouts
  test/setup.ts       Test environment setup
```

## Requirements

- Node.js 20.19+ or 22.13+
- npm 10+

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local URL. The assistant works in **local site-guide mode** without credentials. To enable model-backed answers locally, copy `.env.example` to `.env.local`, then set `OPENAI_API_KEY`, `OPENAI_MODEL`, and `OPENAI_CHAT_ENABLED=true`. Restart Vite after changing the values. Never put the provider key in a `VITE_*` variable or browser code.

## Checks

```sh
npm test
npm run lint
npm run build
```

The test suite covers landing-page project cards, all ten project routes, global search filtering, the saved theme preference, the assistant's local guide, request validation, and tutorial content. It does not verify a live model call without configured credentials.

## Deployment

The production UI builds to the static `dist/` directory. For static hosting, configure SPA path fallback so direct visits to nested routes serve `index.html`; the assistant remains in local guide mode unless the host also serves the API routes. Vercel can deploy the `api/` Edge handlers alongside the Vite output. Add `OPENAI_API_KEY`, `OPENAI_MODEL`, and `OPENAI_CHAT_ENABLED=true` as server-side environment settings to enable model responses. The model endpoint is unauthenticated and has no distributed rate limiter; keep it disabled on a public deployment until provider/edge usage caps and abuse controls are configured.

For GitHub Pages under a repository subpath, configure Vite's `base` option for that path before deploying; GitHub Pages does not run these API handlers. Custom domains and deployment credentials are provider-specific and are not included.

## Configuration and limitations

- GitHub statistics and repository activity are not connected. No live GitHub claims are made.
- AI, finance, pipeline, API workbench, log analysis, ML, collaboration, CLI, and codebase parsing workflows remain future work.
- The public portfolio has no user authentication or conversation persistence. Model mode sends recent chat messages to the configured provider; review provider data controls and contractual terms for your use case.
- The chat endpoint is disabled by default and validates origin, body size, message count, roles, and message length when enabled. It is not a substitute for identity-based quotas or abuse protection. Before enabling a public model-backed deployment, add provider/deployment rate limits and usage budgets; add authentication if the audience or data requires it.
- Profile, contact, resume, and GitHub repository details are intentionally editable placeholders.
- External font files are loaded from Google Fonts; system sans-serif fallbacks are used if unavailable.

## Roadmap

1. **Foundation:** application shell, design system, landing page, responsive project routes. *(Current)*
2. **Assistant & guide:** site-aware guide mode, optional server-side model endpoint, researched enterprise tutorial. *(Implemented; provider credentials remain optional.)*
3. **Core project interactions:** implement one project at a time, starting with Developer Analytics Dashboard.
4. **Integrations and release readiness:** verify authorization and secret handling, add abuse controls, complete accessibility and responsive review, and document deployment specifics.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Bug reports should include the route, browser, viewport size, and steps to reproduce. Please keep demo data labeled and avoid implying an external integration is live unless it has been configured and verified.

## License

MIT. See [LICENSE](LICENSE).
