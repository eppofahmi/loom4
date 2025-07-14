// Sample chat data
const sampleChats = [
    {
        id: 1,
        title: "AI Text-to-SQL Agent Context Design",
        lastMessage: "2 hours ago",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
        id: 2,
        title: "Nenek's Medical Monitoring",
        lastMessage: "5 hours ago",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
        id: 3,
        title: "Indonesian Name List Sorting",
        lastMessage: "1 day ago",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
        id: 4,
        title: "Student Registration Data Visualization",
        lastMessage: "3 days ago",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
        id: 5,
        title: "Prinsip yang membuat kita bang...",
        lastMessage: "5 days ago",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
        id: 6,
        title: "University Website System Architecture Design",
        lastMessage: "1 week ago",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
        id: 7,
        title: "React Component State Management Best Practices",
        lastMessage: "2 weeks ago",
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    },
    {
        id: 8,
        title: "Python Data Analysis with Pandas",
        lastMessage: "20 days ago",
        timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
    },
    {
        id: 9,
        title: "Mermaid Diagram for Service Catalog",
        lastMessage: "3 weeks ago",
        timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
    },
    {
        id: 10,
        title: "CSS Grid Layout Implementation",
        lastMessage: "1 month ago",
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
];

// Current state
let currentSection = 'chats';
let filteredChats = [...sampleChats];
let displayedChats = [];
let currentPage = 1;
const itemsPerPage = 6;
let isLoading = false;
let hasMoreChats = true;
let selectedChats = new Set();

// DOM Elements
const recentChatsList = document.getElementById('recentChatsList');
const chatHistory = document.getElementById('chatHistory');
const searchInput = document.getElementById('searchInput');
const chatCount = document.getElementById('chatCount');
const selectedCount = document.getElementById('selectedCount');
const selectBtn = document.getElementById('selectBtn');
const viewAllBtn = document.getElementById('viewAllBtn');
const normalState = document.getElementById('normalState');
const selectionState = document.getElementById('selectionState');
const selectionCount = document.getElementById('selectionCount');
const selectAllBtn = document.getElementById('selectAllBtn');
const cancelSelectionBtn = document.getElementById('cancelSelectionBtn');
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
const navLinks = document.querySelectorAll('.nav-link');
const newChatButtons = document.querySelectorAll('.new-chat-btn, .new-chat-btn-dark');

// Sidebar Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const userDropdown = document.getElementById('userDropdown');
const userMenu = document.getElementById('userMenu');

// Sidebar State Management
let sidebarCollapsed = false;
let isMobile = false;

// Load sidebar state from localStorage
function loadSidebarState() {
    const saved = localStorage.getItem('loom4-sidebar-collapsed');
    sidebarCollapsed = saved === 'true';
    
    // Check if mobile
    isMobile = window.innerWidth <= 1024;
    
    if (!isMobile && sidebarCollapsed) {
        sidebar.classList.add('collapsed');
        sidebar.setAttribute('aria-expanded', 'false');
    }
}

// Save sidebar state to localStorage
function saveSidebarState() {
    localStorage.setItem('loom4-sidebar-collapsed', sidebarCollapsed.toString());
}

// Toggle sidebar
function toggleSidebar() {
    if (isMobile) {
        // Mobile: toggle overlay
        sidebar.classList.toggle('active');
        sidebarBackdrop.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    } else {
        // Desktop: toggle collapsed state
        sidebarCollapsed = !sidebarCollapsed;
        sidebar.classList.toggle('collapsed', sidebarCollapsed);
        sidebar.setAttribute('aria-expanded', !sidebarCollapsed);
        saveSidebarState();
    }
}

// Close sidebar (mobile)
function closeSidebar() {
    if (isMobile) {
        sidebar.classList.remove('active');
        sidebarBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Handle window resize
function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 1024;
    
    if (wasMobile !== isMobile) {
        // Mobile state changed
        if (isMobile) {
            // Switched to mobile
            sidebar.classList.remove('collapsed');
            sidebar.classList.remove('active');
            sidebarBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            // Switched to desktop
            sidebar.classList.remove('active');
            sidebarBackdrop.classList.remove('active');
            document.body.style.overflow = '';
            
            // Restore collapsed state
            if (sidebarCollapsed) {
                sidebar.classList.add('collapsed');
            }
        }
        sidebar.setAttribute('aria-expanded', !sidebarCollapsed);
    }
}

// Toggle user menu
function toggleUserMenu() {
    userMenu.classList.toggle('active');
}

// Close user menu when clicking outside
function closeUserMenu(e) {
    if (!userDropdown.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.classList.remove('active');
    }
}

// Initialize the application
function init() {
    loadSidebarState();
    renderRecentChats();
    resetPagination();
    loadMoreChats();
    updateChatCount();
    updateSelectButtonText();
    setupEventListeners();
}

// Render recent chats in sidebar
function renderRecentChats() {
    const recentChats = sampleChats.slice(0, 5); // Show only first 5 in sidebar
    
    recentChatsList.innerHTML = recentChats.map(chat => `
        <div class="chat-item" data-chat-id="${chat.id}">
            <div class="chat-title">${chat.title}</div>
            <div class="chat-timestamp">${chat.lastMessage}</div>
        </div>
    `).join('');
}

// Render chat history in main content
function renderChatHistory() {
    if (currentSection !== 'chats') {
        chatHistory.innerHTML = `
            <div class="history-item">
                <div class="history-title">Coming Soon</div>
                <div class="history-subtitle">This section is under development</div>
            </div>
        `;
        return;
    }

    chatHistory.innerHTML = displayedChats.map(chat => `
        <div class="chat-item-wrapper" data-chat-id="${chat.id}">
            <div class="history-item" data-chat-id="${chat.id}">
                <div class="chat-content">
                    <div class="history-title">${chat.title}</div>
                    <div class="history-subtitle">Last message ${chat.lastMessage}</div>
                </div>
                <div class="action-buttons">
                    <div class="internal-checkbox">
                        <input type="checkbox" class="chat-checkbox" data-chat-id="${chat.id}" id="checkbox-${chat.id}">
                        <label for="checkbox-${chat.id}" class="checkbox-label"></label>
                    </div>
                    <button class="share-btn" data-chat-id="${chat.id}" title="Share chat">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="delete-btn" data-chat-id="${chat.id}" title="Delete chat">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add loading indicator if needed
    if (isLoading) {
        chatHistory.innerHTML += `
            <div class="loading-indicator">
                <div class="loading-spinner"></div>
                <span>Loading more chats...</span>
            </div>
        `;
    }
}

// Update chat count
function updateChatCount() {
    chatCount.textContent = filteredChats.length;
    updateChatCountDisplay();
}

// Update chat count display (normal vs selection mode)
function updateChatCountDisplay() {
    const mainContent = document.querySelector('.main-content');
    
    if (mainContent.classList.contains('selection-mode')) {
        // Show selection state
        normalState.style.display = 'none';
        selectionState.classList.add('visible');
        
        // Update selection count
        if (selectionCount) {
            selectionCount.textContent = selectedChats.size;
        }
    } else {
        // Show normal state
        normalState.style.display = 'flex';
        selectionState.classList.remove('visible');
        
        // Update selected count in normal state
        if (selectedCount) {
            selectedCount.textContent = selectedChats.size;
        }
    }
}

// Load more chats for infinite scroll
function loadMoreChats() {
    if (isLoading || !hasMoreChats) return;
    
    isLoading = true;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newChats = filteredChats.slice(startIndex, endIndex);
    
    if (newChats.length === 0) {
        hasMoreChats = false;
        showViewAllButton();
        isLoading = false;
        return;
    }
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        displayedChats = [...displayedChats, ...newChats];
        renderChatHistory();
        currentPage++;
        isLoading = false;
        
        // Check if we've loaded all chats
        if (displayedChats.length >= filteredChats.length) {
            hasMoreChats = false;
            showViewAllButton();
        }
    }, 300);
}

// Show/hide view all button
function showViewAllButton() {
    const viewAllSection = document.querySelector('.view-all-section');
    if (viewAllSection && displayedChats.length >= filteredChats.length && filteredChats.length > 0) {
        viewAllSection.style.display = 'flex';
        viewAllSection.style.opacity = '0';
        viewAllSection.style.transform = 'translateY(20px)';
        
        // Animate in
        setTimeout(() => {
            viewAllSection.style.transition = 'all 0.3s ease';
            viewAllSection.style.opacity = '1';
            viewAllSection.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Hide view all button
function hideViewAllButton() {
    const viewAllSection = document.querySelector('.view-all-section');
    if (viewAllSection) {
        viewAllSection.style.display = 'none';
    }
}

// Reset pagination
function resetPagination() {
    displayedChats = [];
    currentPage = 1;
    hasMoreChats = true;
    isLoading = false;
    hideViewAllButton();
}

// Format timestamp for display
function formatTimestamp(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (hours < 1) {
        return 'Just now';
    } else if (hours < 24) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (days < 7) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
        const weeks = Math.floor(days / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
}

// Handle search functionality
function handleSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredChats = [...sampleChats];
    } else {
        filteredChats = sampleChats.filter(chat => 
            chat.title.toLowerCase().includes(searchTerm)
        );
    }
    
    // Reset pagination and load first batch
    clearSelections();
    resetPagination();
    loadMoreChats();
    updateChatCount();
}

// Handle navigation
function handleNavigation(section) {
    // Update active state
    navLinks.forEach(link => {
        link.parentElement.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-section="${section}"]`);
    if (activeLink) {
        activeLink.parentElement.classList.add('active');
    }
    
    currentSection = section;
    
    // Update main title
    const mainTitle = document.querySelector('.chat-history-title');
    const sectionTitles = {
        'chats': 'Your chat history',
        'projects': 'Your projects',
        'artifacts': 'Your artifacts',
        'connector': 'Connector settings'
    };
    
    if (mainTitle) {
        mainTitle.textContent = sectionTitles[section] || 'Loom4';
    }
    
    // Reset search and render appropriate content
    if (searchInput) {
        searchInput.value = '';
    }
    filteredChats = [...sampleChats];
    clearSelections();
    resetPagination();
    loadMoreChats();
    updateChatCount();
}

// Handle chat selection
function handleChatSelect(chatId) {
    const selectedChat = sampleChats.find(chat => chat.id === parseInt(chatId));
    if (selectedChat) {
        // In a real application, this would open the chat conversation
        console.log('Opening chat:', selectedChat.title);
        
        // Visual feedback
        document.querySelectorAll('.chat-item, .history-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        document.querySelectorAll(`[data-chat-id="${chatId}"]`).forEach(item => {
            item.classList.add('selected');
        });
        
        // Show a simple alert for demo purposes
        alert(`Opening chat: "${selectedChat.title}"`);
    }
}

// Handle new chat creation
function handleNewChat() {
    // In a real application, this would create a new chat
    console.log('Creating new chat...');
    alert('Creating a new chat...');
}

// Handle select functionality
function handleSelect() {
    // Toggle selection mode or show selected items
    if (selectedChats.size > 0) {
        const selectedTitles = Array.from(selectedChats).map(id => {
            const chat = sampleChats.find(c => c.id === parseInt(id));
            return chat ? chat.title : 'Unknown';
        });
        alert(`Selected chats:\n${selectedTitles.join('\n')}`);
    } else {
        alert('No chats selected. Hover over chats and click checkboxes to select them.');
    }
}

// Handle checkbox selection
function handleCheckboxChange(chatId, isChecked) {
    if (isChecked) {
        selectedChats.add(chatId);
    } else {
        selectedChats.delete(chatId);
    }
    
    // Update visual state
    const chatItem = document.querySelector(`[data-chat-id="${chatId}"]`);
    
    if (chatItem) {
        if (isChecked) {
            chatItem.classList.add('selected');
        } else {
            chatItem.classList.remove('selected');
        }
    }
    
    // Update selection mode and toolbar
    updateSelectionMode();
    updateSelectButtonText();
}

// Handle share functionality
function handleChatShare(chatId) {
    const chat = sampleChats.find(c => c.id === parseInt(chatId));
    if (chat) {
        // In a real application, this would open a share dialog or copy share link
        const shareUrl = `${window.location.origin}/chat/${chatId}`;
        
        // Try to use the Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: chat.title,
                text: `Check out this chat: ${chat.title}`,
                url: shareUrl
            }).then(() => {
                console.log('Chat shared successfully');
            }).catch((error) => {
                console.log('Error sharing:', error);
                // Fallback to copying to clipboard
                copyToClipboard(shareUrl, chat.title);
            });
        } else {
            // Fallback to copying to clipboard
            copyToClipboard(shareUrl, chat.title);
        }
    }
}

// Copy share link to clipboard
function copyToClipboard(url, title) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            alert(`Share link for "${title}" copied to clipboard!`);
        }).catch(() => {
            // Fallback for older browsers
            fallbackCopyToClipboard(url, title);
        });
    } else {
        fallbackCopyToClipboard(url, title);
    }
}

// Fallback copy method for older browsers
function fallbackCopyToClipboard(url, title) {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert(`Share link for "${title}" copied to clipboard!`);
    } catch (err) {
        alert(`Share link: ${url}`);
    }
    
    document.body.removeChild(textArea);
}

// Update select button text based on selection
function updateSelectButtonText() {
    if (selectBtn) {
        if (selectedChats.size > 0) {
            selectBtn.textContent = `Selected (${selectedChats.size})`;
            selectBtn.style.color = '#99BC85';
            selectBtn.style.fontWeight = '600';
        } else {
            selectBtn.textContent = 'Select';
            selectBtn.style.color = '#F68537';
            selectBtn.style.fontWeight = '500';
        }
    }
}

// Update selection mode (show/hide toolbar and persistent checkboxes)
function updateSelectionMode() {
    const mainContent = document.querySelector('.main-content');
    const hasSelections = selectedChats.size > 0;
    
    if (hasSelections) {
        // Enter selection mode
        mainContent.classList.add('selection-mode');
        
        // Update select all button text
        if (selectAllBtn) {
            const allVisible = displayedChats.length;
            const allSelected = displayedChats.every(chat => selectedChats.has(chat.id.toString()));
            selectAllBtn.textContent = allSelected ? 'Deselect all' : 'Select all';
        }
    } else {
        // Exit selection mode
        mainContent.classList.remove('selection-mode');
    }
    
    // Update chat count display
    updateChatCountDisplay();
}

// Select all visible chats
function selectAllChats() {
    const allSelected = displayedChats.every(chat => selectedChats.has(chat.id.toString()));
    
    if (allSelected) {
        // Deselect all
        displayedChats.forEach(chat => {
            selectedChats.delete(chat.id.toString());
            const checkbox = document.getElementById(`checkbox-${chat.id}`);
            if (checkbox) {
                checkbox.checked = false;
            }
            const chatItem = document.querySelector(`[data-chat-id="${chat.id}"]`);
            if (chatItem) {
                chatItem.classList.remove('selected');
            }
        });
    } else {
        // Select all
        displayedChats.forEach(chat => {
            selectedChats.add(chat.id.toString());
            const checkbox = document.getElementById(`checkbox-${chat.id}`);
            if (checkbox) {
                checkbox.checked = true;
            }
            const chatItem = document.querySelector(`[data-chat-id="${chat.id}"]`);
            if (chatItem) {
                chatItem.classList.add('selected');
            }
        });
    }
    
    updateSelectionMode();
    updateSelectButtonText();
}

// Cancel selection mode
function cancelSelection() {
    clearSelections();
    updateSelectionMode();
}

// Delete selected chats
function deleteSelectedChats() {
    if (selectedChats.size === 0) return;
    
    const selectedTitles = Array.from(selectedChats).map(id => {
        const chat = sampleChats.find(c => c.id === parseInt(id));
        return chat ? chat.title : 'Unknown';
    }).slice(0, 5); // Show max 5 titles
    
    const moreCount = selectedChats.size - selectedTitles.length;
    let confirmMessage = `Are you sure you want to delete ${selectedChats.size} chat${selectedChats.size > 1 ? 's' : ''}?\n\n`;
    confirmMessage += selectedTitles.join('\n');
    if (moreCount > 0) {
        confirmMessage += `\n...and ${moreCount} more`;
    }
    confirmMessage += '\n\nThis action cannot be undone.';
    
    const confirmed = confirm(confirmMessage);
    if (confirmed) {
        // Remove from sample data
        Array.from(selectedChats).forEach(chatId => {
            const index = sampleChats.findIndex(c => c.id === parseInt(chatId));
            if (index > -1) {
                sampleChats.splice(index, 1);
            }
        });
        
        // Update filtered and displayed chats
        filteredChats = filteredChats.filter(c => !selectedChats.has(c.id.toString()));
        displayedChats = displayedChats.filter(c => !selectedChats.has(c.id.toString()));
        
        // Clear selections
        selectedChats.clear();
        
        // Re-render and update
        renderChatHistory();
        renderRecentChats();
        updateChatCount();
        updateSelectionMode();
        updateSelectButtonText();
        
        console.log('Selected chats deleted');
    }
}

// Handle chat deletion
function handleChatDelete(chatId) {
    const chat = sampleChats.find(c => c.id === parseInt(chatId));
    if (chat) {
        const confirmed = confirm(`Are you sure you want to delete "${chat.title}"?\n\nThis action cannot be undone.`);
        if (confirmed) {
            // Remove from sample data
            const index = sampleChats.findIndex(c => c.id === parseInt(chatId));
            if (index > -1) {
                sampleChats.splice(index, 1);
            }
            
            // Remove from selected chats
            selectedChats.delete(chatId);
            
            // Update filtered chats
            filteredChats = filteredChats.filter(c => c.id !== parseInt(chatId));
            
            // Update displayed chats
            displayedChats = displayedChats.filter(c => c.id !== parseInt(chatId));
            
            // Re-render
            renderChatHistory();
            renderRecentChats();
            updateChatCount();
            updateSelectButtonText();
            
            console.log(`Chat deleted: ${chat.title}`);
        }
    }
}

// Clear all selections
function clearSelections() {
    selectedChats.clear();
    document.querySelectorAll('.history-item').forEach(item => {
        item.classList.remove('selected');
    });
    document.querySelectorAll('.chat-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    updateSelectButtonText();
    updateSelectionMode();
}

// Handle view all functionality
function handleViewAll() {
    // In a real application, this would navigate to a full chat list page
    console.log('Viewing all chats...');
    alert('Navigating to full chat history...');
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            handleNavigation(section);
        });
    });
    
    // New chat buttons
    newChatButtons.forEach(button => {
        button.addEventListener('click', handleNewChat);
    });
    
    // Select button
    if (selectBtn) {
        selectBtn.addEventListener('click', handleSelect);
    }
    
    // View all button
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', handleViewAll);
    }
    
    // Selection toolbar buttons
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', selectAllChats);
    }
    
    if (cancelSelectionBtn) {
        cancelSelectionBtn.addEventListener('click', cancelSelection);
    }
    
    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', deleteSelectedChats);
    };
    
    // Chat selection (using event delegation)
    if (recentChatsList) {
        recentChatsList.addEventListener('click', (e) => {
            const chatItem = e.target.closest('.chat-item');
            if (chatItem) {
                const chatId = chatItem.getAttribute('data-chat-id');
                handleChatSelect(chatId);
            }
        });
    }
    
    if (chatHistory) {
        chatHistory.addEventListener('click', (e) => {
            // Handle checkbox clicks
            if (e.target.classList.contains('chat-checkbox')) {
                const chatId = e.target.getAttribute('data-chat-id');
                handleCheckboxChange(chatId, e.target.checked);
                return;
            }
            
            // Handle share button clicks
            if (e.target.classList.contains('fa-share') || e.target.classList.contains('share-btn')) {
                const shareBtn = e.target.closest('.share-btn');
                if (shareBtn) {
                    const chatId = shareBtn.getAttribute('data-chat-id');
                    handleChatShare(chatId);
                    return;
                }
            }
            
            // Handle delete button clicks
            if (e.target.classList.contains('fa-trash') || e.target.classList.contains('delete-btn')) {
                const deleteBtn = e.target.closest('.delete-btn');
                if (deleteBtn) {
                    const chatId = deleteBtn.getAttribute('data-chat-id');
                    handleChatDelete(chatId);
                    return;
                }
            }
            
            // Handle chat item clicks (but not on interactive elements)
            if (!e.target.closest('.action-buttons')) {
                const historyItem = e.target.closest('.history-item');
                if (historyItem) {
                    const chatId = historyItem.getAttribute('data-chat-id');
                    handleChatSelect(chatId);
                }
            }
        });
        
        // Infinite scroll detection
        const chatListContainer = chatHistory.parentElement;
        if (chatListContainer) {
            chatListContainer.addEventListener('scroll', () => {
                const { scrollTop, scrollHeight, clientHeight } = chatListContainer;
                const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
                
                // Load more when user scrolls to 80% of the content
                if (scrollPercentage > 0.8 && hasMoreChats && !isLoading) {
                    loadMoreChats();
                }
            });
        }
    }
    
    // User profile dropdown (placeholder)
    const dropdownArrow = document.querySelector('.dropdown-arrow');
    dropdownArrow.addEventListener('click', () => {
        alert('User menu coming soon...');
    });
    
    // Sidebar event listeners
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeSidebar);
    }
    
    if (userDropdown) {
        userDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleUserMenu();
        });
    }
    
    // Close user menu when clicking outside
    document.addEventListener('click', closeUserMenu);
    
    // Window resize handler
    window.addEventListener('resize', handleResize);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + B to toggle sidebar
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            toggleSidebar();
        }
        
        // Ctrl/Cmd + K for search focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to close sidebar/menu or clear search/selections
        if (e.key === 'Escape') {
            if (userMenu.classList.contains('active')) {
                userMenu.classList.remove('active');
            } else if (isMobile && sidebar.classList.contains('active')) {
                closeSidebar();
            } else if (document.activeElement === searchInput) {
                searchInput.value = '';
                handleSearch('');
                searchInput.blur();
            } else if (selectedChats.size > 0) {
                clearSelections();
            }
        }
        
        // Ctrl/Cmd + A to select all visible chats
        if ((e.ctrlKey || e.metaKey) && e.key === 'a' && currentSection === 'chats') {
            e.preventDefault();
            selectAllChats();
        }
        
        // Delete key to delete selected chats
        if (e.key === 'Delete' && selectedChats.size > 0 && currentSection === 'chats') {
            e.preventDefault();
            deleteSelectedChats();
        }
    });
}

// Add some utility functions for future enhancement
const utils = {
    // Debounce function for search optimization
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Format date for display
    formatDate: (date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    },
    
    // Truncate text with ellipsis
    truncateText: (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
};

// Enhanced search with debouncing
const debouncedSearch = utils.debounce(handleSearch, 300);
if (searchInput) {
    // Remove the duplicate event listener since we already have one in setupEventListeners
    // This prevents double-binding
}

// CSS for selected state
const style = document.createElement('style');
style.textContent = `
    .chat-item.selected,
    .history-item.selected {
        background-color: #99BC85 !important;
        color: white;
        border-color: #99BC85 !important;
    }
    
    .chat-item.selected .chat-title,
    .chat-item.selected .chat-timestamp,
    .history-item.selected .history-title,
    .history-item.selected .history-subtitle {
        color: white;
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}