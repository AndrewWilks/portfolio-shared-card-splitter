import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/details/activity')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/details/activity"!</div>
}
