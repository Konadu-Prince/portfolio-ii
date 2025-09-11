/**
 * Enhanced Analytics System for Portfolio
 * Collects detailed user information for better audience insights
 * 
 * Data Collected:
 * - IP Address (via external service)
 * - Device Type & Browser
 * - Location (approximate)
 * - Machine ID (browser fingerprint)
 * - User Agent details
 * - Screen resolution
 * - Timezone
 * - Language preferences
 */

class EnhancedAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.machineId = this.generateMachineId();
        this.startTime = Date.now();
        this.pageStartTime = Date.now();
        this.scrollDepth = 0;
        this.maxScrollDepth = 0;
        this.isActive = true;
        this.userConsent = false;
        
        this.init();
    }

    init() {
        // Show privacy notice and get consent
        this.showPrivacyNotice();
        
        // Initialize tracking after consent
        if (this.userConsent) {
            this.initializeTracking();
        }
    }

    showPrivacyNotice() {
        // Check if user has already given consent
        const consent = localStorage.getItem('analytics_consent');
        if (consent === 'accepted') {
            this.userConsent = true;
            return;
        }

        // Show privacy notice
        const notice = document.createElement('div');
        notice.id = 'privacy-notice';
        notice.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 10000;
                font-family: Arial, sans-serif;
                max-width: 500px;
                margin: 0 auto;
            ">
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">📊 Analytics & Privacy Notice</h3>
                <p style="margin: 0 0 15px 0; font-size: 14px; line-height: 1.4;">
                    We collect analytics data to improve your experience and understand our developer audience. 
                    This includes: IP address, device info, browser details, location, and usage patterns.
                </p>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="analytics.declineConsent()" style="
                        background: rgba(255,255,255,0.2);
                        color: white;
                        border: 1px solid rgba(255,255,255,0.3);
                        padding: 8px 16px;
                        border-radius: 20px;
                        cursor: pointer;
                        font-size: 14px;
                    ">Decline</button>
                    <button onclick="analytics.acceptConsent()" style="
                        background: white;
                        color: #667eea;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 20px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: bold;
                    ">Accept & Continue</button>
                </div>
            </div>
        `;
        document.body.appendChild(notice);
    }

    acceptConsent() {
        this.userConsent = true;
        localStorage.setItem('analytics_consent', 'accepted');
        document.getElementById('privacy-notice').remove();
        this.initializeTracking();
    }

    declineConsent() {
        this.userConsent = false;
        localStorage.setItem('analytics_consent', 'declined');
        document.getElementById('privacy-notice').remove();
        // Still track basic anonymous data
        this.trackBasicData();
    }

    async initializeTracking() {
        if (!this.userConsent) return;

        // Collect detailed user information
        const userInfo = await this.collectUserInfo();
        
        // Track page view with detailed info
        this.trackEvent('page_view', {
            ...userInfo,
            page_title: document.title,
            page_url: window.location.href,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        });

        // Set up event listeners
        this.setupEventListeners();
        
        // Track page load
        this.trackEvent('page_load', {
            load_time: Date.now() - this.pageStartTime,
            ...userInfo
        });
    }

    async collectUserInfo() {
        const userInfo = {
            // Basic info
            session_id: this.sessionId,
            machine_id: this.machineId,
            user_agent: navigator.userAgent,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            color_depth: screen.colorDepth,
            pixel_ratio: window.devicePixelRatio,
            
            // Device detection
            device_type: this.getDeviceType(),
            browser: this.getBrowserInfo(),
            os: this.getOperatingSystem(),
            
            // Network info
            connection_type: navigator.connection ? navigator.connection.effectiveType : 'unknown',
            online_status: navigator.onLine,
            
            // Location (approximate via IP)
            location: await this.getLocationInfo(),
            
            // Additional fingerprinting
            canvas_fingerprint: this.getCanvasFingerprint(),
            webgl_fingerprint: this.getWebGLFingerprint(),
            plugins: this.getPluginInfo(),
            fonts: this.getFontInfo()
        };

        return userInfo;
    }

    async getLocationInfo() {
        try {
            // Use a free IP geolocation service
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            return {
                ip: data.ip,
                city: data.city,
                region: data.region,
                country: data.country_name,
                country_code: data.country_code,
                latitude: data.latitude,
                longitude: data.longitude,
                timezone: data.timezone,
                isp: data.org,
                asn: data.asn
            };
        } catch (error) {
            console.log('Location info unavailable:', error);
            return {
                ip: 'unknown',
                city: 'unknown',
                region: 'unknown',
                country: 'unknown',
                error: 'Location service unavailable'
            };
        }
    }

    getDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        if (/mobile|android|iphone|ipad|tablet/.test(userAgent)) {
            return 'mobile';
        } else if (/tablet|ipad/.test(userAgent)) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browser = 'unknown';
        let version = 'unknown';

        if (userAgent.includes('Chrome')) {
            browser = 'Chrome';
            version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'unknown';
        } else if (userAgent.includes('Firefox')) {
            browser = 'Firefox';
            version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'unknown';
        } else if (userAgent.includes('Safari')) {
            browser = 'Safari';
            version = userAgent.match(/Version\/(\d+)/)?.[1] || 'unknown';
        } else if (userAgent.includes('Edge')) {
            browser = 'Edge';
            version = userAgent.match(/Edge\/(\d+)/)?.[1] || 'unknown';
        }

        return { browser, version };
    }

    getOperatingSystem() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Windows')) return 'Windows';
        if (userAgent.includes('Mac')) return 'macOS';
        if (userAgent.includes('Linux')) return 'Linux';
        if (userAgent.includes('Android')) return 'Android';
        if (userAgent.includes('iOS')) return 'iOS';
        return 'Unknown';
    }

    getCanvasFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('Canvas fingerprint', 2, 2);
            return canvas.toDataURL().slice(-50); // Last 50 chars for uniqueness
        } catch (error) {
            return 'canvas_unavailable';
        }
    }

    getWebGLFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return 'webgl_unavailable';
            
            const renderer = gl.getParameter(gl.RENDERER);
            const vendor = gl.getParameter(gl.VENDOR);
            return `${vendor}_${renderer}`.slice(0, 50);
        } catch (error) {
            return 'webgl_unavailable';
        }
    }

    getPluginInfo() {
        const plugins = Array.from(navigator.plugins).map(plugin => plugin.name);
        return plugins.slice(0, 10); // Limit to first 10 plugins
    }

    getFontInfo() {
        // Check for common fonts
        const fonts = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS'];
        const availableFonts = fonts.filter(font => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.font = '12px monospace';
            const baseline = ctx.measureText('test').width;
            ctx.font = `12px ${font}, monospace`;
            return ctx.measureText('test').width !== baseline;
        });
        return availableFonts;
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateMachineId() {
        // Create a more persistent machine ID
        let machineId = localStorage.getItem('machine_id');
        if (!machineId) {
            machineId = 'machine_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('machine_id', machineId);
        }
        return machineId;
    }

    setupEventListeners() {
        // Scroll tracking
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                if (scrollPercent > this.maxScrollDepth) {
                    this.maxScrollDepth = scrollPercent;
                    this.trackEvent('scroll_depth', { depth: scrollPercent });
                }
            }, 100);
        });

        // Time on page tracking
        setInterval(() => {
            if (this.isActive) {
                this.trackEvent('time_on_page', { 
                    time_seconds: Math.round((Date.now() - this.pageStartTime) / 1000) 
                });
            }
        }, 30000); // Every 30 seconds

        // Page visibility tracking
        document.addEventListener('visibilitychange', () => {
            this.isActive = !document.hidden;
            if (document.hidden) {
                this.trackEvent('page_exit', { 
                    active_time: Date.now() - this.pageStartTime 
                });
            }
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            this.trackEvent('form_submission', {
                form_type: e.target.id || e.target.className || 'unknown',
                form_action: e.target.action || 'unknown'
            });
        });

        // External link clicks
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.hostname !== window.location.hostname) {
                this.trackEvent('external_link_click', {
                    url: e.target.href,
                    text: e.target.textContent
                });
            }
        });

        // Resume downloads
        document.addEventListener('click', (e) => {
            if (e.target.href && e.target.href.includes('resume') || 
                e.target.textContent.toLowerCase().includes('resume')) {
                this.trackEvent('resume_download', {
                    url: e.target.href || window.location.href
                });
            }
        });
    }

    trackEvent(eventType, data = {}) {
        if (!this.userConsent && eventType !== 'page_view') return;

        const event = {
            event_type: eventType,
            timestamp: new Date().toISOString(),
            session_id: this.sessionId,
            machine_id: this.machineId,
            data: data
        };

        this.storeEvent(event);
        console.log('Analytics event stored:', eventType, event);
    }

    storeEvent(event) {
        try {
            const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            events.push(event);
            
            // Keep only last 1000 events to prevent storage overflow
            if (events.length > 1000) {
                events.splice(0, events.length - 1000);
            }
            
            localStorage.setItem('analytics_events', JSON.stringify(events));
        } catch (error) {
            console.error('Error storing analytics event:', error);
        }
    }

    trackBasicData() {
        // Track minimal anonymous data even without consent
        this.trackEvent('page_view', {
            page_title: document.title,
            page_url: window.location.href,
            device_type: this.getDeviceType(),
            browser: this.getBrowserInfo().browser,
            timestamp: new Date().toISOString()
        });
    }

    // Export data as Excel-compatible CSV
    exportDataAsCSV() {
        const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        
        if (events.length === 0) {
            alert('No analytics data available to export.');
            return;
        }

        // Flatten the data for CSV export
        const csvData = events.map(event => {
            const data = event.data;
            return {
                'Event Type': event.event_type,
                'Timestamp': event.timestamp,
                'Session ID': event.session_id,
                'Machine ID': event.machine_id,
                'IP Address': data.ip || 'N/A',
                'Device Type': data.device_type || 'N/A',
                'Browser': data.browser || 'N/A',
                'Browser Version': data.version || 'N/A',
                'Operating System': data.os || 'N/A',
                'Location': data.city && data.country ? `${data.city}, ${data.country}` : 'N/A',
                'Country': data.country || 'N/A',
                'City': data.city || 'N/A',
                'ISP': data.isp || 'N/A',
                'Screen Resolution': data.screen_resolution || 'N/A',
                'Viewport Size': data.viewport_size || 'N/A',
                'Language': data.language || 'N/A',
                'Timezone': data.timezone || 'N/A',
                'Connection Type': data.connection_type || 'N/A',
                'Page Title': data.page_title || 'N/A',
                'Page URL': data.page_url || 'N/A',
                'Referrer': data.referrer || 'N/A',
                'Load Time (ms)': data.load_time || 'N/A',
                'Scroll Depth (%)': data.depth || 'N/A',
                'Time on Page (s)': data.time_seconds || 'N/A',
                'Form Type': data.form_type || 'N/A',
                'External Link': data.url || 'N/A',
                'User Agent': data.user_agent || 'N/A',
                'Canvas Fingerprint': data.canvas_fingerprint || 'N/A',
                'WebGL Fingerprint': data.webgl_fingerprint || 'N/A',
                'Available Fonts': data.fonts ? data.fonts.join(', ') : 'N/A',
                'Plugins': data.plugins ? data.plugins.join(', ') : 'N/A'
            };
        });

        // Convert to CSV
        const headers = Object.keys(csvData[0]);
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => 
                headers.map(header => {
                    const value = row[header] || '';
                    // Escape commas and quotes in CSV
                    return `"${value.toString().replace(/"/g, '""')}"`;
                }).join(',')
            )
        ].join('\n');

        // Download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `portfolio_analytics_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Get analytics summary
    getAnalyticsData() {
        const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        
        const summary = {
            total_events: events.length,
            unique_sessions: new Set(events.map(e => e.session_id)).size,
            unique_machines: new Set(events.map(e => e.machine_id)).size,
            total_page_views: events.filter(e => e.event_type === 'page_view').length,
            total_resume_downloads: events.filter(e => e.event_type === 'resume_download').length,
            total_form_submissions: events.filter(e => e.event_type === 'form_submission').length,
            total_external_clicks: events.filter(e => e.event_type === 'external_link_click').length,
            recent_events: events.slice(-20).reverse()
        };

        return summary;
    }

    // Clear all analytics data
    clearData() {
        localStorage.removeItem('analytics_events');
        localStorage.removeItem('machine_id');
        localStorage.removeItem('analytics_consent');
        alert('All analytics data has been cleared.');
    }
}

// Initialize analytics when DOM is loaded
let analytics;
document.addEventListener('DOMContentLoaded', () => {
    analytics = new EnhancedAnalytics();
});

// Make analytics globally available
window.analytics = analytics;
