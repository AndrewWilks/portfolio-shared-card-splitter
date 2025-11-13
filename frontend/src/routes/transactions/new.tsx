import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/transactions/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/transactions/new"!</div>
}
