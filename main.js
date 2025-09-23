// Bolidesh Foundation JavaScript
// Handles animations, interactions, pagination, and dynamic content

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    initAnimations();
    initInteractiveElements();
    initDynamicContent();
    initPagination(); // पेजिनेशन इनिशियलाइज़ेशन
    initStatistics();
    initSmoothScrolling();
    
    // Handle responsive behavior
    handleResponsive();
});

// Initialize animations
function initAnimations() {
    // Animate elements when they come into view
    const animatedElements = document.querySelectorAll('.featured-card, .overview-card, .stat-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// Initialize interactive elements
function initInteractiveElements() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.featured-card, .overview-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.cta-button, .pagination-button');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = '';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

// Initialize dynamic content
function initDynamicContent() {
    // Update copyright year automatically
    const yearElement = document.querySelector('footer .footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
    }
    
    // Add loading animation to images
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
            img.classList.add('loaded');
        });
        
        // Set initial opacity for fade-in effect
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        }
    });
}

// पेजिनेशन सिस्टम इनिशियलाइज़ेशन
function initPagination() {
    const categoryLists = document.querySelectorAll('.category-list');
    
    if (categoryLists.length > 0) {
        categoryLists.forEach(list => {
            // वर्णमाला के क्रम में आर्टिकल्स को सॉर्ट करें
            sortArticlesAlphabetically(list);
            
            // पेजिनेशन लागू करें
            setupPagination(list, 10); // प्रति पेज 10 आर्टिकल
        });
    }
}

// वर्णमाला के क्रम में आर्टिकल्स को सॉर्ट करें
function sortArticlesAlphabetically(list) {
    const items = Array.from(list.children);
    
    // आर्टिकल्स को वर्णमाला के क्रम में सॉर्ट करें
    items.sort((a, b) => {
        const textA = a.textContent || a.innerText;
        const textB = b.textContent || b.innerText;
        return textA.localeCompare(textB);
    });
    
    // सॉर्ट किए गए आर्टिकल्स को वापस लिस्ट में डालें
    list.innerHTML = '';
    items.forEach(item => list.appendChild(item));
}

// पेजिनेशन सेटअप
function setupPagination(list, itemsPerPage) {
    const items = Array.from(list.children);
    const totalItems = items.length;
    
    if (totalItems <= itemsPerPage) {
        // अगर आर्टिकल्स की संख्या itemsPerPage से कम है, तो पेजिनेशन की जरूरत नहीं
        return;
    }
    
    // सभी आर्टिकल्स को छुपाएं
    items.forEach(item => {
        item.style.display = 'none';
    });
    
    // पेजिनेशन कंट्रोल्स बनाएं
    const paginationControls = createPaginationControls(totalItems, itemsPerPage);
    
    // पेजिनेशन कंट्रोल्स को लिस्ट के बाद डालें
    list.parentNode.insertBefore(paginationControls, list.nextSibling);
    
    // पहला पेज दिखाएं
    showPage(items, 1, itemsPerPage);
}

// पेजिनेशन कंट्रोल्स बनाएं
function createPaginationControls(totalItems, itemsPerPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-controls';
    
    // पिछला पेज बटन
    const prevButton = document.createElement('button');
    prevButton.className = 'pagination-button';
    prevButton.innerHTML = '&laquo; Prev';
    prevButton.addEventListener('click', () => {
        const currentPage = parseInt(paginationContainer.getAttribute('data-currentpage') || '1');
        if (currentPage > 1) {
            showPage(Array.from(document.querySelector('.category-list').children), currentPage - 1, itemsPerPage);
            paginationContainer.setAttribute('data-currentpage', currentPage - 1);
            updatePaginationButtons(paginationContainer, currentPage - 1, totalPages);
        }
    });
    
    // पेज नंबर
    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-info';
    pageInfo.textContent = 'Page 1 of ' + totalPages;
    
    // अगला पेज बटन
    const nextButton = document.createElement('button');
    nextButton.className = 'pagination-button';
    nextButton.innerHTML = 'Next &raquo;';
    nextButton.addEventListener('click', () => {
        const currentPage = parseInt(paginationContainer.getAttribute('data-currentpage') || '1');
        if (currentPage < totalPages) {
            showPage(Array.from(document.querySelector('.category-list').children), currentPage + 1, itemsPerPage);
            paginationContainer.setAttribute('data-currentpage', currentPage + 1);
            updatePaginationButtons(paginationContainer, currentPage + 1, totalPages);
        }
    });
    
    // पेज नंबर बटन्स (यदि जरूरी हो)
    const pageNumbers = document.createElement('div');
    pageNumbers.className = 'page-numbers';
    
    if (totalPages <= 10) {
        // सीधे सभी पेज नंबर दिखाएं
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = 'pagination-button page-number';
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                showPage(Array.from(document.querySelector('.category-list').children), i, itemsPerPage);
                paginationContainer.setAttribute('data-currentpage', i);
                updatePaginationButtons(paginationContainer, i, totalPages);
            });
            pageNumbers.appendChild(pageButton);
        }
    } else {
        // पहले, अंतिम और करंट पेज के आसपास के पेज नंबर दिखाएं
        // यहाँ आप अधिक उन्नत पेजिनेशन लॉजिक जोड़ सकते हैं
        const currentPage = 1;
        
        // पहला पेज
        const firstPageButton = document.createElement('button');
        firstPageButton.className = 'pagination-button page-number';
        firstPageButton.textContent = '1';
        firstPageButton.addEventListener('click', () => {
            showPage(Array.from(document.querySelector('.category-list').children), 1, itemsPerPage);
            paginationContainer.setAttribute('data-currentpage', 1);
            updatePaginationButtons(paginationContainer, 1, totalPages);
        });
        pageNumbers.appendChild(firstPageButton);
        
        // Ellipsis अगर जरूरी हो
        if (currentPage > 3) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'ellipsis';
            ellipsis.textContent = '...';
            pageNumbers.appendChild(ellipsis);
        }
        
        // करंट पेज और उसके आसपास
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);
        
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = 'pagination-button page-number';
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                showPage(Array.from(document.querySelector('.category-list').children), i, itemsPerPage);
                paginationContainer.setAttribute('data-currentpage', i);
                updatePaginationButtons(paginationContainer, i, totalPages);
            });
            pageNumbers.appendChild(pageButton);
        }
        
        // Ellipsis अगर जरूरी हो
        if (currentPage < totalPages - 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'ellipsis';
            ellipsis.textContent = '...';
            pageNumbers.appendChild(ellipsis);
        }
        
        // अंतिम पेज
        const lastPageButton = document.createElement('button');
        lastPageButton.className = 'pagination-button page-number';
        lastPageButton.textContent = totalPages;
        lastPageButton.addEventListener('click', () => {
            showPage(Array.from(document.querySelector('.category-list').children), totalPages, itemsPerPage);
            paginationContainer.setAttribute('data-currentpage', totalPages);
            updatePaginationButtons(paginationContainer, totalPages, totalPages);
        });
        pageNumbers.appendChild(lastPageButton);
    }
    
    // कंट्रोल्स को कंटेनर में जोड़ें
    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(pageInfo);
    paginationContainer.appendChild(pageNumbers);
    paginationContainer.appendChild(nextButton);
    
    // करंट पेज सेट करें
    paginationContainer.setAttribute('data-currentpage', '1');
    
    return paginationContainer;
}

// विशिष्ट पेज के आर्टिकल्स दिखाएं
function showPage(items, pageNumber, itemsPerPage) {
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // सभी आर्टिकल्स छुपाएं
    items.forEach(item => {
        item.style.display = 'none';
    });
    
    // वर्तमान पेज के आर्टिकल्स दिखाएं
    for (let i = startIndex; i < endIndex && i < items.length; i++) {
        items[i].style.display = 'block';
    }
    
    // पेज जानकारी अपडेट करें
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const pageInfo = document.querySelector('.page-info');
    if (pageInfo) {
        pageInfo.textContent = `Page ${pageNumber} of ${totalPages}`;
    }
    
    // पेजिनेशन बटन्स अपडेट करें
    const paginationContainer = document.querySelector('.pagination-controls');
    if (paginationContainer) {
        updatePaginationButtons(paginationContainer, pageNumber, totalPages);
    }
}

// पेजिनेशन बटन्स अपडेट करें
function updatePaginationButtons(paginationContainer, currentPage, totalPages) {
    const prevButton = paginationContainer.querySelector('button:first-child');
    const nextButton = paginationContainer.querySelector('button:last-child');
    const pageNumberButtons = paginationContainer.querySelectorAll('.page-number');
    
    // पिछला बटन अपडेट करें
    prevButton.disabled = currentPage === 1;
    
    // अगला बटन अपडेट करें
    nextButton.disabled = currentPage === totalPages;
    
    // सक्रिय पेज हाइलाइट करें
    pageNumberButtons.forEach(button => {
        if (parseInt(button.textContent) === currentPage) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Animated statistics counter
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.textContent = Math.floor(progress * (end - start) + start).toLocaleString();
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize statistics animation
function initStatistics() {
    const statSection = document.querySelector('.stats-section');
    if (!statSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate statistics with delays
                setTimeout(() => animateValue('stat1', 0, 12500, 2000), 500);
                setTimeout(() => animateValue('stat2', 0, 85400, 2000), 1000);
                setTimeout(() => animateValue('stat3', 0, 3500, 2000), 1500);
                setTimeout(() => animateValue('stat4', 0, 9800, 2000), 2000);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(statSection);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
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
}

// Handle responsive behavior
function handleResponsive() {
    // Adjust card grid based on screen size
    const overviewGrid = document.querySelector('.overview-grid');
    const featuredGrid = document.querySelector('.featured-grid');
    
    if (overviewGrid && window.innerWidth < 768) {
        overviewGrid.style.gap = '1.5rem';
    }
    
    if (featuredGrid && window.innerWidth < 768) {
        featuredGrid.style.gap = '1.5rem';
    }
    
    // पेजिनेशन कंट्रोल्स को रेस्पॉन्सिव बनाएं
    const paginationControls = document.querySelector('.pagination-controls');
    if (paginationControls && window.innerWidth < 768) {
        const pageNumbers = paginationControls.querySelector('.page-numbers');
        if (pageNumbers) {
            // मोबाइल डिवाइस पर पेज नंबर छुपाएं
            pageNumbers.style.display = 'none';
        }
    } else if (paginationControls && window.innerWidth >= 768) {
        const pageNumbers = paginationControls.querySelector('.page-numbers');
        if (pageNumbers) {
            // डेस्कटॉप डिवाइस पर पेज नंबर दिखाएं
            pageNumbers.style.display = 'flex';
        }
    }
}

// Listen for window resize events
window.addEventListener('resize', handleResponsive);

// Add class for JavaScript-enabled styling
document.documentElement.classList.add('js-enabled');

// Export functions for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initAnimations,
        initInteractiveElements,
        initDynamicContent,
        initPagination,
        sortArticlesAlphabetically,
        setupPagination,
        animateValue,
        initStatistics,
        initSmoothScrolling
    };
}