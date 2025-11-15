import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/card-accounts/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/card-accounts/"!</div>
}
