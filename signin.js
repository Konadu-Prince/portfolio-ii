// Form handling and validation
document.addEventListener('DOMContentLoaded', function() {
    const signinForm = document.querySelector('.signin-form');
    const signinBtn = document.querySelector('.signin-btn');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const checkbox = document.querySelector('input[type="checkbox"]');

    // Form submission
    signinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            showLoading();
            
            // Simulate API call
            setTimeout(() => {
                showSuccess();
                
                // Reset form after success
                setTimeout(() => {
                    resetForm();
                }, 2000);
            }, 1500);
        }
    });

    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Email validation
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        } else {
            removeError(emailInput);
        }
        
        // Password validation
        if (!passwordInput.value.trim()) {
            showError(passwordInput, 'Password is required');
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            showError(passwordInput, 'Password must be at least 6 characters');
            isValid = false;
        } else {
            removeError(passwordInput);
        }
        
        return isValid;
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show error message
    function showError(input, message) {
        removeError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.8rem;
            margin-top: 5px;
            animation: slideIn 0.3s ease;
        `;
        
        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = '#e74c3c';
    }

    // Remove error message
    function removeError(input) {
        const errorDiv = input.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.style.borderColor = '#e1e8ed';
    }

    // Show loading state
    function showLoading() {
        signinBtn.classList.add('loading');
        signinBtn.innerHTML = '<i class="fas fa-spinner"></i>';
    }

    // Show success state
    function showSuccess() {
        signinBtn.classList.remove('loading');
        signinBtn.classList.add('success');
        signinBtn.innerHTML = '<i class="fas fa-check"></i><span>Success!</span>';
    }

    // Reset form
    function resetForm() {
        signinBtn.classList.remove('success', 'loading');
        signinBtn.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right"></i>';
        signinForm.reset();
        removeError(emailInput);
        removeError(passwordInput);
    }

    // Real-time validation
    emailInput.addEventListener('blur', function() {
        if (this.value.trim() && !isValidEmail(this.value)) {
            showError(this, 'Please enter a valid email');
        }
    });

    passwordInput.addEventListener('blur', function() {
        if (this.value.trim() && this.value.length < 6) {
            showError(this, 'Password must be at least 6 characters');
        }
    });

    // Clear errors on input
    emailInput.addEventListener('input', function() {
        if (this.style.borderColor === 'rgb(231, 76, 60)') {
            removeError(this);
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.style.borderColor === 'rgb(231, 76, 60)') {
            removeError(this);
        }
    });

    // Social sign-in buttons
    const socialBtns = document.querySelectorAll('.social-btn');
    
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Show loading state
            const originalContent = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            this.style.pointerEvents = 'none';
            
            // Simulate social sign-in
            setTimeout(() => {
                this.innerHTML = originalContent;
                this.style.pointerEvents = '';
                
                // Show success message
                showNotification(`${this.classList.contains('google') ? 'Google' : 'Facebook'} sign-in coming soon!`);
            }, 2000);
        });
    });

    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Password reset feature coming soon!');
    });

    // Notification system
    function showNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2c3e50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideOutRight {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100%); }
        }
    `;
    document.head.appendChild(style);

    // Enhanced input focus effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.style.transform = 'scale(1)';
        });
    });

    // Remember me functionality
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            showNotification('Remember me enabled');
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
            const nextInput = document.activeElement.parentNode.nextElementSibling?.querySelector('input');
            if (nextInput) {
                nextInput.focus();
            } else {
                signinBtn.click();
            }
        }
    });

    // Scroll to Top Functionality
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

    // Navbar Active Link Highlighting
    function updateActiveNavLink() {
        const currentPage = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            // Highlight based on current page
            if (currentPage.includes('signin.html')) {
                // For signin page, we could highlight a specific section
                // For now, we'll highlight the home link as it's the main page
                if (link.getAttribute('href') === 'index.html#home') {
                    link.classList.add('active');
                }
            }
        });
    }

    // Initialize navbar highlighting
    updateActiveNavLink();
});

