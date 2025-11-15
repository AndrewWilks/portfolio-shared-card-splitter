import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/transactions/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/transactions/new"!</div>
}
