import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/card-accounts/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/card-accounts/new"!</div>
}
