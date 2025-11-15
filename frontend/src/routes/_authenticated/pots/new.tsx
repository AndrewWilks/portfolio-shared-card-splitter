import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/pots/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/pots/new"!</div>
}
