// ========================================
// ROUTING SYSTEM
// ========================================
// Cache bust: 2025-09-08-00:52

class Router {
    constructor() {
        this.routes = {
            '/': 'index.html',
            '/index.html': 'index.html',
            '/portfolio': 'index.html',
            '/signin': 'signin.html',
            '/signin.html': 'signin.html',
            '/gallery': 'image-gallery.html',
            '/image-gallery': 'image-gallery.html',
            '/image-gallery.html': 'image-gallery.html',
            '/youtube': 'youtube-showcase.html',
            '/youtube-showcase': 'youtube-showcase.html',
            '/youtube-showcase.html': 'youtube-showcase.html',
            '/contact': 'index.html#contact',
            '/projects': 'index.html#projects',
            '/about': 'index.html#about',
            '/expertise': 'index.html#expertise',
            '/certifications': 'index.html#certifications',
            '/content': 'index.html#content',
            '/testimonials': 'index.html#testimonials'
        };
        this.init();
    }

    init() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            this.handleRoute(e.state?.path || window.location.pathname);
        });

        // Handle initial page load
        this.handleRoute(window.location.pathname);
    }

    navigate(path, updateHistory = true) {
        if (updateHistory) {
            history.pushState({ path }, '', path);
        }
        this.handleRoute(path);
    }

    handleRoute(path) {
        const route = this.routes[path];
        
        if (route) {
            if (route.includes('#')) {
                // Handle hash navigation
                const [page, section] = route.split('#');
                if (page === 'index.html' || page === '') {
                    this.scrollToSection(section);
                } else {
                    window.location.href = route;
                }
            } else if (route !== 'index.html') {
                // Navigate to different page
                window.location.href = route;
            } else {
                // Stay on current page, scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            // Handle 404 or unknown routes
            this.handle404(path);
        }
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    handle404(path) {
        console.log(`Route not found: "${path}", redirecting to home`);
        this.navigate('/', false);
    }
}

// Initialize router
const router = new Router();

// ========================================
// NAVIGATION SYSTEM
// ========================================

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Enhanced Navigation Links with Router Integration
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const sectionId = href.substring(1); // Remove the #
        
        // Use router for navigation
        router.navigate(`/${sectionId}`);
    });
});

// Handle external navigation links
document.querySelectorAll('a[href^="/"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const path = this.getAttribute('href');
        router.navigate(path);
    });
});

// ========================================
// ENHANCED PROJECT FILTERING SYSTEM
// ========================================

class ProjectFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        if (this.filterButtons.length > 0) {
            this.setupEventListeners();
            this.initializeFilter();
        }
    }

    setupEventListeners() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleFilterClick(e));
        });
    }

    initializeFilter() {
        // Set initial active state
        const activeButton = document.querySelector('.filter-btn.active') || this.filterButtons[0];
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    handleFilterClick(e) {
        e.preventDefault();
        
        const button = e.currentTarget;
        const filterValue = button.getAttribute('data-filter');
        
        // Update active button
        this.updateActiveButton(button);
        
        // Filter projects with animation
        this.filterProjects(filterValue);
        
        // Update URL hash
        this.updateUrlHash(filterValue);
        
        // Show notification
        this.showFilterNotification(filterValue);
    }

    updateActiveButton(activeButton) {
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.style.transform = 'scale(1)';
        });
        
        activeButton.classList.add('active');
        activeButton.style.transform = 'scale(1.05)';
        
        // Reset transform after animation
        setTimeout(() => {
            activeButton.style.transform = 'scale(1)';
        }, 200);
    }

    filterProjects(filterValue) {
        let visibleCount = 0;
        
        this.projectCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            const shouldShow = filterValue === 'all' || category === filterValue;
            
            if (shouldShow) {
                // Show with staggered animation
                setTimeout(() => {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    // Trigger animation
                    requestAnimationFrame(() => {
                        card.style.transition = 'all 0.6s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                }, index * 100);
                
                visibleCount++;
            } else {
                // Hide with fade out
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Update project count
        this.updateProjectCount(visibleCount, filterValue);
    }

    updateProjectCount(count, filter) {
        const countElement = document.querySelector('.project-count');
        if (countElement) {
            const filterText = filter === 'all' ? 'All Projects' : filter.charAt(0).toUpperCase() + filter.slice(1) + ' Projects';
            countElement.textContent = `${count} ${filterText}`;
        }
    }

    updateUrlHash(filterValue) {
        if (filterValue !== 'all') {
            window.location.hash = `#projects-${filterValue}`;
        } else {
            window.location.hash = '#projects';
        }
    }

    showFilterNotification(filterValue) {
        const filterText = filterValue === 'all' ? 'All projects' : filterValue.charAt(0).toUpperCase() + filterValue.slice(1) + ' projects';
        showNotification(`Showing ${filterText}`, 'info');
    }

    // Method to filter by URL hash
    filterByHash() {
        const hash = window.location.hash;
        if (hash.includes('projects-')) {
            const filterValue = hash.split('-')[1];
            const button = document.querySelector(`[data-filter="${filterValue}"]`);
            if (button) {
                this.handleFilterClick({ currentTarget: button, preventDefault: () => {} });
            }
        }
    }
}

// Initialize project filter
const projectFilter = new ProjectFilter();

// Handle URL hash changes
window.addEventListener('hashchange', () => {
    projectFilter.filterByHash();
});

// Form Validation and Submission
// ========================================
// ENHANCED CONTACT FORM SYSTEM
// ========================================

class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
        this.initEmailJS();
    }

    init() {
        if (this.form) {
            this.setupEventListeners();
            this.setupValidation();
        }
    }

    initEmailJS() {
        // Wait for EmailJS to load
        const checkEmailJS = () => {
            if (typeof emailjs !== 'undefined') {
                console.log('EmailJS is available, initializing...');
                const config = this.getEmailConfig();
                try {
                    emailjs.init(config.PUBLIC_KEY);
                    console.log('EmailJS initialized in ContactForm');
                } catch (error) {
                    console.error('EmailJS initialization error in ContactForm:', error);
                }
            } else {
                console.log('EmailJS not yet loaded, retrying...');
                setTimeout(checkEmailJS, 100);
            }
        };
        
        // Start checking after a short delay
        setTimeout(checkEmailJS, 500);
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    setupValidation() {
        // Add validation attributes
        const emailInput = this.form.querySelector('input[type="email"]');
        if (emailInput) {
            // Remove any existing pattern to avoid regex errors
            emailInput.removeAttribute('pattern');
            // Use built-in HTML5 email validation instead
            emailInput.setAttribute('type', 'email');
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name') || this.form.querySelector('input[type="text"]').value,
            email: formData.get('email') || this.form.querySelector('input[type="email"]').value,
            service: formData.get('service') || this.form.querySelector('select').value,
            subject: formData.get('subject') || 'Portfolio Contact',
            message: formData.get('message') || this.form.querySelector('textarea').value,
            timestamp: new Date().toISOString()
        };
        
        this.submitForm(data);
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.type || field.tagName.toLowerCase();
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = `${this.getFieldLabel(fieldName)} is required`;
            isValid = false;
        }
        
        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
        }
        
        // Name validation
        if (fieldName === 'text' && value && value.length < 2) {
            errorMessage = 'Name must be at least 2 characters long';
            isValid = false;
        }
        
        // Message validation
        if (fieldName === 'textarea' && value && value.length < 10) {
            errorMessage = 'Message must be at least 10 characters long';
            isValid = false;
        }
        
        this.showFieldError(field, errorMessage);
        return isValid;
    }

    getFieldLabel(fieldName) {
        const labels = {
            'name': 'Name',
            'email': 'Email',
            'service': 'Service',
            'subject': 'Subject',
            'message': 'Message',
            'text': 'Name',
            'textarea': 'Message',
            'select': 'Service'
        };
        return labels[fieldName] || fieldName;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        if (message) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    async submitForm(data) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Update button state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send email using EmailJS
            await this.sendEmailViaEmailJS(data);
            
            // Success
            this.showSuccessMessage();
            this.form.reset();
            this.clearAllErrors();
            
        } catch (error) {
            // Error
            this.showErrorMessage(error.message);
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    getEmailConfig() {
        // Return email configuration
        return {
            PUBLIC_KEY: "fskHEzXL0R69WMIWx", // Your EmailJS public key
            SERVICE_ID: "Yservice_jzajkjf", // Your EmailJS service ID
            TEMPLATE_ID: "template_d8a084j", // Your EmailJS template ID
            TO_EMAIL: "konaduprince26@gmail.com"
        };
    }

    async sendEmailViaEmailJS(data) {
        const config = this.getEmailConfig();
        
        console.log('EmailJS Config:', config);
        console.log('Form Data:', data);
        
        // Check if EmailJS is configured
        if (config.PUBLIC_KEY === "YOUR_PUBLIC_KEY_HERE" || 
            config.SERVICE_ID === "YOUR_SERVICE_ID_HERE" || 
            config.TEMPLATE_ID === "YOUR_TEMPLATE_ID_HERE") {
            throw new Error('EmailJS not configured. Please set up your EmailJS credentials.');
        }
        
        // Check if EmailJS library is loaded
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS library not loaded');
            throw new Error('EmailJS library not loaded. Please check your internet connection and refresh the page.');
        }
        
        console.log('EmailJS library loaded, initializing...');
        
        // Initialize EmailJS
        try {
            emailjs.init(config.PUBLIC_KEY);
            console.log('EmailJS initialized successfully');
        } catch (initError) {
            console.error('EmailJS initialization error:', initError);
            throw new Error('Failed to initialize EmailJS: ' + initError.message);
        }
        
        // Prepare template parameters
        const templateParams = {
            from_name: data.name,
            from_email: data.email,
            subject: data.subject || 'Portfolio Contact',
            message: data.message,
            to_email: config.TO_EMAIL
        };
        
        console.log('Sending email with params:', templateParams);
        
        // Send email using EmailJS
        try {
            const response = await emailjs.send(
                config.SERVICE_ID,
                config.TEMPLATE_ID,
                templateParams
            );
            
            console.log('EmailJS response:', response);
            
            if (response.status !== 200) {
                throw new Error(`EmailJS returned status ${response.status}`);
            }
            
            // Log successful submission
            console.log('Contact form submission successful:', data);
            
        } catch (emailError) {
            console.error('EmailJS send error:', emailError);
            throw new Error('Failed to send email: ' + emailError.message);
        }
    }

    async simulateApiCall(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate occasional failures for testing
        if (Math.random() < 0.1) {
            throw new Error('Network error. Please try again.');
        }
        
        // Log the data (in real implementation, send to server)
        console.log('Contact form submission:', data);
        
        // In a real implementation, you would send this data to your server
        // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });
    }

    showSuccessMessage() {
        showNotification('Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
        
        // Show additional success details
        setTimeout(() => {
            showNotification('Thank you for reaching out! Check your email for a confirmation.', 'info');
        }, 2000);
    }

    showErrorMessage(message) {
        showNotification(message || 'Failed to send message. Please try again.', 'error');
    }

    clearAllErrors() {
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => this.clearFieldError(field));
    }
}

// Initialize contact form
const contactForm = new ContactForm();

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Enhanced Animation on Scroll with Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add staggered animation for grid items
            if (entry.target.classList.contains('expertise-grid') || 
                entry.target.classList.contains('certifications-grid') ||
                entry.target.classList.contains('projects-grid') ||
                entry.target.classList.contains('skills-grid') ||
                entry.target.classList.contains('content-grid') ||
                entry.target.classList.contains('testimonials-grid')) {
                
                const items = entry.target.querySelectorAll('.expertise-card, .certification-card, .project-card, .skill-category, .content-card, .testimonial-card');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.project-card, .skill-item, .about-stats .stat, .highlight-item, .expertise-card, .content-card, .certification-card, .testimonial-card');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Observe section containers for staggered animations
    const sectionContainers = document.querySelectorAll('.expertise-grid, .certifications-grid, .projects-grid, .skills-grid, .content-grid, .testimonials-grid');
    sectionContainers.forEach(container => {
        container.style.opacity = '0';
        container.style.transform = 'translateY(30px)';
        container.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(container);
    });
});

// Enhanced expertise, content, and certification card interactions
document.addEventListener('DOMContentLoaded', () => {
    const expertiseCards = document.querySelectorAll('.expertise-card');
    const contentCards = document.querySelectorAll('.content-card');
    const certificationCards = document.querySelectorAll('.certification-card');
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    [...expertiseCards, ...contentCards, ...certificationCards, ...testimonialCards].forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add smooth scrolling for all new sections
document.addEventListener('DOMContentLoaded', () => {
    const expertiseSection = document.querySelector('#expertise');
    const certificationsSection = document.querySelector('#certifications');
    const contentSection = document.querySelector('#content');
    const testimonialsSection = document.querySelector('#testimonials');

    if (expertiseSection) {
        observer.observe(expertiseSection);
    }

    if (certificationsSection) {
        observer.observe(certificationsSection);
    }

    if (contentSection) {
        observer.observe(contentSection);
    }

    if (testimonialsSection) {
        observer.observe(testimonialsSection);
    }
});

// Enhanced certification card animations
document.addEventListener('DOMContentLoaded', () => {
    const certificationCards = document.querySelectorAll('.certification-card');

    certificationCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.style.animation = 'fadeInUp 0.8s ease forwards';
    });
});

// Add networking project category support
document.addEventListener('DOMContentLoaded', () => {
    const networkingProjects = document.querySelectorAll('[data-category="networking"]');

    networkingProjects.forEach(project => {
        project.addEventListener('mouseenter', function() {
            this.style.borderColor = '#1ba1d2';
        });

        project.addEventListener('mouseleave', function() {
            this.style.borderColor = '#f0f0f0';
        });
    });
});

// Enhanced testimonial card interactions
document.addEventListener('DOMContentLoaded', () => {
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    testimonialCards.forEach((card, index) => {
        // Add staggered entrance animation
        card.style.animationDelay = `${index * 0.3}s`;
        card.style.animation = 'fadeInUp 0.8s ease forwards';
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });
});

// Performance optimization: Debounced scroll handler
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(() => {
        // Handle scroll-based animations or effects here
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.tech-badge');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 10);
});

// Enhanced form focus effects
document.addEventListener('DOMContentLoaded', () => {
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.style.borderColor = '#3498db';
            this.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Close any open notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => notification.remove());
    }
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
`;

document.head.appendChild(style);

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading states to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
    
    // Add ripple effect to buttons
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Make resume download button functional
    const resumeBtn = document.querySelector('.btn-resume');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            downloadResume();
        });
    }
});

// Project button functionality
function showProjectDetails(projectId) {
    const projectInfo = {
        'network-infrastructure': {
            title: 'Enterprise Network Infrastructure',
            description: 'A comprehensive network infrastructure design for enterprise environments, featuring Cisco technologies, VLANs, routing protocols, and advanced security measures.',
            features: ['Scalable Architecture', 'High Availability', 'Security Integration', 'Performance Monitoring', 'Automated Management'],
            technologies: ['Cisco IOS', 'VLANs', 'OSPF', 'Network Security', 'SNMP Monitoring'],
            status: 'Completed'
        },
        'cloud-infrastructure': {
            title: 'Multi-Cloud Infrastructure',
            description: 'Hybrid cloud solution using AWS and Azure with infrastructure as code, automated deployment, and comprehensive monitoring.',
            features: ['Multi-Cloud Strategy', 'Infrastructure as Code', 'Automated Deployment', 'Cost Optimization', 'Security Compliance'],
            technologies: ['AWS', 'Azure', 'Terraform', 'Docker', 'CI/CD'],
            status: 'In Progress'
        }
    };

    const project = projectInfo[projectId];
    if (project) {
        showProjectModal(project);
    }
}

function showProjectDemo(projectId) {
    const demoInfo = {
        'security-tool': {
            title: 'Network Security Assessment Tool',
            message: 'This tool is currently in development. It will provide comprehensive network vulnerability scanning and security assessment capabilities.',
            features: ['Vulnerability Scanning', 'Penetration Testing', 'Security Reporting', 'Real-time Monitoring']
        },
        'ecommerce': {
            title: 'E-commerce Platform',
            message: 'A modern e-commerce solution with advanced features including payment processing, inventory management, and analytics.',
            features: ['Payment Integration', 'Inventory Management', 'User Management', 'Analytics Dashboard']
        }
    };

    const demo = demoInfo[projectId];
    if (demo) {
        showDemoModal(demo);
    }
}

function showProjectSource(projectId) {
    const sourceInfo = {
        'security-tool': 'Network Security Assessment Tool - Source code available on GitHub',
        'ecommerce': 'E-commerce Platform - Source code available on GitHub',
        'auth-system': 'Authentication System - Source code available on GitHub'
    };

    const message = sourceInfo[projectId] || 'Source code available on GitHub';
    showNotification(message, 'info');
}

function showProjectDocumentation(projectId) {
    const docInfo = {
        'network-infrastructure': 'Network Infrastructure Documentation - Technical specifications and deployment guide available',
        'cloud-infrastructure': 'Cloud Infrastructure Documentation - Architecture diagrams and deployment procedures available'
    };

    const message = docInfo[projectId] || 'Documentation available';
    showNotification(message, 'info');
}

function showProjectArchitecture(projectId) {
    const archInfo = {
        'cloud-infrastructure': 'Cloud Architecture - Multi-cloud design with AWS and Azure integration, showing load balancing, auto-scaling, and security layers.'
    };

    const message = archInfo[projectId] || 'Architecture details available';
    showNotification(message, 'info');
}

// Project Modal Functions
function showProjectModal(project) {
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${project.title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${project.description}</p>
                <div class="project-features">
                    <h4>Key Features:</h4>
                    <ul>
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="project-tech">
                    <h4>Technologies Used:</h4>
                    <div class="tech-tags">
                        ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                </div>
                <div class="project-status">
                    <strong>Status:</strong> ${project.status}
                </div>
            </div>
        </div>
    `;

    // Add modal styles
    if (!document.querySelector('#modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .project-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-content {
                background: white;
                border-radius: 15px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                animation: slideIn 0.3s ease;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #eee;
            }
            
            .modal-header h3 {
                margin: 0;
                color: #2c3e50;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            }
            
            .modal-close:hover {
                color: #e74c3c;
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .project-features ul {
                list-style: none;
                padding: 0;
            }
            
            .project-features li {
                padding: 5px 0;
                position: relative;
                padding-left: 20px;
            }
            
            .project-features li:before {
                content: '✓';
                position: absolute;
                left: 0;
                color: #27ae60;
                font-weight: bold;
            }
            
            .tech-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 10px;
            }
            
            .tech-tags span {
                background: #e8f4fd;
                color: #3498db;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 0.9rem;
            }
            
            .project-status {
                margin-top: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 10px;
                border-left: 4px solid #3498db;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(modalStyles);
    }

    document.body.appendChild(modal);

    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function closeModal(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', closeModal);
        }
    });
}

function showDemoModal(demo) {
    const modal = document.createElement('div');
    modal.className = 'demo-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${demo.title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${demo.message}</p>
                <div class="demo-features">
                    <h4>Features:</h4>
                    <ul>
                        ${demo.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="demo-note">
                    <strong>Note:</strong> This project is currently in development. The live demo will be available soon!
                </div>
            </div>
        </div>
    `;

    // Add demo modal styles
    if (!document.querySelector('#demo-modal-styles')) {
        const demoModalStyles = document.createElement('style');
        demoModalStyles.id = 'demo-modal-styles';
        demoModalStyles.textContent = `
            .demo-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .demo-note {
                margin-top: 20px;
                padding: 15px;
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 10px;
                color: #856404;
            }
        `;
        document.head.appendChild(demoModalStyles);
    }

    document.body.appendChild(modal);

    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Resume download functionality
function downloadResume() {
    // Show resume preview first
    showResumePreview();
}

function showResumePreview() {
    const resumeContent = `
Konadu Prince
Cybersecurity Analyst & Software Developer
UCC Graduate | CCNA & Network+ Certified

CONTACT INFORMATION
Email: konaduprince26@gmail.com
LinkedIn: linkedin.com/in/konadu-prince
Location: Ghana

PROFESSIONAL SUMMARY
Cybersecurity Analyst and Software Developer with expertise in network security, cloud computing, and modern web technologies. CCNA and Network+ certified professional with a passion for creating secure, scalable solutions.

EDUCATION
University of Cape Coast (UCC) - Graduate
Degree in Computer Science/Information Technology

CERTIFICATIONS
• CCNA (Cisco Certified Network Associate) - Valid: 2024-2027
• Network+ (CompTIA Network+) - Valid: 2024-2027
• AWS Cloud Practitioner - Valid: 2024-2027
• Cybersecurity Fundamentals

TECHNICAL SKILLS
Networking & Infrastructure: Cisco Technologies, Network Design, Network Security, Network Troubleshooting
Cybersecurity: Threat Analysis, Vulnerability Assessment, Security Architecture, Penetration Testing
Development: HTML5, CSS3, JavaScript, Python, React, Node.js
Cloud & DevOps: AWS, Azure, Docker, Terraform, CI/CD
Database: SQL, NoSQL, Database Security, Performance Optimization

PROFESSIONAL EXPERIENCE
Cybersecurity Analyst
• Conducted comprehensive security assessments and vulnerability management
• Implemented security architecture and incident response procedures
• Performed penetration testing and security auditing

Network Engineer
• Designed and implemented enterprise network infrastructure
• Configured Cisco devices and implemented routing protocols
• Troubleshot network issues and optimized performance

Software Developer
• Developed full-stack web applications using modern technologies
• Created secure authentication systems and API integrations
• Implemented responsive design and user experience improvements

Cloud Practitioner
• Designed and deployed multi-cloud infrastructure solutions
• Implemented infrastructure as code using Terraform
• Managed AWS and Azure services for optimal performance

ADDITIONAL SKILLS
• Life Coaching & Personal Development
• Content Creation (YouTube: Panisow Animations)
• UI/UX Design Principles
• AI Basics and Technology Education

PROJECTS
• Enterprise Network Infrastructure - Cisco-based network design
• Network Security Assessment Tool - Python-based security tool
• E-commerce Platform - Full-stack web application
• Multi-Cloud Infrastructure - AWS/Azure hybrid solution
• Modern Authentication System - Secure login system

LANGUAGES
English (Fluent), Local Languages

INTERESTS
Cybersecurity, Networking, Cloud Computing, Software Development, Life Coaching, Content Creation, AI Technology
    `;

    const modal = document.createElement('div');
    modal.className = 'resume-preview-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Resume Preview</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="resume-preview">
                    <pre>${resumeContent}</pre>
                </div>
                <div class="resume-actions">
                    <button class="btn btn-primary" onclick="downloadResumeFile()">
                        <i class="fas fa-download"></i>
                        Download Resume
                    </button>
                    <button class="btn btn-outline" onclick="closeResumePreview()">
                        <i class="fas fa-times"></i>
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add resume preview modal styles
    if (!document.querySelector('#resume-preview-styles')) {
        const resumePreviewStyles = document.createElement('style');
        resumePreviewStyles.id = 'resume-preview-styles';
        resumePreviewStyles.textContent = `
            .resume-preview-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .resume-preview-modal .modal-content {
                background: white;
                border-radius: 15px;
                max-width: 800px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                animation: slideIn 0.3s ease;
            }
            
            .resume-preview-modal .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #eee;
                background: #f8f9fa;
                border-radius: 15px 15px 0 0;
            }
            
            .resume-preview-modal .modal-header h3 {
                margin: 0;
                color: #2c3e50;
                font-size: 1.5rem;
            }
            
            .resume-preview-modal .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .resume-preview-modal .modal-close:hover {
                background: #e74c3c;
                color: white;
            }
            
            .resume-preview-modal .modal-body {
                padding: 20px;
            }
            
            .resume-preview {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 20px;
                max-height: 400px;
                overflow-y: auto;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.6;
                white-space: pre-wrap;
                color: #2c3e50;
            }
            
            .resume-preview pre {
                margin: 0;
                font-family: inherit;
                font-size: inherit;
                line-height: inherit;
            }
            
            .resume-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .resume-actions .btn {
                min-width: 150px;
                padding: 12px 24px;
                font-size: 16px;
            }
            
            @media (max-width: 768px) {
                .resume-preview-modal .modal-content {
                    width: 95%;
                    margin: 20px;
                }
                
                .resume-preview {
                    font-size: 12px;
                    padding: 15px;
                }
                
                .resume-actions {
                    flex-direction: column;
                    align-items: center;
                }
                
                .resume-actions .btn {
                    width: 100%;
                    max-width: 250px;
                }
            }
            
            @keyframes slideOut {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(-50px); opacity: 0; }
            }
        `;
        document.head.appendChild(resumePreviewStyles);
    }

    document.body.appendChild(modal);

    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeResumePreview);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeResumePreview();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function closeResumePreviewKey(e) {
        if (e.key === 'Escape') {
            closeResumePreview();
            document.removeEventListener('keydown', closeResumePreviewKey);
        }
    });
}

function closeResumePreview() {
    const modal = document.querySelector('.resume-preview-modal');
    if (modal) {
        modal.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

function downloadResumeFile() {
    const resumeContent = `
Konadu Prince
Cybersecurity Analyst & Software Developer
UCC Graduate | CCNA & Network+ Certified

CONTACT INFORMATION
Email: konaduprince26@gmail.com
LinkedIn: linkedin.com/in/konadu-prince
Location: Ghana

PROFESSIONAL SUMMARY
Cybersecurity Analyst and Software Developer with expertise in network security, cloud computing, and modern web technologies. CCNA and Network+ certified professional with a passion for creating secure, scalable solutions.

EDUCATION
University of Cape Coast (UCC) - Graduate
Degree in Computer Science/Information Technology

CERTIFICATIONS
• CCNA (Cisco Certified Network Associate) - Valid: 2024-2027
• Network+ (CompTIA Network+) - Valid: 2024-2027
• AWS Cloud Practitioner - Valid: 2024-2027
• Cybersecurity Fundamentals

TECHNICAL SKILLS
Networking & Infrastructure: Cisco Technologies, Network Design, Network Security, Network Troubleshooting
Cybersecurity: Threat Analysis, Vulnerability Assessment, Security Architecture, Penetration Testing
Development: HTML5, CSS3, JavaScript, Python, React, Node.js
Cloud & DevOps: AWS, Azure, Docker, Terraform, CI/CD
Database: SQL, NoSQL, Database Security, Performance Optimization

PROFESSIONAL EXPERIENCE
Cybersecurity Analyst
• Conducted comprehensive security assessments and vulnerability management
• Implemented security architecture and incident response procedures
• Performed penetration testing and security auditing

Network Engineer
• Designed and implemented enterprise network infrastructure
• Configured Cisco devices and implemented routing protocols
• Troubleshot network issues and optimized performance

Software Developer
• Developed full-stack web applications using modern technologies
• Created secure authentication systems and API integrations
• Implemented responsive design and user experience improvements

Cloud Practitioner
• Designed and deployed multi-cloud infrastructure solutions
• Implemented infrastructure as code using Terraform
• Managed AWS and Azure services for optimal performance

ADDITIONAL SKILLS
• Life Coaching & Personal Development
• Content Creation (YouTube: Panisow Animations)
• UI/UX Design Principles
• AI Basics and Technology Education

PROJECTS
• Enterprise Network Infrastructure - Cisco-based network design
• Network Security Assessment Tool - Python-based security tool
• E-commerce Platform - Full-stack web application
• Multi-Cloud Infrastructure - AWS/Azure hybrid solution
• Modern Authentication System - Secure login system

LANGUAGES
English (Fluent), Local Languages

INTERESTS
Cybersecurity, Networking, Cloud Computing, Software Development, Life Coaching, Content Creation, AI Technology
    `;

    // Create and download the resume file
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Konadu_Prince_Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Close the preview modal
    closeResumePreview();

    // Show success notification
    showNotification('Resume downloaded successfully!', 'success');
}

// ========================================
// ENHANCED PROJECT MODAL SYSTEM
// ========================================

class ProjectModal {
    constructor() {
        this.projectData = {
            'network-infrastructure': {
                title: 'Network Infrastructure Design',
                description: 'Comprehensive network infrastructure design and implementation for enterprise environments with focus on scalability, security, and performance.',
                technologies: ['Cisco IOS', 'VLANs', 'OSPF', 'EIGRP', 'BGP', 'Network Security', 'QoS'],
                features: ['Scalable Architecture', 'High Availability', 'Security Implementation', 'Performance Optimization', 'Load Balancing'],
                challenges: ['Complex routing requirements', 'Security compliance', 'Performance optimization', 'Network segmentation'],
                solutions: ['Implemented OSPF routing', 'Deployed VLAN segmentation', 'Applied security policies', 'Optimized network topology'],
                demo: 'https://demo.network-infrastructure.com',
                source: 'https://github.com/konaduprince/network-infrastructure',
                documentation: 'https://docs.network-infrastructure.com'
            },
            'security-tool': {
                title: 'Security Assessment Tool',
                description: 'Automated security assessment and vulnerability scanning tool for network infrastructure with comprehensive reporting and risk analysis.',
                technologies: ['Python', 'Network Scanning', 'Vulnerability Assessment', 'Reporting', 'Nmap', 'OpenVAS'],
                features: ['Automated Scanning', 'Vulnerability Detection', 'Report Generation', 'Risk Assessment', 'Compliance Checking'],
                challenges: ['Large network coverage', 'False positive reduction', 'Performance optimization', 'Real-time monitoring'],
                solutions: ['Implemented multi-threading', 'Applied filtering algorithms', 'Optimized scanning techniques', 'Added caching mechanisms'],
                demo: 'https://demo.security-tool.com',
                source: 'https://github.com/konaduprince/security-tool',
                documentation: 'https://docs.security-tool.com'
            },
            'ecommerce': {
                title: 'E-commerce Platform',
                description: 'Full-stack e-commerce platform with modern UI/UX, secure payment processing, and comprehensive admin dashboard.',
                technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'Express', 'JWT', 'Redux'],
                features: ['User Authentication', 'Product Management', 'Shopping Cart', 'Payment Processing', 'Order Tracking', 'Admin Dashboard'],
                challenges: ['Payment security', 'User experience', 'Performance optimization', 'Inventory management'],
                solutions: ['Integrated Stripe API', 'Implemented responsive design', 'Applied caching strategies', 'Added real-time updates'],
                demo: 'https://demo.ecommerce-platform.com',
                source: 'https://github.com/konaduprince/ecommerce-platform',
                documentation: 'https://docs.ecommerce-platform.com'
            },
            'cloud-infrastructure': {
                title: 'Cloud Infrastructure Setup',
                description: 'AWS cloud infrastructure design and implementation with auto-scaling, monitoring, and disaster recovery capabilities.',
                technologies: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'CloudFormation', 'Lambda', 'RDS'],
                features: ['Auto-scaling', 'Load Balancing', 'Monitoring', 'Backup & Recovery', 'CI/CD Pipeline', 'Infrastructure as Code'],
                challenges: ['Cost optimization', 'Security compliance', 'High availability', 'Disaster recovery'],
                solutions: ['Implemented auto-scaling', 'Applied security groups', 'Deployed multi-AZ setup', 'Created backup strategies'],
                demo: 'https://demo.cloud-infrastructure.com',
                source: 'https://github.com/konaduprince/cloud-infrastructure',
                documentation: 'https://docs.cloud-infrastructure.com'
            },
            'auth-system': {
                title: 'Modern Authentication System',
                description: 'Secure authentication system with multi-factor authentication, social login, and comprehensive session management.',
                technologies: ['JWT', 'OAuth 2.0', 'MFA', 'Session Management', 'Node.js', 'MongoDB', 'Redis'],
                features: ['Multi-factor Authentication', 'Social Login', 'Session Management', 'Security Policies', 'Role-based Access', 'Audit Logging'],
                challenges: ['Security implementation', 'User experience', 'Session management', 'Scalability'],
                solutions: ['Implemented JWT tokens', 'Added MFA support', 'Applied security policies', 'Optimized session handling'],
                demo: 'https://demo.auth-system.com',
                source: 'https://github.com/konaduprince/auth-system',
                documentation: 'https://docs.auth-system.com'
            }
        };
    }

    showProjectDetails(projectId) {
        const project = this.projectData[projectId];
        if (!project) {
            this.showNotification('Project not found', 'error');
            return;
        }

        this.createModal('details', project);
    }

    showProjectDemo(projectId) {
        const project = this.projectData[projectId];
        if (!project) {
            this.showNotification('Project not found', 'error');
            return;
        }

        this.createModal('demo', project);
    }

    showProjectSource(projectId) {
        const project = this.projectData[projectId];
        if (!project) {
            this.showNotification('Project not found', 'error');
            return;
        }

        this.createModal('source', project);
    }

    showProjectDocumentation(projectId) {
        const project = this.projectData[projectId];
        if (!project) {
            this.showNotification('Project not found', 'error');
            return;
        }

        this.createModal('documentation', project);
    }

    showProjectArchitecture(projectId) {
        const project = this.projectData[projectId];
        if (!project) {
            this.showNotification('Project not found', 'error');
            return;
        }

        this.createModal('architecture', project);
    }

    createModal(type, project) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = this.getModalContent(type, project);
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => modal.classList.add('active'), 10);
        
        // Close modal on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
    }

    getModalContent(type, project) {
        const baseContent = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${project.title}</h3>
                    <button class="modal-close" onclick="projectModal.closeModal(this.closest('.modal-overlay'))">&times;</button>
                </div>
                <div class="modal-body">
                    <p class="project-description">${project.description}</p>
        `;

        let specificContent = '';
        
        switch (type) {
            case 'details':
                specificContent = this.getDetailsContent(project);
                break;
            case 'demo':
                specificContent = this.getDemoContent(project);
                break;
            case 'source':
                specificContent = this.getSourceContent(project);
                break;
            case 'documentation':
                specificContent = this.getDocumentationContent(project);
                break;
            case 'architecture':
                specificContent = this.getArchitectureContent(project);
                break;
        }

        return baseContent + specificContent + `
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="projectModal.closeModal(this.closest('.modal-overlay'))">Close</button>
                </div>
            </div>
        `;
    }

    getDetailsContent(project) {
        return `
            <div class="project-details">
                <h4>Technologies Used</h4>
                <div class="tech-tags">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                
                <h4>Key Features</h4>
                <ul class="feature-list">
                    ${project.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                </ul>
                
                <h4>Challenges & Solutions</h4>
                <div class="challenges-solutions">
                    <div class="challenges">
                        <h5><i class="fas fa-exclamation-triangle"></i> Challenges</h5>
                        <ul>
                            ${project.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="solutions">
                        <h5><i class="fas fa-lightbulb"></i> Solutions</h5>
                        <ul>
                            ${project.solutions.map(solution => `<li>${solution}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    getDemoContent(project) {
        return `
            <div class="demo-content">
                <div class="demo-preview">
                    <h4><i class="fas fa-play-circle"></i> Live Demo</h4>
                    <p>Experience the project in action with our interactive demo.</p>
                    <div class="demo-actions">
                        <a href="${project.demo}" target="_blank" class="btn btn-primary">
                            <i class="fas fa-external-link-alt"></i> Open Demo
                        </a>
                        <button class="btn btn-outline" onclick="projectModal.showProjectDetails('${project.title.toLowerCase().replace(/\s+/g, '-')}')">
                            <i class="fas fa-info-circle"></i> View Details
                        </button>
                    </div>
                </div>
                <div class="demo-features">
                    <h5>Demo Features</h5>
                    <ul>
                        ${project.features.slice(0, 4).map(feature => `<li><i class="fas fa-star"></i> ${feature}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    getSourceContent(project) {
        return `
            <div class="source-content">
                <div class="source-info">
                    <h4><i class="fab fa-github"></i> Source Code</h4>
                    <p>Explore the complete source code and contribute to the project.</p>
                    <div class="source-actions">
                        <a href="${project.source}" target="_blank" class="btn btn-primary">
                            <i class="fab fa-github"></i> View on GitHub
                        </a>
                        <button class="btn btn-outline" onclick="projectModal.showProjectDetails('${project.title.toLowerCase().replace(/\s+/g, '-')}')">
                            <i class="fas fa-code"></i> View Details
                        </button>
                    </div>
                </div>
                <div class="source-stats">
                    <h5>Repository Stats</h5>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <i class="fas fa-code"></i>
                            <span>${project.technologies.length}+ Technologies</span>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-feather-alt"></i>
                            <span>${project.features.length} Features</span>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-bug"></i>
                            <span>Active Development</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getDocumentationContent(project) {
        return `
            <div class="documentation-content">
                <div class="docs-info">
                    <h4><i class="fas fa-book"></i> Documentation</h4>
                    <p>Comprehensive documentation covering setup, usage, and API reference.</p>
                    <div class="docs-actions">
                        <a href="${project.documentation}" target="_blank" class="btn btn-primary">
                            <i class="fas fa-book-open"></i> Read Documentation
                        </a>
                        <button class="btn btn-outline" onclick="projectModal.showProjectDetails('${project.title.toLowerCase().replace(/\s+/g, '-')}')">
                            <i class="fas fa-info-circle"></i> View Details
                        </button>
                    </div>
                </div>
                <div class="docs-sections">
                    <h5>Documentation Sections</h5>
                    <ul>
                        <li><i class="fas fa-rocket"></i> Getting Started</li>
                        <li><i class="fas fa-cog"></i> Installation Guide</li>
                        <li><i class="fas fa-play"></i> Usage Examples</li>
                        <li><i class="fas fa-code"></i> API Reference</li>
                        <li><i class="fas fa-question-circle"></i> FAQ</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getArchitectureContent(project) {
        return `
            <div class="architecture-content">
                <div class="arch-info">
                    <h4><i class="fas fa-sitemap"></i> System Architecture</h4>
                    <p>Detailed overview of the system architecture and design patterns.</p>
                </div>
                <div class="arch-diagram">
                    <div class="arch-layer">
                        <h5>Presentation Layer</h5>
                        <div class="arch-components">
                            ${project.technologies.filter(tech => ['React', 'Vue', 'Angular', 'HTML', 'CSS', 'JavaScript'].includes(tech)).map(tech => `<span class="arch-component">${tech}</span>`).join('')}
                        </div>
                    </div>
                    <div class="arch-layer">
                        <h5>Application Layer</h5>
                        <div class="arch-components">
                            ${project.technologies.filter(tech => ['Node.js', 'Express', 'Python', 'Java', 'C#'].includes(tech)).map(tech => `<span class="arch-component">${tech}</span>`).join('')}
                        </div>
                    </div>
                    <div class="arch-layer">
                        <h5>Data Layer</h5>
                        <div class="arch-components">
                            ${project.technologies.filter(tech => ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'AWS RDS'].includes(tech)).map(tech => `<span class="arch-component">${tech}</span>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="arch-features">
                    <h5>Architecture Features</h5>
                    <ul>
                        <li><i class="fas fa-shield-alt"></i> Security First Design</li>
                        <li><i class="fas fa-expand-arrows-alt"></i> Scalable Architecture</li>
                        <li><i class="fas fa-heartbeat"></i> High Availability</li>
                        <li><i class="fas fa-tachometer-alt"></i> Performance Optimized</li>
                    </ul>
                </div>
            </div>
        `;
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
    }

    showNotification(message, type = 'info') {
        // Use existing notification system
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Initialize project modal system
const projectModal = new ProjectModal();

// Override existing project functions with enhanced versions
function showProjectDetails(projectId) {
    projectModal.showProjectDetails(projectId);
}

function showProjectDemo(projectId) {
    projectModal.showProjectDemo(projectId);
}

function showProjectSource(projectId) {
    projectModal.showProjectSource(projectId);
}

function showProjectDocumentation(projectId) {
    projectModal.showProjectDocumentation(projectId);
}

function showProjectArchitecture(projectId) {
    projectModal.showProjectArchitecture(projectId);
}

// ========================================
// ENHANCED INTERACTIVE FEATURES
// ========================================

class InteractiveFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupParallaxEffects();
        this.setupProgressBars();
        this.setupCounters();
        this.setupTooltips();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Special handling for different elements
                    if (entry.target.classList.contains('skill-bar')) {
                        this.animateSkillBar(entry.target);
                    }
                    
                    if (entry.target.classList.contains('counter')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const elementsToAnimate = document.querySelectorAll(
            '.project-card, .skill-item, .expertise-card, .certification-card, .content-card, .testimonial-card, .counter, .skill-bar'
        );
        
        elementsToAnimate.forEach(el => observer.observe(el));
    }

    setupHoverEffects() {
        // Enhanced card hover effects
        const cards = document.querySelectorAll('.project-card, .expertise-card, .certification-card, .content-card, .testimonial-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.enhanceCardHover(e.target, true);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.enhanceCardHover(e.target, false);
            });
        });

        // Button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.enhanceButtonHover(e.target, true);
            });
            
            button.addEventListener('mouseleave', (e) => {
                this.enhanceButtonHover(e.target, false);
            });
        });
    }

    enhanceCardHover(card, isEntering) {
        if (isEntering) {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            
            // Add glow effect
            const glow = document.createElement('div');
            glow.className = 'card-glow';
            glow.style.cssText = `
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
                border-radius: inherit;
                z-index: -1;
                opacity: 0.3;
                filter: blur(10px);
            `;
            card.style.position = 'relative';
            card.appendChild(glow);
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
            
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.remove();
            }
        }
    }

    enhanceButtonHover(button, isEntering) {
        if (isEntering) {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 8px 20px rgba(0, 123, 255, 0.3)';
        } else {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '';
        }
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero-bg, .section-bg');
        
        window.addEventListener('scroll', this.debounce(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 10));
    }

    setupProgressBars() {
        const progressBars = document.querySelectorAll('.skill-bar-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const percentage = progressBar.getAttribute('data-percentage');
                    
                    setTimeout(() => {
                        progressBar.style.width = percentage + '%';
                    }, 200);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => observer.observe(bar));
    }

    setupCounters() {
        const counters = document.querySelectorAll('.counter');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    }

    animateSkillBar(skillBar) {
        const fill = skillBar.querySelector('.skill-bar-fill');
        if (fill) {
            const percentage = fill.getAttribute('data-percentage');
            setTimeout(() => {
                fill.style.width = percentage + '%';
            }, 300);
        }
    }

    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target);
            });
            
            element.addEventListener('mouseleave', (e) => {
                this.hideTooltip(e.target);
            });
        });
    }

    showTooltip(element) {
        const tooltipText = element.getAttribute('data-tooltip');
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--card-bg);
            color: var(--text-primary);
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.85rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        });
        
        element._tooltip = tooltip;
    }

    hideTooltip(element) {
        const tooltip = element._tooltip;
        if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 300);
            delete element._tooltip;
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize interactive features
const interactiveFeatures = new InteractiveFeatures();

// ========================================
// ENHANCED NAVIGATION FEATURES
// ========================================

// Active Navigation Highlighting
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    let currentSection = '';
    let currentOffset = window.scrollY + 150; // Offset for better detection
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;
        
        // Check if current scroll position is within this section
        if (currentOffset >= sectionTop && currentOffset < sectionBottom) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // If no section is found, check if we're at the very top
    if (!currentSection && window.scrollY < 200) {
        currentSection = 'home';
    }
    
    // Update navbar links
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.includes('#')) {
            const sectionId = href.split('#')[1];
            if (sectionId === currentSection) {
                link.classList.add('active');
            }
        }
    });
    
    // Update sidebar links
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Scroll to Top Functionality
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Sidebar Navigation Functionality
function initSidebar() {
    const sidebarNav = document.getElementById('sidebarNav');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    if (sidebarNav && sidebarToggle && sidebarClose) {
        // Toggle sidebar
        sidebarToggle.addEventListener('click', () => {
            sidebarNav.classList.add('active');
        });
        
        // Close sidebar
        sidebarClose.addEventListener('click', () => {
            sidebarNav.classList.remove('active');
        });
        
        // Close sidebar when clicking on links
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                sidebarNav.classList.remove('active');
            });
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebarNav.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebarNav.classList.remove('active');
            }
        });
        
        // Close sidebar on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                sidebarNav.classList.remove('active');
            }
        });
    }
}

// Throttle function for better performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize enhanced navigation features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize new navigation features
    initScrollToTop();
    initSidebar();
    
    // Update active navigation on scroll with throttling
    const throttledUpdateNavigation = throttle(updateActiveNavigation, 100);
    window.addEventListener('scroll', throttledUpdateNavigation);
    
    // Initial call to set active navigation
    updateActiveNavigation();
});
