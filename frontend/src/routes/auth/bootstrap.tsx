import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/bootstrap')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/bootstrap"!</div>
}
