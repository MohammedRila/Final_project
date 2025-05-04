import { useEffect, useRef } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom on new updates
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [scans]);

  function formatTime(timestamp: number) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function getDomainFromUrl(url: string) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (error) {
      return url;
    }
  }

  if (scans.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-neutral-500">
        <div className="text-center">
          <i className="fas fa-radar text-2xl mb-3 opacity-30"></i>
          <p>Waiting for real-time activity</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-80 overflow-y-auto border border-neutral-200 rounded-md bg-neutral-50"
    >
      <div className="px-4 py-3 border-b border-neutral-200 bg-white">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-600">Real-Time Log</span>
          <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">Live</span>
        </div>
      </div>
      
      <div className="divide-y divide-neutral-100">
        {scans.map((scan, index) => (
          <div key={index} className="p-3 text-sm animate-fadeIn">
            <div className="flex items-start">
              <div className={`w-2 h-2 rounded-full mt-1.5 mr-2 ${scan.isSafe ? 'bg-success-500' : 'bg-danger-500'}`}></div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-800 truncate">
                    {getDomainFromUrl(scan.url)}
                  </span>
                  <span className="text-xs text-neutral-500 whitespace-nowrap ml-2">
                    {formatTime(scan.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 truncate mt-1" title={scan.message}>
                  {scan.isSafe ? 
                    <span className="text-success-700">✓ Safe - </span> : 
                    <span className="text-danger-700">⚠ Phishing - </span>
                  }
                  {scan.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}