import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pots/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/pots/new"!</div>
}
