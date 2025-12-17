import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-accent-cyan">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-text-primary">Page Not Found</h2>
        <p className="mt-2 text-text-secondary">
          The page you are looking for does not exist.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

