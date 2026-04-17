import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface StatItem {
  label: string;
  value: string;
}

interface RefreshPageShellProps {
  title: string;
  subtitle: string;
  stats: StatItem[];
  sections: { title: string; description: string }[];
}

export function RefreshPageShell({ title, subtitle, stats, sections }: RefreshPageShellProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-text-primary">{title}</h1>
        <p className="text-text-secondary mt-2">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => (
          <Card key={item.label} variant="glass">
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wider text-text-muted">{item.label}</p>
              <p className="text-2xl font-bold text-text-primary mt-2">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Card key={section.title} variant="glass-dark">
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary">{section.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
