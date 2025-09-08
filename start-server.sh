#!/bin/bash

# Portfolio Server Management Script
# This script ensures proper port management and clean server startup

PORT=${1:-3000}  # Default port 3000, or use first argument
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Starting Portfolio Server..."
echo "📁 Project Directory: $PROJECT_DIR"
echo "🔌 Port: $PORT"

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    echo "🔍 Checking for processes on port $port..."
    
    # Find processes using the port
    local pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ ! -z "$pids" ]; then
        echo "⚠️  Found existing processes on port $port: $pids"
        echo "🛑 Stopping existing processes..."
        
        # Kill the processes
        echo $pids | xargs kill -9 2>/dev/null
        
        # Wait a moment for processes to terminate
        sleep 2
        
        # Verify they're gone
        local remaining=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$remaining" ]; then
            echo "❌ Failed to stop some processes. Trying force kill..."
            echo $remaining | xargs kill -9 2>/dev/null
            sleep 1
        fi
        
        echo "✅ Port $port is now free"
    else
        echo "✅ Port $port is available"
    fi
}

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1  # Port is in use
    else
        return 0  # Port is free
    fi
}

# Function to find next available port
find_available_port() {
    local start_port=$1
    local port=$start_port
    
    while ! check_port $port; do
        port=$((port + 1))
        if [ $port -gt $((start_port + 100)) ]; then
            echo "❌ Could not find available port starting from $start_port"
            exit 1
        fi
    done
    
    echo $port
}

# Main execution
echo "🔧 Setting up server..."

# Kill any existing processes on the target port
kill_port $PORT

# Check if port is still available
if ! check_port $PORT; then
    echo "⚠️  Port $PORT is still in use, finding alternative..."
    PORT=$(find_available_port $PORT)
    echo "🔄 Using port $PORT instead"
fi

# Change to project directory
cd "$PROJECT_DIR"

# Start the server
echo "🌟 Starting HTTP server on port $PORT..."
echo "📱 Access your portfolio at: http://localhost:$PORT"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the server with proper error handling
python3 -m http.server $PORT

# Handle server shutdown
echo ""
echo "🛑 Server stopped"
echo "🧹 Cleaning up..."

# Kill any remaining processes on this port
kill_port $PORT

echo "✅ Cleanup complete"
