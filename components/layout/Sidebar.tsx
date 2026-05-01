'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Video,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Shield,
  Users,
  LucideIcon,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { RoleType } from '@prisma/client';

interface SidebarProps {
  userName?: string;
  userEmail?: string;
  role?: RoleType;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const getNavItems = (role?: RoleType): NavItem[] => {
  const common = [
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  if (role === 'INSTRUCTOR') {
    return [
      { href: '/instructor/dashboard', label: 'Instructor Home', icon: LayoutDashboard },
      { href: '/instructor/courses', label: 'My Courses', icon: BookOpen },
      { href: '/instructor/students', label: 'Students', icon: Users },
      { href: '/gradebook', label: 'Gradebook', icon: BookOpen },
      { href: '/calendar', label: 'Calendar', icon: Video },
      { href: '/messaging', label: 'Messaging', icon: MessageSquare },
      { href: '/assets', label: 'Asset Library', icon: BookOpen },
      { href: '/courses', label: 'Course Library', icon: BookOpen },
      ...common,
    ];
  }

  if (role === 'ADMIN' || role === 'TENANT_ADMIN' || role === 'SUPER_ADMIN') {
    return [
      { href: '/admin/dashboard', label: 'Site Admin', icon: Shield },
      { href: '/admin/audit', label: 'Audit Logs', icon: Shield },
      { href: '/admin/users', label: 'Users', icon: Users },
      { href: '/cohorts', label: 'Cohorts', icon: Users },
      { href: '/analytics', label: 'Analytics', icon: LayoutDashboard },
      { href: '/integrations', label: 'Integrations', icon: Settings },
      { href: '/security', label: 'Security', icon: Shield },
      { href: '/help', label: 'Help Center', icon: MessageSquare },
      { href: '/instructor/courses', label: 'Manage Courses', icon: BookOpen },
      { href: '/messaging', label: 'Messaging', icon: MessageSquare },
      { href: '/assets', label: 'Asset Library', icon: BookOpen },
      { href: '/billing', label: 'Billing', icon: Settings },
      ...common,
    ];
  }

  // Default: Student
  return [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/courses', label: 'Marketplace', icon: BookOpen },
    { href: '/live', label: 'Live Classes', icon: Video },
    { href: '/calendar', label: 'Calendar', icon: Video },
    { href: '/ai-chat', label: 'AI Tutor', icon: MessageSquare },
    { href: '/messaging', label: 'Messaging', icon: MessageSquare },
    { href: '/help', label: 'Help Center', icon: MessageSquare },
    ...common,
  ];
};

export function Sidebar({ userName, userEmail, role }: SidebarProps) {
  const pathname = usePathname();
  const navItems = getNavItems(role);

  return (
    <aside className="hidden md:flex flex-col w-[var(--width-sidebar)] bg-white/[0.01] backdrop-blur-xl saturate-[180%] border-r border-white/5 h-screen sticky top-0 z-40 overflow-hidden">
      <div className="p-6 h-[var(--height-topbar)] flex items-center border-b border-white/5 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-grad-primary flex items-center justify-center shadow-neon-purple transition-transform group-hover:scale-110">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-heading tracking-tight">
            Smart<span className="text-accent-cyan">LMS</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden',
                isActive
                  ? 'bg-accent-cyan/10 text-accent-cyan'
                  : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
              )}
            >
              <div className="flex items-center gap-3 z-10">
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-accent-cyan" : "text-text-muted group-hover:text-text-primary"
                )} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>

              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-accent-cyan"
                />
              )}

              <ChevronRight className={cn(
                "w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300",
                !isActive && "group-hover:opacity-40 group-hover:translate-x-0"
              )} />
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 gap-4 flex flex-col flex-shrink-0">
        <div className="px-4 py-3 rounded-2xl glass-dark border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center overflow-hidden">
            {userName ? (
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} alt={userName} />
            ) : (
              <User className="w-5 h-5 text-accent-purple" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-text-primary truncate">{userName || 'Unknown User'}</p>
            <p className="text-[10px] text-text-muted truncate capitalize">{role?.toLowerCase().replace('_', ' ') || 'Learner'}</p>
          </div>
        </div>

        <Button
          variant="glass"
          className="w-full justify-start text-text-muted hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20 group h-11"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="mr-3 w-4 h-4 group-hover:rotate-180 transition-transform" />
          <span className="text-sm font-medium">Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}
