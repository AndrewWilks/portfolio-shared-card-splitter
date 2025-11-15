import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/members/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/members/$id"!</div>
}
