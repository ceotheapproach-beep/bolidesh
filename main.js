// Donation Popup Functionality
document.addEventListener('DOMContentLoaded', function() {
  const donationPopup = document.getElementById('donationPopup');
  const closePopup = document.getElementById('closePopup');
  const closePopupBtn = document.getElementById('closePopupBtn');
  
  // Show popup after 3 seconds
  setTimeout(function() {
    donationPopup.classList.add('active');
  }, 3000);
  
  // Close popup when close button is clicked
  closePopup.addEventListener('click', function() {
    donationPopup.classList.remove('active');
  });
  
  closePopupBtn.addEventListener('click', function() {
    donationPopup.classList.remove('active');
  });
  
  // Close popup when clicking outside the content
  donationPopup.addEventListener('click', function(e) {
    if (e.target === donationPopup) {
      donationPopup.classList.remove('active');
    }
  });
  
  // Add active class to current page in navigation
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
});