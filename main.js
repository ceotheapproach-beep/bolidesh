// Main.js - Enhanced Donation Popup, Navigation, and Interactivity
document.addEventListener('DOMContentLoaded', function () {
  // Utility: Set a cookie
  function setCookie(name, value, hours) {
    const date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  }

  // Utility: Get a cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Utility: Debounce function for scroll events
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Donation Popup Functionality
  const donationPopup = document.getElementById('donationPopup');
  const closePopup = document.getElementById('closePopup');
  const closePopupBtn = document.getElementById('closePopupBtn');
  const popupContent = document.querySelector('.popup-content');

  if (donationPopup && closePopup && closePopupBtn && popupContent) {
    // Accessibility: Add ARIA attributes
    donationPopup.setAttribute('aria-hidden', 'true');
    donationPopup.setAttribute('role', 'dialog');
    closePopup.setAttribute('aria-label', 'Close donation popup');

    // Check if popup should be shown (cookie-based, once every 24 hours)
    const popupCookieKey = 'donationPopupShown';
    if (!getCookie(popupCookieKey)) {
      const delay = parseInt(donationPopup.dataset.delay || 3000, 10);
      setTimeout(() => {
        donationPopup.classList.add('active');
        donationPopup.setAttribute('aria-hidden', 'false');
        popupContent.focus();
        setCookie(popupCookieKey, 'true', 24);
      }, delay);
    }

    // Function to close popup
    function closePopupHandler() {
      donationPopup.classList.remove('active');
      donationPopup.setAttribute('aria-hidden', 'true');
    }

    // Close popup events
    closePopup.addEventListener('click', closePopupHandler);
    closePopupBtn.addEventListener('click', closePopupHandler);

    // Close popup when clicking outside content
    donationPopup.addEventListener('click', function (e) {
      if (e.target === donationPopup) {
        closePopupHandler();
      }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && donationPopup.classList.contains('active')) {
        closePopupHandler();
      }
    });

    // Focus trap for accessibility
    const focusableElements = popupContent.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    popupContent.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' && donationPopup.classList.contains('active')) {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  } else {
    console.warn('Donation popup elements not found.');
  }

  // Navigation Functionality
  const navLinks = document.querySelectorAll('nav a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const hrefBase = href.split(/[?#]/)[0];

    // Set active class for current page
    if (hrefBase === currentPage || (hrefBase === '' && currentPage === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }

    // Smooth scrolling for anchor links (no header offset since header is not sticky)
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

  // Scroll-based active link update for single-page navigation
  const sections = document.querySelectorAll('section[id]');
  const updateActiveLink = debounce(() => {
    let currentSectionId = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom >= 150) {
        currentSectionId = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }, 100);

  window.addEventListener('scroll', updateActiveLink);

  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav ul');

  if (navToggle && navMenu) {
    navToggle.setAttribute('aria-label', 'Toggle navigation menu');
    navToggle.addEventListener('click', function () {
      const isExpanded = navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isExpanded);
      navMenu.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.4, 1)';
      navMenu.style.transform = isExpanded ? 'translateY(0)' : 'translateY(-100%)';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          navMenu.style.transform = 'translateY(-100%)';
        }
      });
    });
  }

  // Lazy Loading Images
  const images = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }

  // Scroll-to-Top Button
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'scroll-top';
  scrollTopBtn.innerHTML = '↑';
  scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(scrollTopBtn);

  const toggleScrollTop = debounce(() => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, 100);

  window.addEventListener('scroll', toggleScrollTop);

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Article Card Hover Effects
  const articleCards = document.querySelectorAll('.article-card');
  articleCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const excerpt = card.querySelector('p');
      if (excerpt) {
        excerpt.style.maxHeight = '200px';
        excerpt.style.transition = 'max-height 0.4s cubic-bezier(0.2, 0.8, 0.4, 1)';
      }
    });
    card.addEventListener('mouseleave', () => {
      const excerpt = card.querySelector('p');
      if (excerpt) {
        excerpt.style.maxHeight = '5.7rem';
      }
    });
  });
});