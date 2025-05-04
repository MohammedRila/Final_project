import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { WebSocket } from "ws"; // Import without type prefix
import { analyzeUrl } from "./phishing-detection";
import * as fs from 'fs';
import * as path from 'path';

// Recent scans history for dashboard (in-memory data store)
interface ScanHistoryItem {
  timestamp: number;
  url: string;
  isSafe: boolean;
  message: string;
}

// Store last 100 scans in memory
const scanHistory: ScanHistoryItem[] = [];

// Load legitimate and phishing URLs for quick lookup
const legitimateUrls = new Set<string>();
const phishingUrls = new Set<string>();

// Load pre-identified URLs from files
function loadUrlDatabases() {
  try {
    const legitUrlsPath = path.join(process.cwd(), 'static/assets/legitimateurls.csv');
    const phishUrlsPath = path.join(process.cwd(), 'static/assets/phishurls.csv');
    
    // Check if files exist
    if (fs.existsSync(legitUrlsPath)) {
      const legitData = fs.readFileSync(legitUrlsPath, 'utf8');
      legitData.split('\n').forEach(url => {
        if (url.trim()) legitimateUrls.add(url.trim());
      });
      console.log(`Loaded ${legitimateUrls.size} legitimate URLs`);
    }
    
    if (fs.existsSync(phishUrlsPath)) {
      const phishData = fs.readFileSync(phishUrlsPath, 'utf8');
      // Skip header row if it exists
      const rows = phishData.split('\n');
      if (rows[0].toLowerCase() === 'url') {
        rows.slice(1).forEach(url => {
          if (url.trim()) phishingUrls.add(url.trim());
        });
      } else {
        rows.forEach(url => {
          if (url.trim()) phishingUrls.add(url.trim());
        });
      }
      console.log(`Loaded ${phishingUrls.size} phishing URLs`);
    }
  } catch (error) {
    console.error("Error loading URL databases:", error);
  }
}

// Try to load URL databases on startup
loadUrlDatabases();

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint for scanning URLs
  app.post("/api/scan", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ 
          message: "URL is required" 
        });
      }

      try {
        // Validate the URL format
        new URL(url);
      } catch (err) {
        return res.status(400).json({ 
          message: "Invalid URL format. Please include http:// or https://" 
        });
      }

      // Check if URL is in known databases first
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      let isSafe: boolean;
      let message: string;
      
      if (legitimateUrls.has(hostname)) {
        isSafe = true;
        message = "This website is recognized as legitimate and safe to visit.";
      } else if (phishingUrls.has(hostname) || phishingUrls.has(url)) {
        isSafe = false;
        message = "This website is recognized as a known phishing site.";
      } else {
        // If not in databases, analyze using heuristics
        const result = await analyzeUrl(url);
        isSafe = result.isSafe;
        message = result.message;
      }
      
      // Add to scan history
      const scanResult = {
        timestamp: Date.now(),
        url,
        isSafe,
        message
      };
      
      scanHistory.unshift(scanResult);
      if (scanHistory.length > 100) scanHistory.pop(); // Keep only most recent 100
      
      // Broadcast to all connected WebSocket clients
      broadcastScanResult(scanResult);
      
      return res.status(200).json({
        url,
        isSafe,
        message
      });
    } catch (error) {
      console.error("Error scanning URL:", error);
      return res.status(500).json({ 
        message: "Error scanning URL" 
      });
    }
  });
  
  // API endpoint to get scan history
  app.get("/api/scan-history", (req, res) => {
    return res.status(200).json({
      history: scanHistory
    });
  });
  
  // API endpoint to get stats
  app.get("/api/stats", (req, res) => {
    const totalScans = scanHistory.length;
    const safeScans = scanHistory.filter(scan => scan.isSafe).length;
    const phishingScans = totalScans - safeScans;
    
    const safePercentage = totalScans > 0 ? (safeScans / totalScans * 100).toFixed(1) : "0";
    const phishingPercentage = totalScans > 0 ? (phishingScans / totalScans * 100).toFixed(1) : "0";
    
    return res.status(200).json({
      totalScans,
      safeScans,
      phishingScans,
      safePercentage,
      phishingPercentage,
      knownLegitimateUrls: legitimateUrls.size,
      knownPhishingUrls: phishingUrls.size
    });
  });

  const httpServer = createServer(app);
  
  // Set up WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    // Send initial scan history on connection
    try {
      ws.send(JSON.stringify({
        type: 'history',
        data: scanHistory
      }));
    } catch (error) {
      console.error('Error sending initial history:', error);
    }
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'scan' && data.url) {
          try {
            new URL(data.url); // Validate URL
            const result = await analyzeUrl(data.url);
            
            const scanResult = {
              timestamp: Date.now(),
              url: data.url,
              isSafe: result.isSafe,
              message: result.message
            };
            
            // Add to history and broadcast
            scanHistory.unshift(scanResult);
            if (scanHistory.length > 100) scanHistory.pop();
            
            broadcastScanResult(scanResult);
            
            // Send response to this specific client
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'scan-result',
                data: scanResult
              }));
            }
          } catch (err) {
            // Send error to client
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'error',
                message: 'Invalid URL format'
              }));
            }
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });
  
  // Function to broadcast scan results to all connected clients
  function broadcastScanResult(scanResult: ScanHistoryItem) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'new-scan',
          data: scanResult
        }));
      }
    });
  }
  
  return httpServer;
}
