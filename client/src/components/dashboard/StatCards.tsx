import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, BarChart3, CheckCircle, Shield, TrendingDown, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  className?: string;
}

function StatCard({ title, value, description, icon, trend, className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center pt-1 space-x-1">
            {trend.value > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={`text-xs ${trend.value > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(trend.value)}% {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatsData {
  totalScans: number;
  safeScans: number;
  phishingScans: number;
  safePercentage: string;
  phishingPercentage: string;
  knownLegitimateUrls: number;
  knownPhishingUrls: number;
}

interface StatCardsProps {
  stats?: StatsData;
  isLoading: boolean;
}

export function StatCards({ stats, isLoading }: StatCardsProps) {
  if (isLoading) {
    return (
      <>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-[150px]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[100px] mb-2" />
            <Skeleton className="h-3 w-[170px]" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-[150px]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[100px] mb-2" />
            <Skeleton className="h-3 w-[170px]" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-[150px]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[100px] mb-2" />
            <Skeleton className="h-3 w-[170px]" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-[150px]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[100px] mb-2" />
            <Skeleton className="h-3 w-[170px]" />
          </CardContent>
        </Card>
      </>
    );
  }

  if (!stats) {
    return (
      <div className="col-span-4 py-10 text-center text-muted-foreground">
        Failed to load statistics. Please try refreshing the page.
      </div>
    );
  }

  return (
    <>
      <StatCard
        title="Total Scans"
        value={stats.totalScans}
        description="Total URLs analyzed"
        icon={<BarChart3 className="h-4 w-4" />}
      />
      <StatCard
        title="Safe URLs"
        value={stats.safeScans}
        description={`${stats.safePercentage} of all scans`}
        icon={<CheckCircle className="h-4 w-4" />}
        trend={stats.totalScans > 0 ? { value: 100 * stats.safeScans / stats.totalScans, label: "safe rate" } : undefined}
      />
      <StatCard
        title="Phishing URLs"
        value={stats.phishingScans}
        description={`${stats.phishingPercentage} of all scans`}
        icon={<AlertCircle className="h-4 w-4" />}
        trend={stats.totalScans > 0 ? { value: -100 * stats.phishingScans / stats.totalScans, label: "detection rate" } : undefined}
      />
      <StatCard
        title="Database Coverage"
        value={stats.knownLegitimateUrls + stats.knownPhishingUrls}
        description={`${stats.knownLegitimateUrls} safe + ${stats.knownPhishingUrls} phishing URLs`}
        icon={<Shield className="h-4 w-4" />}
      />
    </>
  );
}