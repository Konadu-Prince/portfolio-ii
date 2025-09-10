# Portfolio Analytics System

This portfolio includes a comprehensive analytics system that tracks page visits, resume downloads, and user interactions.

## Features

### 📊 What's Tracked

- **Page Views**: Every time someone visits your portfolio pages
- **Resume Downloads**: When visitors download your resume
- **Form Submissions**: Contact form submissions
- **External Link Clicks**: Clicks on external links (LinkedIn, GitHub, etc.)
- **Project Interactions**: Clicks on project cards and buttons
- **Scroll Depth**: How far visitors scroll on your pages
- **Time on Page**: How long visitors spend on each page
- **Session Tracking**: Unique visitor sessions

### 🎯 Analytics Dashboard

Access your analytics dashboard at: `http://localhost:3000/analytics`

The dashboard shows:
- Total page views
- Resume download count
- Unique visitors
- Form submissions
- External link clicks
- Project interactions
- Recent activity feed

## Getting Started

### 1. Start the Enhanced Server

```bash
# Start with analytics enabled
npm start

# Or start on a specific port
npm run dev

# Or use the analytics-specific command
npm run analytics
```

### 2. Access Your Portfolio

- **Portfolio**: `http://localhost:3000`
- **Analytics Dashboard**: `http://localhost:3000/analytics`

### 3. View Analytics

The analytics dashboard automatically updates every 30 seconds and shows:
- Real-time statistics
- Recent visitor activity
- Download tracking
- Interaction metrics

## How It Works

### Frontend Tracking (`analytics.js`)

The analytics system automatically tracks:
- Page loads and navigation
- Button clicks and form submissions
- Scroll depth and time on page
- External link clicks
- Resume downloads

### Backend API (`analytics-api.js`)

The backend handles:
- Storing analytics data in JSON format
- Providing API endpoints for data retrieval
- Processing and aggregating statistics
- Serving the analytics dashboard

### Data Storage

Analytics data is stored in `analytics-data.json` with:
- Event timestamps
- User session tracking
- Page view statistics
- Download counts
- Interaction metrics

## API Endpoints

### Track Events
```
POST /api/analytics
Content-Type: application/json

{
  "event_type": "page_view",
  "data": {
    "url": "http://localhost:3000",
    "title": "Portfolio Home",
    "session_id": "session_123"
  }
}
```

### Get Statistics
```
GET /api/analytics?type=stats
```

### Get Recent Activity
```
GET /api/analytics?type=recent&limit=20
```

### Get Events by Type
```
GET /api/analytics?type=events&event_type=resume_download&limit=50
```

## Customization

### Adding Custom Tracking

You can add custom event tracking in your JavaScript:

```javascript
// Track custom events
if (window.analytics) {
    window.analytics.trackEvent('custom_event', {
        action: 'button_click',
        element: 'special_button',
        value: 'custom_value'
    });
}
```

### Modifying Dashboard

The analytics dashboard is served from the enhanced server. You can customize it by modifying the `serveAnalyticsDashboard` method in `enhanced-server.js`.

## Data Privacy

- No personal information is collected
- Only anonymous usage statistics are tracked
- Data is stored locally on your server
- No third-party analytics services are used

## Troubleshooting

### Analytics Not Working

1. **Check Console**: Open browser developer tools and check for JavaScript errors
2. **Verify Server**: Ensure the enhanced server is running (`npm start`)
3. **Check Network**: Verify API calls are being made to `/api/analytics`
4. **Local Storage**: Check if events are being stored locally as fallback

### Dashboard Not Loading

1. **Server Status**: Ensure the enhanced server is running
2. **Port Access**: Check if port 3000 is accessible
3. **API Endpoints**: Verify `/api/analytics` endpoints are responding
4. **Browser Console**: Check for JavaScript errors in the dashboard

### Data Not Persisting

1. **File Permissions**: Ensure the server can write to `analytics-data.json`
2. **Disk Space**: Check available disk space
3. **Server Restart**: Data should persist between server restarts

## File Structure

```
portfolio/
├── analytics.js              # Frontend tracking
├── analytics-api.js          # Backend API
├── enhanced-server.js        # Server with analytics
├── analytics-data.json       # Data storage (auto-created)
├── ANALYTICS.md             # This documentation
└── package.json             # Updated scripts
```

## Commands

```bash
# Start with analytics
npm start

# Development mode
npm run dev

# Analytics-specific server
npm run analytics

# Legacy server (no analytics)
npm run legacy

# Stop all servers
npm run stop

# Clean up processes
npm run clean
```

## Benefits

- **Track Performance**: See which pages get the most views
- **Monitor Downloads**: Know how many people download your resume
- **Understand Engagement**: See which projects get the most interest
- **Optimize Content**: Use data to improve your portfolio
- **Professional Insights**: Understand your audience better

## Privacy-First Approach

This analytics system is designed with privacy in mind:
- No cookies or tracking pixels
- No third-party services
- Data stays on your server
- Anonymous usage statistics only
- GDPR-friendly implementation

Start your enhanced portfolio server and begin tracking your professional impact today!
