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
        {/* Title and Icon */}
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {/* Main Value */}
        <div className="text-2xl font-bold">{value}</div>
        {/* Optional Description */}
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {/* Optional Trend */}
        {trend && (
          <div className="flex items-center pt-1 space-x-1">
            {trend.value > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={`text-xs ${trend.value > 0 ? "text-green-500" : "text-red-500"}`}>
              {Math.abs(trend.value)}% {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatsData {
  totalScans: number; // Total number of scans performed
  safeScans: number; // Total number of safe URLs detected
  phishingScans: number; // Total number of phishing URLs detected
  safePercentage: string; // Percentage of safe scans
  phishingPercentage: string; // Percentage of phishing scans
  knownLegitimateUrls: number; // Known legitimate URLs in the database
  knownPhishingUrls: number; // Known phishing URLs in the database
}

interface StatCardsProps {
  stats?: StatsData; // Optional stats data
  isLoading: boolean; // Loading state
}

export function StatCards({ stats, isLoading }: StatCardsProps) {
  if (isLoading) {
    // Render skeletons while loading
    return (
      <>
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
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
        ))}
      </>
    );
  }

  if (!stats) {
    // Render error if stats are unavailable
    return (
      <div className="col-span-4 py-10 text-center text-muted-foreground">
        Failed to load statistics. Please try refreshing the page.
      </div>
    );
  }

  // Render stat cards
  return (
    <>
      {/* Total Scans */}
      <StatCard
        title="Total Scans"
        value={stats.totalScans}
        description="Total URLs analyzed"
        icon={<BarChart3 className="h-4 w-4" />}
      />
      {/* Safe URLs */}
      <StatCard
        title="Safe URLs"
        value={stats.safeScans}
        description={`${stats.safePercentage} of all scans`}
        icon={<CheckCircle className="h-4 w-4" />}
        trend={
          stats.totalScans > 0
            ? { value: (100 * stats.safeScans) / stats.totalScans, label: "safe rate" }
            : undefined
        }
      />
      {/* Phishing URLs */}
      <StatCard
        title="Phishing URLs"
        value={stats.phishingScans}
        description={`${stats.phishingPercentage} of all scans`}
        icon={<AlertCircle className="h-4 w-4" />}
        trend={
          stats.totalScans > 0
            ? { value: -(100 * stats.phishingScans) / stats.totalScans, label: "detection rate" }
            : undefined
        }
      />
      {/* Database Coverage */}
      <StatCard
        title="Database Coverage"
        value={stats.knownLegitimateUrls + stats.knownPhishingUrls}
        description={`${stats.knownLegitimateUrls} safe + ${stats.knownPhishingUrls} phishing URLs`}
        icon={<Shield className="h-4 w-4" />}
      />
    </>
  );
}