# Development Phases

## Phase 1: User Invitations + Nav Links
- Build user invitation system (backend + frontend)
  - Database schema for invitations
  - Invitation routes, service, repository
  - Invitation UI (create, send, accept)
- Add navigation links to existing nav
  - Desktop nav: links to dashboard/transactions/pots/accounts/members
  - Mobile nav: basic menu toggle
- **Goal**: Multi-user functionality + navigable app
- **Estimated**: 8-10 hours

## Phase 2: Notifications
- Database schema for notifications
- Notification CRUD (routes, service, repository)
- Notification UI components
- Notification preferences

## Phase 3: SSE (Real-time)
- SSE endpoint in Hono
- Event publishing service
- EventSource client in frontend
- Connect notifications to SSE stream
- Connection management/reconnection

## Notes
- Build UI primitives as needed (avoid premature abstraction)
- Focus: fast progress without bloat
- Let real features drive component requirements
