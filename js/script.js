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