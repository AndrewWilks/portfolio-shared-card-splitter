import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pots/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/pots/$id/edit"!</div>
}
