import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScanHistoryTable } from "@/components/dashboard/ScanHistoryTable";
import { StatCards } from "@/components/dashboard/StatCards";
import { RealTimeMonitor } from "@/components/dashboard/RealTimeMonitor";

export default function Dashboard() {
  const [wsConnected, setWsConnected] = useState(false);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  
  // Fetch initial stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });
  
  // Websocket connection for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log("WebSocket connected");
      setWsConnected(true);
    };
    
    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setWsConnected(false);
      
      // Try to reconnect after a delay
      setTimeout(() => {
        // The useEffect cleanup will close the old socket
        // and this effect will run again to create a new one
      }, 3000);
    };
    
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle incoming messages based on type
        if (message.type === 'history') {
          setScanHistory(message.data);
        } else if (message.type === 'new-scan') {
          setScanHistory(prev => {
            const newHistory = [message.data, ...prev];
            return newHistory.slice(0, 100); // Keep at most 100 items
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      <main className="flex-grow py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-heading font-bold text-neutral-900">Dashboard</h1>
            <p className="text-neutral-600 mt-2">
              Monitor phishing detection activity and view real-time statistics
            </p>
          </div>
          
          {/* Connection status indicator */}
          <div className="mb-6">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${wsConnected ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${wsConnected ? 'bg-success-500' : 'bg-danger-500'}`}></div>
              <span>{wsConnected ? 'Connected to real-time updates' : 'Connecting to real-time updates...'}</span>
            </div>
          </div>
          
          {/* Stats cards */}
          <div className="mb-8">
            <StatCards stats={stats} isLoading={statsLoading} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Real-time monitor */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-5">
                <h2 className="text-xl font-heading font-semibold mb-4">Real-Time Activity</h2>
                <RealTimeMonitor scans={scanHistory.slice(0, 10)} />
              </div>
            </div>
            
            {/* Scan history table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-5">
                <h2 className="text-xl font-heading font-semibold mb-4">Recent Scan History</h2>
                <ScanHistoryTable scans={scanHistory} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}