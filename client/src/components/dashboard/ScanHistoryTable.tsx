import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
    return new Date(timestamp).toLocaleString();
  }

  function truncateUrl(url: string, maxLength = 50) {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  }

  if (scans.length === 0) {
    return (
      <div className="py-8 text-center text-neutral-500">
        <i className="fas fa-history text-2xl mb-3 opacity-30"></i>
        <p>No scan history available yet. Try scanning some URLs!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scans.map((scan, index) => (
            <TableRow key={index}>
              <TableCell className="whitespace-nowrap">
                {formatTimestamp(scan.timestamp)}
              </TableCell>
              <TableCell className="max-w-xs truncate" title={scan.url}>
                <a 
                  href={scan.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary-700 hover:underline"
                >
                  {truncateUrl(scan.url)}
                </a>
              </TableCell>
              <TableCell>
                {scan.isSafe ? (
                  <Badge variant="outline" className="bg-success-50 text-success-700 border-success-200">
                    <i className="fas fa-shield-alt mr-1"></i> Safe
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-danger-50 text-danger-700 border-danger-200">
                    <i className="fas fa-exclamation-triangle mr-1"></i> Suspicious
                  </Badge>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-neutral-600 max-w-xs truncate" title={scan.message}>
                {scan.message}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}