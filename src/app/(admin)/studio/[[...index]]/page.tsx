import StudioClient from './StudioClient'

export function generateStaticParams() {
  return [{ index: [] }];
}

export default function AdminPage() {
  return <StudioClient />
}
