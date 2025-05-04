/**
 * Advanced phishing detection module that analyzes URLs for potential phishing indicators
 * using heuristics and known phishing patterns from the dataset
 */
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface AnalysisResult {
  isSafe: boolean;
  message: string;
  details?: {
    suspiciousPatterns?: string[];
    securityIndicators?: string[];
    score?: number;
  };
}

// Load phishing and legitimate domain patterns from our dataset
const phishingDataset = new Set<string>();
const legitimateDataset = new Set<string>();

// Load the datasets once at module initialization
function initializeDatasets() {
  try {
    // Load legitimate URLs
    const legitPath = path.join(process.cwd(), 'static/assets/legitimateurls.csv');
    if (fs.existsSync(legitPath)) {
      const legitData = fs.readFileSync(legitPath, 'utf8');
      legitData.split('\n').forEach(url => {
        if (url.trim()) {
          legitimateDataset.add(url.trim());
        }
      });
    }
    
    // Load phishing URLs
    const phishPath = path.join(process.cwd(), 'static/assets/phishurls.csv');
    if (fs.existsSync(phishPath)) {
      const phishData = fs.readFileSync(phishPath, 'utf8');
      // Skip the header if it exists
      const lines = phishData.split('\n');
      const startIndex = lines[0].toLowerCase() === 'url' ? 1 : 0;
      
      for (let i = startIndex; i < lines.length; i++) {
        const url = lines[i].trim();
        if (url) {
          phishingDataset.add(url);
          // Also add domain only version for better matching
          try {
            const urlObj = new URL(url);
            phishingDataset.add(urlObj.hostname);
          } catch (e) {
            // Skip malformed URLs
          }
        }
      }
    }
  } catch (error) {
    console.error("Error initializing phishing detection datasets:", error);
  }
}

// Initialize datasets
initializeDatasets();

/**
 * Analyzes a URL for phishing indicators using our dataset and heuristics
 */
export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // Check direct matches in our datasets
    if (legitimateDataset.has(domain)) {
      return {
        isSafe: true,
        message: 'This website is recognized as legitimate and safe to visit.',
        details: {
          securityIndicators: ['Domain is in trusted websites database'],
          suspiciousPatterns: [],
          score: 100
        }
      };
    }
    
    if (phishingDataset.has(domain) || phishingDataset.has(url)) {
      return {
        isSafe: false,
        message: 'This website is recognized as a known phishing site.',
        details: {
          suspiciousPatterns: ['Domain is in known phishing database'],
          securityIndicators: [],
          score: 0
        }
      };
    }
    
    // If not found directly in datasets, use heuristic analysis
    const suspiciousPatterns: string[] = [];
    const securityIndicators: string[] = [];
    let phishingScore = 50; // Start with neutral score
    
    // Enhanced suspicious keywords
    const suspiciousKeywords = [
      'phishing', 'scam', 'login', 'sign-in', 'signin', 'account', 
      'verify', 'secure', 'security', 'update', 'confirm', 'bank',
      'paypal', 'password', 'credential', 'wallet', 'bitcoin', 'crypto',
      'authenticate', 'verification', 'authorize', 'recover', 'reset'
    ];
    
    // Look for suspicious patterns in the domain or path
    const domainAndPath = domain + urlObj.pathname;
    const lowerDomainAndPath = domainAndPath.toLowerCase();
    
    suspiciousKeywords.forEach(keyword => {
      if (lowerDomainAndPath.includes(keyword)) {
        suspiciousPatterns.push(`Contains suspicious keyword: ${keyword}`);
        phishingScore -= 5;
      }
    });
    
    // Check for HTTPS - weigh more positively for security than before
    if (urlObj.protocol === 'https:') {
      securityIndicators.push('Uses secure HTTPS connection');
      phishingScore += 10;
    } else {
      suspiciousPatterns.push('Not using secure HTTPS connection');
      phishingScore -= 15;
    }
    
    // Check for suspicious TLDs
    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.club', '.live', '.site'];
    for (const tld of suspiciousTLDs) {
      if (domain.endsWith(tld)) {
        suspiciousPatterns.push(`Using potentially suspicious TLD: ${tld}`);
        phishingScore -= 7;
      }
    }
    
    // Check for domain typosquatting of popular sites
    const popularDomains = [
      'google', 'facebook', 'amazon', 'apple', 'microsoft', 
      'netflix', 'paypal', 'instagram', 'twitter', 'linkedin',
      'youtube', 'outlook', 'gmail', 'yahoo', 'bank', 'chase', 
      'wellsfargo', 'citi', 'citibank', 'amex', 'americanexpress'
    ];
    
    for (const popularDomain of popularDomains) {
      // Look for domains that include the name but aren't exactly the well-known domain
      if (domain.includes(popularDomain) && 
          !domain.endsWith(`.${popularDomain}.com`) && 
          domain !== `${popularDomain}.com`) {
        suspiciousPatterns.push(`Potential typosquatting of: ${popularDomain}`);
        phishingScore -= 15;
      }
    }
    
    // Check for excessive subdomains
    const subdomains = domain.split('.');
    if (subdomains.length > 3) {
      suspiciousPatterns.push('Excessive number of subdomains');
      phishingScore -= 10;
    }
    
    // Check for IP address in URL
    const ipPattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
    if (ipPattern.test(domain)) {
      suspiciousPatterns.push('Uses IP address instead of domain name');
      phishingScore -= 20;
    }
    
    // Check if the URL contains too many special characters
    const specialChars = urlObj.pathname.replace(/[a-zA-Z0-9]/g, '');
    if (specialChars.length > 5) {
      suspiciousPatterns.push('Contains excessive special characters');
      phishingScore -= 5;
    }
    
    // Check URL length - phishers often use very long URLs
    if (url.length > 100) {
      suspiciousPatterns.push('Excessively long URL');
      phishingScore -= 10;
    }
    
    // Check for random-looking domain names (high entropy)
    const domainWithoutTLD = domain.split('.')[0];
    if (calculateEntropy(domainWithoutTLD) > 4 && domainWithoutTLD.length > 10) {
      suspiciousPatterns.push('Random-looking domain name');
      phishingScore -= 15;
    }
    
    // Check for URL redirection in parameters
    const hasRedirectParams = url.includes('redirect=') || 
                            url.includes('url=') || 
                            url.includes('link=') ||
                            url.includes('goto=');
    if (hasRedirectParams) {
      suspiciousPatterns.push('Contains redirect parameters');
      phishingScore -= 10;
    }
    
    // Check for numerical characters in domain
    const numberOfDigits = (domain.match(/\d/g) || []).length;
    if (numberOfDigits > 3 && domainWithoutTLD.length < 15) {
      suspiciousPatterns.push('Unusual number of digits in domain');
      phishingScore -= 5;
    }
    
    // Normalize the score to a range of 0-100
    phishingScore = Math.max(0, Math.min(100, phishingScore));
    
    // Determine if URL is safe based on phishing score
    const isSafe = phishingScore >= 50;
    
    // Generate appropriate message based on the score
    let message = '';
    if (phishingScore >= 80) {
      message = 'This website appears to be legitimate and safe to visit.';
    } else if (phishingScore >= 50) {
      message = 'This website seems legitimate but shows some minor suspicious indicators.';
    } else if (phishingScore >= 30) {
      message = 'This website shows multiple signs of being a potential phishing attempt.';
    } else {
      message = 'This website shows strong indicators of being a phishing site.';
    }
    
    return {
      isSafe,
      message,
      details: {
        suspiciousPatterns,
        securityIndicators,
        score: phishingScore
      }
    };
  } catch (error) {
    console.error("Error analyzing URL:", error);
    return {
      isSafe: false,
      message: "Error analyzing URL. The URL may be malformed.",
      details: {
        suspiciousPatterns: ["Error parsing URL"],
        securityIndicators: [],
        score: 0
      }
    };
  }
}

/**
 * Calculate the entropy (randomness) of a string
 * Higher entropy means more random/unpredictable
 */
function calculateEntropy(str: string): number {
  const len = str.length;
  const charCounts: Record<string, number> = {};
  
  // Count character occurrences
  for (let i = 0; i < len; i++) {
    const char = str[i];
    charCounts[char] = (charCounts[char] || 0) + 1;
  }
  
  // Calculate entropy
  let entropy = 0;
  for (const char in charCounts) {
    const probability = charCounts[char] / len;
    entropy -= probability * Math.log2(probability);
  }
  
  return entropy;
}
