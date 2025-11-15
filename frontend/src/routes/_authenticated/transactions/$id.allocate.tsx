import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/transactions/$id/allocate')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/transactions/$id/allocate"!</div>
}
