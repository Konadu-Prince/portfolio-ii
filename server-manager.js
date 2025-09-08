#!/usr/bin/env node

/**
 * Portfolio Server Manager
 * Advanced port management and server control
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

class PortfolioServerManager {
    constructor(port = 3000) {
        this.port = port;
        this.server = null;
        this.isRunning = false;
        this.projectDir = process.cwd();
    }

    // Check if a port is available
    async isPortAvailable(port) {
        return new Promise((resolve) => {
            const server = http.createServer();
            
            server.listen(port, () => {
                server.close(() => {
                    resolve(true);
                });
            });
            
            server.on('error', () => {
                resolve(false);
            });
        });
    }

    // Kill processes on a specific port
    async killPortProcesses(port) {
        return new Promise((resolve) => {
            const command = process.platform === 'win32' 
                ? `netstat -ano | findstr :${port}` 
                : `lsof -ti:${port}`;
            
            exec(command, (error, stdout) => {
                if (error || !stdout.trim()) {
                    resolve(true); // No processes found
                    return;
                }
                
                const pids = stdout.trim().split('\n').filter(pid => pid);
                if (pids.length === 0) {
                    resolve(true);
                    return;
                }
                
                console.log(`🔍 Found ${pids.length} process(es) on port ${port}`);
                console.log(`🛑 Stopping processes: ${pids.join(', ')}`);
                
                const killCommand = process.platform === 'win32'
                    ? `taskkill /F /PID ${pids.join(' /PID ')}`
                    : `kill -9 ${pids.join(' ')}`;
                
                exec(killCommand, (killError) => {
                    if (killError) {
                        console.log(`⚠️  Some processes may still be running`);
                    } else {
                        console.log(`✅ Successfully stopped processes on port ${port}`);
                    }
                    resolve(true);
                });
            });
        });
    }

    // Find next available port
    async findAvailablePort(startPort) {
        let port = startPort;
        const maxAttempts = 100;
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            if (await this.isPortAvailable(port)) {
                return port;
            }
            port++;
            attempts++;
        }
        
        throw new Error(`Could not find available port starting from ${startPort}`);
    }

    // Start the server
    async start() {
        try {
            console.log('🚀 Portfolio Server Manager Starting...');
            console.log(`📁 Project Directory: ${this.projectDir}`);
            console.log(`🔌 Target Port: ${this.port}`);
            
            // Kill any existing processes on the target port
            await this.killPortProcesses(this.port);
            
            // Wait a moment for processes to fully terminate
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Check if port is available
            if (!(await this.isPortAvailable(this.port))) {
                console.log(`⚠️  Port ${this.port} is still in use, finding alternative...`);
                this.port = await this.findAvailablePort(this.port);
                console.log(`🔄 Using port ${this.port} instead`);
            }
            
            // Start the HTTP server
            await this.startHTTPServer();
            
        } catch (error) {
            console.error('❌ Error starting server:', error.message);
            process.exit(1);
        }
    }

    // Start HTTP server using Python
    async startHTTPServer() {
        return new Promise((resolve, reject) => {
            console.log(`🌟 Starting HTTP server on port ${this.port}...`);
            console.log(`📱 Access your portfolio at: http://localhost:${this.port}`);
            console.log(`🛑 Press Ctrl+C to stop the server`);
            console.log('');
            
            // Start Python HTTP server
            const pythonServer = spawn('python3', ['-m', 'http.server', this.port.toString()], {
                cwd: this.projectDir,
                stdio: 'inherit'
            });
            
            this.server = pythonServer;
            this.isRunning = true;
            
            // Handle server process events
            pythonServer.on('error', (error) => {
                console.error('❌ Server error:', error.message);
                reject(error);
            });
            
            pythonServer.on('exit', (code) => {
                this.isRunning = false;
                if (code !== 0) {
                    console.log(`⚠️  Server exited with code ${code}`);
                }
            });
            
            // Handle graceful shutdown
            process.on('SIGINT', () => {
                console.log('\n🛑 Shutting down server...');
                this.stop();
            });
            
            process.on('SIGTERM', () => {
                console.log('\n🛑 Shutting down server...');
                this.stop();
            });
            
            resolve();
        });
    }

    // Stop the server
    async stop() {
        if (this.server && this.isRunning) {
            console.log('🛑 Stopping server...');
            this.server.kill('SIGTERM');
            
            // Wait for graceful shutdown
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Force kill if still running
            if (this.isRunning) {
                this.server.kill('SIGKILL');
            }
        }
        
        // Clean up any remaining processes on the port
        await this.killPortProcesses(this.port);
        
        console.log('✅ Server stopped and cleaned up');
        process.exit(0);
    }
}

// Main execution
async function main() {
    const port = process.argv[2] ? parseInt(process.argv[2]) : 3000;
    const serverManager = new PortfolioServerManager(port);
    
    try {
        await serverManager.start();
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = PortfolioServerManager;
