// GitHub Issues Tracker - Main Application JavaScript

// ============================================
// CONFIGURATION
// ============================================
const API_BASE_URL = 'https://phi-lab-server.vercel.app/api/v1/lab';
const DEMO_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// ============================================
// STATE MANAGEMENT
// ============================================
let allIssues = [];
let filteredIssues = [];
let currentTab = 'all';

// ============================================
// DOM ELEMENTS
// ============================================
const loginPage = document.getElementById('login-page');
const mainPage = document.getElementById('main-page');
const loginBtn = document.getElementById('login-btn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const issuesGrid = document.getElementById('issues-grid');
const loadingSpinner = document.getElementById('loading-spinner');
const issueCountElement = document.getElementById('issue-count');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const tabs = document.querySelectorAll('[data-tab]');
const issueModal = document.getElementById('issue-modal');

// ============================================
// LOGIN FUNCTIONALITY
// ============================================
function handleLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
        // Successful login
        loginPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        loadAllIssues();
    } else {
        alert('Invalid credentials! Please use:\nUsername: admin\nPassword: admin123');
    }
}

loginBtn.addEventListener('click', handleLogin);

// Allow Enter key to submit login
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleLogin();
    }
});

usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        passwordInput.focus();
    }
});

// ============================================
// FETCH ISSUES FROM API
// ============================================
async function loadAllIssues() {
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/issues`);
        const data = await response.json();
        
        if (data.status === 'success' && data.data) {
            allIssues = data.data;
            filteredIssues = [...allIssues];
            renderIssues(filteredIssues);
        } else {
            console.error('Failed to load issues:', data);
            issuesGrid.innerHTML = '<p class="text-center text-gray-500 col-span-4">Failed to load issues. Please try again.</p>';
        }
    } catch (error) {
        console.error('Error fetching issues:', error);
        issuesGrid.innerHTML = '<p class="text-center text-gray-500 col-span-4">Error loading issues. Please check your connection.</p>';
    } finally {
        showLoading(false);
    }
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
async function searchIssues(query) {
    if (!query.trim()) {
        filteredIssues = filterByTab(allIssues, currentTab);
        renderIssues(filteredIssues);
        return;
    }

    showLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/issues/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.status === 'success' && data.data) {
            filteredIssues = filterByTab(data.data, currentTab);
            renderIssues(filteredIssues);
        } else {
            issuesGrid.innerHTML = '<p class="text-center text-gray-500 col-span-4">No issues found matching your search.</p>';
            updateIssueCount(0);
        }
    } catch (error) {
        console.error('Error searching issues:', error);
        issuesGrid.innerHTML = '<p class="text-center text-gray-500 col-span-4">Error searching issues. Please try again.</p>';
    } finally {
        showLoading(false);
    }
}

searchBtn.addEventListener('click', () => {
    searchIssues(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchIssues(searchInput.value);
    }
});

// ============================================
// TAB FILTERING
// ============================================
function filterByTab(issues, tab) {
    switch (tab) {
        case 'open':
            return issues.filter(issue => issue.status.toLowerCase() === 'open');
        case 'closed':
            return issues.filter(issue => issue.status.toLowerCase() === 'closed');
        default:
            return issues;
    }
}

function setActiveTab(tab) {
    currentTab = tab;
    
    // Remove all active classes
    tabs.forEach(t => {
        t.classList.remove('tab-active', 'tab-active-all', 'tab-active-open', 'tab-active-closed', 'bg-yellow-400', 'bg-green-500', 'bg-purple-600', 'text-white', 'text-black');
        t.classList.add('text-gray-600');
    });

    // Add active class to current tab
    const activeTab = document.querySelector(`[data-tab="${tab}"]`);
    activeTab.classList.remove('text-gray-600');
    
    switch (tab) {
        case 'all':
            activeTab.classList.add('tab-active', 'bg-yellow-400', 'text-black');
            break;
        case 'open':
            activeTab.classList.add('tab-active', 'bg-green-500', 'text-white');
            break;
        case 'closed':
            activeTab.classList.add('tab-active', 'bg-purple-600', 'text-white');
            break;
    }

    // Filter issues
    const searchQuery = searchInput.value.trim();
    if (searchQuery) {
        searchIssues(searchQuery);
    } else {
        filteredIssues = filterByTab(allIssues, tab);
        renderIssues(filteredIssues);
    }
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        setActiveTab(tab.dataset.tab);
    });
});

// ============================================
// RENDER ISSUES
// ============================================
function renderIssues(issues) {
    issuesGrid.innerHTML = '';
    updateIssueCount(issues.length);

    if (issues.length === 0) {
        issuesGrid.innerHTML = '<p class="text-center text-gray-500 col-span-4">No issues found.</p>';
        return;
    }

    issues.forEach(issue => {
        const card = createIssueCard(issue);
        issuesGrid.appendChild(card);
    });
}

function createIssueCard(issue) {
    const isOpen = issue.status.toLowerCase() === 'open';
    const borderClass = isOpen ? 'card-open' : 'card-closed';
    const statusIconClass = isOpen ? 'status-open' : 'status-closed';
    
    const card = document.createElement('div');
    card.className = `card bg-white shadow-md issue-card ${borderClass}`;
    card.onclick = () => openIssueModal(issue);

    // Format date
    const createdDate = new Date(issue.createdAt).toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
    });

    // Get priority badge class
    const priorityClass = getPriorityClass(issue.priority);

    // Create labels HTML
    const labelsHTML = issue.labels.map(label => {
        const labelClass = getLabelClass(label);
        return `<span class="badge badge-sm ${labelClass}">${label}</span>`;
    }).join('');

    card.innerHTML = `
        <div class="card-body p-4">
            <div class="flex justify-between items-start">
                <span class="${statusIconClass}">
                    <i class="fas fa-exclamation-circle text-lg"></i>
                </span>
                <span class="badge badge-sm ${priorityClass}">${issue.priority}</span>
            </div>
            <h3 class="font-bold text-gray-800 text-sm mt-2 line-clamp-2">${issue.title}</h3>
            <p class="text-gray-500 text-xs mt-1 line-clamp-2">${issue.description}</p>
            <div class="flex flex-wrap gap-1 mt-3">
                ${labelsHTML}
            </div>
            <div class="mt-4 pt-3 border-t border-gray-100">
                <p class="text-gray-500 text-xs">#${issue.id} by ${issue.author}</p>
                <p class="text-gray-400 text-xs">${createdDate}</p>
            </div>
        </div>
    `;

    return card;
}

// ============================================
// MODAL FUNCTIONALITY
// ============================================
async function openIssueModal(issue) {
    // Fetch single issue details for more complete data
    try {
        const response = await fetch(`${API_BASE_URL}/issue/${issue.id}`);
        const data = await response.json();
        
        if (data.status === 'success' && data.data) {
            displayIssueModal(data.data);
        } else {
            displayIssueModal(issue);
        }
    } catch (error) {
        console.error('Error fetching issue details:', error);
        displayIssueModal(issue);
    }
}

function displayIssueModal(issue) {
    const isOpen = issue.status.toLowerCase() === 'open';
    
    document.getElementById('modal-title').textContent = issue.title;
    document.getElementById('modal-description').textContent = issue.description;
    document.getElementById('modal-author').textContent = issue.author;
    document.getElementById('modal-assignee').textContent = issue.author;
    
    // Status badge
    const statusBadge = document.getElementById('modal-status');
    statusBadge.textContent = isOpen ? 'Opened' : 'Closed';
    statusBadge.className = `badge ${isOpen ? 'status-badge-open' : 'status-badge-closed'}`;
    
    // Date
    const createdDate = new Date(issue.createdAt).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    document.getElementById('modal-date').textContent = createdDate;
    
    // Priority
    const priorityBadge = document.getElementById('modal-priority');
    priorityBadge.textContent = issue.priority;
    priorityBadge.className = `badge ${getPriorityClass(issue.priority)}`;
    
    // Labels
    const labelsContainer = document.getElementById('modal-labels');
    labelsContainer.innerHTML = issue.labels.map(label => {
        const labelClass = getLabelClass(label);
        return `<span class="badge ${labelClass}">${label}</span>`;
    }).join('');
    
    issueModal.showModal();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function showLoading(show) {
    loadingSpinner.classList.toggle('hidden', !show);
    issuesGrid.classList.toggle('hidden', show);
}

function updateIssueCount(count) {
    issueCountElement.textContent = count;
}

function getPriorityClass(priority) {
    switch (priority.toLowerCase()) {
        case 'high':
            return 'priority-high';
        case 'medium':
            return 'priority-medium';
        case 'low':
            return 'priority-low';
        default:
            return 'bg-gray-400 text-white';
    }
}

function getLabelClass(label) {
    const labelLower = label.toLowerCase();
    if (labelLower.includes('bug')) return 'label-bug';
    if (labelLower.includes('enhancement')) return 'label-enhancement';
    if (labelLower.includes('help')) return 'label-help-wanted';
    if (labelLower.includes('documentation') || labelLower.includes('doc')) return 'label-documentation';
    if (labelLower.includes('feature')) return 'label-feature';
    return 'bg-gray-400 text-white';
}

// ============================================
// INITIALIZATION
// ============================================
// Check if user is already logged in (for demo purposes, always show login)
document.addEventListener('DOMContentLoaded', () => {
    // Initialize - show login page
    loginPage.classList.remove('hidden');
    mainPage.classList.add('hidden');
});
