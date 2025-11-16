import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/details/ledger')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/details/ledger"!</div>
}
