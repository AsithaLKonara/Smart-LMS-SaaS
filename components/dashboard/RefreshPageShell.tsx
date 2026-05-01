import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

interface StatItem {
  label: string;
  value: string;
}

interface RefreshPageShellProps {
  title: string;
  subtitle: string;
  stats: StatItem[];
  sections?: { title: string; description: string }[];
}

export function RefreshPageShell({ title, subtitle, stats, sections = [] }: RefreshPageShellProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-bold text-text-primary tracking-tight">
            {title}
          </h1>
          <p className="text-text-secondary mt-2 max-w-xl">{subtitle}</p>
        </div>
        <div className="h-1 w-24 bg-gradient-to-r from-accent-purple to-accent-cyan rounded-full hidden md:block mb-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <Card 
            key={item.label} 
            variant="glass" 
            className="border-white/5 hover:border-white/20 transition-all duration-300"
          >
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-1">
                    {item.label}
                  </p>
                  <p className="text-3xl font-bold text-text-primary tracking-tighter">
                    {item.value}
                  </p>
                </div>
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10",
                  i % 2 === 0 ? "text-accent-purple" : "text-accent-cyan"
                )}>
                  {/* Generic icon logic or just a dot for now */}
                  <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card 
            key={section.title} 
            variant="glass-dark" 
            className="border-white/5 group hover:border-white/10 transition-all duration-500"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-xl group-hover:text-accent-purple transition-colors">
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary leading-relaxed">
                {section.description}
              </p>
              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-text-muted">Module Status: Active</span>
                <button className="text-xs font-semibold text-accent-purple hover:underline">
                  Configure &rarr;
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
