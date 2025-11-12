import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/details/activity')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/details/activity"!</div>
}
