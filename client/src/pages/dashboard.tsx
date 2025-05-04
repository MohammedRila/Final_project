import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from 'react-helmet';
import { Container } from "@/components/ui/container";
import { ScanHistoryTable } from "@/components/dashboard/ScanHistoryTable";
import { StatCards } from "@/components/dashboard/StatCards";
import { RealTimeMonitor } from "@/components/dashboard/RealTimeMonitor";
import { URLScanForm } from "@/components/home/URLScanForm";
import { getQueryFn } from "@/lib/queryClient";

interface ScanHistoryItem {
  timestamp: number;
  url: string;
  isSafe: boolean;
  message: string;
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

export default function Dashboard() {
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Query to get stats data
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Connect to the WebSocket server when the component mounts
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      setWsConnected(true);
      console.log("WebSocket connected");
    };

    newSocket.onmessage = (event) => {
      try {
        const scanData = JSON.parse(event.data) as ScanHistoryItem;
        setScanHistory(prevHistory => [scanData, ...prevHistory]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    newSocket.onclose = () => {
      setWsConnected(false);
      console.log("WebSocket disconnected");
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setWsConnected(false);
    };

    setSocket(newSocket);

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, []);

  // Handle a new scan submission
  const handleScan = (scanResult: ScanHistoryItem) => {
    setScanHistory(prevHistory => [scanResult, ...prevHistory]);
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | PhishHook AI</title>
      </Helmet>
      <Container className="py-8">
        <div className="mb-8">
          <URLScanForm onScanComplete={handleScan} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCards stats={stats as StatsData | undefined} isLoading={isLoading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <RealTimeMonitor scans={scanHistory} />
          <ScanHistoryTable scans={scanHistory} />
        </div>

        {!wsConnected && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-sm">
            <strong>Note:</strong> Real-time updates are not currently available. Some features may be limited.
          </div>
        )}
      </Container>
    </>
  );
}