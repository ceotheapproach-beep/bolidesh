// Donation Popup and Navigation Functionality
document.addEventListener('DOMContentLoaded', function () {
  // Donation Popup Elements
  const donationPopup = document.getElementById('donationPopup');
  const closePopup = document.getElementById('closePopup');
  const closePopupBtn = document.getElementById('closePopupBtn');

  // Check if elements exist to prevent errors
  if (!donationPopup || !closePopup || !closePopupBtn) {
    console.warn('Donation popup elements not found.');
    return;
  }

  // Session storage key to track if popup was shown
  const popupSessionKey = 'donationPopupShown';

  // Function to show popup
  function showPopup() {
    // Check if popup was already shown in this session
    if (sessionStorage.getItem(popupSessionKey)) return;

    // Get delay from data attribute or default to 3 seconds
    const delay = parseInt(donationPopup.dataset.delay || 3000, 10);
    setTimeout(() => {
      donationPopup.classList.add('active');
      // Focus on the popup for accessibility
      donationPopup.focus();
      // Mark popup as shown in session
      sessionStorage.setItem(popupSessionKey, 'true');
    }, delay);
  }

  // Function to close popup
  function closePopupHandler() {
    donationPopup.classList.remove('active');
  }

  // Show popup after delay
  showPopup();

  // Close popup when close button is clicked
  closePopup.addEventListener('click', closePopupHandler);

  // Close popup when secondary close button is clicked
  closePopupBtn.addEventListener('click', closePopupHandler);

  // Close popup when clicking outside the content
  donationPopup.addEventListener('click', function (e) {
    if (e.target === donationPopup) {
      closePopupHandler();
    }
  });

  // Close popup with Escape key for accessibility
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && donationPopup.classList.contains('active')) {
      closePopupHandler();
    }
  });

  // Navigation Functionality
  const navLinks = document.querySelectorAll('nav a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Add active class to current page link
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Handle cases where href includes query parameters or fragments
    const hrefBase = href.split(/[?#]/)[0];
    if (hrefBase === currentPage || (hrefBase === '' && currentPage === 'index.html')) {
      link.classList.add('active');
    }

    // Add smooth scrolling for anchor links
    if (href.startsWith('#')) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  });

  // Mobile Navigation Toggle (assuming a hamburger menu exists)
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav ul');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');
      // Update aria-expanded for accessibility
      const isExpanded = navMenu.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
});