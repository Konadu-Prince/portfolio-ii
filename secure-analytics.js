// ========================================
// SECURE ANALYTICS DASHBOARD
// ========================================
// Adds basic authentication to analytics dashboard

class SecureAnalytics {
    constructor() {
        this.username = 'admin'; // Change this
        this.password = 'portfolio2024'; // Change this
        this.sessionKey = 'analytics_auth';
        this.init();
    }

    init() {
        // Check if user is already authenticated
        if (this.isAuthenticated()) {
            this.showDashboard();
        } else {
            this.showLoginForm();
        }
    }

    isAuthenticated() {
        const auth = sessionStorage.getItem(this.sessionKey);
        return auth === 'true';
    }

    authenticate(username, password) {
        if (username === this.username && password === this.password) {
            sessionStorage.setItem(this.sessionKey, 'true');
            this.showDashboard();
            return true;
        }
        return false;
    }

    logout() {
        sessionStorage.removeItem(this.sessionKey);
        this.showLoginForm();
    }

    showLoginForm() {
        document.body.innerHTML = `
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 15px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    width: 100%;
                    max-width: 400px;
                ">
                    <h2 style="text-align: center; margin-bottom: 30px; color: #333;">
                        🔒 Analytics Dashboard
                    </h2>
                    <form id="loginForm">
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 5px; color: #666;">Username:</label>
                            <input type="text" id="username" required style="
                                width: 100%;
                                padding: 12px;
                                border: 1px solid #ddd;
                                border-radius: 5px;
                                font-size: 16px;
                            ">
                        </div>
                        <div style="margin-bottom: 30px;">
                            <label style="display: block; margin-bottom: 5px; color: #666;">Password:</label>
                            <input type="password" id="password" required style="
                                width: 100%;
                                padding: 12px;
                                border: 1px solid #ddd;
                                border-radius: 5px;
                                font-size: 16px;
                            ">
                        </div>
                        <button type="submit" style="
                            width: 100%;
                            background: #667eea;
                            color: white;
                            border: none;
                            padding: 12px;
                            border-radius: 5px;
                            font-size: 16px;
                            cursor: pointer;
                        ">Login</button>
                    </form>
                    <div id="error" style="
                        color: #e74c3c;
                        text-align: center;
                        margin-top: 15px;
                        display: none;
                    ">Invalid credentials</div>
                </div>
            </div>
        `;

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (this.authenticate(username, password)) {
                // Success - dashboard will be shown
            } else {
                document.getElementById('error').style.display = 'block';
            }
        });
    }

    showDashboard() {
        // Load the original dashboard content
        fetch(window.location.href.replace('/analytics', '/analytics-dashboard.html'))
            .then(response => response.text())
            .then(html => {
                document.body.innerHTML = html;
                
                // Add logout button
                const header = document.querySelector('.header');
                if (header) {
                    header.innerHTML += `
                        <button onclick="secureAnalytics.logout()" style="
                            position: absolute;
                            top: 20px;
                            right: 20px;
                            background: rgba(255,255,255,0.2);
                            color: white;
                            border: 1px solid rgba(255,255,255,0.3);
                            padding: 8px 16px;
                            border-radius: 20px;
                            cursor: pointer;
                            font-size: 14px;
                        ">Logout</button>
                    `;
                }
                
                // Initialize dashboard functionality
                if (typeof loadAnalytics === 'function') {
                    loadAnalytics();
                }
            })
            .catch(error => {
                console.error('Error loading dashboard:', error);
                document.body.innerHTML = '<h1>Error loading dashboard</h1>';
            });
    }
}

// Initialize secure analytics
const secureAnalytics = new SecureAnalytics();
