# Development Phases

## Phase 1: Navigation & Sidebar ✅ (Completed)

- ✅ Shadcn sidebar implementation
  - Code-split sidebar components
  - Collapsible sidebar (icon mode)
  - Mobile responsive sidebar
  - `SidebarMenuContent` component for static content
- ✅ Dashboard sidebar with branding
  - FairShare logo/name
  - Navigation structure in place
  - User profile in footer
- ✅ Card switcher UI component
  - Dropdown menu with card selection
  - Card icon display (Visa/Mastercard/Amex)
  - Mock data in place
- **Status**: Navigation infrastructure complete

## Phase 2: Card Selection Feature (Current Phase)

- Backend: Card management system ✅
  - Card routes (GET /cards, POST /cards, GET /cards/:id, etc.) ✅
  - Card service layer ✅
  - Card repository (database operations) ✅
  - Connect to existing cards schema ✅
  - Onboarding endpoint (POST /api/v1/onboarding) ✅
  - User.hasOnboarded flag in database ✅
- Frontend: User First Card UX
  - Create onboarding wizard component (multi-step form)✅
    - Step 1: Welcome screen with explanation✅
    - Step 2: Card creation form (name, type, last4)✅
    - Step 3: Success/confirmation screen✅
  - Implement routing logic ✅
    - Add `/onboarding` route (public but authenticated) ✅
    - Create route guard to check `hasOnboarded` flag ✅
    - Redirect to `/onboarding` if `hasOnboarded === false` ✅
    - Skip onboarding if `hasOnboarded === true` ✅
  - Onboarding state management✅
    - Track current step in wizard (local state)✅
    - Validate each step before proceeding ✅
    - Handle form submission to create first card ✅
    - Call onboarding endpoint after card creation✅
  - Post-onboarding flow✅
    - Update user context with `hasOnboarded: true`✅
    - Redirect to dashboard after completion✅
    - Auto-select newly created card as active
    - Show success message/toast
- Frontend: Connect card switcher
  - Card service/API client
  - Fetch user's cards
  - Handle card selection state
  - Update routes with active cardId
  - Persist selected card (cookie/local storage)
- Dashboard card context
  - Pass active card to dashboard routes
  - Update `$cardId` param handling
- **Goal**: Fully functional card selection with backend integration
- **Estimated**: 4-6 hours

## Phase 3: User Invitations System

- Database schema for invitations
  - Invitations table (inviterId, inviteeEmail, cardId, status, token)
  - Invitation status enum (pending, accepted, rejected, expired)
- Backend invitation system
  - Invitation routes (POST, GET, PATCH)
  - Invitation service (create, send, accept, list)
  - Invitation repository
  - Email service integration (optional for now)
- Frontend invitation UI
  - Create invitation form/modal
  - Invitation list view
  - Accept invitation page
  - Add to onboarding wizard
  - Pending invitations indicator
- **Goal**: Multi-user card sharing
- **Estimated**: 6-8 hours

## Phase 4: Extended Navigation Links

- Add remaining navigation items
  - Transactions page + route
  - Pots page + route
  - Accounts page + route
  - Members page + route
- Update sidebar navigation
  - Add nav items with icons
  - Active state handling
  - Card context for all routes
- Mobile navigation improvements
  - Ensure all links work on mobile
  - Touch-friendly interactions
- **Goal**: Complete app navigation
- **Estimated**: 3-4 hours

## Phase 5: Notifications

- Database schema for notifications
- Notification CRUD (routes, service, repository)
- Notification UI components
- Notification preferences
- **Estimated**: 4-6 hours

## Phase 6: SSE (Real-time)

- SSE endpoint in Hono
- Event publishing service
- EventSource client in frontend
- Connect notifications to SSE stream
- Connection management/reconnection
- **Estimated**: 4-5 hours

## Notes

- Build UI primitives as needed (avoid premature abstraction)
- Focus: fast progress without bloat
- Let real features drive component requirements
- Each phase builds on the previous one

## App Flows

- **Bootstrap / Onboarding Flow:**
  1. User logs in/bootstraps → receives user object with `hasOnboarded` flag
  2. Check `user.hasOnboarded` in AuthContext/route guard
  3. If `false`, redirect to `/onboarding` route
  4. Show onboarding wizard (create first card / review invited card)
  5. On successful card creation / accepted of invited card, call
     `POST /api/v1/onboarding` to mark user as onboarded
  6. Redirect to dashboard with newly created card auto-selected
  7. Future logins skip onboarding if `hasOnboarded === true`
