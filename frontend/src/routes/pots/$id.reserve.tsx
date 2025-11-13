import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pots/$id/reserve')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/pots/$id/reserve"!</div>
}
