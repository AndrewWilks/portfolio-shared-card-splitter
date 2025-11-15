import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/card-accounts/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/card-accounts/$id/edit"!</div>
}
