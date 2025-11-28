import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  change: string;
  icon: LucideIcon;
  variant?: 'primary' | 'accent' | 'secondary' | 'destructive';
  'data-testid'?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  variant = 'primary',
  'data-testid': testId
}: MetricCardProps) {
  const iconColors = {
    primary: 'text-primary',
    accent: 'text-accent',
    secondary: 'text-secondary',
    destructive: 'text-destructive',
  };

  const changeColors = {
    primary: 'text-accent',
    accent: 'text-accent',
    secondary: 'text-muted-foreground',
    destructive: 'text-destructive',
  };

  const formatValue = (val: number | string) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card data-testid={testId}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold text-foreground" data-testid={`${testId}-value`}>
              {formatValue(value)}
            </p>
            <p className={`text-xs ${changeColors[variant]}`} data-testid={`${testId}-change`}>
              {change}
            </p>
          </div>
          <div className={`w-12 h-12 bg-${variant}/10 rounded-lg flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColors[variant]}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
