// ========================================
// IMAGE GALLERY FUNCTIONALITY
// ========================================

class ImageGallery {
    constructor() {
        this.images = [];
        this.currentSlideIndex = 0;
        this.slideshowInterval = null;
        this.isPlaying = false;
        this.isPublic = false;
        this.privateLink = null;
        
        this.init();
    }
    
    init() {
        this.loadExistingImages();
        this.bindEvents();
        this.initScrollToTop();
        this.initMobileMenu();
        this.updateSlideshow();
    }
    
    loadExistingImages() {
        // Load existing images from the page
        const imageItems = document.querySelectorAll('.image-item img');
        this.images = Array.from(imageItems).map((img, index) => ({
            src: img.src,
            alt: img.alt,
            title: `Image ${index + 1}`,
            description: `Description for ${img.alt}`,
            category: 'portfolio'
        }));
    }
    
    bindEvents() {
        // View toggle buttons
        document.getElementById('gridView').addEventListener('click', () => this.showGridView());
        document.getElementById('slideshowView').addEventListener('click', () => this.showSlideshowView());
        
        // Upload functionality
        document.getElementById('uploadBtn').addEventListener('click', () => {
            document.getElementById('imageUpload').click();
        });
        
        document.getElementById('imageUpload').addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files);
        });
        
        // Privacy controls
        document.getElementById('publicToggle').addEventListener('change', (e) => {
            this.togglePublicAccess(e.target.checked);
        });
        
        document.getElementById('generateLink').addEventListener('click', () => {
            this.generatePrivateLink();
        });
        
        document.getElementById('copyLink').addEventListener('click', () => {
            this.copyPrivateLink();
        });
        
        // Slideshow controls
        document.getElementById('playPauseBtn').addEventListener('click', () => {
            this.toggleSlideshow();
        });
        
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.previousSlide();
        });
        
        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextSlide();
        });
        
        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });
        
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadImage();
        });
        
        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareImage();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
        
        // Close modal on outside click
        document.getElementById('imageModal').addEventListener('click', (e) => {
            if (e.target.id === 'imageModal') {
                this.closeModal();
            }
        });
    }
    
    showGridView() {
        document.getElementById('galleryGrid').style.display = 'block';
        document.getElementById('slideshowSection').style.display = 'none';
        
        document.getElementById('gridView').classList.add('active');
        document.getElementById('slideshowView').classList.remove('active');
        
        this.stopSlideshow();
    }
    
    showSlideshowView() {
        document.getElementById('galleryGrid').style.display = 'none';
        document.getElementById('slideshowSection').style.display = 'block';
        
        document.getElementById('gridView').classList.remove('active');
        document.getElementById('slideshowView').classList.add('active');
        
        this.updateSlideshow();
    }
    
    handleImageUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const newImage = {
                        src: e.target.result,
                        alt: file.name,
                        title: file.name.split('.')[0],
                        description: `Uploaded image: ${file.name}`,
                        category: 'uploaded'
                    };
                    
                    this.images.push(newImage);
                    this.addImageToGrid(newImage);
                    this.updateSlideshow();
                    
                    // Show success message
                    this.showNotification('Image uploaded successfully!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    addImageToGrid(image) {
        const grid = document.getElementById('imageGrid');
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.setAttribute('data-category', image.category);
        
        imageItem.innerHTML = `
            <img src="${image.src}" alt="${image.alt}" loading="lazy">
            <div class="image-overlay">
                <div class="image-actions">
                    <button class="btn-icon" onclick="gallery.viewImage('${image.src}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="gallery.deleteImage(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        grid.appendChild(imageItem);
    }
    
    viewImage(src) {
        const image = this.images.find(img => img.src === src);
        if (image) {
            document.getElementById('modalImage').src = image.src;
            document.getElementById('modalTitle').textContent = image.title;
            document.getElementById('modalDescription').textContent = image.description;
            document.getElementById('imageModal').style.display = 'block';
            
            // Store current image for download/share
            this.currentModalImage = image;
        }
    }
    
    closeModal() {
        document.getElementById('imageModal').style.display = 'none';
    }
    
    deleteImage(button) {
        const imageItem = button.closest('.image-item');
        const img = imageItem.querySelector('img');
        const src = img.src;
        
        if (confirm('Are you sure you want to delete this image?')) {
            // Remove from images array
            this.images = this.images.filter(img => img.src !== src);
            
            // Remove from DOM
            imageItem.remove();
            
            // Update slideshow if needed
            this.updateSlideshow();
            
            this.showNotification('Image deleted successfully!', 'success');
        }
    }
    
    togglePublicAccess(isPublic) {
        this.isPublic = isPublic;
        const message = isPublic ? 'Gallery is now public' : 'Gallery is now private';
        this.showNotification(message, 'info');
    }
    
    generatePrivateLink() {
        const linkId = this.generateUniqueId();
        this.privateLink = `${window.location.origin}${window.location.pathname}?private=${linkId}`;
        
        document.getElementById('privateLink').value = this.privateLink;
        document.getElementById('linkDisplay').style.display = 'flex';
        
        this.showNotification('Private link generated!', 'success');
    }
    
    copyPrivateLink() {
        const linkInput = document.getElementById('privateLink');
        linkInput.select();
        linkInput.setSelectionRange(0, 99999);
        
        navigator.clipboard.writeText(linkInput.value).then(() => {
            this.showNotification('Link copied to clipboard!', 'success');
        });
    }
    
    generateUniqueId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    updateSlideshow() {
        if (this.images.length === 0) return;
        
        // Update slide counter
        document.getElementById('currentSlide').textContent = this.currentSlideIndex + 1;
        document.getElementById('totalSlides').textContent = this.images.length;
        
        // Update slide image
        const currentImage = this.images[this.currentSlideIndex];
        document.getElementById('slideImage').src = currentImage.src;
        document.getElementById('slideTitle').textContent = currentImage.title;
        document.getElementById('slideDescription').textContent = currentImage.description;
        
        // Update thumbnails
        this.updateThumbnails();
        
        // Reset progress
        this.resetProgress();
    }
    
    updateThumbnails() {
        const thumbnailsContainer = document.getElementById('slideThumbnails');
        thumbnailsContainer.innerHTML = '';
        
        this.images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail';
            if (index === this.currentSlideIndex) {
                thumbnail.classList.add('active');
            }
            
            thumbnail.innerHTML = `<img src="${image.src}" alt="${image.alt}">`;
            thumbnail.addEventListener('click', () => {
                this.goToSlide(index);
            });
            
            thumbnailsContainer.appendChild(thumbnail);
        });
    }
    
    goToSlide(index) {
        this.currentSlideIndex = index;
        this.updateSlideshow();
    }
    
    nextSlide() {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % this.images.length;
        this.updateSlideshow();
    }
    
    previousSlide() {
        this.currentSlideIndex = (this.currentSlideIndex - 1 + this.images.length) % this.images.length;
        this.updateSlideshow();
    }
    
    toggleSlideshow() {
        if (this.isPlaying) {
            this.stopSlideshow();
        } else {
            this.startSlideshow();
        }
    }
    
    startSlideshow() {
        this.isPlaying = true;
        document.getElementById('playPauseBtn').innerHTML = '<i class="fas fa-pause"></i>';
        
        this.slideshowInterval = setInterval(() => {
            this.nextSlide();
        }, 3000); // 3 seconds per slide
        
        this.startProgress();
    }
    
    stopSlideshow() {
        this.isPlaying = false;
        document.getElementById('playPauseBtn').innerHTML = '<i class="fas fa-play"></i>';
        
        if (this.slideshowInterval) {
            clearInterval(this.slideshowInterval);
            this.slideshowInterval = null;
        }
        
        this.stopProgress();
    }
    
    startProgress() {
        const progressFill = document.getElementById('progressFill');
        let progress = 0;
        
        this.progressInterval = setInterval(() => {
            progress += 100 / 30; // 3 seconds = 30 * 100ms
            progressFill.style.width = progress + '%';
            
            if (progress >= 100) {
                progress = 0;
            }
        }, 100);
    }
    
    stopProgress() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        document.getElementById('progressFill').style.width = '0%';
    }
    
    resetProgress() {
        this.stopProgress();
        if (this.isPlaying) {
            this.startProgress();
        }
    }
    
    downloadImage() {
        if (this.currentModalImage) {
            const link = document.createElement('a');
            link.href = this.currentModalImage.src;
            link.download = this.currentModalImage.title || 'image';
            link.click();
            
            this.showNotification('Download started!', 'success');
        }
    }
    
    shareImage() {
        if (this.currentModalImage && navigator.share) {
            navigator.share({
                title: this.currentModalImage.title,
                text: this.currentModalImage.description,
                url: this.currentModalImage.src
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(this.currentModalImage.src).then(() => {
                this.showNotification('Image URL copied to clipboard!', 'success');
            });
        }
    }
    
    handleKeyboard(e) {
        if (document.getElementById('imageModal').style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    this.closeModal();
                    break;
                case 'ArrowLeft':
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    this.nextSlide();
                    break;
            }
        }
        
        if (document.getElementById('slideshowSection').style.display === 'block') {
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.toggleSlideshow();
                    break;
                case 'ArrowLeft':
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    this.nextSlide();
                    break;
            }
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 3000;
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    initScrollToTop() {
        const scrollToTopBtn = document.getElementById('scrollToTop');
        
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
    
    initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Global functions for onclick handlers
function viewImage(src) {
    gallery.viewImage(src);
}

function deleteImage(button) {
    gallery.deleteImage(button);
}

// Initialize gallery when DOM is loaded
let gallery;
document.addEventListener('DOMContentLoaded', function() {
    gallery = new ImageGallery();
    
    // Check for private link access
    const urlParams = new URLSearchParams(window.location.search);
    const privateId = urlParams.get('private');
    
    if (privateId) {
        // This is a private link access
        document.querySelector('.gallery-subtitle').textContent = 'Private gallery access via link';
        document.getElementById('publicToggle').checked = false;
        gallery.isPublic = false;
    }
});
