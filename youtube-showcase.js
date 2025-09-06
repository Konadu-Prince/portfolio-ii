// YouTube Showcase Slideshow JavaScript

// Global variables
let currentSlideIndex = 0;
let slides = [];
let indicators = [];
let autoplayInterval;
let isAutoplayActive = true;
const slideInterval = 20000; // 20 seconds

// Initialize the slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSlideshow();
    startAutoplay();
    setupEventListeners();
});

// Initialize slideshow elements
function initializeSlideshow() {
    slides = document.querySelectorAll('.slide');
    indicators = document.querySelectorAll('.indicator');
    
    // Set initial slide
    showSlide(0);
    
    // Update progress bar
    updateProgressBar();
}

// Show specific slide
function showSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach(slide => {
        slide.classList.remove('active', 'prev');
    });
    
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Add active class to current slide and indicator
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
    
    currentSlideIndex = index;
}

// Change slide (next/previous)
function changeSlide(direction) {
    let newIndex = currentSlideIndex + direction;
    
    // Handle wrap-around
    if (newIndex >= slides.length) {
        newIndex = 0;
    } else if (newIndex < 0) {
        newIndex = slides.length - 1;
    }
    
    showSlide(newIndex);
    resetAutoplay();
}

// Go to specific slide
function currentSlide(index) {
    showSlide(index - 1); // Convert to 0-based index
    resetAutoplay();
}

// Start autoplay
function startAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
    }
    
    autoplayInterval = setInterval(() => {
        if (isAutoplayActive) {
            changeSlide(1);
        }
    }, slideInterval);
}

// Stop autoplay
function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
    }
}

// Reset autoplay (restart timer)
function resetAutoplay() {
    if (isAutoplayActive) {
        startAutoplay();
    }
}

// Toggle autoplay
function toggleAutoplay() {
    isAutoplayActive = !isAutoplayActive;
    
    const autoplayIcon = document.getElementById('autoplay-icon');
    const autoplayText = document.getElementById('autoplay-text');
    
    if (isAutoplayActive) {
        autoplayIcon.className = 'fas fa-pause';
        autoplayText.textContent = 'Pause';
        startAutoplay();
    } else {
        autoplayIcon.className = 'fas fa-play';
        autoplayText.textContent = 'Play';
        stopAutoplay();
    }
}

// Update progress bar
function updateProgressBar() {
    const progressFill = document.getElementById('progress-fill');
    if (!progressFill) return;
    
    let progress = 0;
    const progressStep = 100 / (slideInterval / 100); // Update every 100ms
    
    const progressInterval = setInterval(() => {
        if (!isAutoplayActive) {
            clearInterval(progressInterval);
            return;
        }
        
        progress += progressStep;
        progressFill.style.width = progress + '%';
        
        if (progress >= 100) {
            progress = 0;
            progressFill.style.width = '0%';
        }
    }, 100);
}

// Setup event listeners
function setupEventListeners() {
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowLeft':
                changeSlide(-1);
                break;
            case 'ArrowRight':
                changeSlide(1);
                break;
            case ' ':
                e.preventDefault();
                toggleAutoplay();
                break;
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const slideshowWrapper = document.querySelector('.slideshow-wrapper');
    
    slideshowWrapper.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slideshowWrapper.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                changeSlide(1);
            } else {
                // Swipe right - previous slide
                changeSlide(-1);
            }
        }
    }
    
    // Pause autoplay on hover
    slideshowWrapper.addEventListener('mouseenter', function() {
        if (isAutoplayActive) {
            stopAutoplay();
        }
    });
    
    slideshowWrapper.addEventListener('mouseleave', function() {
        if (isAutoplayActive) {
            startAutoplay();
        }
    });
    
    // Mobile navigation
    setupMobileNavigation();
}

// Setup mobile navigation
function setupMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.stat-card, .slide-info');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Video thumbnail click handler
document.addEventListener('DOMContentLoaded', function() {
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real implementation, you would open the YouTube video
            // For now, we'll just open the channel
            window.open('https://youtube.com/@panisowanimations', '_blank');
        });
    });
});

// Performance optimization: Preload next slide images
function preloadNextSlide() {
    const nextIndex = (currentSlideIndex + 1) % slides.length;
    const nextSlide = slides[nextIndex];
    if (nextSlide) {
        const img = nextSlide.querySelector('img');
        if (img && !img.complete) {
            const preloadImg = new Image();
            preloadImg.src = img.src;
        }
    }
}

// Call preload function when slide changes
const originalShowSlide = showSlide;
showSlide = function(index) {
    originalShowSlide(index);
    preloadNextSlide();
};

// Handle window resize
window.addEventListener('resize', function() {
    // Recalculate slide dimensions if needed
    showSlide(currentSlideIndex);
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    stopAutoplay();
});

// Export functions for global access
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;
window.toggleAutoplay = toggleAutoplay;
