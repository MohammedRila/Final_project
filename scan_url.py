#!/usr/bin/env python3
"""
PhishHook AI - CLI URL Scanner
------------------------------
This script allows you to scan URLs from the command line without
opening the full application UI.

Usage:
    python scan_url.py <url>
    python scan_url.py https://example.com
"""

import sys
import requests
import json
import time
from urllib.parse import urlparse

# ANSI color codes for terminal output
class Colors:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_banner():
    """Print a banner for the URL scanner"""
    banner = f"""
{Colors.BLUE}{Colors.BOLD}=============================================
       PhishHook AI - CLI URL Scanner       
============================================={Colors.ENDC}
    """
    print(banner)

def is_valid_url(url):
    """Check if a URL has a valid format"""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False

def scan_url(url):
    """Scan a URL using the PhishHook AI API"""
    if not is_valid_url(url):
        print(f"{Colors.RED}Error: Invalid URL format. Please include the protocol (http:// or https://){Colors.ENDC}")
        return False
    
    try:
        print(f"{Colors.YELLOW}Scanning URL: {url}{Colors.ENDC}")
        print(f"{Colors.YELLOW}Connecting to local PhishHook AI server...{Colors.ENDC}")
        
        # Connect to the local PhishHook AI API
        api_url = "http://localhost:5000/api/scan"
        response = requests.post(api_url, json={"url": url}, timeout=10)
        
        if response.status_code != 200:
            print(f"{Colors.RED}Error: API returned status code {response.status_code}{Colors.ENDC}")
            print(f"{Colors.YELLOW}Response: {response.text}{Colors.ENDC}")
            print(f"\n{Colors.YELLOW}Is the PhishHook AI server running? Start it with: python run_phishhook.py{Colors.ENDC}")
            return False
        
        # Parse the response
        try:
            result = response.json()
            return result
        except json.JSONDecodeError:
            print(f"{Colors.RED}Error: Failed to parse API response{Colors.ENDC}")
            return False
        
    except requests.exceptions.ConnectionError:
        print(f"{Colors.RED}Error: Failed to connect to PhishHook AI server{Colors.ENDC}")
        print(f"\n{Colors.YELLOW}Make sure the server is running. Start it with: python run_phishhook.py{Colors.ENDC}")
        return False
    except requests.exceptions.Timeout:
        print(f"{Colors.RED}Error: Request timed out{Colors.ENDC}")
        return False
    except Exception as e:
        print(f"{Colors.RED}Error: {str(e)}{Colors.ENDC}")
        return False

def display_result(result):
    """Display the scan result in a nice format"""
    if not result:
        return
    
    print("\n" + "="*50)
    print(f"{Colors.BOLD}Scan Result:{Colors.ENDC}")
    print("="*50)
    
    # Display the basic result
    if result.get("isSafe", False):
        print(f"{Colors.GREEN}VERDICT: SAFE - This URL appears to be legitimate{Colors.ENDC}")
    else:
        print(f"{Colors.RED}VERDICT: SUSPICIOUS - This URL may be a phishing attempt{Colors.ENDC}")
    
    # Display the message
    message = result.get("message", "No additional information available")
    print(f"\n{Colors.BOLD}Analysis:{Colors.ENDC}")
    print(f"{message}")
    
    # Display details if available
    if "details" in result:
        details = result["details"]
        
        if "suspiciousPatterns" in details and details["suspiciousPatterns"]:
            print(f"\n{Colors.BOLD}Suspicious Patterns Detected:{Colors.ENDC}")
            for pattern in details["suspiciousPatterns"]:
                print(f"- {pattern}")
        
        if "securityIndicators" in details and details["securityIndicators"]:
            print(f"\n{Colors.BOLD}Security Indicators:{Colors.ENDC}")
            for indicator in details["securityIndicators"]:
                print(f"- {indicator}")
        
        if "score" in details:
            score = details["score"]
            print(f"\n{Colors.BOLD}Trust Score:{Colors.ENDC} {score:.2f}/10")
    
    print("\n" + "="*50)
    print(f"Scanned at: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*50)

def main():
    """Main function to run the URL scanner"""
    print_banner()
    
    # Check command line arguments
    if len(sys.argv) < 2:
        print(f"Usage: python {sys.argv[0]} <url>")
        print(f"Example: python {sys.argv[0]} https://example.com")
        sys.exit(1)
    
    # Get the URL from command line arguments
    url = sys.argv[1]
    
    # Scan the URL
    result = scan_url(url)
    
    # Display the result
    if result:
        display_result(result)

if __name__ == "__main__":
    main()