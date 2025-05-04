import type { Express } from "express";
import { createServer, type Server } from "http";
import { analyzeUrl } from "./phishing-detection";

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

      // Analyze the URL for phishing indicators
      const result = await analyzeUrl(url);
      
      return res.status(200).json({
        url,
        isSafe: result.isSafe,
        message: result.message
      });
    } catch (error) {
      console.error("Error scanning URL:", error);
      return res.status(500).json({ 
        message: "Error scanning URL" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
