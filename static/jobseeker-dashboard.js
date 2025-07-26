// Dashboard JavaScript for Job Seeker Dashboard

document.addEventListener('DOMContentLoaded', function() {
    initializeJobSeekerDashboard();
});

function initializeJobSeekerDashboard() {
    // Check if user is authenticated
    checkJobSeekerAuth();
    
    // Initialize dashboard components
    initializeSidebar();
    initializeUserMenu();
    initializeJobSearch();
    initializeAIApply();
    initializeInterviewPrep();
    
    // Load dashboard data
    loadJobSeekerData();
}

function checkJobSeekerAuth() {
    const user = localStorage.getItem('jobgenie_user');
    const userType = localStorage.getItem('jobgenie_user_type');
    
    // Allow direct access during development
    if (!user || userType !== 'jobseeker') {
        // Create mock user data for development
        const mockUser = {
            id: 'jobseeker_456',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            type: 'jobseeker'
        };
        localStorage.setItem('jobgenie_user', JSON.stringify(mockUser));
        localStorage.setItem('jobgenie_user_type', 'jobseeker');
    }
    
    // Update UI with user info
    const userData = JSON.parse(localStorage.getItem('jobgenie_user'));
    updateUserInfo(userData);
}

function updateUserInfo(userData) {
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userData.name || 'Job Seeker';
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
            loadJobSearch();
            break;
        case 'applications':
            loadMyApplications();
            break;
        case 'interviews':
            loadInterviewPrep();
            break;
        case 'ai-resume':
            loadAIResumeBuilder();
            break;
        case 'profile':
            loadProfile();
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

function initializeJobSearch() {
    const jobSearchInput = document.getElementById('jobSearchInput');
    const searchJobsBtn = document.getElementById('searchJobsBtn');
    
    if (jobSearchInput) {
        jobSearchInput.addEventListener('input', debounce(performJobSearch, 300));
    }
    
    if (searchJobsBtn) {
        searchJobsBtn.addEventListener('click', () => {
            showSection('jobs');
        });
    }
}

function performJobSearch() {
    const query = document.getElementById('jobSearchInput')?.value;
    console.log('Searching for:', query);
    // In a real app, this would filter the job results
}

function initializeAIApply() {
    // Add event listeners for AI Apply buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('ai-apply') || e.target.closest('.ai-apply')) {
            const button = e.target.classList.contains('ai-apply') ? e.target : e.target.closest('.ai-apply');
            const jobId = button.dataset.job;
            startAIApplication(jobId);
        }
    });
}

function startAIApplication(jobId) {
    console.log('Starting AI application for job:', jobId);
    
    // Show AI Apply modal
    showModal('aiApplyModal');
    
    // Start the AI application process
    simulateAIApplicationProcess();
}

function simulateAIApplicationProcess() {
    const steps = ['step1', 'step2', 'step3'];
    let currentStep = 0;
    
    // Show first step
    showAIStep(steps[currentStep]);
    
    // Simulate progression through steps
    const progressInterval = setInterval(() => {
        currentStep++;
        if (currentStep < steps.length) {
            showAIStep(steps[currentStep]);
        } else {
            clearInterval(progressInterval);
        }
    }, 3000);
}

function showAIStep(stepId) {
    // Hide all steps
    document.querySelectorAll('.ai-apply-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    const currentStep = document.getElementById(stepId);
    if (currentStep) {
        currentStep.classList.add('active');
    }
}

function submitAIApplication() {
    // Show loading state
    const submitBtn = document.querySelector('.application-summary .btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate submission
    setTimeout(() => {
        closeModal('aiApplyModal');
        showNotification('AI-generated application submitted successfully!', 'success');
        
        // Update applications list
        addToMyApplications();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function addToMyApplications() {
    // In a real app, this would update the backend and refresh the applications list
    console.log('Application added to user applications');
}

function initializeInterviewPrep() {
    // Add event listeners for interview prep buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('interview-prep-btn') || e.target.closest('.interview-prep-btn')) {
            const button = e.target.classList.contains('interview-prep-btn') ? e.target : e.target.closest('.interview-prep-btn');
            if (button.classList.contains('active')) {
                const jobId = button.dataset.job;
                startInterviewPrep(jobId);
            }
        } else if (e.target.classList.contains('start-interview-prep') || e.target.closest('.start-interview-prep')) {
            const button = e.target.classList.contains('start-interview-prep') ? e.target : e.target.closest('.start-interview-prep');
            const jobId = button.dataset.job;
            startInterviewPrep(jobId);
        }
    });
}

function startInterviewPrep(jobId) {
    console.log('Starting interview prep for job:', jobId);
    
    // Update modal title with job info
    const jobTitles = {
        'innovate-react': 'React Developer - InnovateLabs',
        'devcorp-js': 'JavaScript Developer - DevCorp',
        'techcorp-frontend': 'Frontend Developer - TechCorp'
    };
    
    const currentJobTitle = document.getElementById('currentJobTitle');
    if (currentJobTitle) {
        currentJobTitle.textContent = jobTitles[jobId] || 'Interview Preparation';
    }
    
    // Show interview prep modal
    showModal('interviewPrepModal');
    
    // Initialize chat
    initializeInterviewChat(jobId);
}

function initializeInterviewChat(jobId) {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendChatMessage');
    
    if (chatInput && sendButton) {
        // Clear previous listeners
        const newChatInput = chatInput.cloneNode(true);
        const newSendButton = sendButton.cloneNode(true);
        chatInput.parentNode.replaceChild(newChatInput, chatInput);
        sendButton.parentNode.replaceChild(newSendButton, sendButton);
        
        // Add new listeners
        newChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
        
        newSendButton.addEventListener('click', sendChatMessage);
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Clear input
    chatInput.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        generateAIResponse(message);
    }, 1000);
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    
    const avatarIcon = sender === 'user' ? 'fa-user' : 'fa-robot';
    
    messageElement.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${avatarIcon}"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
    // Simple mock responses based on keywords
    let response = "I understand you're preparing for your interview. ";
    
    if (userMessage.toLowerCase().includes('react')) {
        response += "React is a powerful library! Let me ask you: Can you explain the difference between class components and functional components? Also, how do you handle state management in large React applications?";
    } else if (userMessage.toLowerCase().includes('javascript')) {
        response += "JavaScript fundamentals are crucial! Here's a question for you: What's the difference between 'let', 'const', and 'var'? Can you also explain how closures work?";
    } else if (userMessage.toLowerCase().includes('nervous') || userMessage.toLowerCase().includes('anxious')) {
        response += "It's completely normal to feel nervous before an interview! Here are some tips: practice your answers out loud, research the company thoroughly, and remember that they're interested in you. Would you like to practice some common interview questions?";
    } else {
        response += "That's a great question! Based on the job description, I recommend focusing on these key areas: technical skills demonstration, problem-solving approach, and cultural fit. Would you like me to generate some practice questions for you?";
    }
    
    addMessageToChat(response, 'ai');
}

function sendSuggestion(suggestion) {
    const chatInput = document.getElementById('chatInput');
    chatInput.value = suggestion;
    sendChatMessage();
}

function closeInterviewPrep() {
    closeModal('interviewPrepModal');
    
    // Clear chat messages for next session
    const chatMessages = document.getElementById('chatMessages');
    const initialMessage = chatMessages.querySelector('.ai-message');
    chatMessages.innerHTML = '';
    if (initialMessage) {
        chatMessages.appendChild(initialMessage);
    }
}

function loadJobSeekerData() {
    // Load stats for overview
    loadJobSeekerStats();
    
    // Load job matches
    loadJobMatches();
    
    // Load application status
    loadApplicationStatus();
}

function loadJobSeekerStats() {
    // Mock stats data
    const stats = {
        applicationsSent: 8,
        profileViews: 24,
        interviewInvites: 3,
        aiApplications: 5
    };
    
    // Update stat cards with animation
    animateStatCards(stats);
}

function animateStatCards(stats) {
    const statElements = {
        applicationsSent: document.querySelector('.stat-card:nth-child(1) h3'),
        profileViews: document.querySelector('.stat-card:nth-child(2) h3'),
        interviewInvites: document.querySelector('.stat-card:nth-child(3) h3'),
        aiApplications: document.querySelector('.stat-card:nth-child(4) h3')
    };
    
    Object.entries(stats).forEach(([key, value]) => {
        const element = statElements[key];
        if (element) {
            animateNumber(element, 0, value, 1000);
        }
    });
}

function loadJobMatches() {
    // Mock job matches data
    const jobMatches = [
        {
            id: 'frontend-dev',
            title: 'Senior Frontend Developer',
            company: 'TechCorp Solutions',
            match: 96,
            logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
        {
            id: 'react-dev',
            title: 'React Developer',
            company: 'InnovateLabs',
            match: 89,
            logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
        {
            id: 'fullstack-eng',
            title: 'Full Stack Engineer',
            company: 'StartupXYZ',
            match: 82,
            logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100'
        }
    ];
    
    console.log('Job matches loaded:', jobMatches);
}

function loadApplicationStatus() {
    // Mock application status data
    const applications = [
        {
            id: 'techcorp-frontend',
            title: 'Frontend Developer - TechCorp',
            status: 'under-review',
            appliedAt: '2 days ago',
            type: 'ai'
        },
        {
            id: 'innovate-react',
            title: 'React Developer - InnovateLabs',
            status: 'accepted',
            appliedAt: '5 days ago',
            type: 'ai',
            interviewReady: true
        },
        {
            id: 'devcorp-js',
            title: 'JavaScript Developer - DevCorp',
            status: 'accepted',
            appliedAt: '1 week ago',
            type: 'manual',
            interviewReady: true
        }
    ];
    
    console.log('Application status loaded:', applications);
}

function loadJobSearch() {
    console.log('Loading job search results...');
}

function loadMyApplications() {
    console.log('Loading my applications...');
}

function loadInterviewPrep() {
    console.log('Loading interview prep data...');
}

function loadAIResumeBuilder() {
    console.log('Loading AI resume builder...');
}

function loadProfile() {
    console.log('Loading user profile...');
}

// Modal functions
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

// Utility functions
function animateNumber(element, start, end, duration) {
    if (!element) return;
    
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

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    // Use the same notification system from static/script.js
    if (window.JobGenie && window.JobGenie.showNotification) {
        window.JobGenie.showNotification(message, type);
    } else {
        // Create simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27AE60' : '#3498DB'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Make functions available globally
window.closeModal = closeModal;
window.showModal = showModal;
window.submitAIApplication = submitAIApplication;
window.sendSuggestion = sendSuggestion;
window.closeInterviewPrep = closeInterviewPrep;