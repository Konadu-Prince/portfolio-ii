// ========================================
// ANALYTICS API BACKEND
// ========================================
// Handles analytics data storage and retrieval

const fs = require('fs');
const path = require('path');

class AnalyticsAPI {
    constructor() {
        this.dataFile = path.join(__dirname, 'analytics-data.json');
        this.analyticsData = this.loadAnalyticsData();
        this.init();
    }

    init() {
        // Ensure data file exists
        if (!fs.existsSync(this.dataFile)) {
            this.saveAnalyticsData();
        }
    }

    loadAnalyticsData() {
        try {
            if (fs.existsSync(this.dataFile)) {
                const data = fs.readFileSync(this.dataFile, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading analytics data:', error);
        }
        
        // Return default structure
        return {
            events: [],
            stats: {
                total_page_views: 0,
                total_resume_downloads: 0,
                total_form_submissions: 0,
                total_external_clicks: 0,
                total_project_interactions: 0,
                unique_sessions: new Set(),
                page_views_by_url: {},
                events_by_type: {},
                last_updated: new Date().toISOString()
            }
        };
    }

    saveAnalyticsData() {
        try {
            // Convert Set to Array for JSON serialization
            const dataToSave = {
                ...this.analyticsData,
                stats: {
                    ...this.analyticsData.stats,
                    unique_sessions: Array.from(this.analyticsData.stats.unique_sessions)
                }
            };
            
            fs.writeFileSync(this.dataFile, JSON.stringify(dataToSave, null, 2));
        } catch (error) {
            console.error('Error saving analytics data:', error);
        }
    }

    addEvent(eventType, data) {
        const event = {
            id: this.generateEventId(),
            event_type: eventType,
            data: data,
            timestamp: new Date().toISOString(),
            ip: data.ip || 'unknown',
            user_agent: data.user_agent || 'unknown'
        };

        // Add to events array
        this.analyticsData.events.push(event);

        // Update stats
        this.updateStats(event);

        // Save to file
        this.saveAnalyticsData();

        return event;
    }

    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    updateStats(event) {
        const stats = this.analyticsData.stats;
        const eventType = event.event_type;
        const data = event.data;

        // Initialize unique_sessions as Set if it's an array
        if (Array.isArray(stats.unique_sessions)) {
            stats.unique_sessions = new Set(stats.unique_sessions);
        }

        // Count events by type
        stats.events_by_type[eventType] = (stats.events_by_type[eventType] || 0) + 1;

        // Track unique sessions
        if (data.session_id) {
            stats.unique_sessions.add(data.session_id);
        }

        // Count specific events
        switch (eventType) {
            case 'page_view':
                stats.total_page_views++;
                if (data.url) {
                    stats.page_views_by_url[data.url] = (stats.page_views_by_url[data.url] || 0) + 1;
                }
                break;
            case 'resume_download':
                stats.total_resume_downloads++;
                break;
            case 'form_submission':
                stats.total_form_submissions++;
                break;
            case 'external_link_click':
                stats.total_external_clicks++;
                break;
            case 'project_interaction':
                stats.total_project_interactions++;
                break;
        }

        stats.last_updated = new Date().toISOString();
    }

    getStats() {
        // Convert Set to number for unique sessions
        const stats = {
            ...this.analyticsData.stats,
            unique_sessions: this.analyticsData.stats.unique_sessions.size
        };

        return {
            stats: stats,
            recent_events: this.analyticsData.events.slice(-50),
            total_events: this.analyticsData.events.length,
            time_period: this.getTimePeriod()
        };
    }

    getTimePeriod() {
        if (this.analyticsData.events.length === 0) {
            return { start: null, end: null };
        }

        const timestamps = this.analyticsData.events.map(event => new Date(event.timestamp));
        return {
            start: new Date(Math.min(...timestamps)).toISOString(),
            end: new Date(Math.max(...timestamps)).toISOString()
        };
    }

    getEventsByType(eventType, limit = 100) {
        return this.analyticsData.events
            .filter(event => event.event_type === eventType)
            .slice(-limit);
    }

    getEventsByDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        return this.analyticsData.events.filter(event => {
            const eventDate = new Date(event.timestamp);
            return eventDate >= start && eventDate <= end;
        });
    }

    getPageViewsByUrl() {
        return this.analyticsData.stats.page_views_by_url;
    }

    getTopPages(limit = 10) {
        const pageViews = this.analyticsData.stats.page_views_by_url;
        return Object.entries(pageViews)
            .sort(([,a], [,b]) => b - a)
            .slice(0, limit)
            .map(([url, views]) => ({ url, views }));
    }

    getRecentActivity(limit = 20) {
        return this.analyticsData.events
            .slice(-limit)
            .reverse()
            .map(event => ({
                id: event.id,
                type: event.event_type,
                timestamp: event.timestamp,
                url: event.data.url || 'N/A',
                details: this.getEventDetails(event)
            }));
    }

    getEventDetails(event) {
        switch (event.event_type) {
            case 'page_view':
                return `Page viewed: ${event.data.title || 'Unknown'}`;
            case 'resume_download':
                return `Resume downloaded from: ${event.data.url || 'Unknown page'}`;
            case 'form_submission':
                return `Form submitted: ${event.data.form_type || 'Unknown form'}`;
            case 'external_link_click':
                return `External link clicked: ${event.data.url || 'Unknown link'}`;
            case 'project_interaction':
                return `Project interaction: ${event.data.action || 'Unknown action'}`;
            default:
                return `Event: ${event.event_type}`;
        }
    }

    // Clean up old events (keep only last 1000)
    cleanup() {
        if (this.analyticsData.events.length > 1000) {
            this.analyticsData.events = this.analyticsData.events.slice(-1000);
            this.saveAnalyticsData();
        }
    }

    // Export data for backup
    exportData() {
        return {
            export_date: new Date().toISOString(),
            total_events: this.analyticsData.events.length,
            stats: this.getStats(),
            events: this.analyticsData.events
        };
    }

    // Import data from backup
    importData(data) {
        try {
            if (data.events && Array.isArray(data.events)) {
                this.analyticsData.events = data.events;
                this.saveAnalyticsData();
                return true;
            }
        } catch (error) {
            console.error('Error importing analytics data:', error);
        }
        return false;
    }
}

// Express.js middleware for analytics API
function createAnalyticsMiddleware() {
    const analyticsAPI = new AnalyticsAPI();

    return {
        // Middleware to handle analytics requests
        handleAnalytics: (req, res) => {
            // Set CORS headers
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            if (req.method === 'POST') {
                try {
                    const { event_type, data } = req.body;
                    
                    if (!event_type) {
                        return res.status(400).json({ error: 'Event type is required' });
                    }

                    // Add request info to data
                    const eventData = {
                        ...data,
                        ip: req.ip || req.connection.remoteAddress,
                        user_agent: req.get('User-Agent')
                    };

                    const event = analyticsAPI.addEvent(event_type, eventData);
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: true, 
                        event_id: event.id,
                        message: 'Event tracked successfully' 
                    }));
                } catch (error) {
                    console.error('Error handling analytics request:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                }
            } else if (req.method === 'GET') {
                try {
                    const { type, limit, start_date, end_date } = req.query;
                    
                    let result;
                    
                    if (type === 'stats') {
                        result = analyticsAPI.getStats();
                    } else if (type === 'events' && req.query.event_type) {
                        result = analyticsAPI.getEventsByType(req.query.event_type, parseInt(limit) || 100);
                    } else if (type === 'recent') {
                        result = analyticsAPI.getRecentActivity(parseInt(limit) || 20);
                    } else if (type === 'pages') {
                        result = analyticsAPI.getTopPages(parseInt(limit) || 10);
                    } else if (type === 'range' && start_date && end_date) {
                        result = analyticsAPI.getEventsByDateRange(start_date, end_date);
                    } else {
                        result = analyticsAPI.getStats();
                    }
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                } catch (error) {
                    console.error('Error fetching analytics data:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                }
            } else {
                res.writeHead(405, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Method not allowed' }));
            }
        },

        // Get analytics API instance
        getAPI: () => analyticsAPI
    };
}

module.exports = { AnalyticsAPI, createAnalyticsMiddleware };
