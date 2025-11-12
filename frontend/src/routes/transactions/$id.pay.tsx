import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/transactions/$id/pay')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/transactions/$id/pay"!</div>
}
