import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/transactions/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/transactions/$id/edit"!</div>
}
