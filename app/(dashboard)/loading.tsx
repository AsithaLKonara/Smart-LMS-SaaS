import { Container } from '@/components/layout/Container';

export default function DashboardLoading() {
  return (
    <Container className="py-8 animate-pulse space-y-6">
      <div className="h-10 w-1/3 rounded-lg bg-white/10" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-40 rounded-xl bg-white/5" />
        <div className="h-40 rounded-xl bg-white/5" />
      </div>
      <div className="h-64 rounded-xl bg-white/5" />
    </Container>
  );
}
