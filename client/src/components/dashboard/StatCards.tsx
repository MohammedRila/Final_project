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
    <div className={`bg-white rounded-lg shadow-sm border border-neutral-200 p-5 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-neutral-500">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-neutral-900">{value}</p>
            {trend && (
              <p className={`ml-2 text-xs font-medium ${trend.value >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
        </div>
        <div className="p-3 rounded-full bg-primary-50 text-primary-700">
          {icon}
        </div>
      </div>
    </div>
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
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-5">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total URL Scans"
        value={stats.totalScans}
        icon={<i className="fas fa-search text-lg"></i>}
      />
      <StatCard
        title="Safe URLs Detected"
        value={stats.safeScans}
        description={`${stats.safePercentage}% of total scans`}
        icon={<i className="fas fa-shield-alt text-lg"></i>}
        className="border-l-4 border-l-success-500"
      />
      <StatCard
        title="Phishing URLs Detected"
        value={stats.phishingScans}
        description={`${stats.phishingPercentage}% of total scans`}
        icon={<i className="fas fa-exclamation-triangle text-lg"></i>}
        className="border-l-4 border-l-danger-500"
      />
      <StatCard
        title="Total URLs in Database"
        value={stats.knownLegitimateUrls + stats.knownPhishingUrls}
        description={`${stats.knownLegitimateUrls} safe, ${stats.knownPhishingUrls} phishing`}
        icon={<i className="fas fa-database text-lg"></i>}
      />
    </div>
  );
}