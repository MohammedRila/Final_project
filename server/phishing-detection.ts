/**
 * Simple phishing detection module that analyzes URLs for potential phishing indicators
 */

interface AnalysisResult {
  isSafe: boolean;
  message: string;
  details?: {
    suspiciousPatterns?: string[];
    securityIndicators?: string[];
  };
}

/**
 * Analyzes a URL for phishing indicators
 * 
 * In a production environment, this would connect to more sophisticated
 * phishing detection services or databases, but for demonstration
 * this uses simple heuristics.
 */
export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  
  // Simple indicators for demonstration purposes
  const suspiciousPatterns: string[] = [];
  const securityIndicators: string[] = [];
  
  // Check if domain contains suspicious keywords
  const suspiciousKeywords = [
    'phishing', 'scam', 'login', 'sign-in', 'signin', 'account', 
    'verify', 'secure', 'security', 'update', 'confirm'
  ];
  
  // Look for suspicious patterns in the domain or path
  const domainAndPath = domain + urlObj.pathname;
  suspiciousKeywords.forEach(keyword => {
    if (domainAndPath.toLowerCase().includes(keyword)) {
      suspiciousPatterns.push(`Contains suspicious keyword: ${keyword}`);
    }
  });
  
  // Check if URL is using HTTPS
  if (urlObj.protocol === 'https:') {
    securityIndicators.push('Uses secure HTTPS connection');
  } else {
    suspiciousPatterns.push('Not using secure HTTPS connection');
  }
  
  // Check for suspicious TLDs
  const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz'];
  for (const tld of suspiciousTLDs) {
    if (domain.endsWith(tld)) {
      suspiciousPatterns.push(`Using potentially suspicious TLD: ${tld}`);
    }
  }
  
  // Check for domain typosquatting (very simple check)
  const popularDomains = [
    'google', 'facebook', 'amazon', 'apple', 'microsoft', 
    'netflix', 'paypal', 'instagram', 'twitter', 'linkedin'
  ];
  
  for (const popularDomain of popularDomains) {
    if (domain.includes(popularDomain) && !domain.endsWith(`.${popularDomain}.com`)) {
      suspiciousPatterns.push(`Potential typosquatting of: ${popularDomain}`);
    }
  }
  
  // Check for excessive subdomains
  const subdomains = domain.split('.');
  if (subdomains.length > 3) {
    suspiciousPatterns.push('Excessive number of subdomains');
  }
  
  // Check for IP address in URL
  const ipPattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
  if (ipPattern.test(domain)) {
    suspiciousPatterns.push('Uses IP address instead of domain name');
  }
  
  // Check if the URL contains too many special characters
  const specialChars = urlObj.pathname.replace(/[a-zA-Z0-9]/g, '');
  if (specialChars.length > 5) {
    suspiciousPatterns.push('Contains excessive special characters');
  }
  
  // Determine if URL is safe based on indicators
  const isSafe = suspiciousPatterns.length < 2;
  const message = isSafe ? 
    'This website appears to be legitimate and safe to visit.' : 
    'This website shows signs of being a phishing attempt.';
  
  return {
    isSafe,
    message,
    details: {
      suspiciousPatterns,
      securityIndicators
    }
  };
}
