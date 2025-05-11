import * as fs from 'fs';
import * as path from 'path';

interface AnalysisResult {
  isSafe: boolean;
  message: string;
  details?: {
    suspiciousPatterns?: string[];
    securityIndicators?: string[];
    score?: number;
  };
}

// Datasets for phishing and legitimate URLs
const phishingDataset = new Set<string>();
const legitimateDataset = new Set<string>();

/**
 * Initialize datasets for phishing and legitimate domains
 */
async function initializeDatasets() {
  try {
    // Paths to datasets
    const legitPath = path.join(process.cwd(), 'static/assets/legitimateurls.csv');
    const phishPath = path.join(process.cwd(), 'static/assets/phishurls.csv');

    // Load legitimate URLs
    if (fs.existsSync(legitPath)) {
      const legitData = await fs.promises.readFile(legitPath, 'utf8');
      legitData.split('\n').forEach((url) => {
        if (url.trim()) {
          legitimateDataset.add(url.trim());
        }
      });
    }

    // Load phishing URLs
    if (fs.existsSync(phishPath)) {
      const phishData = await fs.promises.readFile(phishPath, 'utf8');
      const lines = phishData.split('\n');
      const startIndex = lines[0].toLowerCase() === 'url' ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const url = lines[i].trim();
        if (url) {
          phishingDataset.add(url);
          try {
            phishingDataset.add(new URL(url).hostname);
          } catch {
            // Skip malformed URLs
          }
        }
      }
    }
  } catch (error) {
    console.error("Error initializing phishing datasets:", error);
  }
}

// Initialize datasets
initializeDatasets();

/**
 * Analyzes a URL for phishing indicators
 * @param url - The URL to analyze
 * @returns AnalysisResult with details about phishing indicators
 */
export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    const lowerDomainAndPath = (domain + urlObj.pathname).toLowerCase();

    // Direct match in legitimate dataset
    if (legitimateDataset.has(domain)) {
      return {
        isSafe: true,
        message: 'This website is recognized as legitimate and safe to visit.',
        details: {
          securityIndicators: ['Domain is in trusted websites database'],
          suspiciousPatterns: [],
          score: 100,
        },
      };
    }

    // Direct match in phishing dataset
    if (phishingDataset.has(domain)) {
      return {
        isSafe: false,
        message: 'This website is recognized as a known phishing site.',
        details: {
          suspiciousPatterns: ['Domain is in known phishing database'],
          securityIndicators: [],
          score: 0,
        },
      };
    }

    // Heuristic analysis
    const suspiciousPatterns: string[] = [];
    const securityIndicators: string[] = [];
    let phishingScore = 50; // Neutral score

    // Suspicious keywords
    const suspiciousKeywords = [
      'phishing', 'scam', 'login', 'sign-in', 'signin', 'account',
      'verify', 'secure', 'security', 'update', 'confirm', 'bank',
      'paypal', 'password', 'credential', 'wallet', 'bitcoin', 'crypto',
      'authenticate', 'verification', 'authorize', 'recover', 'reset',
    ];

    // Check for suspicious keywords
    suspiciousKeywords.forEach((keyword) => {
      if (lowerDomainAndPath.includes(keyword)) {
        suspiciousPatterns.push(`Contains suspicious keyword: ${keyword}`);
        phishingScore -= 5;
      }
    });

    // Check HTTPS usage
    if (urlObj.protocol === 'https:') {
      securityIndicators.push('Uses secure HTTPS connection');
      phishingScore += 10;
    } else {
      suspiciousPatterns.push('Not using secure HTTPS connection');
      phishingScore -= 15;
    }

    // Check suspicious TLDs
    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.club', '.live', '.site'];
    suspiciousTLDs.forEach((tld) => {
      if (domain.endsWith(tld)) {
        suspiciousPatterns.push(`Using potentially suspicious TLD: ${tld}`);
        phishingScore -= 7;
      }
    });

    // Check for domain typosquatting
    const popularDomains = [
      'google', 'facebook', 'amazon', 'apple', 'microsoft', 
      'netflix', 'paypal', 'instagram', 'twitter', 'linkedin',
      'youtube', 'outlook', 'gmail', 'yahoo', 'bank', 'chase', 
      'wellsfargo', 'citi', 'citibank', 'amex', 'americanexpress',
    ];
    popularDomains.forEach((popularDomain) => {
      if (domain.includes(popularDomain) &&
          !domain.endsWith(`.${popularDomain}.com`) &&
          domain !== `${popularDomain}.com`) {
        suspiciousPatterns.push(`Potential typosquatting of: ${popularDomain}`);
        phishingScore -= 15;
      }
    });

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

    // Check URL length
    if (url.length > 100) {
      suspiciousPatterns.push('Excessively long URL');
      phishingScore -= 10;
    }

    // Check domain randomness
    const domainWithoutTLD = domain.split('.')[0];
    if (calculateEntropy(domainWithoutTLD) > 4 && domainWithoutTLD.length > 10) {
      suspiciousPatterns.push('Random-looking domain name');
      phishingScore -= 15;
    }

    // Normalize phishing score
    phishingScore = Math.max(0, Math.min(100, phishingScore));

    // Determine safety
    const isSafe = phishingScore >= 50;
    const message = phishingScore >= 80
      ? 'This website appears to be legitimate and safe to visit.'
      : phishingScore >= 50
      ? 'This website seems legitimate but shows some minor suspicious indicators.'
      : phishingScore >= 30
      ? 'This website shows multiple signs of being a potential phishing attempt.'
      : 'This website shows strong indicators of being a phishing site.';

    return {
      isSafe,
      message,
      details: {
        suspiciousPatterns,
        securityIndicators,
        score: phishingScore,
      },
    };
  } catch (error) {
    console.error(`Error analyzing URL "${url}":`, error);
    return {
      isSafe: false,
      message: "Error analyzing URL. The URL may be malformed.",
      details: {
        suspiciousPatterns: ["Error parsing URL"],
        securityIndicators: [],
        score: 0,
      },
    };
  }
}

/**
 * Calculate the entropy (randomness) of a string
 * @param str - The string to calculate entropy for
 * @returns The entropy value
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