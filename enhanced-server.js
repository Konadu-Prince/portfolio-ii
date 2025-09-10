#!/usr/bin/env node

/**
 * Enhanced Portfolio Server with Analytics API
 * Includes analytics tracking and dashboard
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { spawn, exec } = require('child_process');
const { createAnalyticsMiddleware } = require('./analytics-api.js');

class EnhancedPortfolioServer {
    constructor(port = 3000) {
        this.port = port;
        this.server = null;
        this.isRunning = false;
        this.projectDir = process.cwd();
        this.analyticsMiddleware = createAnalyticsMiddleware();
        this.mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.pdf': 'application/pdf',
            '.txt': 'text/plain'
        };
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
                    resolve(true);
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

    // Get MIME type for file
    getMimeType(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        return this.mimeTypes[ext] || 'application/octet-stream';
    }

    // Serve static files
    serveStaticFile(filePath, res) {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
                return;
            }

            const mimeType = this.getMimeType(filePath);
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(data);
        });
    }

    // Serve analytics dashboard
    serveAnalyticsDashboard(res) {
        const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Analytics Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .header p {
            opacity: 0.9;
            font-size: 1.1rem;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 30px;
        }
        
        .stat-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 25px;
            text-align: center;
            border-left: 4px solid #667eea;
            transition: transform 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }
        
        .stat-label {
            color: #666;
            font-size: 1.1rem;
        }
        
        .section {
            padding: 30px;
            border-top: 1px solid #eee;
        }
        
        .section h2 {
            color: #333;
            margin-bottom: 20px;
            font-size: 1.8rem;
        }
        
        .recent-activity {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
        }
        
        .activity-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #eee;
        }
        
        .activity-item:last-child {
            border-bottom: none;
        }
        
        .activity-type {
            background: #667eea;
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .activity-details {
            flex: 1;
            margin: 0 15px;
            color: #666;
        }
        
        .activity-time {
            color: #999;
            font-size: 0.9rem;
        }
        
        .refresh-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            margin: 20px 0;
            transition: background 0.3s ease;
        }
        
        .refresh-btn:hover {
            background: #5a6fd8;
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        
        .error {
            background: #fee;
            color: #c33;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        
        @media (max-width: 768px) {
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .activity-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Portfolio Analytics</h1>
            <p>Real-time insights into your portfolio performance</p>
        </div>
        
        <div class="stats-grid" id="statsGrid">
            <div class="loading">Loading analytics data...</div>
        </div>
        
        <div class="section">
            <h2>📈 Recent Activity</h2>
            <button class="refresh-btn" onclick="loadAnalytics()">🔄 Refresh Data</button>
            <div id="recentActivity" class="recent-activity">
                <div class="loading">Loading recent activity...</div>
            </div>
        </div>
    </div>

    <script>
        async function loadAnalytics() {
            try {
                // Load stats
                const statsResponse = await fetch('/api/analytics?type=stats');
                const statsData = await statsResponse.json();
                
                // Load recent activity
                const activityResponse = await fetch('/api/analytics?type=recent&limit=20');
                const activityData = await activityResponse.json();
                
                displayStats(statsData.stats);
                displayRecentActivity(activityData);
                
            } catch (error) {
                console.error('Error loading analytics:', error);
                document.getElementById('statsGrid').innerHTML = '<div class="error">Failed to load analytics data</div>';
                document.getElementById('recentActivity').innerHTML = '<div class="error">Failed to load recent activity</div>';
            }
        }
        
        function displayStats(stats) {
            const statsGrid = document.getElementById('statsGrid');
            statsGrid.innerHTML = \`
                <div class="stat-card">
                    <div class="stat-number">\${stats.total_page_views || 0}</div>
                    <div class="stat-label">📄 Page Views</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">\${stats.total_resume_downloads || 0}</div>
                    <div class="stat-label">📥 Resume Downloads</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">\${stats.unique_sessions || 0}</div>
                    <div class="stat-label">👥 Unique Visitors</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">\${stats.total_form_submissions || 0}</div>
                    <div class="stat-label">📝 Form Submissions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">\${stats.total_external_clicks || 0}</div>
                    <div class="stat-label">🔗 External Clicks</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">\${stats.total_project_interactions || 0}</div>
                    <div class="stat-label">🎯 Project Interactions</div>
                </div>
            \`;
        }
        
        function displayRecentActivity(activities) {
            const activityContainer = document.getElementById('recentActivity');
            
            if (!activities || activities.length === 0) {
                activityContainer.innerHTML = '<div class="loading">No recent activity</div>';
                return;
            }
            
            const activityHTML = activities.map(activity => \`
                <div class="activity-item">
                    <div class="activity-type">\${getActivityTypeLabel(activity.type)}</div>
                    <div class="activity-details">\${activity.details}</div>
                    <div class="activity-time">\${formatTime(activity.timestamp)}</div>
                </div>
            \`).join('');
            
            activityContainer.innerHTML = activityHTML;
        }
        
        function getActivityTypeLabel(type) {
            const labels = {
                'page_view': '👁️ View',
                'resume_download': '📥 Download',
                'form_submission': '📝 Form',
                'external_link_click': '🔗 Link',
                'project_interaction': '🎯 Project'
            };
            return labels[type] || type;
        }
        
        function formatTime(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diff = now - date;
            
            if (diff < 60000) return 'Just now';
            if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
            if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
            return date.toLocaleDateString();
        }
        
        // Load analytics on page load
        document.addEventListener('DOMContentLoaded', loadAnalytics);
        
        // Auto-refresh every 30 seconds
        setInterval(loadAnalytics, 30000);
    </script>
</body>
</html>`;
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(dashboardHTML);
    }

    // Handle HTTP requests
    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const method = req.method;

        // Handle analytics API
        if (pathname.startsWith('/api/analytics')) {
            // Add query parameters and other properties to request object
            req.query = parsedUrl.query;
            req.ip = req.connection.remoteAddress;
            req.get = (header) => req.headers[header.toLowerCase()];
            
            // Parse JSON body for POST requests
            if (method === 'POST') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    try {
                        req.body = JSON.parse(body);
                        this.analyticsMiddleware.handleAnalytics(req, res);
                    } catch (error) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Invalid JSON' }));
                    }
                });
            } else {
                this.analyticsMiddleware.handleAnalytics(req, res);
            }
            return;
        }

        // Handle analytics dashboard
        if (pathname === '/analytics' || pathname === '/dashboard') {
            this.serveAnalyticsDashboard(res);
            return;
        }

        // Handle static files
        let filePath = path.join(this.projectDir, pathname);
        
        // Default to index.html for root path
        if (pathname === '/') {
            filePath = path.join(this.projectDir, 'index.html');
        }

        // Check if file exists
        fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                // Try with .html extension
                if (!path.extname(filePath)) {
                    filePath += '.html';
                    fs.stat(filePath, (err, stats) => {
                        if (err || !stats.isFile()) {
                            res.writeHead(404, { 'Content-Type': 'text/html' });
                            res.end(`
                                <!DOCTYPE html>
                                <html>
                                <head>
                                    <title>404 - Page Not Found</title>
                                    <style>
                                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                                        h1 { color: #e74c3c; }
                                        a { color: #3498db; text-decoration: none; }
                                    </style>
                                </head>
                                <body>
                                    <h1>404 - Page Not Found</h1>
                                    <p>The requested page could not be found.</p>
                                    <a href="/">← Back to Home</a>
                                </body>
                                </html>
                            `);
                        } else {
                            this.serveStaticFile(filePath, res);
                        }
                    });
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>404 - Page Not Found</title>
                            <style>
                                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                                h1 { color: #e74c3c; }
                                a { color: #3498db; text-decoration: none; }
                            </style>
                        </head>
                        <body>
                            <h1>404 - Page Not Found</h1>
                            <p>The requested page could not be found.</p>
                            <a href="/">← Back to Home</a>
                        </body>
                        </html>
                    `);
                }
            } else {
                this.serveStaticFile(filePath, res);
            }
        });
    }

    // Start the enhanced server
    async start() {
        try {
            console.log('🚀 Enhanced Portfolio Server Starting...');
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

    // Start HTTP server
    async startHTTPServer() {
        return new Promise((resolve, reject) => {
            console.log(`🌟 Starting Enhanced HTTP server on port ${this.port}...`);
            console.log(`📱 Access your portfolio at: http://localhost:${this.port}`);
            console.log(`📊 Analytics dashboard: http://localhost:${this.port}/analytics`);
            console.log(`🛑 Press Ctrl+C to stop the server`);
            console.log('');
            
            this.server = http.createServer((req, res) => {
                this.handleRequest(req, res);
            });
            
            this.server.listen(this.port, () => {
                this.isRunning = true;
                console.log(`✅ Server is running on http://localhost:${this.port}`);
                resolve();
            });
            
            this.server.on('error', (error) => {
                console.error('❌ Server error:', error.message);
                reject(error);
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
        });
    }

    // Stop the server
    async stop() {
        if (this.server && this.isRunning) {
            console.log('🛑 Stopping server...');
            this.server.close();
            this.isRunning = false;
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
    const server = new EnhancedPortfolioServer(port);
    
    try {
        await server.start();
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = EnhancedPortfolioServer;
