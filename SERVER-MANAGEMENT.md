# Portfolio Server Management

This document explains how to properly manage the portfolio server with automatic port conflict resolution.

## 🚀 Quick Start

### Option 1: Simple Bash Script (Recommended)
```bash
# Start server on default port 3000
./start-server.sh

# Start server on specific port
./start-server.sh 8080
```

### Option 2: Advanced Node.js Manager
```bash
# Start server on default port 3000
npm start

# Start server on specific port
npm run dev

# Start server on port 8080
npm run serve
```

### Option 3: Direct Node.js
```bash
# Start server on default port 3000
node server-manager.js

# Start server on specific port
node server-manager.js 8080
```

## 🛠️ Server Management Features

### Automatic Port Management
- **Port Conflict Detection**: Automatically detects if a port is already in use
- **Process Cleanup**: Kills existing processes on the target port
- **Port Fallback**: Finds the next available port if the target port is busy
- **Graceful Shutdown**: Properly stops all server processes

### Available Commands

#### Start Server
```bash
# Default port 3000
./start-server.sh
npm start
node server-manager.js

# Custom port
./start-server.sh 8080
node server-manager.js 8080
```

#### Stop Server
```bash
# Stop all Python HTTP servers
npm run stop

# Clean stop (stops both Python and Node processes)
npm run clean

# Manual stop (Ctrl+C in terminal)
```

## 🔧 How It Works

### Port Conflict Resolution Process

1. **Check Target Port**: Verifies if the requested port is available
2. **Kill Existing Processes**: If port is busy, kills processes using that port
3. **Wait for Cleanup**: Waits 2 seconds for processes to fully terminate
4. **Verify Availability**: Double-checks that the port is now free
5. **Find Alternative**: If still busy, finds the next available port
6. **Start Server**: Launches the HTTP server on the available port

### Process Management

The server manager handles:
- **Python HTTP Server**: Main server process
- **Port Cleanup**: Automatic cleanup of conflicting processes
- **Graceful Shutdown**: Proper termination on Ctrl+C
- **Error Handling**: Robust error handling and recovery

## 📱 Access Your Portfolio

Once the server starts, you'll see:
```
🌟 Starting HTTP server on port 3000...
📱 Access your portfolio at: http://localhost:3000
🛑 Press Ctrl+C to stop the server
```

## 🐛 Troubleshooting

### Port Still in Use
If you get "Address already in use" errors:

1. **Use the server manager**:
   ```bash
   ./start-server.sh
   ```

2. **Manual cleanup**:
   ```bash
   # Find processes using port 3000
   lsof -ti:3000
   
   # Kill processes on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

3. **Use different port**:
   ```bash
   ./start-server.sh 8080
   ```

### Server Won't Start
1. **Check Python installation**:
   ```bash
   python3 --version
   ```

2. **Check Node.js installation**:
   ```bash
   node --version
   ```

3. **Check file permissions**:
   ```bash
   chmod +x start-server.sh
   chmod +x server-manager.js
   ```

## 🔄 Development Workflow

### Recommended Workflow
1. **Start development server**:
   ```bash
   ./start-server.sh
   ```

2. **Make changes** to your HTML, CSS, or JS files

3. **Refresh browser** to see changes (no restart needed)

4. **Stop server** when done:
   ```bash
   # Press Ctrl+C in terminal
   # Or run:
   npm run stop
   ```

### Multiple Projects
If you're working on multiple projects:

```bash
# Project 1 (portfolio)
cd /path/to/portfolio
./start-server.sh 3000

# Project 2 (another project)
cd /path/to/other-project
./start-server.sh 8080
```

## 📋 Server Management Commands Summary

| Command | Description |
|---------|-------------|
| `./start-server.sh` | Start server on port 3000 |
| `./start-server.sh 8080` | Start server on port 8080 |
| `npm start` | Start server (Node.js manager) |
| `npm run dev` | Start development server |
| `npm run serve` | Start server on port 8080 |
| `npm run stop` | Stop all Python HTTP servers |
| `npm run clean` | Clean stop all processes |
| `Ctrl+C` | Graceful shutdown |

## 🎯 Best Practices

1. **Always use the server manager** instead of direct `python3 -m http.server`
2. **Use Ctrl+C** to stop the server gracefully
3. **Check the console output** for port information
4. **Use different ports** for different projects
5. **Keep the server running** during development for live reload

## 🚨 Important Notes

- The server manager automatically handles port conflicts
- Always stop the server with Ctrl+C for clean shutdown
- The server serves files from the current directory
- Make sure you're in the portfolio directory when starting the server
- The server manager works on Linux, macOS, and Windows (with WSL)
