document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const navItems = document.querySelectorAll(".nav-item");
  const contentSections = document.querySelectorAll(".content-section");
  const addProjectBtn = document.getElementById("addProjectBtn");
  const projectsGrid = document.getElementById("projectsGrid");
  const addChatBtn = document.getElementById("addChatBtn");
  const chatList = document.getElementById("chatList");
  const chatHistoryList = document.getElementById("chatHistoryList");
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");
  const chatMessages = document.getElementById("chatMessages");
  const typingIndicator = document.getElementById("typingIndicator");
  const artifactViewer = document.getElementById("artifactViewer");
  const closeArtifact = document.getElementById("closeArtifact");
  const artifactContent = document.getElementById("artifactContent");
  const lastArtifactBtn = document.getElementById("lastArtifactBtn");
  const artifactsGrid = document.getElementById("artifactsGrid");
  const totalFiles = document.getElementById("totalFiles");
  const totalUrls = document.getElementById("totalUrls");
  const knowledgeList = document.getElementById("knowledgeList");

  // Sample data
  let projects = [
    {
      id: 1,
      title: "Website Redesign",
      description: "Complete redesign of company website with modern UI/UX",
      status: "active",
      lastActive: "2023-05-15",
      knowledgeBase: "web-design-kb"
    },
    {
      id: 2,
      title: "Mobile App Development",
      description: "Building a cross-platform mobile app for iOS and Android",
      status: "active",
      lastActive: "2023-05-10",
      knowledgeBase: "mobile-dev-kb"
    },
    {
      id: 3,
      title: "Marketing Campaign",
      description: "Q3 marketing campaign for new product launch",
      status: "planned",
      lastActive: "",
      knowledgeBase: "marketing-kb"
    },
    {
      id: 4,
      title: "API Integration",
      description: "Integrating third-party APIs for payment processing",
      status: "completed",
      lastActive: "2023-04-28",
      knowledgeBase: "api-integration-kb"
    }
  ];

  let chats = [
    {
      id: 1,
      title: "Website content ideas",
      lastMessage: "Can you suggest some content for our homepage?",
      timestamp: "2023-05-15T10:30:00",
      projectId: null
    },
    {
      id: 2,
      title: "Code review help",
      lastMessage: "I need help reviewing this React component",
      timestamp: "2023-05-14T16:45:00",
      projectId: null
    },
    {
      id: 3,
      title: "Meeting notes summary",
      lastMessage: "Summary of yesterday's strategy meeting",
      timestamp: "2023-05-12T09:15:00",
      projectId: null
    },
    {
      id: 4,
      title: "Design system discussion",
      lastMessage: "Let's talk about our design tokens",
      timestamp: "2023-05-11T14:20:00",
      projectId: 1
    }
  ];

  let artifacts = [
    {
      id: 1,
      title: "Homepage HTML",
      type: "html",
      content: "<!DOCTYPE html>\n<html>\n<head>\n  <title>My Website</title>\n</head>\n<body>\n  <h1>Welcome to My Site</h1>\n</body>\n</html>",
      preview: "Basic HTML structure for homepage"
    },
    {
      id: 2,
      title: "Styles CSS",
      type: "css",
      content: "body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 0;\n}\n\nh1 {\n  color: #333;\n}",
      preview: "Basic CSS styles for the website"
    },
    {
      id: 3,
      title: "App Script",
      type: "javascript",
      content: 'function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
      preview: "Simple JavaScript greeting function"
    },
    {
      id: 4,
      title: "Project Docs",
      type: "markdown",
      content: "# Project Documentation\n\n## Overview\n\nThis project aims to...\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3",
      preview: "Project documentation in markdown format"
    }
  ];

  let knowledgeSources = [];
  let currentChatId = null;
  let lastArtifact = null;
  let currentRenameChat = null;
  let currentShareChat = null;

  // Initialize the app
  function init() {
    renderProjects();
    renderChatHistory();
    renderArtifacts();
    setupEventListeners();
    loadSavedData();
  }

  // Load saved data from localStorage
  function loadSavedData() {
    const savedProjects = localStorage.getItem("loom4_projects");
    const savedChats = localStorage.getItem("loom4_chats");
    
    if (savedProjects) {
      projects = JSON.parse(savedProjects);
      renderProjects();
    }
    
    if (savedChats) {
      chats = JSON.parse(savedChats);
      renderChatHistory();
    }
  }

  // Save data to localStorage
  function saveData() {
    localStorage.setItem("loom4_projects", JSON.stringify(projects));
    localStorage.setItem("loom4_chats", JSON.stringify(chats));
  }

  // Helper functions
  function formatStatus(status) {
    const statusMap = {
      active: "Active",
      planned: "Planned",
      completed: "Completed"
    };
    return statusMap[status] || status;
  }

  function formatDate(dateString) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return formatDate(timestamp);
  }

  // Render projects list
  function renderProjects() {
    projectsGrid.innerHTML = "";
    projects.forEach((project) => {
      const projectCard = document.createElement("div");
      projectCard.className = "project-card";
      projectCard.innerHTML = `
        <div class="project-card-header">
          <div class="project-card-title">${project.title}</div>
          <div class="project-card-status ${project.status}">${formatStatus(project.status)}</div>
        </div>
        <div class="project-card-description">${project.description}</div>
        <div class="project-meta">
          ${project.lastActive ? `<span class="last-active">Last active: ${formatDate(project.lastActive)}</span>` : ""}
        </div>
        <div class="project-actions">
          <button class="start-chat-btn" data-project-id="${project.id}">
            <i class="fas fa-comment"></i> Start Chat
          </button>
        </div>
      `;
      projectsGrid.appendChild(projectCard);
    });

    // Add event listeners to new chat buttons
    document.querySelectorAll(".start-chat-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const projectId = parseInt(e.currentTarget.dataset.projectId);
        startProjectChat(projectId);
      });
    });
  }

  // Enhanced render chat history with action buttons
  function renderChatHistory() {
    chatHistoryList.innerHTML = "";
    chatList.innerHTML = "";

    chats.forEach((chat) => {
      // For sidebar chat list with hover actions
      const chatItem = document.createElement("div");
      chatItem.className = "chat-item";
      chatItem.innerHTML = `
        <div class="chat-item-content">${chat.title}</div>
        <div class="chat-item-actions">
          <button class="chat-action-btn rename" title="Rename" data-chat-id="${chat.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="chat-action-btn share" title="Share" data-chat-id="${chat.id}">
            <i class="fas fa-share-alt"></i>
          </button>
          <button class="chat-action-btn delete" title="Delete" data-chat-id="${chat.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;

      // Add click event for opening chat (only on content, not action buttons)
      chatItem.querySelector('.chat-item-content').addEventListener("click", () => openChat(chat.id));
      chatList.appendChild(chatItem);

      // For chat history section with hover actions
      const chatHistoryItem = document.createElement("div");
      chatHistoryItem.className = "chat-history-item";
      chatHistoryItem.innerHTML = `
        <div class="chat-history-item-content">
          <div class="chat-history-item-title">${chat.title}</div>
          <div class="chat-history-item-subtitle">${chat.lastMessage} • ${formatTimeAgo(chat.timestamp)}</div>
        </div>
        <div class="chat-history-item-actions">
          <button class="chat-history-action-btn rename" title="Rename" data-chat-id="${chat.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="chat-history-action-btn share" title="Share" data-chat-id="${chat.id}">
            <i class="fas fa-share-alt"></i>
          </button>
          <button class="chat-history-action-btn delete" title="Delete" data-chat-id="${chat.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;

      // Add click event for opening chat (only on content, not action buttons)
      chatHistoryItem.querySelector('.chat-history-item-content').addEventListener("click", () => openChat(chat.id));
      chatHistoryList.appendChild(chatHistoryItem);
    });

    // Setup chat action button events
    setupChatActionButtons();
  }

  // Setup event listeners for chat action buttons
  function setupChatActionButtons() {
    // Handle sidebar chat actions
    document.querySelectorAll('.chat-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent chat from opening
        const chatId = parseInt(btn.dataset.chatId);
        const action = btn.classList.contains('rename') ? 'rename' : 
                      btn.classList.contains('share') ? 'share' : 'delete';
        handleChatAction(chatId, action);
      });
    });

    // Handle chat history actions
    document.querySelectorAll('.chat-history-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent chat from opening
        const chatId = parseInt(btn.dataset.chatId);
        const action = btn.classList.contains('rename') ? 'rename' : 
                      btn.classList.contains('share') ? 'share' : 'delete';
        handleChatAction(chatId, action);
      });
    });
  }

  // Handle chat actions (rename, share, delete)
  function handleChatAction(chatId, action) {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    switch (action) {
      case 'rename':
        showRenameModal(chat);
        break;
      case 'share':
        showShareModal(chat);
        break;
      case 'delete':
        deleteChat(chatId);
        break;
    }
  }

  // Show rename modal
  function showRenameModal(chat) {
    currentRenameChat = chat;
    const modal = document.getElementById('chatRenameModal');
    const input = document.getElementById('chatRenameInput');
    
    input.value = chat.title;
    modal.style.display = 'flex';
    
    // Focus input and select text
    setTimeout(() => {
      input.focus();
      input.select();
    }, 100);
  }

  // Show share modal
  function showShareModal(chat) {
    currentShareChat = chat;
    const modal = document.getElementById('chatShareModal');
    const linkInput = document.getElementById('chatShareLink');
    
    // Generate share link (in real app, this would be from your backend)
    const shareLink = `${window.location.origin}/chat/${chat.id}`;
    linkInput.value = shareLink;
    
    modal.style.display = 'flex';
  }

  // Delete chat with confirmation
  function deleteChat(chatId) {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    if (confirm(`Are you sure you want to delete "${chat.title}"?`)) {
      chats = chats.filter(c => c.id !== chatId);
      
      // If currently viewing this chat, go to chat list
      if (currentChatId === chatId) {
        showSection('chat');
        currentChatId = null;
      }
      
      renderChatHistory();
      saveData();
      
      // Show success message
      showNotification('Chat deleted successfully', 'success');
    }
  }

  // Rename chat
  function renameChat() {
    if (!currentRenameChat) return;
    
    const input = document.getElementById('chatRenameInput');
    const newTitle = input.value.trim();
    
    if (!newTitle) {
      showNotification('Please enter a valid name', 'error');
      return;
    }
    
    currentRenameChat.title = newTitle;
    closeModal('chatRenameModal');
    renderChatHistory();
    saveData();
    
    // Update current chat display if this is the active chat
    if (currentChatId === currentRenameChat.id) {
      updateActiveChatTitle(newTitle);
    }
    
    showNotification('Chat renamed successfully', 'success');
    currentRenameChat = null;
  }

  // Copy share link
  function copyShareLink() {
    const linkInput = document.getElementById('chatShareLink');
    
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // For mobile devices
    
    try {
      document.execCommand('copy');
      showNotification('Link copied to clipboard!', 'success');
    } catch (err) {
      showNotification('Failed to copy link', 'error');
    }
  }

  // Show notification
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Add CSS animations for notifications
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // Update active chat title
  function updateActiveChatTitle(newTitle) {
    const welcomeContent = chatMessages.querySelector('.welcome-content h1');
    if (welcomeContent && welcomeContent.textContent.startsWith('Chat:')) {
      welcomeContent.textContent = `Chat: ${newTitle}`;
    }
  }

  // Start chat within project
  function startProjectChat(projectId) {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    // Create new chat in this project context
    const newChat = {
      id: Date.now(),
      projectId: project.id,
      title: `Chat: ${project.title}`,
      lastMessage: "New chat started",
      timestamp: new Date().toISOString(),
      knowledgeBase: project.knowledgeBase
    };

    chats.unshift(newChat);
    openChat(newChat.id);
    renderChatHistory();
    saveData();

    showNotification(`Chat started for project: ${project.title}`, 'success');
  }

  // Render artifacts
  function renderArtifacts() {
    artifactsGrid.innerHTML = "";
    artifacts.forEach((artifact) => {
      const artifactCard = document.createElement("div");
      artifactCard.className = "artifact-card";
      artifactCard.innerHTML = `
        <div class="artifact-card-header">
          <div class="artifact-card-title">${artifact.title}</div>
          <div class="artifact-card-type">${artifact.type}</div>
        </div>
        <div class="artifact-card-preview">${artifact.preview}</div>
      `;
      artifactCard.addEventListener("click", () => viewArtifact(artifact));
      artifactsGrid.appendChild(artifactCard);
    });
  }

  // View artifact in the viewer
  function viewArtifact(artifact) {
    lastArtifact = artifact;
    document.getElementById("artifactTitle").textContent = artifact.title;
    document.getElementById("artifactType").textContent = artifact.type;

    let contentHtml = "";
    if (artifact.type === "markdown") {
      // Simple markdown to HTML conversion (in real app, use a proper markdown parser)
      contentHtml = `<div class="markdown-content">${artifact.content.replace(/\n/g, '<br>')}</div>`;
    } else if (artifact.type === "html") {
      contentHtml = `<iframe srcdoc="${escapeHtml(artifact.content)}"></iframe>`;
    } else if (artifact.type === "css" || artifact.type === "javascript") {
      contentHtml = `<pre class="code-content">${escapeHtml(artifact.content)}</pre>`;
    } else {
      contentHtml = `<pre>${escapeHtml(artifact.content)}</pre>`;
    }

    artifactContent.innerHTML = contentHtml;
    artifactViewer.classList.add("open");
  }

  // Escape HTML for safe rendering
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Open chat
  function openChat(chatId) {
    currentChatId = chatId;
    showSection('active-chat');

    // Update active chat in sidebar and history
    document.querySelectorAll(".chat-item, .chat-history-item").forEach((item) => {
      item.classList.remove("active");
    });

    // Find and activate the clicked chat
    const chatItem = Array.from(document.querySelectorAll(".chat-item")).find((item) => {
      const chatIdFromBtn = item.querySelector('[data-chat-id]')?.dataset.chatId;
      return parseInt(chatIdFromBtn) === chatId;
    });

    const chatHistoryItem = Array.from(document.querySelectorAll(".chat-history-item")).find((item) => {
      const chatIdFromBtn = item.querySelector('[data-chat-id]')?.dataset.chatId;
      return parseInt(chatIdFromBtn) === chatId;
    });

    if (chatItem) chatItem.classList.add("active");
    if (chatHistoryItem) chatHistoryItem.classList.add("active");

    // Load chat messages (simplified for demo)
    const chat = chats.find(c => c.id === chatId);
    chatMessages.innerHTML = `
      <div class="welcome-message">
        <div class="welcome-content">
          <h1>Chat: ${chat ? chat.title : 'Unknown Chat'}</h1>
          <p>This is where your conversation would appear.</p>
        </div>
      </div>
    `;
  }

  // Add new chat
  function addNewChat() {
    const newChatId = Date.now();
    const newChat = {
      id: newChatId,
      title: `New Chat ${new Date().toLocaleTimeString()}`,
      lastMessage: "No messages yet",
      timestamp: new Date().toISOString(),
      projectId: null
    };
    chats.unshift(newChat);
    renderChatHistory();
    openChat(newChatId);
    saveData();
  }

  // Show specific section
  function showSection(sectionName) {
    // Hide all sections
    contentSections.forEach((section) => section.classList.remove("active"));
    
    // Show the selected section
    const sectionId = sectionName.includes('-section') ? sectionName : sectionName + "-section";
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add("active");
    }

    // Update navigation
    navItems.forEach((navItem) => navItem.classList.remove("active"));
    const navItem = document.querySelector(`[data-section="${sectionName.replace('-section', '')}"]`);
    if (navItem) {
      navItem.classList.add("active");
    }
  }

  // Close modal
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    }
  }

  // Setup event listeners
  function setupEventListeners() {
    // Sidebar toggle
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });

    // Navigation items
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        const sectionName = item.getAttribute("data-section");
        showSection(sectionName);
      });
    });

    // Add project button
    addProjectBtn.addEventListener("click", () => {
      document.getElementById('projectModal').style.display = 'flex';
    });

    // Add chat button
    addChatBtn.addEventListener("click", addNewChat);

    // Message input
    messageInput.addEventListener("input", () => {
      sendButton.disabled = messageInput.value.trim() === "";
    });

    messageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!sendButton.disabled) {
          sendMessage();
        }
      }
    });

    // Send button
    sendButton.addEventListener("click", sendMessage);

    // Artifact viewer
    closeArtifact.addEventListener("click", () => {
      artifactViewer.classList.remove("open");
    });

    lastArtifactBtn.addEventListener("click", () => {
      if (lastArtifact) {
        viewArtifact(lastArtifact);
      }
    });

    // Profile Section Toggle
    document.getElementById('profileToggle').addEventListener('click', function() {
      document.querySelector('.profile-section').classList.toggle('open');
    });

    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.project-modal, .connection-modal, .settings-modal, .chat-rename-modal, .chat-share-modal');
        if (modal) {
          modal.style.display = 'none';
        }
      });
    });

    // Chat rename functionality
    document.getElementById('confirmChatRename').addEventListener('click', renameChat);
    
    // Chat rename input enter key
    document.getElementById('chatRenameInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        renameChat();
      }
    });

    // Copy share link functionality
    document.getElementById('copyChatLink').addEventListener('click', copyShareLink);

    // Connect buttons
    document.querySelectorAll(".connect-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".connect-card");
        const type = card.dataset.connectionType;
        showConnectionForm(type);
      });
    });

    // Project modal functionality
    setupProjectModal();
    
    // Settings modal functionality
    setupSettingsModal();
  }

  // Setup project modal
  function setupProjectModal() {
    // Knowledge Base Selection
    document.querySelectorAll(".option-card").forEach((card) => {
      card.addEventListener("click", () => {
        document.querySelectorAll(".option-card").forEach((c) => c.classList.remove("active"));
        card.classList.add("active");

        if (card.dataset.kbType === "existing") {
          document.getElementById("existingKnowledge").classList.remove("hidden");
          populateKnowledgeBases();
        } else {
          document.getElementById("existingKnowledge").classList.add("hidden");
        }
      });
    });

    // Save Project
    document.getElementById('saveProject').addEventListener('click', () => {
      const projectName = document.getElementById("projectName").value.trim();
      const projectDescription = document.getElementById("projectDescription").value.trim();
      const projectInstructions = document.getElementById("projectInstructions").value.trim();

      if (!projectName) {
        showNotification('Please enter a project name', 'error');
        return;
      }

      const project = {
        id: Date.now(),
        title: projectName,
        description: projectDescription || "No description provided",
        instructions: projectInstructions,
        status: "active",
        lastActive: new Date().toISOString().split('T')[0],
        knowledgeBase: document.querySelector(".option-card.active")?.dataset.kbType === "existing"
          ? document.getElementById("existingKnowledge").value
          : "new-kb-" + Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      projects.unshift(project);
      renderProjects();
      closeProjectModal();
      saveData();
      
      showNotification('Project created successfully', 'success');
    });
  }

  // Close project modal and reset form
  function closeProjectModal() {
    document.getElementById("projectModal").style.display = "none";
    
    // Reset form fields
    document.getElementById("projectName").value = "";
    document.getElementById("projectDescription").value = "";
    document.getElementById("projectInstructions").value = "";
    
    // Reset knowledge base selection
    document.querySelectorAll(".option-card").forEach((card) => {
      card.classList.remove("active");
    });
    document.getElementById("existingKnowledge").classList.add("hidden");
  }

  // Setup settings modal
  function setupSettingsModal() {
    // Submenu Actions
    document.querySelectorAll('.submenu-item').forEach(item => {
      item.addEventListener('click', function() {
        const action = this.dataset.action;
        
        switch(action) {
          case 'settings':
            document.getElementById('settingsModal').style.display = 'flex';
            break;
          case 'contact':
            showNotification('Contact form would open here', 'info');
            break;
          case 'upgrade':
            showNotification('Upgrade options would be shown here', 'info');
            break;
          case 'learn':
            showNotification('Help documentation would open here', 'info');
            break;
          case 'logout':
            if (confirm('Are you sure you want to log out?')) {
              showNotification('Logged out successfully', 'success');
            }
            break;
        }
        
        // Close profile menu
        document.querySelector('.profile-section').classList.remove('open');
      });
    });

    // Settings Tabs
    document.querySelectorAll('.settings-tabs .tab').forEach(tab => {
      tab.addEventListener('click', function() {
        const tabName = this.dataset.tab;
        
        // Update active tab
        document.querySelectorAll('.settings-tabs .tab').forEach(t => 
          t.classList.remove('active'));
        this.classList.add('active');
        
        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => 
          content.classList.remove('active'));
        document.querySelector(`.tab-content[data-tab="${tabName}"]`).classList.add('active');
      });
    });

    // Theme Selection
    document.querySelectorAll('.theme-option').forEach(option => {
      option.addEventListener('click', function() {
        const theme = this.dataset.theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        showNotification(`Theme changed to ${theme}`, 'success');
      });
    });

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  // Connection form functionality
  const connectionConfigs = {
    file: {
      title: "File Connection",
      fields: [
        {
          type: "file",
          name: "files",
          label: "Select files",
          accept: ".pdf,.doc,.txt,.csv",
          multiple: true,
          required: true
        }
      ]
    },
    web: {
      title: "Web Connection",
      fields: [
        {
          type: "url",
          name: "url",
          label: "Website URL",
          placeholder: "https://example.com",
          required: true
        }
      ]
    },
    database: {
      title: "Database Connection",
      fields: [
        {
          type: "select",
          name: "type",
          label: "Database Type",
          options: [
            { value: "mysql", label: "MySQL" },
            { value: "postgres", label: "PostgreSQL" },
            { value: "mongodb", label: "MongoDB" }
          ],
          required: true
        }
      ]
    },
    api: {
      title: "API Connection",
      fields: [
        {
          type: "url",
          name: "endpoint",
          label: "API Endpoint",
          placeholder: "https://api.example.com/v1",
          required: true
        }
      ]
    }
  };

  function showConnectionForm(type) {
    const config = connectionConfigs[type];
    const modal = document.getElementById("connectionModal");
    const modalBody = document.getElementById("modalBody");

    document.getElementById("modalTitle").textContent = config.title;

    modalBody.innerHTML = config.fields.map(field => `
      <div class="form-group">
        <label>${field.label}</label>
        ${renderField(field)}
      </div>
    `).join("");

    modal.style.display = "flex";
  }

  function renderField(field) {
    switch (field.type) {
      case "select":
        return `
          <select name="${field.name}" ${field.required ? "required" : ""}>
            ${field.options.map(opt => `
              <option value="${opt.value}">${opt.label}</option>
            `).join("")}
          </select>
        `;
      default:
        return `
          <input type="${field.type}" 
                 name="${field.name}" 
                 placeholder="${field.placeholder || ""}"
                 ${field.required ? "required" : ""}
                 ${field.multiple ? "multiple" : ""}
                 ${field.accept ? `accept="${field.accept}"` : ""}>
        `;
    }
  }

  // Handle connection confirmation
  document.getElementById("confirmConnection").addEventListener("click", () => {
    showNotification('Connection established successfully', 'success');
    closeModal('connectionModal');
  });

  // Helper function to populate knowledge bases
  function populateKnowledgeBases() {
    const select = document.getElementById("existingKnowledge");
    select.innerHTML = '<option value="">Select knowledge base</option>';

    const knowledgeBases = [
      { id: "kb1", name: "Marketing Materials" },
      { id: "kb2", name: "Technical Docs" },
      { id: "kb3", name: "Company Policies" }
    ];

    knowledgeBases.forEach((kb) => {
      const option = document.createElement("option");
      option.value = kb.id;
      option.textContent = kb.name;
      select.appendChild(option);
    });
  }

  // Send message functionality
  function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage("user", message);
    messageInput.value = "";
    sendButton.disabled = true;

    // Show typing indicator
    typingIndicator.classList.add("show");

    // Simulate AI response after a delay
    setTimeout(() => {
      typingIndicator.classList.remove("show");

      const responses = [
        "I've analyzed your request and here's what I found...",
        "Based on the information available, I'd recommend...",
        "That's an interesting question. Here's what I know...",
        "I can help with that. Here are the details...",
        "After reviewing similar cases, here's my response..."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      addMessage("assistant", randomResponse);

      // Create an artifact from the conversation (simplified)
      if (Math.random() > 0.7) {
        const artifactTypes = ["markdown", "html", "css", "javascript"];
        const randomType = artifactTypes[Math.floor(Math.random() * artifactTypes.length)];

        const newArtifact = {
          id: artifacts.length + 1,
          title: `Conversation Artifact ${artifacts.length + 1}`,
          type: randomType,
          content: `# Conversation Summary\n\n**User:** ${message}\n\n**AI:** ${randomResponse}`,
          preview: `Summary of conversation about ${message.substring(0, 20)}...`
        };

        artifacts.unshift(newArtifact);
        renderArtifacts();
        lastArtifact = newArtifact;
      }

      // Update chat last message
      if (currentChatId) {
        const chat = chats.find((c) => c.id === currentChatId);
        if (chat) {
          chat.lastMessage = `AI: ${randomResponse.substring(0, 30)}...`;
          chat.timestamp = new Date().toISOString();
          renderChatHistory();
          saveData();
        }
      }
    }, 1500);
  }

  // Add message to chat
  function addMessage(role, content) {
    // Remove welcome message if it exists
    const welcomeMessage = chatMessages.querySelector('.welcome-message');
    if (welcomeMessage) {
      welcomeMessage.remove();
    }

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${role}`;

    const avatarDiv = document.createElement("div");
    avatarDiv.className = "message-avatar";
    avatarDiv.innerHTML = role === "user" 
      ? '<i class="fas fa-user"></i>' 
      : '<i class="fas fa-robot"></i>';

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    contentDiv.innerHTML = `<p>${content}</p>`;

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Initialize the app
  init();
});