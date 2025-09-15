// Bolidesh Foundation JavaScript
// Handles TOC dropdown, pagination, smooth scrolling, and lazy loading

// Table of Contents Dropdown
document.addEventListener('DOMContentLoaded', () => {
  const tocItems = document.querySelectorAll('.toc > ul > li');
  tocItems.forEach(item => {
    const subToc = item.querySelector('.sub-toc');
    if (subToc) {
      const mainLink = item.querySelector('a');
      mainLink.addEventListener('click', (e) => {
        e.preventDefault();
        subToc.classList.toggle('active');
      });
    }
  });
});

// Pagination for Category Pages
function paginateList(listSelector, itemsPerPage) {
  const list = document.querySelector(listSelector);
  if (!list) return;
  
  const items = Array.from(list.children);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  let currentPage = 1;
  
  // Sort items alphabetically
  items.sort((a, b) => a.textContent.localeCompare(b.textContent));
  list.innerHTML = '';
  items.forEach(item => list.appendChild(item));
  
  function showPage(page) {
    items.forEach((item, index) => {
      item.style.display = (index >= (page - 1) * itemsPerPage && index < page * itemsPerPage) ? 'block' : 'none';
    });
    
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';
    
    // Previous Button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = page === 1;
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
      }
    });
    pagination.appendChild(prevButton);
    
    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.disabled = i === page;
      button.addEventListener('click', () => {
        currentPage = i;
        showPage(currentPage);
      });
      pagination.appendChild(button);
    }
    
    // Next Button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = page === totalPages;
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        showPage(currentPage);
      }
    });
    pagination.appendChild(nextButton);
  }
  
  showPage(currentPage);
}

// Smooth Scrolling for Internal Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Lazy Loading for Images
const images = document.querySelectorAll('img[data-src]');
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      observer.unobserve(img);
    }
  });
}, { rootMargin: '0px 0px 200px 0px' });

images.forEach(img => observer.observe(img));

// Initialize Pagination on Category Pages
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.category-list')) {
    paginateList('.category-list', 10);
  }
});