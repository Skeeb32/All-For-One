# Security policy

## Stage 1 scope

The current application is a static client-side foundation. It has no authentication, server, database, uploads, external API requests, or authorization model. The theme preference is stored in the current browser's local storage. Search filters a fixed in-memory page catalog.

Do not treat a future integration as secure until it has a server-side design, input validation, access-control review, secret-management plan, and tests. Never put private credentials in `VITE_*` variables or browser bundles. The API Workbench must not become an unrestricted server-side proxy; the document assistant must not invent citations; finance demos must not request bank credentials.

## Reporting a vulnerability

Please do not include exploit details or sensitive data in a public issue. Contact the repository maintainer privately after the public repository URL and a security contact have been configured.
