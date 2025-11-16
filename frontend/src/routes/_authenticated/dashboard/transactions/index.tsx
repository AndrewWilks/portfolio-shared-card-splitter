import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/transactions/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/transactions/"!</div>
}
