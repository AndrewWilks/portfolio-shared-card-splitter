import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/transactions/$id/pay')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/transactions/$id/pay"!</div>
}
