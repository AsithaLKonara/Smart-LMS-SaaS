'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: '🏠' },
  { href: '/courses', label: 'Courses', icon: '📚' },
  { href: '/live', label: 'Live', icon: '📹' },
  { href: '/ai-chat', label: 'AI Chat', icon: '🤖' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-white/10">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                isActive
                  ? 'text-accent-cyan'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-cyan" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

