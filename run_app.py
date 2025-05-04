#!/usr/bin/env python3
"""
PhishHook AI Launcher
---------------------
This script provides a convenient way to run the PhishHook AI application.
It will:
1. Start the Node.js server
2. Open the application in a browser
3. Provide a clean way to stop everything with Ctrl+C
"""

import os
import sys
import subprocess
import webbrowser
import time
import platform
import signal
import atexit

# Colors for terminal output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_banner():
    """Print a fancy banner for the application launcher"""
    banner = f"""
{Colors.BLUE}{Colors.BOLD}╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║  {Colors.YELLOW}██████╗ ██╗  ██╗██╗███████╗██╗  ██╗██╗  ██╗ ██████╗  ██████╗ ██╗  ██╗{Colors.BLUE}  ║
║  {Colors.YELLOW}██╔══██╗██║  ██║██║██╔════╝██║  ██║██║  ██║██╔═══██╗██╔══██╗██║ ██╔╝{Colors.BLUE}  ║
║  {Colors.YELLOW}██████╔╝███████║██║███████╗███████║███████║██║   ██║██║  ██║█████╔╝ {Colors.BLUE}  ║
║  {Colors.YELLOW}██╔═══╝ ██╔══██║██║╚════██║██╔══██║██╔══██║██║   ██║██║  ██║██╔═██╗ {Colors.BLUE}  ║
║  {Colors.YELLOW}██║     ██║  ██║██║███████║██║  ██║██║  ██║╚██████╔╝██████╔╝██║  ██╗{Colors.BLUE}  ║
║  {Colors.YELLOW}╚═╝     ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝{Colors.BLUE}  ║
║                                                                   ║
║                 {Colors.GREEN}AI-Powered Phishing Detection Platform{Colors.BLUE}                ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝{Colors.ENDC}
"""
    print(banner)

def get_npm_command():
    """Determine the correct NPM command based on the platform"""
    if platform.system() == "Windows":
        return "npm.cmd"
    return "npm"

def run_application():
    """Main function to run the PhishHook AI application"""
    print_banner()
    
    project_dir = os.path.dirname(os.path.abspath(__file__))
    npm_cmd = get_npm_command()
    
    # Check if node_modules exists, if not, run npm install
    if not os.path.isdir(os.path.join(project_dir, "node_modules")):
        print(f"{Colors.YELLOW}Node modules not found. Running npm install...{Colors.ENDC}")
        try:
            subprocess.check_call([npm_cmd, "install"], cwd=project_dir)
            print(f"{Colors.GREEN}Dependencies installed successfully.{Colors.ENDC}")
        except subprocess.CalledProcessError:
            print(f"{Colors.RED}Failed to install dependencies. Please run 'npm install' manually.{Colors.ENDC}")
            sys.exit(1)
    
    # Start the development server
    try:
        print(f"{Colors.GREEN}Starting PhishHook AI server...{Colors.ENDC}")
        server_process = subprocess.Popen(
            [npm_cmd, "run", "dev"],
            cwd=project_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        
        # Register cleanup to ensure server is terminated on exit
        def cleanup():
            if server_process.poll() is None:
                print(f"\n{Colors.YELLOW}Shutting down server...{Colors.ENDC}")
                # Handle platform-specific termination
                if platform.system() == "Windows":
                    # On Windows, gracefully terminate the process
                    import ctypes
                    kernel32 = ctypes.WinDLL('kernel32')
                    kernel32.GenerateConsoleCtrlEvent(0, server_process.pid)
                else:
                    # On Unix systems, send SIGTERM
                    server_process.send_signal(signal.SIGTERM)
                server_process.wait(timeout=5)
                print(f"{Colors.GREEN}Server shutdown complete.{Colors.ENDC}")
                
        atexit.register(cleanup)
        
        # Wait for server to start
        print(f"{Colors.YELLOW}Waiting for server to start...{Colors.ENDC}")
        server_ready = False
        start_time = time.time()
        timeout = 60  # 60 seconds timeout
        
        while not server_ready and time.time() - start_time < timeout:
            line = server_process.stdout.readline()
            if line:
                print(line.strip())
                if "Node.js server running" in line or "ready in" in line:
                    server_ready = True
            time.sleep(0.1)
        
        if not server_ready:
            print(f"{Colors.RED}Server did not start within the expected time. Check for errors above.{Colors.ENDC}")
            sys.exit(1)
        
        # Open browser
        url = "http://localhost:5000"
        print(f"{Colors.GREEN}Server is running! Opening {url} in your browser...{Colors.ENDC}")
        webbrowser.open(url)
        
        print(f"{Colors.BLUE}{Colors.BOLD}PhishHook AI is now running!{Colors.ENDC}")
        print(f"{Colors.YELLOW}Press Ctrl+C to stop the server and exit{Colors.ENDC}")
        
        # Keep the script running and display server output
        while True:
            line = server_process.stdout.readline()
            if line:
                print(line.strip())
            else:
                # Check if the process is still running
                if server_process.poll() is not None:
                    print(f"{Colors.RED}Server process has ended. Exit code: {server_process.returncode}{Colors.ENDC}")
                    break
            time.sleep(0.1)
            
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Received keyboard interrupt. Shutting down...{Colors.ENDC}")
        sys.exit(0)

if __name__ == "__main__":
    run_application()