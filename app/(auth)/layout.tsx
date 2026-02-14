import { Container } from '@/components/layout/Container';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center py-12 px-4">
      <Container className="w-full max-w-md">
        {children}
      </Container>
    </div>
  );
}

