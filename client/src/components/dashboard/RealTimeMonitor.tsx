import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface ScanHistoryItem {
  timestamp: number;
  url: string;
  isSafe: boolean;
  message: string;
}

interface RealTimeMonitorProps {
  scans: ScanHistoryItem[];
}

export function RealTimeMonitor({ scans }: RealTimeMonitorProps) {
  const [recentScans, setRecentScans] = useState<ScanHistoryItem[]>([]);

  useEffect(() => {
    // Get the 10 most recent scans
    const sortedScans = [...scans]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
    setRecentScans(sortedScans);
  }, [scans]);

  function formatTime(timestamp: number) {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.warn(`Invalid timestamp: ${timestamp}`); // Log the problematic timestamp
        return "Invalid time";
      }
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(date);
    } catch (error) {
      console.error("Error formatting time:", error, "Timestamp:", timestamp);
      return "Error formatting time";
    }
  }

  function getDomainFromUrl(url: string) {
    try {
      if (!url || typeof url !== "string") throw new Error("Invalid URL");
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (error) {
      console.warn(`Failed to parse URL: ${url}`, error); // Log the problematic URL
      return "Invalid URL";
    }
  }

  return (
    <Card className="col-span-4 sm:col-span-2">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Real-Time Monitoring</CardTitle>
        <CardDescription>Live feed of URL scan activities</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          {recentScans.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Clock className="h-10 w-10 mb-2 text-muted-foreground/60" />
              <p>No recent scan activity.</p>
              <p className="text-sm">Scan a URL to see real-time results.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentScans.map((scan, index) => (
                <div
                  key={`${scan.url}-${scan.timestamp}-${index}`} // Improved key to use URL and timestamp
                  className="flex items-start space-x-3 p-3 rounded-md border animate-fadeIn"
                >
                  {scan.isSafe ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 space-y-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <p
                        className="font-medium truncate text-sm"
                        title={scan.url}
                      >
                        {getDomainFromUrl(scan.url)}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(scan.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {scan.message}
                    </p>
                    <div>
                      {scan.isSafe ? (
                        <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                          Safe
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          Suspicious
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}