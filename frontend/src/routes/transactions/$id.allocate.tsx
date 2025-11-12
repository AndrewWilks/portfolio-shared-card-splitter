import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/transactions/$id/allocate')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/transactions/$id/allocate"!</div>
}
