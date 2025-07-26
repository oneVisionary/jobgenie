// Dashboard JavaScript for Admin (Company) Dashboard

document.addEventListener('DOMContentLoaded', function() {
    initializeAdminDashboard();
});

function initializeAdminDashboard() {
    // Check if user is authenticated
    checkAdminAuth();
    
    // Initialize dashboard components
    initializeSidebar();
    initializeUserMenu();
    initializeModals();
    initializeJobForm();
    initializeApplicationReview();
    
    // Load dashboard data
    loadDashboardData();
}

function checkAdminAuth() {
    const user = localStorage.getItem('jobgenie_user');
    const userType = localStorage.getItem('jobgenie_user_type');
    
    // Allow direct access during development
    if (!user || userType !== 'company') {
        // Create mock user data for development
        const mockUser = {
            id: 'company_123',
            name: 'TechCorp Solutions',
            email: 'admin@techcorp.com',
            type: 'company'
        };
        localStorage.setItem('jobgenie_user', JSON.stringify(mockUser));
        localStorage.setItem('jobgenie_user_type', 'company');
    }
    
    // Update UI with user info
    const userData = JSON.parse(localStorage.getItem('jobgenie_user'));
    updateUserInfo(userData);
}

function updateUserInfo(userData) {
    const companyNameElement = document.getElementById('companyName');
    if (companyNameElement) {
        companyNameElement.textContent = userData.name || 'Company Dashboard';
    }
}

function initializeSidebar() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            showSection(sectionId);
            
            // Update active state
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            link.closest('.nav-item').classList.add('active');
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load section-specific data
        loadSectionData(sectionId);
    }
}

function loadSectionData(sectionId) {
    switch (sectionId) {
        case 'jobs':
            loadJobPosts();
            break;
        case 'applications':
            loadApplications();
            break;
        case 'candidates':
            loadCandidates();
            break;
        case 'analytics':
            loadAnalytics();
            break;
    }
}

function initializeUserMenu() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', () => {
            userDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
}

function initializeModals() {
    // Post Job Modal
    const postJobBtn = document.getElementById('postJobBtn');
    const createJobBtn = document.getElementById('createJobBtn');
    const postJobModal = document.getElementById('postJobModal');
    
    if (postJobBtn) {
        postJobBtn.addEventListener('click', () => {
            showModal('postJobModal');
        });
    }
    
    if (createJobBtn) {
        createJobBtn.addEventListener('click', () => {
            showModal('postJobModal');
        });
    }
    
    // Close modal when clicking overlay
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Reset form if exists
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

function initializeJobForm() {
    const jobForm = document.getElementById('jobForm');
    const skillInput = document.getElementById('skillInput');
    const jobDescription = document.getElementById('jobDescription');
    
    if (jobForm) {
        jobForm.addEventListener('submit', handleJobSubmission);
    }
    
    // Skills input functionality
    if (skillInput) {
        skillInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const skill = this.value.trim();
                if (skill) {
                    addSkill(skill);
                    this.value = '';
                }
            }
        });
    }
    
    // Character counter for job description
    if (jobDescription) {
        jobDescription.addEventListener('input', function() {
            const charCount = this.value.length;
            const counter = document.querySelector('.char-count');
            if (counter) {
                counter.textContent = `${charCount} / 2000 characters`;
                if (charCount > 2000) {
                    counter.style.color = 'var(--danger-color)';
                } else {
                    counter.style.color = 'var(--gray-500)';
                }
            }
        });
    }
}

function handleJobSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const jobData = Object.fromEntries(formData);
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting Job...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Add job to local storage (in a real app, this would go to your backend)
        const jobs = JSON.parse(localStorage.getItem('jobgenie_jobs') || '[]');
        const newJob = {
            id: generateJobId(),
            ...jobData,
            companyId: getCurrentUserId(),
            status: 'active',
            createdAt: new Date().toISOString(),
            applications: 0,
            views: 0
        };
        
        jobs.push(newJob);
        localStorage.setItem('jobgenie_jobs', JSON.stringify(jobs));
        
        // Reset form and close modal
        e.target.reset();
        closeModal('postJobModal');
        
        // Show success message
        showNotification('Job posted successfully!', 'success');
        
        // Refresh job posts
        loadJobPosts();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 1500);
}

function loadDashboardData() {
    // Load stats for overview
    loadDashboardStats();
    
    // Load recent activity
    loadRecentApplications();
    loadTopPerformingJobs();
}

function loadDashboardStats() {
    // In a real app, this would fetch from your backend
    const stats = {
        activeJobs: 12,
        totalApplications: 47,
        aiApplications: 23,
        interviewsScheduled: 8
    };
    
    // Update stat cards with animation
    animateStatCards(stats);
}

function animateStatCards(stats) {
    const statElements = {
        activeJobs: document.querySelector('.stat-card:nth-child(1) h3'),
        totalApplications: document.querySelector('.stat-card:nth-child(2) h3'),
        aiApplications: document.querySelector('.stat-card:nth-child(3) h3'),
        interviewsScheduled: document.querySelector('.stat-card:nth-child(4) h3')
    };
    
    Object.entries(stats).forEach(([key, value]) => {
        const element = statElements[key];
        if (element) {
            animateNumber(element, 0, value, 1000);
        }
    });
}

function loadRecentApplications() {
    // Mock recent applications data
    const applications = [
        {
            id: 1,
            name: 'Sarah Johnson',
            position: 'Frontend Developer',
            type: 'ai',
            avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
            appliedAt: '2 hours ago'
        },
        {
            id: 2,
            name: 'Michael Chen',
            position: 'UX Designer',
            type: 'manual',
            avatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=100',
            appliedAt: '5 hours ago'
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            position: 'Data Scientist',
            type: 'ai',
            avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100',
            appliedAt: '1 day ago'
        }
    ];
    
    // This would normally update the DOM with real data
    console.log('Recent applications loaded:', applications);
}

function loadTopPerformingJobs() {
    // Mock top performing jobs data
    const jobs = [
        {
            title: 'Senior Frontend Developer',
            posted: '3 days ago',
            applications: 15,
            views: 234
        },
        {
            title: 'UX/UI Designer',
            posted: '1 week ago',
            applications: 12,
            views: 189
        },
        {
            title: 'Data Scientist',
            posted: '5 days ago',
            applications: 8,
            views: 156
        }
    ];
    
    console.log('Top performing jobs loaded:', jobs);
}

function loadJobPosts() {
    // Load jobs from localStorage
    const jobs = JSON.parse(localStorage.getItem('jobgenie_jobs') || '[]');
    const currentUserId = getCurrentUserId();
    const userJobs = jobs.filter(job => job.companyId === currentUserId);
    
    console.log('User jobs loaded:', userJobs);
    // In a real app, this would update the jobs grid in the DOM
}

function loadApplications() {
    // Mock applications data
    const applications = [
        {
            id: 1,
            applicantName: 'Sarah Johnson',
            jobTitle: 'Senior Frontend Developer',
            type: 'ai',
            skillsMatch: 94,
            avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
            keySkills: ['React', 'TypeScript', 'Node.js', 'AWS'],
            aiInsights: 'Candidate has 5+ years of React experience and strong TypeScript skills. Previous work at tech startups aligns well with your company culture.'
        },
        {
            id: 2,
            applicantName: 'Michael Chen',
            jobTitle: 'UX/UI Designer',
            type: 'manual',
            skillsMatch: 87,
            avatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=100',
            keySkills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research']
        }
    ];
    
    console.log('Applications loaded:', applications);
}

function loadCandidates() {
    console.log('Loading candidates...');
}

function loadAnalytics() {
    console.log('Loading analytics...');
}

function initializeApplicationReview() {
    // Add event listeners for application actions
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-success') && e.target.textContent === 'Accept') {
            handleApplicationAction('accept', e.target);
        } else if (e.target.classList.contains('btn-danger') && e.target.textContent === 'Reject') {
            handleApplicationAction('reject', e.target);
        }
    });
}

function handleApplicationAction(action, button) {
    const applicationCard = button.closest('.application-card');
    const applicantName = applicationCard.querySelector('.applicant-info h3').textContent;
    
    // Show loading state
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        if (action === 'accept') {
            showNotification(`${applicantName} has been accepted for interview!`, 'success');
            // In a real app, this would enable the interview prep chatbot
        } else {
            showNotification(`${applicantName}'s application has been rejected.`, 'info');
        }
        
        // Remove or update the application card
        applicationCard.style.opacity = '0.5';
        
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
    }, 1000);
}

// Utility functions
function getCurrentUserId() {
    const user = localStorage.getItem('jobgenie_user');
    return user ? JSON.parse(user).id : null;
}

function generateJobId() {
    return 'job_' + Math.random().toString(36).substr(2, 9);
}

function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

function showNotification(message, type = 'info') {
    // Use the same notification system from static/script.js
    if (window.JobGenie && window.JobGenie.showNotification) {
        window.JobGenie.showNotification(message, type);
    } else {
        // Fallback simple alert
        alert(message);
    }
}

// Make functions available globally
window.closeModal = closeModal;
window.showModal = showModal;

// Skills management functions
let selectedSkills = [];

function addSkill(skill) {
    if (!selectedSkills.includes(skill)) {
        selectedSkills.push(skill);
        updateSkillsDisplay();
        updateSkillsInput();
    }
}

function removeSkill(skill) {
    selectedSkills = selectedSkills.filter(s => s !== skill);
    updateSkillsDisplay();
    updateSkillsInput();
}

function updateSkillsDisplay() {
    const container = document.getElementById('skillsContainer');
    if (container) {
        container.innerHTML = selectedSkills.map(skill => `
            <span class="skill-tag">
                ${skill}
                <button type="button" class="remove-skill" onclick="removeSkill('${skill}')">
                    <i class="fas fa-times"></i>
                </button>
            </span>
        `).join('');
    }
}

function updateSkillsInput() {
    const hiddenInput = document.getElementById('requiredSkills');
    if (hiddenInput) {
        hiddenInput.value = selectedSkills.join(', ');
    }
}

function formatText(type) {
    const textarea = document.getElementById('jobDescription');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (selectedText) {
        let formattedText = '';
        switch (type) {
            case 'bold':
                formattedText = `**${selectedText}**`;
                break;
            case 'italic':
                formattedText = `*${selectedText}*`;
                break;
            case 'list':
                formattedText = `• ${selectedText}`;
                break;
        }
        
        textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
        textarea.focus();
        textarea.setSelectionRange(start, start + formattedText.length);
    }
}

// Make functions globally available
window.addSkill = addSkill;
window.removeSkill = removeSkill;
window.formatText = formatText;