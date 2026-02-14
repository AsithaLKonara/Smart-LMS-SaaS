'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

import { RoleType } from '@prisma/client';

interface SidebarProps {
  userName?: string;
  userEmail?: string;
  role?: RoleType;
}

const getNavItems = (role?: RoleType) => {
  const common = [
    { href: '/profile', label: 'Profile', icon: '👤' },
  ];

  if (role === 'INSTRUCTOR') {
    return [
      { href: '/instructor/dashboard', label: 'Instructor Home', icon: '📊' },
      { href: '/instructor/courses', label: 'My Courses', icon: '🛠️' },
      { href: '/instructor/students', label: 'Students', icon: '👥' },
      { href: '/courses', label: 'Course Library', icon: '📚' },
      ...common,
    ];
  }

  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    return [
      { href: '/admin/dashboard', label: 'Site Admin', icon: '🛡️' },
      { href: '/admin/users', label: 'Users', icon: '👥' },
      ...common,
    ];
  }

  // Default: Student
  return [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/courses', label: 'Courses', icon: '📚' },
    { href: '/live', label: 'Live Classes', icon: '📹' },
    { href: '/ai-chat', label: 'AI Chat', icon: '🤖' },
    ...common,
  ];
};

export function Sidebar({ userName, userEmail, role }: SidebarProps) {
  const pathname = usePathname();
  const navItems = getNavItems(role);

  return (
    <aside className="hidden md:flex flex-col w-64 bg-background-secondary border-r border-white/10 h-screen sticky top-0">
      <div className="p-6 border-b border-white/10">
        <Link href={role === 'INSTRUCTOR' ? '/instructor/dashboard' : (role === 'ADMIN' || role === 'SUPER_ADMIN') ? '/admin/dashboard' : '/dashboard'} className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gradient">Smart LMS</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                  : 'text-text-secondary hover:bg-background-card hover:text-text-primary'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        {userName && (
          <div className="mb-4">
            <p className="text-sm font-medium text-text-primary truncate">{userName}</p>
            {userEmail && (
              <p className="text-xs text-text-secondary truncate">{userEmail}</p>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start text-text-secondary hover:text-red-400"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <span className="mr-2">🚪</span>
          Sign Out
        </Button>
      </div>
    </aside>
  );
}

