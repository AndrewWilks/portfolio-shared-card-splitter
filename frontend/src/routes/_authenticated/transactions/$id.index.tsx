import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/transactions/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/transactions/$id/"!</div>
}
