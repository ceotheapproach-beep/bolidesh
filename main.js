// main.js for Bolidesh.in
// Handles mobile navigation toggle with accessibility and performance optimizations
// Last updated: September 08, 2025

// Select DOM elements
const nav = document.querySelector('nav[role="navigation"] ul');
const hamburger = document.createElement('button');
hamburger.className = 'hamburger';
hamburger.setAttribute('aria-label', 'मुख्य मेनू खोलें या बंद करें');
hamburger.setAttribute('aria-expanded', 'false');
hamburger.setAttribute('aria-controls', 'main-nav');
hamburger.innerHTML = `
    <span class="hamburger-icon"></span>
    <span class="sr-only">मेनू</span>
`;

// Add ID to nav ul for ARIA
nav.setAttribute('id', 'main-nav');

// Insert hamburger button before nav
nav.parentNode.insertBefore(hamburger, nav);

// Toggle navigation menu
function toggleNav() {
  const isOpen = nav.classList.toggle('nav-open');
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  hamburger.querySelector('.hamburger-icon').classList.toggle('open', isOpen);
}

// Handle click and touch events
hamburger.addEventListener('click', toggleNav);
hamburger.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Prevent double-tap zoom on mobile
  toggleNav();
});

// Handle keyboard events for accessibility
hamburger.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault(); // Prevent page scroll on Space
    toggleNav();
  }
});

// Close menu when clicking outside (mobile usability)
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !hamburger.contains(e.target) && nav.classList.contains('nav-open')) {
    toggleNav();
  }
});

// Debounce function for resize events
function debounce(func, wait) {
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

// Reset menu state on window resize for larger screens
const handleResize = debounce(() => {
  if (window.innerWidth >= 768) {
    nav.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.querySelector('.hamburger-icon').classList.remove('open');
  }
}, 100);

window.addEventListener('resize', handleResize);

// Initialize menu state on load
document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth < 768) {
    nav.classList.remove('nav-open'); // Ensure menu is closed on mobile
    hamburger.setAttribute('aria-expanded', 'false');
  }
});