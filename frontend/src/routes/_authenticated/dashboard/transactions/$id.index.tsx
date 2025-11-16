import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/transactions/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/transactions/$id/"!</div>
}
