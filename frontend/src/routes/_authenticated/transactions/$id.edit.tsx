import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/transactions/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/transactions/$id/edit"!</div>
}
