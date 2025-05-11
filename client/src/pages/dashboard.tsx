import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/container";
import { ScanHistoryTable } from "@/components/dashboard/ScanHistoryTable";
import { RealTimeMonitor } from "@/components/dashboard/RealTimeMonitor";
import { getQueryFn } from "@/lib/queryClient";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Bar } from "react-chartjs-2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  const [filteredScans, setFilteredScans] = useState<ScanHistoryItem[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [filter, setFilter] = useState({ status: "all", keyword: "" });
  const chartRef = useRef<HTMLDivElement>(null);

  // Query to get stats data
  const { data: stats } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Bar chart data
  const chartData = {
    labels: ["Safe Scans", "Phishing Scans"],
    datasets: [
      {
        label: "Scan Results",
        data: stats ? [stats.safeScans, stats.phishingScans] : [0, 0],
        backgroundColor: ["#4CAF50", "#F44336"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Scan Results Overview",
      },
    },
  };

  // Apply filters to scan history
  useEffect(() => {
    setFilteredScans(
      scanHistory.filter((item) => {
        const matchesStatus =
          filter.status === "all" ||
          (filter.status === "safe" && item.isSafe) ||
          (filter.status === "phishing" && !item.isSafe);
        const matchesKeyword = item.url.toLowerCase().includes(filter.keyword.toLowerCase());
        return matchesStatus && matchesKeyword;
      })
    );
  }, [filter, scanHistory]);

  // Connect to the WebSocket server when the component mounts
  useEffect(() => {
    let wsRetryTimeout: NodeJS.Timeout;
    let isComponentMounted = true;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 5;

    const connectWebSocket = () => {
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        toast.error("Maximum WebSocket reconnection attempts reached.");
        return;
      }

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      const newSocket = new WebSocket(wsUrl);

      newSocket.onopen = () => {
        if (!isComponentMounted) return;
        setWsConnected(true);
        reconnectAttempts = 0; // Reset counter on successful connection
        toast.success("WebSocket connected successfully!");
      };

      newSocket.onmessage = (event) => {
        if (!isComponentMounted) return;
        try {
          const data = JSON.parse(event.data);

          if (data.type === "new-scan" && data.data) {
            const scanData = data.data as ScanHistoryItem;
            setScanHistory((prevHistory) => [scanData, ...prevHistory]);
            toast.info("New scan result received!");
          } else if (data.type === "history" && Array.isArray(data.data)) {
            const historyData = data.data as ScanHistoryItem[];
            setScanHistory(historyData);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      newSocket.onclose = () => {
        if (!isComponentMounted) return;
        setWsConnected(false);
        reconnectAttempts += 1;

        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          const backoffTime = Math.min(
            3000 * Math.pow(1.5, reconnectAttempts - 1),
            10000
          );
          wsRetryTimeout = setTimeout(() => {
            if (isComponentMounted) {
              connectWebSocket();
            }
          }, backoffTime);
        } else {
          toast.error("Unable to reconnect to WebSocket server.");
        }
      };

      newSocket.onerror = () => {
        if (!isComponentMounted) return;
        setWsConnected(false);
      };

      setSocket(newSocket);
    };

    connectWebSocket();

    return () => {
      isComponentMounted = false;
      clearTimeout(wsRetryTimeout);

      if (socket && socket.readyState === WebSocket.OPEN) {
        try {
          socket.close();
        } catch (error) {
          console.error("Error closing WebSocket:", error);
        }
      }
    };
  }, []);

  // Function to export CSV
  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      filteredScans.map((item) => `${item.timestamp},${item.url},${item.isSafe ? "Safe" : "Phishing"}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "scan_history.csv");
    link.click();
  };

  // Function to generate and download the PDF report
  const handleDownloadReport = async () => {
    const doc = new jsPDF();

    // Add a title
    doc.setFontSize(18);
    doc.text("Dashboard Report", 10, 10);

    // Add some stats
    doc.setFontSize(12);
    if (stats) {
      doc.text(`Total Scans: ${stats.totalScans}`, 10, 20);
      doc.text(`Safe Scans: ${stats.safeScans}`, 10, 30);
      doc.text(`Phishing Scans: ${stats.phishingScans}`, 10, 40);
      doc.text(`Known Legitimate URLs: ${stats.knownLegitimateUrls}`, 10, 50);
      doc.text(`Known Phishing URLs: ${stats.knownPhishingUrls}`, 10, 60);
    } else {
      doc.text("Statistics are currently unavailable.", 10, 20);
    }

    // Add a timestamp
    const timestamp = new Date().toLocaleString();
    doc.text(`Generated on: ${timestamp}`, 10, 70);

    // Capture chart as an image
    if (chartRef.current) {
      const chartCanvas = chartRef.current.querySelector("canvas");
      if (chartCanvas) {
        const chartImage = await html2canvas(chartCanvas);
        const chartDataURL = chartImage.toDataURL("image/png");
        doc.addImage(chartDataURL, "PNG", 10, 80, 190, 90); // Positioned below the stats
      }
    }

    // Add scan history (up to the first 20 records for brevity)
    doc.addPage(); // Add a new page for scan history
    doc.setFontSize(14);
    doc.text("Scan History", 10, 10);

    if (filteredScans.length > 0) {
      doc.setFontSize(10);
      filteredScans.slice(0, 20).forEach((scan, index) => {
        const scanTime = new Date(scan.timestamp).toLocaleString();
        doc.text(
          `${index + 1}. URL: ${scan.url} | Status: ${scan.isSafe ? "Safe" : "Phishing"} | Time: ${scanTime}`,
          10,
          20 + index * 10
        );
      });
    } else {
      doc.setFontSize(12);
      doc.text("No scan history available.", 10, 20);
    }

    // Save the PDF
    doc.save("dashboard-report.pdf");
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | PhishHook AI</title>
      </Helmet>

      <Header />

      <Container className="py-8">
        {/* Filter and Search Section */}
        <div className="mb-4 flex space-x-4">
          <select
            className="border rounded-md p-2"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="all">All</option>
            <option value="safe">Safe Scans</option>
            <option value="phishing">Phishing Scans</option>
          </select>
          <input
            type="text"
            placeholder="Search by URL..."
            className="border rounded-md p-2"
            value={filter.keyword}
            onChange={(e) => setFilter({ ...filter, keyword: e.target.value })}
          />
          <button
            onClick={handleExportCSV}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={handleDownloadReport}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Download PDF
          </button>
        </div>

        {/* Chart Section */}
        <div ref={chartRef} className="mb-8">
          <Bar options={chartOptions} data={chartData} />
        </div>

        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-500 text-white p-4 rounded-md">
            <h3>Total Scans</h3>
            <p>{stats?.totalScans || 0}</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-md">
            <h3>Safe Scans</h3>
            <p>{stats?.safeScans || 0}</p>
          </div>
          <div className="bg-red-500 text-white p-4 rounded-md">
            <h3>Phishing Scans</h3>
            <p>{stats?.phishingScans || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <RealTimeMonitor scans={filteredScans} />
          <ScanHistoryTable scans={filteredScans} />
        </div>

        <ToastContainer />
      </Container>
    </>
  );
}