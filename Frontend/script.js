const API_BASE_URL = 'https://jobscrape-i388.onrender.com/api';   //  https://jobscrape.pxxl.click/api

// Get all the elements we need
const jobUrlInput = document.getElementById('jobUrl');
const fetchBtn = document.getElementById('fetchBtn');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const jobInfoDiv = document.getElementById('jobInfo');
const saveBtn = document.getElementById('saveBtn');
const loadJobsBtn = document.getElementById('loadJobsBtn');
const savedJobsDiv = document.getElementById('savedJobs'); 

// --- Auth State Management ---
function isLoggedIn() {
    return !!localStorage.getItem('userEmail');
}
function getUserEmail() {
    return localStorage.getItem('userEmail');
}
function setUser(email, id) {
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userId', id);
}
function clearUser() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
}

// --- Auth Modal Logic ---
const authModal = document.getElementById('authModal');
const authBtn = document.getElementById('authBtn');
const logoutBtn = document.getElementById('logoutBtn');
const closeAuthModal = document.getElementById('closeAuthModal');
const authForm = document.getElementById('authForm');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authPassword2 = document.getElementById('authPassword2');
const loginBtn = document.getElementById('loginBtn');
const switchToRegisterBtn = document.getElementById('switchToRegisterBtn');
const authModalTitle = document.getElementById('authModalTitle');
const authError = document.getElementById('authError');
const authErrorMsg = document.getElementById('authErrorMsg');

let isRegisterMode = false;

function showAuthModal(registerMode = false) {
    isRegisterMode = registerMode;
    authModal.classList.remove('hidden');
    authError.classList.add('hidden');
    authForm.reset();
    if (registerMode) {
        authPassword2.style.display = '';
        loginBtn.textContent = 'Register';
        switchToRegisterBtn.textContent = 'Login';
        authModalTitle.textContent = 'Register';
    } else {
        authPassword2.style.display = 'none';
        loginBtn.textContent = 'Login';
        switchToRegisterBtn.textContent = 'Register';
        authModalTitle.textContent = 'Login';
    }
}
function hideAuthModal() {
    authModal.classList.add('hidden');
}
switchToRegisterBtn.onclick = function(e) {
    e.preventDefault();
    showAuthModal(!isRegisterMode);
};
closeAuthModal.onclick = function() {
    hideAuthModal();
};
authBtn.onclick = function() {
    showAuthModal(false);
};
logoutBtn.onclick = function() {
    clearUser();
    updateAuthUI();
};
function updateAuthUI() {
    if (isLoggedIn()) {
        authBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
    } else {
        authBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
    }
}
updateAuthUI();

// --- Auth Form Submission ---
authForm.onsubmit = async function(e) {
    e.preventDefault();
    authError.classList.add('hidden');
    const email = authEmail.value.trim();
    const password = authPassword.value;
    if (!email || !password) return;
    if (isRegisterMode) {
        const password2 = authPassword2.value;
        if (password !== password2) {
            authErrorMsg.textContent = 'Passwords do not match';
            authError.classList.remove('hidden');
            return;
        }
        // Register
        try {
            const res = await fetch(`${API_BASE_URL}/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, password2 })
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.email, data.id);
                hideAuthModal();
                updateAuthUI();
            } else {
                authErrorMsg.textContent = data.email || data.password || data.password2 || data.message || 'Registration failed';
                authError.classList.remove('hidden');
            }
        } catch (err) {
            authErrorMsg.textContent = 'Network error.';
            authError.classList.remove('hidden');
        }
    } else {
        // Login
        try {
            const res = await fetch(`${API_BASE_URL}/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.email, data.id);
                hideAuthModal();
                updateAuthUI();
            } else {
                authErrorMsg.textContent = data.detail || data.message || 'Login failed';
                authError.classList.remove('hidden');
            }
        } catch (err) {
            authErrorMsg.textContent = 'Network error.';
            authError.classList.remove('hidden');
        }
    }
};

// --- Require Login for Save/View ---
function requireLogin(action) {
    if (!isLoggedIn()) {
        showAuthModal(false);
        return false;
    }
    return true;
}

// --- Patch Save Job ---
const originalSaveJob = saveJob;
saveBtn.onclick = function() {
    if (!requireLogin()) return;
    originalSaveJob();
};
// --- Patch Load Saved Jobs ---
const originalLoadSavedJobs = loadSavedJobs;
loadJobsBtn.onclick = function() {
    if (!requireLogin()) return;
    originalLoadSavedJobs();
};

// Store the current job data
let currentJobData = null;

// Hide all sections initially
function hideAllSections() {
    loadingDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    jobInfoDiv.classList.add('hidden');
}

// Show error message
function showError(message) {
    hideAllSections();
    errorMessage.textContent = message;
    errorDiv.classList.remove('hidden');
}

// Show loading
function showLoading() {
    hideAllSections();
    loadingDiv.classList.remove('hidden');
    fetchBtn.disabled = true;
    fetchBtn.textContent = 'Extracting...';
}

// Hide loading
function hideLoading() {
    loadingDiv.classList.add('hidden');
    fetchBtn.disabled = false;
    fetchBtn.textContent = 'Extract Job Info';
}

// Display job information
function displayJobInfo(jobData) {
    document.getElementById('jobTitle').textContent = jobData.title || 'N/A';
    document.getElementById('jobCompany').textContent = jobData.company || 'N/A';
    document.getElementById('jobLocation').textContent = jobData.location || 'N/A';
    document.getElementById('jobType').textContent = jobData.job_type || 'N/A';
    document.getElementById('jobPay').textContent = jobData.pay || 'N/A';
    document.getElementById('jobPlatform').textContent = jobData.platform || 'N/A';
    
    jobInfoDiv.classList.remove('hidden');
    currentJobData = jobData;
}

// Fetch job info from API
async function fetchJobInfo() {
    const url = jobUrlInput.value.trim();
    
    if (!url) {
        showError('Please enter a job URL');
        return;
    }
    
    // Basic URL validation
    try {
        new URL(url);
    } catch {
        showError('Please enter a valid URL');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/fetch/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayJobInfo(data);
        } else {
            showError(data.error || 'Failed to extract job information');
        }
        
    } catch (error) {
        showError('Network error. Make sure your Django server is running.');
        console.error('Error:', error);
    } finally {
        hideLoading();
    }
}

// Save job to database
async function saveJob() {
    if (!currentJobData) {
        showError('No job data to save');
        return;
    }
    
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/jobs/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...currentJobData, email: getUserEmail() })
        });
        
        if (response.ok) {
            saveBtn.textContent = 'Saved!';
            saveBtn.style.background = '#28a745';
            setTimeout(() => {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save This Job';
                saveBtn.style.background = '';
            }, 2000);
        } else {
            const error = await response.json();
            showError(error.error || 'Failed to save job');
        }
        
    } catch (error) {
        showError('Network error. Could not save job.');
        console.error('Error:', error);
    } finally {
        if (saveBtn.textContent === 'Saving...') {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save This Job';
        }
    }
}

// Load saved jobs
async function loadSavedJobs() {
    loadJobsBtn.disabled = true;
    loadJobsBtn.textContent = 'Loading...';
    
    try {
        const email = getUserEmail();
        const response = await fetch(`${API_BASE_URL}/jobs/?email=${encodeURIComponent(email)}`);
        const jobs = await response.json();
        
        if (response.ok) {
            displaySavedJobs(jobs);
        } else {
            showError('Failed to load saved jobs');
        }
        
    } catch (error) {
        showError('Network error. Could not load saved jobs.');
        console.error('Error:', error);
    } finally {
        loadJobsBtn.disabled = false;
        loadJobsBtn.textContent = 'Load My Saved Jobs';
    }
}

// Display saved jobs
function displaySavedJobs(jobs) {
    if (jobs.length === 0) {
        savedJobsDiv.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No saved jobs yet.</p>';
        return;
    }
    const jobsHTML = jobs.map(job => `
        <div class="saved-job-item" data-job-id="${job.id}">
            <h4>${job.title || 'N/A'}</h4>
            <p><strong>Company:</strong> ${job.company || 'N/A'}</p>
            <p><strong>Location:</strong> ${job.location || 'N/A'}</p>
            <p><strong>Type:</strong> ${job.job_type || 'N/A'}</p>
            <p><strong>Pay:</strong> ${job.pay || 'N/A'}</p>
            <p><strong>Platform:</strong> ${job.platform || 'N/A'}</p>
            <button class="btn delete-job-btn" data-job-id="${job.id}">🗑️ Delete</button>
        </div>
    `).join('');
    savedJobsDiv.innerHTML = jobsHTML;
    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-job-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const jobId = this.getAttribute('data-job-id');
            await deleteJob(jobId);
        });
    });
}
// Delete job
async function deleteJob(jobId) {
    try {
        const email = getUserEmail();
        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/?email=${encodeURIComponent(email)}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            loadSavedJobs();
        } else {
            showError('Failed to delete job');
        }
    } catch (error) {
        showError('Network error. Could not delete job.');
        console.error('Error:', error);
    }
}

// Event listeners
fetchBtn.addEventListener('click', fetchJobInfo);
saveBtn.addEventListener('click', saveJob);
loadJobsBtn.addEventListener('click', loadSavedJobs);

// Allow Enter key to trigger fetch
jobUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchJobInfo();
    }
});

// Initialize
hideAllSections();