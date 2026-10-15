# All For One

A developer portfolio and command center for ten small software projects. The first release establishes the shared interface: a responsive shell, project directory, global search, theme preference, and a dedicated route for each project.

> **Current scope: Stage 1 foundation.** The project pages are route-ready briefs. Their feature workflows and external integrations are not implemented yet. All counts and activity shown in the interface are planning/demo content, not live GitHub data.

## Preview

Screenshots can be added under `docs/screenshots/` and linked here as the interface evolves. Capture the landing page in both themes, one project route, and the mobile navigation. Keep sample data visibly labeled and avoid using personal or secret information in screenshots.

## Included

- Responsive desktop sidebar and mobile navigation drawer.
- Home page with ten project cards and editable profile copy.
- Dedicated routes for every project, plus overview, about, activity, settings, and contact pages.
- Global page search (`Ctrl+K` or `⌘K`), keyboard dismiss, and destination filtering.
- Dark and light themes saved in the current browser.
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

All routes render in Stage 1. Listed integrations are plans only; no credentials are required to run this foundation.

## Architecture

This is a Vite + React + TypeScript single-page application. React Router handles client-side routes. Shared navigation, the theme preference, search dialog, design tokens, and page framing live in the main application; project metadata lives in `src/data/projects.ts`. Project-specific features are intended to be implemented separately in their existing routes as the work advances.

```text
src/
  data/projects.ts    Project catalog and navigation metadata
  App.tsx             Shared shell, routes, landing page, route briefs
  App.test.tsx        Stage 1 route and interaction coverage
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

Vite prints the local URL. No `.env` file or account credentials are needed for Stage 1. `.env.example` is reserved for documenting variables when integrations are added; do not put real secrets in source control or expose private API keys in browser code.

## Checks

```sh
npm test
npm run lint
npm run build
```

The test suite covers landing-page project cards, all ten project routes, global search filtering, and the saved theme preference. It does not claim to test integrations that do not exist yet.

## Deployment

The production output is the static `dist/` directory. Build with `npm run build`, then publish `dist/` to a static host such as GitHub Pages, Netlify, or Cloudflare Pages. Configure the host to serve `index.html` for unknown paths so direct visits and refreshes on nested routes work. This foundation does not need a server or database.

For GitHub Pages under a repository subpath, configure Vite's `base` option for that path before deploying. Custom domains and deployment credentials are provider-specific and are not included.

## Configuration and limitations

- GitHub statistics and repository activity are not connected. No live GitHub claims are made.
- AI, finance, pipeline, API workbench, log analysis, ML, collaboration, CLI, and codebase parsing workflows remain future work.
- There is no authentication, backend, or persistence beyond the browser's theme preference.
- Profile, contact, resume, and GitHub repository details are intentionally editable placeholders.
- External font files are loaded from Google Fonts; system sans-serif fallbacks are used if unavailable.

## Roadmap

1. **Foundation:** application shell, design system, landing page, responsive routes. *(Current)*
2. **Core interactions:** implement one project at a time, starting with Developer Analytics Dashboard.
3. **Integrations and release readiness:** configure providers, verify authorization and secret handling, complete accessibility and responsive review, and document deployment specifics.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Bug reports should include the route, browser, viewport size, and steps to reproduce. Please keep demo data labeled and avoid implying an external integration is live unless it has been configured and verified.

## License

MIT. See [LICENSE](LICENSE).
