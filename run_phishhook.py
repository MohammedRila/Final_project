#!/usr/bin/env python3
"""
PhishHook AI Application Launcher
---------------------------------
This script provides a simple way to run the PhishHook AI application.

It will:
1. Start the Node.js server (npm run dev)
2. Open the application in your default browser
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

# ANSI color codes for terminal output
class Colors:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_banner():
    """Print a banner for the application launcher"""
    banner = f"""
{Colors.BLUE}{Colors.BOLD}======================================================================
               PhishHook AI - Application Launcher               
======================================================================{Colors.ENDC}
    """
    print(banner)

def get_npm_command():
    """Determine the correct NPM command based on the platform"""
    return "npm.cmd" if platform.system() == "Windows" else "npm"

def run_application():
    """Main function to run the PhishHook AI application"""
    print_banner()
    
    project_dir = os.path.dirname(os.path.abspath(__file__))
    npm_cmd = get_npm_command()
    server_process = None
    
    try:
        # Start the development server
        print(f"{Colors.GREEN}Starting PhishHook AI server with command: '{npm_cmd} run dev'{Colors.ENDC}")
        print(f"{Colors.YELLOW}This will run both the backend API and frontend development server{Colors.ENDC}")
        server_process = subprocess.Popen(
            [npm_cmd, "run", "dev"],
            cwd=project_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        
        # Function to clean up server process on exit
        def cleanup():
            if server_process and server_process.poll() is None:
                print(f"\n{Colors.YELLOW}Shutting down server...{Colors.ENDC}")
                try:
                    # Try graceful termination first
                    if platform.system() == "Windows":
                        # On Windows
                        server_process.terminate()
                    else:
                        # On Unix systems
                        server_process.send_signal(signal.SIGINT)
                    
                    # Wait for process to terminate
                    for _ in range(50):  # Wait up to 5 seconds
                        if server_process.poll() is not None:
                            break
                        time.sleep(0.1)
                    
                    # Force kill if still running
                    if server_process.poll() is None:
                        print(f"{Colors.YELLOW}Server not responding to graceful shutdown, forcing termination...{Colors.ENDC}")
                        server_process.kill()
                        
                except Exception as e:
                    print(f"{Colors.RED}Error during shutdown: {e}{Colors.ENDC}")
                    
                print(f"{Colors.GREEN}Server shutdown complete.{Colors.ENDC}")
                
        # Register the cleanup function
        atexit.register(cleanup)
        
        # Wait for server to start
        print(f"{Colors.YELLOW}Waiting for server to start...{Colors.ENDC}")
        server_ready = False
        start_time = time.time()
        timeout = 60  # 60 seconds timeout
        
        while not server_ready and time.time() - start_time < timeout:
            if server_process.stdout is None:
                # Shouldn't happen, but let's be safe
                print(f"{Colors.RED}Error: stdout is not available{Colors.ENDC}")
                break
                
            output_line = server_process.stdout.readline()
            if not output_line:
                # Check if process is still running
                if server_process.poll() is not None:
                    print(f"{Colors.RED}Server process ended unexpectedly with code {server_process.returncode}{Colors.ENDC}")
                    break
                continue
                
            # Process the output line
            line = output_line.strip()
            print(line)
            
            # Check for indicators that server is ready
            startup_indicators = [
                "Node.js server running",
                "serving on port",
                "ready in",
                "ready on port"
            ]
            
            if any(indicator in line for indicator in startup_indicators):
                server_ready = True
                # Small delay to ensure server is fully ready
                time.sleep(1)
                
            time.sleep(0.05)
        
        if not server_ready:
            print(f"{Colors.RED}Server did not start within the expected time. Check for errors above.{Colors.ENDC}")
            sys.exit(1)
        
        # Server is ready, open browser
        port = 5000  # PhishHook AI runs on port 5000
        url = f"http://localhost:{port}"
        print(f"{Colors.GREEN}Server is running! Opening {url} in your browser...{Colors.ENDC}")
        webbrowser.open(url)
        
        print(f"{Colors.BLUE}{Colors.BOLD}PhishHook AI is now running!{Colors.ENDC}")
        print(f"{Colors.YELLOW}Press Ctrl+C to stop the server and exit{Colors.ENDC}")
        
        # Keep displaying server output until process ends or user interrupts
        while server_process.poll() is None:
            if server_process.stdout is None:
                break
                
            output_line = server_process.stdout.readline()
            if output_line:
                print(output_line.strip())
            
            time.sleep(0.05)
            
        # If we get here, process has ended
        exit_code = server_process.returncode or 0
        print(f"{Colors.RED}Server process has ended. Exit code: {exit_code}{Colors.ENDC}")
            
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Received keyboard interrupt. Shutting down...{Colors.ENDC}")
    except Exception as e:
        print(f"{Colors.RED}Error: {str(e)}{Colors.ENDC}")
    finally:
        # Will trigger the cleanup function registered with atexit
        pass

if __name__ == "__main__":
    run_application()