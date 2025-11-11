// ===== CONTACT FORM FUNCTIONS =====

/**
 * Opens the contact form popup
 */
function openForm() {
    const form = document.getElementById("contactForm");
    if (form) {
        form.classList.add("show");
        form.setAttribute("aria-hidden", "false");
        
        // Focus on the first input field for accessibility
        const firstInput = form.querySelector('input[type="text"]');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

/**
 * Closes the contact form popup
 */
function closeForm() {
    const form = document.getElementById("contactForm");
    if (form) {
        form.classList.remove("show");
        form.setAttribute("aria-hidden", "true");
    }
}

// ===== SLIDESHOW FUNCTIONALITY =====

let currentSlideIndex = 1;
let autoSlideInterval;
const AUTO_SLIDE_DELAY = 5000; // 5 seconds

/**
 * Initialize slideshow when page loads
 */
function initializeSlideshow() {
    showSlide(currentSlideIndex);
    startAutoSlide();
}

/**
 * Changes slide by a given number (e.g., -1 for previous, 1 for next)
 * @param {number} n - The number to change the slide by
 */
function changeSlide(n) {
    stopAutoSlide();
    showSlide(currentSlideIndex += n);
    startAutoSlide();
}

/**
 * Goes to a specific slide
 * @param {number} n - The slide number to go to
 */
function goToSlide(n) {
    stopAutoSlide();
    showSlide(currentSlideIndex = n);
    startAutoSlide();
}

/**
 * Displays the specified slide and updates navigation dots
 * @param {number} n - The slide number to display
 */
function showSlide(n) {
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    
    // Wrap around if necessary
    if (n > slides.length) {
        currentSlideIndex = 1;
    }
    if (n < 1) {
        currentSlideIndex = slides.length;
    }
    
    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    
    // Remove active class from all dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    
    // Show the current slide and activate its dot
    if (slides[currentSlideIndex - 1]) {
        slides[currentSlideIndex - 1].classList.add("active");
    }
    if (dots[currentSlideIndex - 1]) {
        dots[currentSlideIndex - 1].classList.add("active");
    }
}

/**
 * Starts automatic slideshow progression
 */
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        changeSlide(1);
    }, AUTO_SLIDE_DELAY);
}

/**
 * Stops automatic slideshow progression
 */
function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
}

// ===== KEYBOARD NAVIGATION =====

/**
 * Handles keyboard navigation for the slideshow
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyboardNavigation(event) {
    // Only handle arrow keys when slideshow is visible
    const slideshow = document.getElementById("Slideshow");
    if (!slideshow) return;
    
    const rect = slideshow.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (isInView) {
        if (event.key === "ArrowLeft") {
            changeSlide(-1);
            event.preventDefault();
        } else if (event.key === "ArrowRight") {
            changeSlide(1);
            event.preventDefault();
        }
    }
    
    // ESC key to close contact form
    if (event.key === "Escape") {
        closeForm();
    }
}

// ===== TOUCH/SWIPE SUPPORT FOR MOBILE =====

let touchStartX = 0;
let touchEndX = 0;
const SWIPE_THRESHOLD = 50; // Minimum distance for a swipe

/**
 * Handles touch start event
 * @param {TouchEvent} event - The touch event
 */
function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].screenX;
}

/**
 * Handles touch end event and detects swipe
 * @param {TouchEvent} event - The touch event
 */
function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
}

/**
 * Determines swipe direction and changes slide accordingly
 */
function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > SWIPE_THRESHOLD) {
        if (swipeDistance > 0) {
            // Swiped right - go to previous slide
            changeSlide(-1);
        } else {
            // Swiped left - go to next slide
            changeSlide(1);
        }
    }
}

// ===== SMOOTH SCROLL WITH OFFSET FOR FIXED NAVBAR =====

/**
 * Smoothly scrolls to anchor links with navbar offset
 */
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener("click", function(event) {
            const href = this.getAttribute("href");
            
            // Don't prevent default for # only
            if (href === "#") return;
            
            const target = document.querySelector(href);
            if (target) {
                event.preventDefault();
                
                const navbarHeight = document.querySelector(".navbar").offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}

// ===== CLOSE FORM ON OUTSIDE CLICK =====

/**
 * Closes contact form when clicking outside of it
 * @param {MouseEvent} event - The click event
 */
function handleOutsideClick(event) {
    const form = document.getElementById("contactForm");
    const contactButton = document.querySelector(".contact-button");
    
    // Check if form is open
    if (form && form.classList.contains("show")) {
        // Check if click is outside form and not on the contact button
        if (!event.target.closest(".form-container") && 
            !event.target.closest(".contact-button") &&
            !event.target.closest(".contact-link")) {
            closeForm();
        }
    }
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====

/**
 * Adds fade-in animation to sections as they come into view
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);
    
    // Observe all content columns
    const columns = document.querySelectorAll(".content-column");
    columns.forEach(column => {
        column.style.opacity = "0";
        column.style.transform = "translateY(30px)";
        column.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(column);
    });
}

// ===== FORM VALIDATION =====

/**
 * Adds client-side form validation
 */
function initializeFormValidation() {
    const form = document.querySelector(".form-container");
    
    if (form) {
        form.addEventListener("submit", function(event) {
            const email = document.getElementById("email");
            const name = document.getElementById("name");
            
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (name && name.value.trim() === "") {
                alert("Please enter your name.");
                event.preventDefault();
                name.focus();
                return false;
            }
            
            if (email && !emailRegex.test(email.value)) {
                alert("Please enter a valid email address.");
                event.preventDefault();
                email.focus();
                return false;
            }
        });
    }
}

// ===== INITIALIZE EVERYTHING ON PAGE LOAD =====

/**
 * Main initialization function
 */
function initialize() {
    // Initialize slideshow
    initializeSlideshow();
    
    // Add keyboard navigation
    document.addEventListener("keydown", handleKeyboardNavigation);
    
    // Add touch support for slideshow
    const slideshowContainer = document.querySelector(".slideshow-container");
    if (slideshowContainer) {
        slideshowContainer.addEventListener("touchstart", handleTouchStart);
        slideshowContainer.addEventListener("touchend", handleTouchEnd);
    }
    
    // Initialize smooth scrolling
    initializeSmoothScroll();
    
    // Add outside click listener for form
    document.addEventListener("click", handleOutsideClick);
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Stop auto-slide when user hovers over slideshow
    if (slideshowContainer) {
        slideshowContainer.addEventListener("mouseenter", stopAutoSlide);
        slideshowContainer.addEventListener("mouseleave", startAutoSlide);
    }
}

// Run initialization when DOM is fully loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
} else {
    initialize();
}

// Pause slideshow when page is not visible
document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
        stopAutoSlide();
    } else {
        startAutoSlide();
    }
});