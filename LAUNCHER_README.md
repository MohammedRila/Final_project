# PhishHook AI - Application Launcher

This folder contains scripts to easily run the PhishHook AI application with a single command.

## Prerequisites

- Python 3.6 or higher
- Node.js and npm

## Running the Application

### Windows

1. Double-click on `run_app.bat` file
2. Or open a command prompt in this directory and run:
   ```
   python run_phishhook.py
   ```

### macOS/Linux

1. Open a terminal in this directory and run:
   ```
   ./run_app.sh
   ```
   
   If you get permission errors, run:
   ```
   chmod +x run_app.sh
   ```
   
2. Alternatively, run directly with Python:
   ```
   python3 run_phishhook.py
   ```

## What the Launcher Does

1. Checks if dependencies are installed, and installs them if needed
2. Starts the Node.js development server
3. Opens the application in your default web browser
4. Shows the server logs in the console
5. Provides a clean way to stop everything with Ctrl+C

## Troubleshooting

If you encounter any issues:

1. Make sure Node.js and npm are installed and in your PATH
2. Make sure Python is installed and in your PATH
3. Try running `npm install` manually in the project directory
4. Check if port 3000 is already in use by another application

## Using in VS Code

1. Open this project folder in VS Code
2. Open the terminal in VS Code
3. Run the appropriate command for your operating system (as listed above)
4. Alternatively, you can create a VS Code task to run the launcher

### VS Code Task Configuration

Add this to your `.vscode/tasks.json` file:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Run PhishHook AI",
      "type": "shell",
      "command": "python",
      "args": ["run_phishhook.py"],
      "isBackground": true,
      "problemMatcher": []
    }
  ]
}
```

Then press `Ctrl+Shift+P` and select "Tasks: Run Task" > "Run PhishHook AI"