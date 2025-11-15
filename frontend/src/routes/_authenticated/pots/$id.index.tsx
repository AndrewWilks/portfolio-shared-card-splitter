import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/pots/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/pots/$id/"!</div>
}
