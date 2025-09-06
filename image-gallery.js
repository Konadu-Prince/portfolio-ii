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
        this.videos = [];
        this.featuredVideos = [];
        this.currentTab = 'featured';
        this.showProfilePicture = true;
        this.isAdmin = false;
        this.adminPassword = 'admin123'; // Change this to your desired password
        
        this.init();
    }
    
    init() {
        this.loadExistingImages();
        this.loadVideos();
        this.loadProfilePicture();
        this.checkAdminSession();
        this.bindEvents();
        this.initScrollToTop();
        this.initMobileMenu();
        this.updateSlideshow();
        this.initYouTubeDashboard();
        this.updateAdminVisibility();
    }
    
    loadExistingImages() {
        // First, try to load saved images from localStorage
        const savedImages = localStorage.getItem('galleryImages');
        if (savedImages) {
            this.images = JSON.parse(savedImages);
            this.renderImagesFromData();
        } else {
            // Load existing images from the page (default images)
            const imageItems = document.querySelectorAll('.image-item img');
            this.images = Array.from(imageItems).map((img, index) => ({
                id: `default_${index}`,
                src: img.src,
                alt: img.alt,
                title: `Image ${index + 1}`,
                description: `Description for ${img.alt}`,
                category: 'portfolio',
                dateAdded: new Date().toISOString()
            }));
            this.saveImages();
        }
    }
    
    renderImagesFromData() {
        const grid = document.getElementById('imageGrid');
        grid.innerHTML = '';
        
        this.images.forEach(image => {
            const imageItem = this.createImageItem(image);
            grid.appendChild(imageItem);
        });
    }
    
    createImageItem(image) {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.setAttribute('data-category', image.category);
        imageItem.setAttribute('data-image-id', image.id);
        
        imageItem.innerHTML = `
            <img src="${image.src}" alt="${image.alt}" loading="lazy">
            <div class="image-overlay">
                <div class="image-actions">
                    <button class="btn-icon" onclick="gallery.viewImage('${image.src}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon admin-only" onclick="gallery.deleteImageById('${image.id}')" style="display: none;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        return imageItem;
    }
    
    saveImages() {
        localStorage.setItem('galleryImages', JSON.stringify(this.images));
    }
    
    loadVideos() {
        // Load existing videos from localStorage or initialize with sample data
        const savedVideos = localStorage.getItem('galleryVideos');
        if (savedVideos) {
            this.videos = JSON.parse(savedVideos);
        } else {
            // Sample video data
            this.videos = [
                {
                    id: 'sample1',
                    title: 'Sample Featured Video',
                    description: 'This is a sample video description',
                    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    videoId: 'dQw4w9WgXcQ',
                    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                    category: 'tutorial',
                    tags: ['sample', 'demo', 'video'],
                    views: 1200000,
                    duration: '3:32',
                    isFeatured: true,
                    dateAdded: new Date().toISOString()
                }
            ];
            this.saveVideos();
        }
        
        this.featuredVideos = this.videos.filter(video => video.isFeatured);
    }
    
    saveVideos() {
        localStorage.setItem('galleryVideos', JSON.stringify(this.videos));
    }
    
    loadProfilePicture() {
        // Load profile picture settings from localStorage
        const savedProfilePicture = localStorage.getItem('galleryProfilePicture');
        const savedProfilePictureSettings = localStorage.getItem('galleryProfilePictureSettings');
        
        if (savedProfilePicture) {
            document.getElementById('profilePicture').src = savedProfilePicture;
        }
        
        if (savedProfilePictureSettings) {
            const settings = JSON.parse(savedProfilePictureSettings);
            this.showProfilePicture = settings.showProfilePicture;
            document.getElementById('profilePictureToggle').checked = this.showProfilePicture;
            this.updateProfilePictureVisibility();
        }
    }
    
    saveProfilePicture() {
        const profilePicture = document.getElementById('profilePicture').src;
        const settings = {
            showProfilePicture: this.showProfilePicture
        };
        
        localStorage.setItem('galleryProfilePicture', profilePicture);
        localStorage.setItem('galleryProfilePictureSettings', JSON.stringify(settings));
    }
    
    checkAdminSession() {
        // Check if admin session is still valid
        const adminSession = localStorage.getItem('galleryAdminSession');
        if (adminSession) {
            const sessionData = JSON.parse(adminSession);
            const now = new Date().getTime();
            // Session expires after 24 hours
            if (now - sessionData.timestamp < 24 * 60 * 60 * 1000) {
                this.isAdmin = true;
            } else {
                localStorage.removeItem('galleryAdminSession');
            }
        }
    }
    
    saveAdminSession() {
        const sessionData = {
            timestamp: new Date().getTime(),
            isAdmin: true
        };
        localStorage.setItem('galleryAdminSession', JSON.stringify(sessionData));
    }
    
    clearAdminSession() {
        localStorage.removeItem('galleryAdminSession');
        this.isAdmin = false;
    }
    
    bindEvents() {
        // View toggle buttons
        document.getElementById('gridView').addEventListener('click', () => this.showGridView());
        document.getElementById('slideshowView').addEventListener('click', () => this.showSlideshowView());
        document.getElementById('youtubeDashboardView').addEventListener('click', () => this.showYouTubeDashboard());
        
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
        
        document.getElementById('profilePictureToggle').addEventListener('change', (e) => {
            this.toggleProfilePictureVisibility(e.target.checked);
        });
        
        // Profile picture upload
        document.getElementById('uploadProfilePicture').addEventListener('click', () => {
            document.getElementById('profilePictureUpload').click();
        });
        
        document.getElementById('profilePictureUpload').addEventListener('change', (e) => {
            this.handleProfilePictureUpload(e.target.files[0]);
        });
        
        // Admin authentication
        document.getElementById('adminLoginBtn').addEventListener('click', () => {
            this.handleAdminLogin();
        });
        
        document.getElementById('adminPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAdminLogin();
            }
        });
        
        document.getElementById('adminLogoutBtn').addEventListener('click', () => {
            this.handleAdminLogout();
        });
        
        // Backup controls
        document.getElementById('exportDataBtn').addEventListener('click', () => {
            this.exportGalleryData();
        });
        
        document.getElementById('importDataBtn').addEventListener('click', () => {
            document.getElementById('importDataInput').click();
        });
        
        document.getElementById('importDataInput').addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.importGalleryData(e.target.files[0]);
            }
        });
        
        document.getElementById('clearDataBtn').addEventListener('click', () => {
            this.clearAllData();
        });
        
        // Mobile menu toggle
        const hamburger = document.querySelector('.gallery-navbar .hamburger');
        const navMenu = document.querySelector('.gallery-navbar .nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
            
            // Close menu when clicking on a link
            document.querySelectorAll('.gallery-navbar .nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                });
            });
        }
        
        // Profile click to show admin login
        const profileIconContainer = document.querySelector('.profile-icon-container');
        const adminLoginSection = document.getElementById('adminLoginSection');
        
        if (profileIconContainer && adminLoginSection) {
            profileIconContainer.addEventListener('click', (e) => {
                // Only show login if not already admin
                if (!this.isAdmin) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle admin login visibility
                    if (adminLoginSection.style.display === 'none' || adminLoginSection.style.display === '') {
                        adminLoginSection.style.display = 'block';
                        // Focus on password input
                        setTimeout(() => {
                            document.getElementById('adminPassword').focus();
                        }, 100);
                    } else {
                        adminLoginSection.style.display = 'none';
                    }
                }
            });
        }
        
        // Close admin login when clicking outside
        document.addEventListener('click', (e) => {
            if (adminLoginSection && adminLoginSection.style.display === 'block') {
                if (!adminLoginSection.contains(e.target) && !profileIconContainer.contains(e.target)) {
                    adminLoginSection.style.display = 'none';
                }
            }
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
        if (!this.isAdmin) {
            this.showNotification('Admin access required to upload images', 'error');
            return;
        }
        
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const newImage = {
                        id: `uploaded_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        src: e.target.result,
                        alt: file.name,
                        title: file.name.split('.')[0],
                        description: `Uploaded image: ${file.name}`,
                        category: 'uploaded',
                        dateAdded: new Date().toISOString()
                    };
                    
                    this.images.push(newImage);
                    this.saveImages(); // Save to localStorage
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
        const imageItem = this.createImageItem(image);
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
        if (!this.isAdmin) {
            this.showNotification('Admin access required to delete images', 'error');
            return;
        }
        
        const imageItem = button.closest('.image-item');
        const imageId = imageItem.getAttribute('data-image-id');
        
        if (confirm('Are you sure you want to delete this image?')) {
            this.deleteImageById(imageId);
        }
    }
    
    deleteImageById(imageId) {
        if (!this.isAdmin) {
            this.showNotification('Admin access required to delete images', 'error');
            return;
        }
        
        // Remove from images array
        this.images = this.images.filter(img => img.id !== imageId);
        
        // Save updated images to localStorage
        this.saveImages();
        
        // Remove from DOM
        const imageItem = document.querySelector(`[data-image-id="${imageId}"]`);
        if (imageItem) {
            imageItem.remove();
        }
        
        // Update slideshow if needed
        this.updateSlideshow();
        
        this.showNotification('Image deleted successfully!', 'success');
    }
    
    togglePublicAccess(isPublic) {
        this.isPublic = isPublic;
        const message = isPublic ? 'Gallery is now public' : 'Gallery is now private';
        this.showNotification(message, 'info');
    }
    
    toggleProfilePictureVisibility(show) {
        if (!this.isAdmin) {
            this.showNotification('Admin access required to change profile picture settings', 'error');
            return;
        }
        
        this.showProfilePicture = show;
        this.updateProfilePictureVisibility();
        this.saveProfilePicture();
        
        const message = show ? 'Profile picture is now visible' : 'Profile picture is now hidden';
        this.showNotification(message, 'info');
    }
    
    updateProfilePictureVisibility() {
        const profilePictureSection = document.getElementById('profilePictureSection');
        if (this.showProfilePicture) {
            profilePictureSection.style.display = 'flex';
        } else {
            profilePictureSection.style.display = 'none';
        }
    }
    
    handleProfilePictureUpload(file) {
        if (!this.isAdmin) {
            this.showNotification('Admin access required to change profile picture', 'error');
            return;
        }
        
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('profilePicture').src = e.target.result;
                this.saveProfilePicture();
                this.showNotification('Profile picture updated successfully!', 'success');
            };
            reader.readAsDataURL(file);
        } else {
            this.showNotification('Please select a valid image file', 'error');
        }
    }
    
    handleAdminLogin() {
        const password = document.getElementById('adminPassword').value;
        
        if (password === this.adminPassword) {
            this.isAdmin = true;
            this.saveAdminSession();
            this.updateAdminVisibility();
            document.getElementById('adminPassword').value = '';
            this.showNotification('Admin access granted!', 'success');
        } else {
            this.showNotification('Invalid password. Access denied.', 'error');
            document.getElementById('adminPassword').value = '';
        }
    }
    
    handleAdminLogout() {
        this.clearAdminSession();
        this.updateAdminVisibility();
        this.showNotification('Logged out successfully', 'info');
    }
    
    updateAdminVisibility() {
        const adminElements = document.querySelectorAll('.admin-only');
        const loginSection = document.getElementById('adminLoginSection');
        const privacyControls = document.getElementById('privacyControls');
        const youtubeDashboardBtn = document.getElementById('youtubeDashboardView');
        
        if (this.isAdmin) {
            // Show admin controls, hide login
            loginSection.style.display = 'none';
            privacyControls.style.display = 'block';
            adminElements.forEach(element => {
                element.style.display = element.style.display === 'none' ? 'none' : 'block';
            });
        } else {
            // Hide admin controls, hide login (login only shows on profile click)
            loginSection.style.display = 'none';
            privacyControls.style.display = 'none';
            adminElements.forEach(element => {
                element.style.display = 'none';
            });
        }
        
        // Show YouTube dashboard button if there are videos
        if (youtubeDashboardBtn) {
            youtubeDashboardBtn.style.display = this.videos.length > 0 ? 'block' : 'none';
        }
    }
    
    // ========================================
    // DATA PERSISTENCE & BACKUP
    // ========================================
    
    exportGalleryData() {
        if (!this.isAdmin) {
            this.showNotification('Admin access required to export data', 'error');
            return;
        }
        
        const galleryData = {
            images: this.images,
            videos: this.videos,
            profilePicture: document.getElementById('profilePicture').src,
            settings: {
                showProfilePicture: this.showProfilePicture,
                isPublic: this.isPublic
            },
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(galleryData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `gallery-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Gallery data exported successfully!', 'success');
    }
    
    importGalleryData(file) {
        if (!this.isAdmin) {
            this.showNotification('Admin access required to import data', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const galleryData = JSON.parse(e.target.result);
                
                if (galleryData.version && galleryData.images && galleryData.videos) {
                    // Import images
                    this.images = galleryData.images;
                    this.saveImages();
                    
                    // Import videos
                    this.videos = galleryData.videos;
                    this.featuredVideos = this.videos.filter(video => video.isFeatured);
                    this.saveVideos();
                    
                    // Import profile picture
                    if (galleryData.profilePicture) {
                        document.getElementById('profilePicture').src = galleryData.profilePicture;
                        this.saveProfilePicture();
                    }
                    
                    // Import settings
                    if (galleryData.settings) {
                        this.showProfilePicture = galleryData.settings.showProfilePicture;
                        this.isPublic = galleryData.settings.isPublic;
                        document.getElementById('profilePictureToggle').checked = this.showProfilePicture;
                        document.getElementById('publicToggle').checked = this.isPublic;
                        this.updateProfilePictureVisibility();
                    }
                    
                    // Refresh the display
                    this.renderImagesFromData();
                    this.updateSlideshow();
                    this.updateYouTubeDashboard();
                    
                    this.showNotification('Gallery data imported successfully!', 'success');
                } else {
                    this.showNotification('Invalid backup file format', 'error');
                }
            } catch (error) {
                this.showNotification('Error importing backup file', 'error');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
    }
    
    clearAllData() {
        if (!this.isAdmin) {
            this.showNotification('Admin access required to clear data', 'error');
            return;
        }
        
        if (confirm('Are you sure you want to clear ALL gallery data? This cannot be undone!')) {
            // Clear localStorage
            localStorage.removeItem('galleryImages');
            localStorage.removeItem('galleryVideos');
            localStorage.removeItem('galleryProfilePicture');
            localStorage.removeItem('galleryProfilePictureSettings');
            localStorage.removeItem('galleryAdminSession');
            
            // Reset to defaults
            this.images = [];
            this.videos = [];
            this.featuredVideos = [];
            this.isAdmin = false;
            this.showProfilePicture = true;
            this.isPublic = false;
            
            // Reload page to reset everything
            window.location.reload();
        }
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
    
    // ========================================
    // YOUTUBE DASHBOARD FUNCTIONALITY
    // ========================================
    
    showYouTubeDashboard() {
        // Allow access if there are videos, but restrict admin functions
        if (this.videos.length === 0) {
            this.showNotification('No videos available to display', 'info');
            return;
        }
        
        document.getElementById('galleryGrid').style.display = 'none';
        document.getElementById('slideshowSection').style.display = 'none';
        document.getElementById('youtubeDashboardSection').style.display = 'block';
        
        document.getElementById('gridView').classList.remove('active');
        document.getElementById('slideshowView').classList.remove('active');
        document.getElementById('youtubeDashboardView').classList.add('active');
        
        this.stopSlideshow();
        this.updateYouTubeDashboard();
    }
    
    initYouTubeDashboard() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });
        
        // Video upload form
        document.getElementById('videoUploadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addVideo();
        });
        
        // Preview video button
        document.getElementById('previewVideo').addEventListener('click', () => {
            this.previewVideo();
        });
        
        // Add featured video button
        document.getElementById('addFeaturedBtn').addEventListener('click', () => {
            this.switchTab('upload');
        });
    }
    
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
        
        this.currentTab = tabName;
        
        if (tabName === 'analytics') {
            this.updateAnalytics();
        }
    }
    
    updateYouTubeDashboard() {
        this.updateFeaturedVideos();
        this.updateAnalytics();
        
        // Update admin-only elements visibility within dashboard
        const adminOnlyElements = document.querySelectorAll('#youtubeDashboardSection .admin-only');
        adminOnlyElements.forEach(element => {
            element.style.display = this.isAdmin ? 'block' : 'none';
        });
    }
    
    updateFeaturedVideos() {
        const grid = document.getElementById('featuredVideosGrid');
        grid.innerHTML = '';
        
        this.featuredVideos.forEach(video => {
            const videoItem = this.createVideoItem(video);
            grid.appendChild(videoItem);
        });
    }
    
    createVideoItem(video) {
        const item = document.createElement('div');
        item.className = 'featured-video-item';
        item.setAttribute('data-video-id', video.id);
        
        item.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}">
                <div class="video-overlay">
                    <button class="play-btn" onclick="gallery.playVideo('${video.videoId}')">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <div class="video-info">
                <h5>${video.title}</h5>
                <p>${video.description}</p>
                <div class="video-meta">
                    <span class="views"><i class="fas fa-eye"></i> ${this.formatNumber(video.views)} views</span>
                    <span class="duration"><i class="fas fa-clock"></i> ${video.duration}</span>
                </div>
                <div class="video-actions admin-only" style="display: ${this.isAdmin ? 'flex' : 'none'};">
                    <button class="btn-icon" onclick="gallery.editVideo('${video.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="gallery.removeFeatured('${video.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn-icon" onclick="gallery.reorderVideo('${video.id}', 'up')">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                </div>
            </div>
        `;
        
        return item;
    }
    
    addVideo() {
        if (!this.isAdmin) {
            this.showNotification('Admin access required to add videos', 'error');
            return;
        }
        
        const url = document.getElementById('videoUrl').value;
        const title = document.getElementById('videoTitle').value;
        const description = document.getElementById('videoDescription').value;
        const category = document.getElementById('videoCategory').value;
        const tags = document.getElementById('videoTags').value.split(',').map(tag => tag.trim());
        const isFeatured = document.getElementById('featuredVideo').checked;
        
        // Extract video ID from URL
        const videoId = this.extractVideoId(url);
        if (!videoId) {
            this.showNotification('Invalid YouTube URL', 'error');
            return;
        }
        
        const video = {
            id: Date.now().toString(),
            title: title,
            description: description,
            url: url,
            videoId: videoId,
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            category: category,
            tags: tags,
            views: Math.floor(Math.random() * 1000000),
            duration: this.generateRandomDuration(),
            isFeatured: isFeatured,
            dateAdded: new Date().toISOString()
        };
        
        this.videos.push(video);
        if (isFeatured) {
            this.featuredVideos.push(video);
        }
        
        this.saveVideos();
        this.updateYouTubeDashboard();
        this.clearVideoForm();
        
        this.showNotification('Video added successfully!', 'success');
    }
    
    extractVideoId(url) {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
    
    generateRandomDuration() {
        const minutes = Math.floor(Math.random() * 10) + 1;
        const seconds = Math.floor(Math.random() * 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    clearVideoForm() {
        document.getElementById('videoUploadForm').reset();
    }
    
    previewVideo() {
        const url = document.getElementById('videoUrl').value;
        const videoId = this.extractVideoId(url);
        
        if (videoId) {
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            window.open(embedUrl, '_blank');
        } else {
            this.showNotification('Please enter a valid YouTube URL first', 'error');
        }
    }
    
    playVideo(videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        window.open(embedUrl, '_blank');
    }
    
    editVideo(videoId) {
        if (!this.isAdmin) {
            this.showNotification('Admin access required to edit videos', 'error');
            return;
        }
        
        const video = this.videos.find(v => v.id === videoId);
        if (video) {
            // Populate form with video data
            document.getElementById('videoUrl').value = video.url;
            document.getElementById('videoTitle').value = video.title;
            document.getElementById('videoDescription').value = video.description;
            document.getElementById('videoCategory').value = video.category;
            document.getElementById('videoTags').value = video.tags.join(', ');
            document.getElementById('featuredVideo').checked = video.isFeatured;
            
            this.switchTab('upload');
            this.showNotification('Video data loaded for editing', 'info');
        }
    }
    
    removeFeatured(videoId) {
        if (!this.isAdmin) {
            this.showNotification('Admin access required to modify featured videos', 'error');
            return;
        }
        
        if (confirm('Are you sure you want to remove this video from featured?')) {
            const video = this.videos.find(v => v.id === videoId);
            if (video) {
                video.isFeatured = false;
                this.featuredVideos = this.featuredVideos.filter(v => v.id !== videoId);
                this.saveVideos();
                this.updateYouTubeDashboard();
                this.showNotification('Video removed from featured', 'success');
            }
        }
    }
    
    reorderVideo(videoId, direction) {
        if (!this.isAdmin) {
            this.showNotification('Admin access required to reorder videos', 'error');
            return;
        }
        
        const index = this.featuredVideos.findIndex(v => v.id === videoId);
        if (index !== -1) {
            if (direction === 'up' && index > 0) {
                [this.featuredVideos[index], this.featuredVideos[index - 1]] = 
                [this.featuredVideos[index - 1], this.featuredVideos[index]];
            } else if (direction === 'down' && index < this.featuredVideos.length - 1) {
                [this.featuredVideos[index], this.featuredVideos[index + 1]] = 
                [this.featuredVideos[index + 1], this.featuredVideos[index]];
            }
            
            this.updateFeaturedVideos();
            this.showNotification('Video order updated', 'success');
        }
    }
    
    updateAnalytics() {
        const totalViews = this.videos.reduce((sum, video) => sum + video.views, 0);
        const totalVideos = this.videos.length;
        const featuredCount = this.featuredVideos.length;
        const totalLikes = Math.floor(totalViews * 0.05); // Estimate likes as 5% of views
        
        document.getElementById('totalViews').textContent = this.formatNumber(totalViews);
        document.getElementById('totalVideos').textContent = totalVideos;
        document.getElementById('featuredCount').textContent = featuredCount;
        document.getElementById('totalLikes').textContent = this.formatNumber(totalLikes);
        
        this.updateRecentVideos();
    }
    
    updateRecentVideos() {
        const recentVideosList = document.getElementById('recentVideosList');
        recentVideosList.innerHTML = '';
        
        const recentVideos = this.videos
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .slice(0, 5);
        
        recentVideos.forEach(video => {
            const item = document.createElement('div');
            item.className = 'recent-video-item';
            
            item.innerHTML = `
                <div class="recent-video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                </div>
                <div class="recent-video-info">
                    <h6>${video.title}</h6>
                    <p>${this.formatNumber(video.views)} views • ${video.duration}</p>
                </div>
            `;
            
            recentVideosList.appendChild(item);
        });
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

// Global functions for onclick handlers
function viewImage(src) {
    gallery.viewImage(src);
}

function deleteImage(button) {
    gallery.deleteImage(button);
}

function deleteImageById(imageId) {
    gallery.deleteImageById(imageId);
}

// YouTube Dashboard Global Functions
function playVideo(videoId) {
    gallery.playVideo(videoId);
}

function editVideo(videoId) {
    gallery.editVideo(videoId);
}

function removeFeatured(videoId) {
    gallery.removeFeatured(videoId);
}

function reorderVideo(videoId, direction) {
    gallery.reorderVideo(videoId, direction);
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
