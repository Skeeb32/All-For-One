# Security policy

## Stage 1 scope

The project pages are static route briefs. The site assistant has a local guide mode and an optional server-side Responses API handler. It has no user authentication, database, file uploads, or enterprise document store. The theme preference is stored in the current browser's local storage. Search and the local assistant use a fixed in-memory site catalog.

The chat handler is disabled unless `OPENAI_CHAT_ENABLED=true` and both server-side provider settings are present. When enabled, it validates same-origin requests, JSON content type, body size, message roles/count/length, applies an output token cap, and does not store response state. It does not provide identity-based quotas or robust distributed rate limiting. A public model-backed deployment must add provider or edge quotas and budget alerts; add authentication when data or audience requires it. Never put credentials in `VITE_*` variables or browser bundles. The API Workbench must not become an unrestricted server-side proxy; the document assistant must not invent citations; finance demos must not request bank credentials.

## Reporting a vulnerability

Please do not include exploit details or sensitive data in a public issue. Contact the repository maintainer privately after the public repository URL and a security contact have been configured.
