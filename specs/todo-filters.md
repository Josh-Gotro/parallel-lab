# Todo Filters Feature

Goal: Add client-side filtering UI and server endpoints for "completed", "active", and "all".

Requirements:
- Client: filter buttons, URL sync (?filter=active|completed|all)
- Server: GET /todos?filter=... returns filtered set
- Tests: minimal happy-path tests for each filter

Notes:
- Keep UI accessible (keyboard focus, aria-pressed on active filter)
- Keep server stateless, filter via query arg
