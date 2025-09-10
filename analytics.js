// ========================================
// ANALYTICS SYSTEM
// ========================================
// Tracks page visits and resume downloads

class Analytics {
    constructor() {
        this.apiEndpoint = '/api/analytics';
        this.sessionId = this.generateSessionId();
        this.visitStartTime = Date.now();
        this.pageLoadTime = null;
        this.init();
    }

    init() {
        // Track page load
        this.trackPageLoad();
        
        // Track page visibility changes
        this.trackVisibilityChanges();
        
        // Track scroll depth
        this.trackScrollDepth();
        
        // Track time on page
        this.trackTimeOnPage();
        
        // Track resume downloads
        this.trackResumeDownloads();
        
        // Track external link clicks
        this.trackExternalLinks();
        
        // Track form submissions
        this.trackFormSubmissions();
        
        // Track project interactions
        this.trackProjectInteractions();
        
        // Initialize page load time tracking
        this.initializePageLoadTracking();
    }

    generateSessionId() {
        // Generate a unique session ID
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    initializePageLoadTracking() {
        // Track when page starts loading
        this.pageLoadStart = performance.now();
        
        // Track when page finishes loading
        window.addEventListener('load', () => {
            this.pageLoadTime = performance.now() - this.pageLoadStart;
            this.trackEvent('page_load', {
                load_time: this.pageLoadTime,
                url: window.location.href,
                referrer: document.referrer
            });
        });
    }

    trackPageLoad() {
        const pageData = {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: new Date().toISOString(),
            session_id: this.sessionId
        };

        this.sendAnalytics('page_view', pageData);
    }

    trackVisibilityChanges() {
        let isVisible = true;
        let hiddenTime = 0;
        let lastHiddenTime = null;

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isVisible = false;
                lastHiddenTime = Date.now();
            } else {
                isVisible = true;
                if (lastHiddenTime) {
                    hiddenTime += Date.now() - lastHiddenTime;
                    lastHiddenTime = null;
                }
            }
        });

        // Track when user leaves the page
        window.addEventListener('beforeunload', () => {
            const totalTime = Date.now() - this.visitStartTime;
            const activeTime = totalTime - hiddenTime;

            this.trackEvent('page_exit', {
                total_time: totalTime,
                active_time: activeTime,
                hidden_time: hiddenTime,
                url: window.location.href
            });
        });
    }

    trackScrollDepth() {
        let maxScrollDepth = 0;
        const scrollThresholds = [25, 50, 75, 90, 100];
        const reachedThresholds = new Set();

        const trackScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);

            if (scrollPercentage > maxScrollDepth) {
                maxScrollDepth = scrollPercentage;
            }

            // Track when user reaches certain scroll thresholds
            scrollThresholds.forEach(threshold => {
                if (scrollPercentage >= threshold && !reachedThresholds.has(threshold)) {
                    reachedThresholds.add(threshold);
                    this.trackEvent('scroll_depth', {
                        depth: threshold,
                        url: window.location.href
                    });
                }
            });
        };

        // Throttle scroll tracking
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(trackScroll, 100);
        });
    }

    trackTimeOnPage() {
        // Track time spent on page in intervals
        setInterval(() => {
            const timeOnPage = Date.now() - this.visitStartTime;
            this.trackEvent('time_on_page', {
                time_seconds: Math.round(timeOnPage / 1000),
                url: window.location.href
            });
        }, 30000); // Track every 30 seconds
    }

    trackResumeDownloads() {
        // Track resume download button clicks
        const resumeButtons = document.querySelectorAll('.btn-resume, a[href*="resume"], a[href*="Resume"]');
        
        resumeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.trackEvent('resume_download', {
                    url: window.location.href,
                    button_text: button.textContent.trim(),
                    button_href: button.href || button.getAttribute('href'),
                    timestamp: new Date().toISOString()
                });
            });
        });

        // Also track the downloadResumeFile function
        const originalDownloadResumeFile = window.downloadResumeFile;
        if (originalDownloadResumeFile) {
            window.downloadResumeFile = () => {
                this.trackEvent('resume_download', {
                    url: window.location.href,
                    method: 'downloadResumeFile',
                    timestamp: new Date().toISOString()
                });
                return originalDownloadResumeFile();
            };
        }
    }

    trackExternalLinks() {
        // Track clicks on external links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href) {
                const url = new URL(link.href);
                const currentDomain = window.location.hostname;
                
                if (url.hostname !== currentDomain) {
                    this.trackEvent('external_link_click', {
                        url: link.href,
                        text: link.textContent.trim(),
                        source_url: window.location.href,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        });
    }

    trackFormSubmissions() {
        // Track contact form submissions
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.trackEvent('form_submission', {
                    form_type: 'contact',
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                });
            });
        }

        // Track other forms
        const allForms = document.querySelectorAll('form');
        allForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                this.trackEvent('form_submission', {
                    form_type: form.className || 'unknown',
                    form_id: form.id || 'no-id',
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                });
            });
        });
    }

    trackProjectInteractions() {
        // Track project card clicks
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const projectTitle = card.querySelector('h3')?.textContent || 'Unknown Project';
                this.trackEvent('project_interaction', {
                    action: 'card_click',
                    project: projectTitle,
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                });
            });
        });

        // Track project button clicks
        const projectButtons = document.querySelectorAll('[onclick*="showProject"]');
        projectButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = button.getAttribute('onclick') || 'unknown_action';
                this.trackEvent('project_interaction', {
                    action: action,
                    button_text: button.textContent.trim(),
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                });
            });
        });
    }

    trackEvent(eventType, data) {
        const eventData = {
            event_type: eventType,
            data: data,
            session_id: this.sessionId,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };

        this.sendAnalytics(eventType, eventData);
    }

    async sendAnalytics(eventType, data) {
        try {
            // Try to send to backend API
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event_type: eventType,
                    data: data,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log(`Analytics event sent: ${eventType}`);
        } catch (error) {
            console.warn('Failed to send analytics to backend, storing locally:', error);
            // Fallback: store in localStorage
            this.storeLocally(eventType, data);
        }
    }

    storeLocally(eventType, data) {
        try {
            const key = `analytics_${eventType}_${Date.now()}`;
            const eventData = {
                event_type: eventType,
                data: data,
                timestamp: new Date().toISOString(),
                stored_locally: true
            };
            
            localStorage.setItem(key, JSON.stringify(eventData));
            
            // Clean up old local storage items (keep only last 100)
            this.cleanupLocalStorage();
        } catch (error) {
            console.error('Failed to store analytics locally:', error);
        }
    }

    cleanupLocalStorage() {
        try {
            const keys = Object.keys(localStorage).filter(key => key.startsWith('analytics_'));
            if (keys.length > 100) {
                // Sort by timestamp and remove oldest
                keys.sort((a, b) => {
                    const timestampA = parseInt(a.split('_')[2]);
                    const timestampB = parseInt(b.split('_')[2]);
                    return timestampA - timestampB;
                });
                
                const keysToRemove = keys.slice(0, keys.length - 100);
                keysToRemove.forEach(key => localStorage.removeItem(key));
            }
        } catch (error) {
            console.error('Failed to cleanup local storage:', error);
        }
    }

    // Method to get analytics data (for dashboard)
    async getAnalyticsData() {
        try {
            const response = await fetch(`${this.apiEndpoint}/stats`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Failed to fetch analytics data from backend:', error);
        }
        
        // Fallback: get from localStorage
        return this.getLocalAnalyticsData();
    }

    getLocalAnalyticsData() {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('analytics_'));
        const events = keys.map(key => {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch (error) {
                return null;
            }
        }).filter(event => event !== null);

        return this.processAnalyticsData(events);
    }

    processAnalyticsData(events) {
        const stats = {
            total_page_views: 0,
            total_resume_downloads: 0,
            total_form_submissions: 0,
            total_external_clicks: 0,
            total_project_interactions: 0,
            unique_sessions: new Set(),
            page_views_by_url: {},
            events_by_type: {},
            recent_events: events.slice(-50), // Last 50 events
            time_period: {
                start: null,
                end: null
            }
        };

        events.forEach(event => {
            const eventType = event.event_type;
            const data = event.data;
            const timestamp = new Date(event.timestamp);

            // Update time period
            if (!stats.time_period.start || timestamp < new Date(stats.time_period.start)) {
                stats.time_period.start = event.timestamp;
            }
            if (!stats.time_period.end || timestamp > new Date(stats.time_period.end)) {
                stats.time_period.end = event.timestamp;
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
        });

        // Convert Set to number
        stats.unique_sessions = stats.unique_sessions.size;

        return stats;
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.analytics = new Analytics();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analytics;
}
