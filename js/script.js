// GitHub Issues Tracker - Main Application JavaScript

// Configuration
const API_BASE_URL = 'https://phi-lab-server.vercel.app/api/v1/lab';
const DEMO_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// DOM Elements
const loginPage = document.getElementById('login-page');
const loginBtn = document.getElementById('login-btn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Login Functionality
function handleLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
        alert('Login successful!');
        // Will redirect to main page in next commit
    } else {
        alert('Invalid credentials! Please use:\nUsername: admin\nPassword: admin123');
    }
}

loginBtn.addEventListener('click', handleLogin);

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

// State Management
let allIssues = [];
let filteredIssues = [];
let currentTab = 'all';

// Additional DOM Elements
const mainPage = document.getElementById('main-page');
const issuesGrid = document.getElementById('issues-grid');
const loadingSpinner = document.getElementById('loading-spinner');
const issueCountElement = document.getElementById('issue-count');

// Update login function to show main page
function handleLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
        loginPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        loadAllIssues();
    } else {
        alert('Invalid credentials! Please use:\nUsername: admin\nPassword: admin123');
    }
}

// Fetch Issues from API
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
            issuesGrid.innerHTML = '<p class="text-center text-gray-500 col-span-4">Failed to load issues.</p>';
        }
    } catch (error) {
        console.error('Error fetching issues:', error);
        issuesGrid.innerHTML = '<p class="text-center text-gray-500 col-span-4">Error loading issues.</p>';
    } finally {
        showLoading(false);
    }
}

// Render Issues
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

// Create Issue Card
function createIssueCard(issue) {
    const isOpen = issue.status.toLowerCase() === 'open';
    const borderClass = isOpen ? 'border-t-4 border-green-500' : 'border-t-4 border-purple-500';
    
    const card = document.createElement('div');
    card.className = `card bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow ${borderClass}`;

    const createdDate = new Date(issue.createdAt).toLocaleDateString('en-US', {
        month: 'numeric', day: 'numeric', year: 'numeric'
    });

    const labelsHTML = issue.labels.map(label => 
        `<span class="badge badge-sm bg-orange-500 text-white">${label}</span>`
    ).join('');

    card.innerHTML = `
        <div class="card-body p-4">
            <div class="flex justify-between items-start">
                <span class="${isOpen ? 'text-green-500' : 'text-purple-500'}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </span>
                <span class="badge badge-sm bg-red-500 text-white">${issue.priority}</span>
            </div>
            <h3 class="font-bold text-gray-800 text-sm mt-2">${issue.title}</h3>
            <p class="text-gray-500 text-xs mt-1">${issue.description}</p>
            <div class="flex flex-wrap gap-1 mt-3">${labelsHTML}</div>
            <div class="mt-4 pt-3 border-t border-gray-100">
                <p class="text-gray-500 text-xs">#${issue.id} by ${issue.author}</p>
                <p class="text-gray-400 text-xs">${createdDate}</p>
            </div>
        </div>
    `;

    return card;
}

// Utility Functions
function showLoading(show) {
    loadingSpinner.classList.toggle('hidden', !show);
    issuesGrid.classList.toggle('hidden', show);
}

function updateIssueCount(count) {
    issueCountElement.textContent = count;
}

// Tab Elements
const tabs = document.querySelectorAll('[data-tab]');

// Filter by Tab
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

// Set Active Tab
function setActiveTab(tab) {
    currentTab = tab;
    
    tabs.forEach(t => {
        t.classList.remove('tab-active', 'bg-yellow-400', 'bg-green-500', 'bg-purple-600', 'text-white', 'text-black');
        t.classList.add('text-gray-600');
    });

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

    filteredIssues = filterByTab(allIssues, tab);
    renderIssues(filteredIssues);
}

// Tab Event Listeners
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        setActiveTab(tab.dataset.tab);
    });
});

const issueModal = document.getElementById('issue-modal');

// Update createIssueCard to add click handler
// In createIssueCard function, add: card.onclick = () => openIssueModal(issue);

async function openIssueModal(issue) {
    try {
        const response = await fetch(`${API_BASE_URL}/issue/${issue.id}`);
        const data = await response.json();
        
        if (data.status === 'success' && data.data) {
            displayIssueModal(data.data);
        } else {
            displayIssueModal(issue);
        }
    } catch (error) {
        displayIssueModal(issue);
    }
}

function displayIssueModal(issue) {
    const isOpen = issue.status.toLowerCase() === 'open';
    
    document.getElementById('modal-title').textContent = issue.title;
    document.getElementById('modal-description').textContent = issue.description;
    document.getElementById('modal-author').textContent = issue.author;
    document.getElementById('modal-assignee').textContent = issue.author;
    
    const statusBadge = document.getElementById('modal-status');
    statusBadge.textContent = isOpen ? 'Opened' : 'Closed';
    statusBadge.className = `badge ${isOpen ? 'bg-green-500 text-white' : 'bg-purple-600 text-white'}`;
    
    const createdDate = new Date(issue.createdAt).toLocaleDateString('en-US', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
    document.getElementById('modal-date').textContent = createdDate;
    
    const priorityBadge = document.getElementById('modal-priority');
    priorityBadge.textContent = issue.priority;
    priorityBadge.className = 'badge bg-red-500 text-white';
    
    const labelsContainer = document.getElementById('modal-labels');
    labelsContainer.innerHTML = issue.labels.map(label => 
        `<span class="badge bg-orange-500 text-white">${label}</span>`
    ).join('');
    
    issueModal.showModal();
}