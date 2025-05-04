import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ScanHistoryItem {
  timestamp: number;
  url: string;
  isSafe: boolean;
  message: string;
}

interface ScanHistoryTableProps {
  scans: ScanHistoryItem[];
}

export function ScanHistoryTable({ scans }: ScanHistoryTableProps) {
  function formatTimestamp(timestamp: number) {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  function truncateUrl(url: string, maxLength = 50) {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Scan History</CardTitle>
        <CardDescription>
          Recent URL scans and their results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-36">Time</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="w-24 text-center">Status</TableHead>
                <TableHead className="w-[200px]">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No scan history available. Try scanning a URL.
                  </TableCell>
                </TableRow>
              ) : (
                scans.map((scan, index) => (
                  <TableRow key={scan.timestamp + index}>
                    <TableCell className="font-mono text-xs">
                      {formatTimestamp(scan.timestamp)}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate font-mono text-xs">
                      <a 
                        href={scan.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 hover:underline"
                        title={scan.url}
                      >
                        {truncateUrl(scan.url)}
                      </a>
                    </TableCell>
                    <TableCell className="text-center">
                      {scan.isSafe ? (
                        <Badge className="bg-green-500 hover:bg-green-600">Safe</Badge>
                      ) : (
                        <Badge variant="destructive">Suspicious</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {scan.message}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}