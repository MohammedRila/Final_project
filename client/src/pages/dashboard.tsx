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
    let wsRetryTimeout: NodeJS.Timeout;
    let isComponentMounted = true;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 5;

    // Global error handler specifically for WebSocket errors
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.error && event.error.toString().includes('WebSocket')) {
        // Prevent the default error behavior for WebSocket errors
        event.preventDefault();
        console.error("WebSocket error intercepted:", event.error);
        return true;
      }
      return false;
    };
    
    // Add global error handler
    window.addEventListener('error', handleGlobalError);

    const connectWebSocket = () => {
      try {
        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          console.log("Maximum reconnection attempts reached, stopped trying");
          return;
        }
        
        // Clear any existing socket
        if (socket) {
          try {
            socket.close();
          } catch (err) {
            // Ignore errors when closing existing socket
          }
        }
        
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        
        console.log(`Attempting to connect WebSocket to: ${wsUrl} (Attempt ${reconnectAttempts + 1})`);
        const newSocket = new WebSocket(wsUrl);

        newSocket.onopen = () => {
          if (!isComponentMounted) return;
          setWsConnected(true);
          reconnectAttempts = 0; // Reset counter on successful connection
          console.log("WebSocket connected successfully");
        };

        newSocket.onmessage = (event) => {
          if (!isComponentMounted) return;
          try {
            // Parse the message data
            const data = JSON.parse(event.data);
            
            // Check if it's a single scan or a batch
            if (data.type === 'new-scan' && data.data) {
              // It's a single new scan
              const scanData = data.data as ScanHistoryItem;
              setScanHistory(prevHistory => [scanData, ...prevHistory]);
            } else if (data.type === 'history' && Array.isArray(data.data)) {
              // It's a batch of history items
              const historyData = data.data as ScanHistoryItem[];
              setScanHistory(historyData);
            } else {
              // Direct scan data format (fallback for compatibility)
              const scanData = data as ScanHistoryItem;
              setScanHistory(prevHistory => [scanData, ...prevHistory]);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        newSocket.onclose = () => {
          if (!isComponentMounted) return;
          setWsConnected(false);
          reconnectAttempts += 1;
          console.log(`WebSocket disconnected, will retry in 3 seconds (Attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
          
          // Try to reconnect after 3 seconds, with backoff
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            const backoffTime = Math.min(3000 * Math.pow(1.5, reconnectAttempts - 1), 10000);
            wsRetryTimeout = setTimeout(() => {
              if (isComponentMounted) {
                console.log(`Attempting to reconnect WebSocket... (Attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
                connectWebSocket();
              }
            }, backoffTime);
          } else {
            console.log("Maximum reconnection attempts reached, stopped trying");
          }
        };

        newSocket.onerror = (error) => {
          if (!isComponentMounted) return;
          console.error("WebSocket error:", error);
          setWsConnected(false);
        };

        setSocket(newSocket);
      } catch (error) {
        console.error("Error establishing WebSocket connection:", error);
        if (isComponentMounted) {
          setWsConnected(false);
          // Try to reconnect after 3 seconds
          wsRetryTimeout = setTimeout(connectWebSocket, 3000);
        }
      }
    };

    // Initial connection
    connectWebSocket();

    // Clean up function
    return () => {
      isComponentMounted = false;
      clearTimeout(wsRetryTimeout);
      
      // Remove event listener
      window.removeEventListener('error', handleGlobalError);
      
      if (socket && socket.readyState === WebSocket.OPEN) {
        try {
          socket.close();
        } catch (error) {
          console.error("Error closing WebSocket:", error);
        }
      }
    };
  }, []);

  // Handle a new scan submission
  const handleScan = (scanResult: any) => {
    // Ensure timestamp is included
    const resultWithTimestamp = {
      ...scanResult,
      timestamp: scanResult.timestamp || Date.now()
    } as ScanHistoryItem;
    
    setScanHistory(prevHistory => [resultWithTimestamp, ...prevHistory]);
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