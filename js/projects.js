// ==========================================
// PROJECTS.JS - All Projects Page Functionality
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeProjectsPage();
});

function initializeProjectsPage() {
    setupProjectFilters();
    setupLoadMore();
    animateStats();
}

// ==========================================
// PROJECT FILTERING
// ==========================================

function setupProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterBtns.length === 0 || projectCards.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            filterProjects(filter, projectCards);
        });
    });
}

function filterProjects(filter, projectCards) {
    projectCards.forEach((card, index) => {
        const categories = card.getAttribute('data-category');
        
        // Remove animation class first
        card.classList.remove('show');
        
        if (filter === 'all' || categories.includes(filter)) {
            card.classList.remove('hidden');
            
            // Add staggered animation
            setTimeout(() => {
                card.classList.add('show');
            }, index * 50);
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Show "no results" message if needed
    const visibleCards = Array.from(projectCards).filter(card => !card.classList.contains('hidden'));
    
    if (visibleCards.length === 0) {
        showNoResultsMessage();
    } else {
        hideNoResultsMessage();
    }
}

function showNoResultsMessage() {
    const grid = document.getElementById('projects-grid');
    let message = document.getElementById('no-results-message');
    
    if (!message) {
        message = document.createElement('div');
        message.id = 'no-results-message';
        message.className = 'no-results';
        message.innerHTML = `
            <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
            <h3>No projects found</h3>
            <p>Try selecting a different filter</p>
        `;
        message.style.cssText = `
            grid-column: 1 / -1;
            text-align: center;
            padding: 4rem 2rem;
            color: #666;
        `;
        grid.appendChild(message);
    }
}

function hideNoResultsMessage() {
    const message = document.getElementById('no-results-message');
    if (message) {
        message.remove();
    }
}

// ==========================================
// LOAD MORE FUNCTIONALITY
// ==========================================

function setupLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadMoreSection = document.getElementById('load-more-section');
    
    if (!loadMoreBtn) return;
    
    // Check if we have more projects to show
    // This is a placeholder - you can implement actual pagination
    const allProjects = document.querySelectorAll('.project-card');
    
    if (allProjects.length > 12) {
        loadMoreSection.style.display = 'block';
        
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more projects
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            setTimeout(() => {
                // Here you would typically load more projects via AJAX
                showNotification('All projects are already displayed!', 'info');
                loadMoreSection.style.display = 'none';
            }, 1000);
        });
    }
}

// ==========================================
// STATS COUNTER ANIMATION
// ==========================================

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = parseInt(stat.getAttribute('data-target'));
                
                animateCounter(stat, target);
                observer.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, stepTime);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K';
    }
    return num.toString();
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? '#28a745' : '#667eea'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==========================================
// SEARCH FUNCTIONALITY (OPTIONAL)
// ==========================================

function setupProjectSearch() {
    const searchInput = document.getElementById('project-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const techs = Array.from(card.querySelectorAll('.tech-tag'))
                .map(tag => tag.textContent.toLowerCase())
                .join(' ');
            
            const matches = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          techs.includes(searchTerm);
            
            if (matches) {
                card.classList.remove('hidden');
                card.classList.add('show');
            } else {
                card.classList.add('hidden');
                card.classList.remove('show');
            }
        });
    });
}
