document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const addChatBtn = document.getElementById("addChatBtn");
  const chatList = document.getElementById("chatList");
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");
  const chatMessages = document.getElementById("chatMessages");
  const typingIndicator = document.getElementById("typingIndicator");
  
  // New UI Elements
  const shareBtn = document.getElementById("shareBtn");
  const expandArtifactBtn = document.getElementById("expandArtifactBtn");
  const shareModalOverlay = document.getElementById("shareModalOverlay");
  const shareModalClose = document.getElementById("shareModalClose");
  const copyLinkBtn = document.getElementById("copyLinkBtn");
  const artifactViewer = document.getElementById("artifactViewer");
  const closeArtifactBtn = document.getElementById("closeArtifactBtn");
  const resizeHandle = document.getElementById("resizeHandle");
  const chatContainer = document.getElementById("chatContainer");
  const chatSection = document.getElementById("chat-section");

  // Sample data 
  let chats = [
    {
      id: 1,
      title: "Creative writing help",
      lastMessage: "Can you help me write a short story?",
      timestamp: "2024-01-15T10:30:00"
    },
    {
      id: 2,
      title: "Code review assistance",
      lastMessage: "I need help reviewing this React component",
      timestamp: "2024-01-14T16:45:00"
    },
    {
      id: 3,
      title: "Data analysis questions", 
      lastMessage: "How do I analyze this dataset effectively?",
      timestamp: "2024-01-12T09:15:00"
    },
    {
      id: 4,
      title: "Language learning",
      lastMessage: "Can you help me practice Spanish?",
      timestamp: "2024-01-11T14:20:00"
    },
    {
      id: 5,
      title: "API documentation",
      lastMessage: "How do I document this REST API effectively?",
      timestamp: "2024-01-10T11:15:00"
    },
    {
      id: 6,
      title: "Database optimization",
      lastMessage: "My queries are running slowly, can you help?",
      timestamp: "2024-01-09T15:45:00"
    },
    {
      id: 7,
      title: "UI/UX design feedback",
      lastMessage: "What do you think about this interface design?",
      timestamp: "2024-01-08T13:20:00"
    },
    {
      id: 8,
      title: "Marketing strategy",
      lastMessage: "Help me plan a social media campaign",
      timestamp: "2024-01-07T09:30:00"
    },
    {
      id: 9,
      title: "Budget planning",
      lastMessage: "I need help creating a monthly budget",
      timestamp: "2024-01-06T16:10:00"
    },
    {
      id: 10,
      title: "Travel recommendations",
      lastMessage: "What are the best places to visit in Japan?",
      timestamp: "2024-01-05T12:45:00"
    },
    {
      id: 11,
      title: "Recipe suggestions",
      lastMessage: "Can you suggest some healthy dinner recipes?",
      timestamp: "2024-01-04T18:20:00"
    },
    {
      id: 12,
      title: "Fitness routine",
      lastMessage: "Help me create a workout plan for beginners",
      timestamp: "2024-01-03T07:15:00"
    },
    {
      id: 13,
      title: "Book recommendations",
      lastMessage: "What are some good sci-fi books to read?",
      timestamp: "2024-01-02T14:30:00"
    },
    {
      id: 14,
      title: "Investment advice",
      lastMessage: "Should I invest in index funds or individual stocks?",
      timestamp: "2024-01-01T10:00:00"
    },
    {
      id: 15,
      title: "Home improvement",
      lastMessage: "How do I install a smart thermostat?",
      timestamp: "2023-12-31T16:45:00"
    }
  ];

  let projects = [
    {
      id: 1,
      title: "Website Redesign",
      description: "Complete redesign of company website with modern UI/UX",
      status: "active",
      lastActive: "2024-01-15",
      members: 4,
      tasks: 12,
      completion: 75
    },
    {
      id: 2,
      title: "Mobile App Development",
      description: "Building a cross-platform mobile app for iOS and Android",
      status: "active",
      lastActive: "2024-01-10",
      members: 6,
      tasks: 24,
      completion: 45
    },
    {
      id: 3,
      title: "Marketing Campaign",
      description: "Q3 marketing campaign for new product launch",
      status: "planned",
      lastActive: "2024-01-08",
      members: 3,
      tasks: 8,
      completion: 25
    },
    {
      id: 4,
      title: "API Documentation",
      description: "Comprehensive API documentation for developers",
      status: "completed",
      lastActive: "2024-01-05",
      members: 2,
      tasks: 15,
      completion: 100
    },
    {
      id: 5,
      title: "User Research Study",
      description: "Conduct user interviews and usability testing",
      status: "active",
      lastActive: "2024-01-12",
      members: 5,
      tasks: 18,
      completion: 60
    },
    {
      id: 6,
      title: "Database Migration",
      description: "Migrate legacy database to new cloud infrastructure",
      status: "planned",
      lastActive: "2024-01-03",
      members: 3,
      tasks: 10,
      completion: 15
    }
  ];

  let artifacts = [
    {
      id: 1,
      title: "Accessible Form Template",
      type: "html",
      description: "A semantic and accessible contact form with proper ARIA labels and responsive layout.",
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Form</title>
</head>
<body>
  <form class="contact-form">
    <div class="form-group">
      <label for="name">Name</label>
      <input type="text" id="name" name="name" required>
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required>
    </div>
    <div class="form-group">
      <label for="message">Message</label>
      <textarea id="message" name="message" rows="5" required></textarea>
    </div>
    <button type="submit">Send Message</button>
  </form>
</body>
</html>`,
      createdAt: "2025-01-20",
      preview: "Accessible contact form with ARIA labels"
    },
    {
      id: 2,
      title: "Button Component Styles",
      type: "css",
      description: "Reusable button component with hover states and variants for consistent UI.",
      content: `.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f1f5f9;
}`,
      createdAt: "2025-01-18",
      preview: "Flexible button component with multiple variants"
    },
    {
      id: 3,
      title: "API Client Module",
      type: "javascript",
      description: "Modular API client with error handling and request/response interceptors.",
      content: `class APIClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.options = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
  }

  async request(endpoint, options = {}) {
    const url = \`\${this.baseURL}\${endpoint}\`;
    
    try {
      const response = await fetch(url, {
        ...this.options,
        ...options,
        headers: {
          ...this.options.headers,
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}`,
      createdAt: "2025-01-15",
      preview: "Reusable API client with error handling"
    },
    {
      id: 4,
      title: "Dashboard Card Template",
      type: "template",
      description: "Responsive dashboard card component with icon, title, and metric display.",
      content: `<div class="dashboard-card">
  <div class="card-header">
    <div class="card-icon">
      <i class="{{iconClass}}"></i>
    </div>
    <h3 class="card-title">{{title}}</h3>
  </div>
  <div class="card-content">
    <div class="metric-value">{{value}}</div>
    <div class="metric-label">{{label}}</div>
    <div class="metric-change {{changeType}}">
      <i class="fa-solid fa-arrow-{{changeDirection}}"></i>
      {{changePercent}}%
    </div>
  </div>
</div>`,
      createdAt: "2025-01-12",
      preview: "Templated dashboard card with dynamic content"
    },
    {
      id: 5,
      title: "Modal Dialog Component",
      type: "component",
      description: "Accessible modal dialog with backdrop, close button, and keyboard navigation.",
      content: `function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}`,
      createdAt: "2025-01-10",
      preview: "React modal component with accessibility features"
    }
  ];

  // Sample knowledge sources data
  let knowledgeSources = [
    {
      id: 1,
      title: "Company Documentation",
      type: "file",
      description: "Internal company docs, policies, and procedures uploaded from shared drive",
      lastUpdated: "2024-01-20T14:30:00",
      status: "connected",
      sourceInfo: "Google Drive - 47 documents"
    },
    {
      id: 2,
      title: "Product Knowledge Base",
      type: "web",
      description: "External product documentation and API references from our website",
      lastUpdated: "2024-01-19T09:15:00", 
      status: "connected",
      sourceInfo: "Website crawl - 23 pages"
    },
    {
      id: 3,
      title: "Customer Database",
      type: "database",
      description: "Customer information and support ticket history for context",
      lastUpdated: "2024-01-18T16:45:00",
      status: "connected", 
      sourceInfo: "PostgreSQL - 3 tables"
    },
    {
      id: 4,
      title: "Support Ticket API",
      type: "api",
      description: "Live connection to support system for real-time ticket information",
      lastUpdated: "2024-01-17T11:20:00",
      status: "connected",
      sourceInfo: "REST API - 2 endpoints"
    },
    {
      id: 5,
      title: "Training Materials",
      type: "file", 
      description: "Employee training videos, manuals, and onboarding documents",
      lastUpdated: "2024-01-15T13:10:00",
      status: "pending",
      sourceInfo: "SharePoint - 12 files"
    }
  ];

  let currentChatId = null;
  let currentSection = 'chat';
  let selectedChatIds = new Set();
  let showChatList = false;
  let showAllChats = false;
  let showAllSidebarChats = false;
  const INITIAL_CHAT_LIMIT = 10;
  const SIDEBAR_CHAT_LIMIT = 10;
  
  // New UI State
  let isArtifactViewerOpen = false;
  let isResizing = false;
  let artifactViewerWidth = 50; // percentage
  
  // Artifacts page state
  let filteredArtifacts = [...artifacts];
  let showAllArtifacts = false;
  const INITIAL_ARTIFACTS_LIMIT = 10;

  // Connect page state
  let filteredKnowledgeSources = [...knowledgeSources];
  let showAllKnowledgeSources = false;
  const INITIAL_KNOWLEDGE_LIMIT = 10;

  // Projects page state
  let filteredProjects = [...projects];
  let showAllProjects = false;
  const INITIAL_PROJECTS_LIMIT = 10;

  // Render projects in the projects section
  function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    const projectsViewAll = document.getElementById('projectsViewAll');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = '';

    if (filteredProjects.length === 0) {
      projectsGrid.innerHTML = `
        <div class="projects-empty-state">
          <h3>No projects found</h3>
          <p>Try adjusting your search or create a new project.</p>
        </div>
      `;
      // Hide view all button when no projects
      if (projectsViewAll) {
        projectsViewAll.style.display = 'none';
      }
      return;
    }

    // Determine projects to display
    const projectsToDisplay = showAllProjects ? filteredProjects : filteredProjects.slice(0, INITIAL_PROJECTS_LIMIT);

    projectsToDisplay.forEach(project => {
      const projectCard = createProjectCard(project);
      projectsGrid.appendChild(projectCard);
    });

    // Setup menu event listeners
    setupProjectMenus();
    
    // Update projects count
    updateProjectsCount();
    
    // Show/hide View All button
    if (projectsViewAll) {
      if (filteredProjects.length > INITIAL_PROJECTS_LIMIT && !showAllProjects) {
        projectsViewAll.style.display = 'block';
      } else {
        projectsViewAll.style.display = 'none';
      }
    }
  }

  // Create project card element
  function createProjectCard(project) {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    
    // Format the updated date
    const updatedDate = formatProjectDate(project.lastActive);
    
    projectCard.innerHTML = `
      <div class="project-card-content">
        <div class="project-card-title">${project.title}</div>
        <div class="project-card-description">${project.description}</div>
        <div class="project-card-updated">Updated at: ${updatedDate}</div>
      </div>
      <div class="project-card-menu" data-project-id="${project.id}">
        <i class="fa-solid fa-ellipsis-vertical"></i>
        <div class="project-menu-dropdown">
          <div class="project-menu-item" data-action="view">
            <i class="fa-solid fa-eye"></i>
            View
          </div>
          <div class="project-menu-item" data-action="edit">
            <i class="fa-solid fa-edit"></i>
            Edit
          </div>
          <div class="project-menu-item delete" data-action="delete">
            <i class="fa-solid fa-trash"></i>
            Delete
          </div>
        </div>
      </div>
    `;

    // Add click event to open project (excluding menu clicks)
    projectCard.addEventListener('click', (e) => {
      if (!e.target.closest('.project-card-menu')) {
        console.log('Opening project:', project.id);
        // Add project opening logic here
      }
    });

    return projectCard;
  }

  // Format project date for display
  function formatProjectDate(dateStr) {
    const date = new Date(dateStr);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  }

  // Setup project menu event listeners
  function setupProjectMenus() {
    // Toggle menu dropdowns
    document.querySelectorAll('.project-card-menu').forEach(menu => {
      menu.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Close all other menus and remove z-index classes
        document.querySelectorAll('.project-menu-dropdown').forEach(dropdown => {
          if (dropdown !== menu.querySelector('.project-menu-dropdown')) {
            dropdown.classList.remove('active');
            // Remove z-index elevation from other cards
            const otherCard = dropdown.closest('.project-card');
            if (otherCard) {
              otherCard.classList.remove('menu-active');
            }
          }
        });
        
        // Toggle current menu
        const dropdown = menu.querySelector('.project-menu-dropdown');
        const currentCard = menu.closest('.project-card');
        
        if (dropdown.classList.contains('active')) {
          dropdown.classList.remove('active');
          currentCard.classList.remove('menu-active');
        } else {
          dropdown.classList.add('active');
          currentCard.classList.add('menu-active');
        }
      });
    });

    // Handle menu item clicks
    document.querySelectorAll('.project-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const action = item.dataset.action;
        const menu = item.closest('.project-card-menu');
        const projectId = parseInt(menu.dataset.projectId);
        const project = projects.find(p => p.id === projectId);
        
        // Close menu and remove z-index elevation
        menu.querySelector('.project-menu-dropdown').classList.remove('active');
        const menuCard = menu.closest('.project-card');
        if (menuCard) {
          menuCard.classList.remove('menu-active');
        }
        
        switch (action) {
          case 'view':
            console.log('Viewing project:', projectId);
            // Add project viewing logic here
            break;
          case 'edit':
            if (project) {
              // Switch to chat section and start a new chat about editing the project
              showSection('chat');
              hideChatListPanel();
              addNewChat();
              // Pre-fill the input with project editing context
              messageInput.value = `I'd like to edit the "${project.title}" project.`;
              sendButton.disabled = false;
            }
            break;
          case 'delete':
            handleProjectAction('delete', projectId);
            break;
        }
      });
    });

    // Close menus when clicking outside
    document.addEventListener('click', () => {
      document.querySelectorAll('.project-menu-dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
        // Remove z-index elevation from all cards
        const card = dropdown.closest('.project-card');
        if (card) {
          card.classList.remove('menu-active');
        }
      });
    });
  }

  // Handle project menu actions
  function handleProjectAction(action, projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    switch(action) {
      case 'rename':
        console.log('Renaming project:', projectId);
        // Add rename logic here
        break;
      case 'duplicate':
        console.log('Duplicating project:', projectId);
        // Add duplicate logic here
        break;
      case 'archive':
        console.log('Archiving project:', projectId);
        // Add archive logic here
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
          const index = projects.findIndex(p => p.id === projectId);
          if (index > -1) {
            projects.splice(index, 1);
            filteredProjects = filteredProjects.filter(p => p.id !== projectId);
            renderProjects();
          }
        }
        break;
    }
  }

  // Update projects count
  function updateProjectsCount() {
    const projectsCountText = document.getElementById('projectsCountText');
    if (projectsCountText) {
      projectsCountText.textContent = `You have ${projects.length} projects with Loom4`;
    }
  }

  // Filter projects based on search
  function filterProjects(searchTerm) {
    if (!searchTerm.trim()) {
      filteredProjects = [...projects];
    } else {
      filteredProjects = projects.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    showAllProjects = false; // Reset pagination when filtering
    renderProjects();
  }

  // Reusable pagination utility for any list
  function createPaginatedList(items, container, createItemFunction, options = {}) {
    const {
      initialLimit = 10,
      showViewAll = true,
      layout = 'grid',
      emptyStateMessage = 'No items found',
      emptyStateSubtext = 'Try adjusting your search or create a new item.',
      viewAllButtonText = 'View All',
      onViewAll = null
    } = options;

    let showAll = false;
    let filteredItems = [...items];

    function renderItems() {
      container.innerHTML = '';

      if (filteredItems.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <h3>${emptyStateMessage}</h3>
            <p>${emptyStateSubtext}</p>
          </div>
        `;
        return;
      }

      const itemsToDisplay = showAll ? filteredItems : filteredItems.slice(0, initialLimit);
      itemsToDisplay.forEach(item => {
        const itemElement = createItemFunction(item, layout);
        container.appendChild(itemElement);
      });

      // Handle View All button
      if (showViewAll) {
        const existingViewAll = container.nextElementSibling?.querySelector('.view-all-btn');
        if (existingViewAll) {
          existingViewAll.parentElement.style.display = 
            filteredItems.length > initialLimit && !showAll ? 'block' : 'none';
        }
      }
    }

    function filterItems(filterFunction) {
      filteredItems = items.filter(filterFunction);
      showAll = false;
      renderItems();
    }

    function viewAll() {
      showAll = true;
      renderItems();
      if (onViewAll) onViewAll();
    }

    function resetPagination() {
      showAll = false;
      filteredItems = [...items];
      renderItems();
    }

    return {
      render: renderItems,
      filter: filterItems,
      viewAll,
      reset: resetPagination,
      updateItems: (newItems) => {
        filteredItems = [...newItems];
        renderItems();
      }
    };
  }

  // Reusable artifact card component
  function createArtifactCard(artifact) {
    const artifactCard = document.createElement('div');
    artifactCard.className = 'artifact-card';
    
    const formattedDate = formatArtifactDate(artifact.createdAt);
    
    artifactCard.innerHTML = `
      <div class="artifact-card-content">
        <div class="artifact-card-title">${artifact.title}</div>
        <div class="artifact-card-description">${artifact.description}</div>
        <div class="artifact-card-meta">
          <span class="artifact-card-tag ${artifact.type}">${getTypeDisplayName(artifact.type)}</span>
          <span class="artifact-card-date">${formattedDate}</span>
        </div>
      </div>
      <div class="artifact-card-menu" data-artifact-id="${artifact.id}">
        <i class="fa-solid fa-ellipsis-vertical"></i>
        <div class="artifact-menu-dropdown">
          <div class="artifact-menu-item" data-action="view">
            <i class="fa-solid fa-eye"></i>
            View
          </div>
          <div class="artifact-menu-item" data-action="edit">
            <i class="fa-solid fa-edit"></i>
            Edit
          </div>
          <div class="artifact-menu-item" data-action="duplicate">
            <i class="fa-solid fa-copy"></i>
            Duplicate
          </div>
          <div class="artifact-menu-item delete" data-action="delete">
            <i class="fa-solid fa-trash"></i>
            Delete
          </div>
        </div>
      </div>
    `;
    
    // Add click event to view artifact (excluding menu clicks)
    artifactCard.addEventListener('click', (e) => {
      if (!e.target.closest('.artifact-card-menu')) {
        viewArtifact(artifact);
      }
    });
    
    return artifactCard;
  }

  // Update artifacts count text
  function updateArtifactsCount() {
    const artifactsCountText = document.getElementById('artifactsCountText');
    if (artifactsCountText) {
      const count = artifacts.length;
      artifactsCountText.textContent = `You have ${count} artifact${count === 1 ? '' : 's'} created with Loom4`;
    }
  }

  // Render artifacts in the artifacts section
  function renderArtifacts() {
    const artifactsGrid = document.getElementById('artifactsGrid');
    const artifactsViewAll = document.getElementById('artifactsViewAll');
    if (!artifactsGrid) return;

    // Update grid layout class (grid only)
    artifactsGrid.className = 'artifacts-grid';

    artifactsGrid.innerHTML = '';

    if (filteredArtifacts.length === 0) {
      artifactsGrid.innerHTML = `
        <div class="artifacts-empty-state">
          <h3>No artifacts found</h3>
          <p>Try adjusting your search or create a new artifact.</p>
        </div>
      `;
      // Hide view all button when no artifacts
      if (artifactsViewAll) {
        artifactsViewAll.style.display = 'none';
      }
      return;
    }

    // Determine artifacts to display
    const artifactsToDisplay = showAllArtifacts ? filteredArtifacts : filteredArtifacts.slice(0, INITIAL_ARTIFACTS_LIMIT);

    artifactsToDisplay.forEach(artifact => {
      const artifactCard = createArtifactCard(artifact);
      artifactsGrid.appendChild(artifactCard);
    });

    // Setup menu event listeners
    setupArtifactMenus();
    
    // Update artifacts count
    updateArtifactsCount();
    
    // Show/hide View All button
    if (artifactsViewAll) {
      if (filteredArtifacts.length > INITIAL_ARTIFACTS_LIMIT && !showAllArtifacts) {
        artifactsViewAll.style.display = 'block';
      } else {
        artifactsViewAll.style.display = 'none';
      }
    }
  }

  // Render knowledge sources in the connect section
  function renderKnowledgeSources() {
    const connectItemsList = document.getElementById('connectItemsList');
    if (!connectItemsList) return;

    // Clear existing content
    connectItemsList.innerHTML = '';

    // Determine how many items to show
    const sourcesToShow = showAllKnowledgeSources ? filteredKnowledgeSources : filteredKnowledgeSources.slice(0, INITIAL_KNOWLEDGE_LIMIT);

    // Render knowledge source items
    sourcesToShow.forEach(source => {
      const sourceItem = document.createElement('div');
      sourceItem.className = 'connect-list-item';
      sourceItem.innerHTML = `
        <input type="checkbox" class="connect-item-checkbox" data-source-id="${source.id}">
        <div class="connect-item-content">
          <div class="connect-item-title">${source.title}</div>
          <div class="connect-item-description">${source.description}</div>
          <div class="connect-item-meta">
            <span class="connect-item-type ${source.type}">${source.type}</span>
            <span>•</span>
            <span>${source.sourceInfo}</span>
            <span>•</span>
            <span>${formatTimeAgo(source.lastUpdated)}</span>
          </div>
        </div>
        <div class="connect-item-actions">
          <button class="connect-item-rename" data-source-id="${source.id}" title="Rename">
            <i class="fas fa-edit"></i>
          </button>
          <button class="connect-item-delete" data-source-id="${source.id}" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;

      // Add click event to open/edit source
      sourceItem.addEventListener('click', (e) => {
        if (e.target.type !== 'checkbox' && !e.target.closest('.connect-item-actions')) {
          // Handle opening/editing knowledge source
          console.log('Opening knowledge source:', source.id);
        }
      });

      connectItemsList.appendChild(sourceItem);
    });

    // Update count text
    updateKnowledgeSourcesCount();
    
    // Show/hide View All button
    const connectViewAll = document.getElementById('connectViewAll');
    if (connectViewAll) {
      if (filteredKnowledgeSources.length > INITIAL_KNOWLEDGE_LIMIT && !showAllKnowledgeSources) {
        connectViewAll.style.display = 'block';
      } else {
        connectViewAll.style.display = 'none';
      }
    }
  }

  // Update knowledge sources count
  function updateKnowledgeSourcesCount() {
    const connectCountText = document.getElementById('connectCountText');
    if (connectCountText) {
      connectCountText.textContent = `You have ${knowledgeSources.length} knowledge sources connected with Loom4`;
    }
  }

  // Show specific section and update navigation
  function showSection(sectionName) {
    currentSection = sectionName;

    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.remove('active');
    });

    // Show the selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update navigation active states
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
      item.classList.remove('active');
    });

    const activeNavItem = document.querySelector(`.nav-item[data-section="${sectionName}"]`);
    if (activeNavItem) {
      activeNavItem.classList.add('active');
    }

    // Handle section-specific logic
    if (sectionName === 'chat') {
      // Show chat list panel by default
      showChatListPanel();
      
      // Ensure artifact viewer button is in correct state
      if (expandArtifactBtn && !isArtifactViewerOpen) {
        expandArtifactBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
        expandArtifactBtn.title = 'Expand Artifact Viewer';
      }
    } else if (sectionName === 'projects') {
      // Reset projects pagination and filters when entering projects section
      showAllProjects = false;
      filteredProjects = [...projects];
      const projectsSearchInput = document.getElementById('projectsSearchInput');
      if (projectsSearchInput) {
        projectsSearchInput.value = '';
      }
    } else if (sectionName === 'artifacts') {
      // Reset artifacts pagination and filters when entering artifacts section
      showAllArtifacts = false;
      filteredArtifacts = [...artifacts];
      const artifactsSearchInput = document.getElementById('artifactsSearchInput');
      if (artifactsSearchInput) {
        artifactsSearchInput.value = '';
      }
    } else if (sectionName === 'connect') {
      // Reset connect pagination and filters when entering connect section
      showAllKnowledgeSources = false;
      filteredKnowledgeSources = [...knowledgeSources];
      const connectSearchInput = document.getElementById('connectSearchInput');
      if (connectSearchInput) {
        connectSearchInput.value = '';
      }
    } else {
      // Clean up chat-specific UI state when leaving chat section
      cleanupChatState();
    }
  }

  // Show chat list panel
  function showChatListPanel() {
    showChatList = true;
    // Reset pagination state when showing chat list
    showAllChats = false;
    const chatListPanel = document.getElementById('chatListPanel');
    const chatContainer = document.getElementById('chatContainer');
    
    if (chatListPanel && chatContainer) {
      chatListPanel.classList.add('active');
      chatContainer.style.display = 'none';
      renderChatListItems();
    }
  }

  // Hide chat list panel and show chat container
  function hideChatListPanel() {
    showChatList = false;
    const chatListPanel = document.getElementById('chatListPanel');
    const chatContainer = document.getElementById('chatContainer');
    
    if (chatListPanel && chatContainer) {
      chatListPanel.classList.remove('active');
      chatContainer.style.display = 'flex';
    }
  }

  // Render chat list items with pagination
  function renderChatListItems() {
    const chatItemsList = document.getElementById('chatItemsList');
    if (!chatItemsList) return;

    // Store reference to footer before clearing
    const footerElement = document.getElementById('chatListFooter');
    
    // Clear existing content
    chatItemsList.innerHTML = '';

    // Determine how many chats to show
    const chatsToShow = showAllChats ? chats : chats.slice(0, INITIAL_CHAT_LIMIT);

    // Render chat items
    chatsToShow.forEach(chat => {
      const chatItem = document.createElement('div');
      chatItem.className = 'chat-list-item';
      chatItem.innerHTML = `
        <input type="checkbox" class="chat-item-checkbox" data-chat-id="${chat.id}">
        <div class="chat-item-content">
          <div class="chat-item-title">${chat.title}</div>
          <div class="chat-item-preview">${chat.lastMessage}</div>
          <div class="chat-item-time">${formatTimeAgo(chat.timestamp)}</div>
        </div>
        <div class="chat-item-actions">
          <button class="chat-item-rename" data-chat-id="${chat.id}" title="Rename">
            <i class="fas fa-edit"></i>
          </button>
          <button class="chat-item-delete" data-chat-id="${chat.id}" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;

      // Add click event to open chat
      chatItem.addEventListener('click', (e) => {
        if (e.target.type !== 'checkbox' && !e.target.closest('.chat-item-actions')) {
          openChatFromList(chat.id);
        }
      });

      chatItemsList.appendChild(chatItem);
    });

    // Always append the footer back to maintain structure
    if (footerElement) {
      chatItemsList.appendChild(footerElement);
    }

    // Show/hide "View All" button based on conditions
    updateViewAllButton();

    // Update total chats count
    updateChatInfoText();

    // Setup checkbox and delete event listeners
    setupChatListEventListeners();
  }

  // Update "View All" button visibility and state
  function updateViewAllButton() {
    const chatListFooter = document.getElementById('chatListFooter');
    const viewAllBtn = document.getElementById('viewAllBtn');

    if (!chatListFooter || !viewAllBtn) return;

    // Show button ONLY if we have MORE than 10 chats (>10) and haven't shown all yet
    if (chats.length > INITIAL_CHAT_LIMIT && !showAllChats) {
      chatListFooter.style.display = 'flex';
      const remainingCount = chats.length - INITIAL_CHAT_LIMIT;
      viewAllBtn.textContent = `View All (${remainingCount} more)`;
    } else {
      // Hide button when we have 10 or fewer chats, or when all chats are shown
      chatListFooter.style.display = 'none';
    }
  }

  // Update chat info text with current count
  function updateChatInfoText() {
    const totalChatsCount = document.getElementById('totalChatsCount');
    if (totalChatsCount) {
      totalChatsCount.textContent = chats.length;
    }
  }

  // Open chat from list
  function openChatFromList(chatId) {
    hideChatListPanel();
    openChat(chatId);
  }

  // Open chat from sidebar (works from any app state)
  function openChatFromSidebar(chatId) {
    // First, navigate to chat section if not already there
    showSection('chat');
    // Hide chat list panel to show the actual chat interface
    hideChatListPanel();
    // Open the specific chat
    openChat(chatId);
  }

  // Setup event listeners for chat list
  function setupChatListEventListeners() {
    // Checkbox changes
    document.querySelectorAll('.chat-item-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const chatId = parseInt(e.target.dataset.chatId);
        if (e.target.checked) {
          selectedChatIds.add(chatId);
        } else {
          selectedChatIds.delete(chatId);
        }
        updateSelectionControls();
      });
    });

    // Rename buttons
    document.querySelectorAll('.chat-item-rename').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const chatId = parseInt(btn.dataset.chatId);
        startRename(chatId, 'list');
      });
    });

    // Delete buttons
    document.querySelectorAll('.chat-item-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const chatId = parseInt(btn.dataset.chatId);
        deleteChat(chatId);
        renderChatListItems();
        updateChatInfoText();
        updateSidebarViewAllButton();
      });
    });
  }

  // Update selection controls visibility and count
  function updateSelectionControls() {
    const selectionSection = document.getElementById('chatListSelection');
    const selectedCount = document.getElementById('selectedCount');
    const chatItemsList = document.getElementById('chatItemsList');
    const chatInfoText = document.getElementById('chatInfoText');
    
    if (selectedChatIds.size > 0) {
      // Show selection toolbar and hide default text
      selectionSection.style.display = 'flex';
      if (chatInfoText) {
        chatInfoText.style.display = 'none';
      }
      selectedCount.textContent = `${selectedChatIds.size} Selected`;
      
      // Add selection mode class to show all checkboxes
      if (chatItemsList) {
        chatItemsList.classList.add('selection-mode');
      }
    } else {
      // Hide selection toolbar and show default text
      selectionSection.style.display = 'none';
      if (chatInfoText) {
        chatInfoText.style.display = 'block';
      }
      
      // Remove selection mode class to hide checkboxes on hover only
      if (chatItemsList) {
        chatItemsList.classList.remove('selection-mode');
      }
    }
  }

  // Share Modal Functions
  function openShareModal() {
    const chatURL = document.getElementById('chatURL');
    const shareType = document.getElementById('shareType');
    
    // Generate a shareable URL (in a real app, this would be generated by the server)
    const currentURL = window.location.href;
    const shareableURL = `${currentURL}share/${currentChatId || 'new'}`;
    
    chatURL.value = shareableURL;
    shareType.value = 'public';
    
    shareModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeShareModal() {
    shareModalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  async function copyShareLink() {
    const chatURL = document.getElementById('chatURL');
    
    try {
      await navigator.clipboard.writeText(chatURL.value);
      
      // Show success feedback
      const originalText = copyLinkBtn.textContent;
      copyLinkBtn.textContent = 'Copied!';
      copyLinkBtn.style.background = '#10b981';
      
      setTimeout(() => {
        copyLinkBtn.textContent = originalText;
        copyLinkBtn.style.background = '#3b82f6';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback: select the text
      chatURL.select();
      chatURL.setSelectionRange(0, 99999);
    }
  }

  // Artifact Viewer Functions
  function openArtifactViewer() {
    // Only allow opening artifact viewer in chat section
    if (currentSection !== 'chat') {
      return;
    }
    
    isArtifactViewerOpen = true;
    
    // Add split-view class to chat section to enable row layout
    if (chatSection) {
      chatSection.classList.add('split-view');
    }
    
    // Show artifact viewer and resize handle
    artifactViewer.classList.add('active');
    resizeHandle.classList.add('active');
    chatContainer.classList.add('split-view');
    
    // Load sample artifact (in a real app, this would load the current artifact)
    loadArtifactContent();
    
    // Update button icon to indicate expanded state
    expandArtifactBtn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
    expandArtifactBtn.title = 'Collapse Artifact Viewer';
  }

  function closeArtifactViewer() {
    isArtifactViewerOpen = false;
    
    // Remove split-view class from chat section
    if (chatSection) {
      chatSection.classList.remove('split-view');
    }
    
    // Hide artifact viewer and resize handle
    artifactViewer.classList.remove('active');
    resizeHandle.classList.remove('active');
    chatContainer.classList.remove('split-view');
    
    // Reset widths back to original state
    artifactViewerWidth = 50;
    
    // Reset chat container width to full width
    if (chatContainer) {
      chatContainer.style.width = '';
    }
    
    // Reset artifact viewer width
    if (artifactViewer) {
      artifactViewer.style.width = '';
    }
    
    // Reset resize handle position
    if (resizeHandle) {
      resizeHandle.style.right = '';
    }
    
    // Reset button icon
    expandArtifactBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    expandArtifactBtn.title = 'Expand Artifact Viewer';
  }

  function loadArtifactContent() {
    const artifactViewerName = document.getElementById('artifactViewerName');
    const artifactViewerContent = document.getElementById('artifactViewerContent');
    
    // Sample artifact content (in a real app, this would load from the artifacts array)
    const sampleArtifact = artifacts[0] || {
      title: 'Homepage HTML',
      type: 'html',
      content: `<!DOCTYPE html>
<html>
<head>
  <title>Sample Page</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #333; }
    .container { max-width: 800px; margin: 0 auto; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to the Sample Page</h1>
    <p>This is a sample HTML artifact that demonstrates the artifact viewer functionality.</p>
    <button onclick="alert('Hello from artifact!')">Click Me</button>
  </div>
</body>
</html>`
    };
    
    // Set contextual title with "Artifact:" prefix
    artifactViewerName.textContent = `Artifact: ${sampleArtifact.title}`;
    
    if (sampleArtifact.type === 'html') {
      // Create an iframe to safely display HTML content
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.srcdoc = sampleArtifact.content;
      
      artifactViewerContent.innerHTML = '';
      artifactViewerContent.appendChild(iframe);
    } else {
      // For other types, display as code
      artifactViewerContent.innerHTML = `<pre><code>${sampleArtifact.content}</code></pre>`;
    }
  }

  function updateArtifactViewerWidth() {
    if (isArtifactViewerOpen) {
      artifactViewer.style.width = artifactViewerWidth + '%';
      chatContainer.style.width = (100 - artifactViewerWidth) + '%';
      
      // Position resize handle based on artifact viewer width
      resizeHandle.style.right = artifactViewerWidth + '%';
    }
  }

  // Resize Handle Functions
  function initResizeHandle() {
    let startX = 0;
    let startWidth = 0;

    resizeHandle.addEventListener('mousedown', (e) => {
      isResizing = true;
      startX = e.clientX;
      startWidth = artifactViewerWidth;
      
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResize);
      
      // Prevent text selection while resizing
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    });

    function handleResize(e) {
      if (!isResizing) return;
      
      const deltaX = startX - e.clientX;
      const chatSectionRect = chatSection.getBoundingClientRect();
      const newWidth = startWidth + (deltaX / chatSectionRect.width) * 100;
      
      // Constrain width between 25% and 75%
      artifactViewerWidth = Math.max(25, Math.min(75, newWidth));
      updateArtifactViewerWidth();
    }

    function stopResize() {
      isResizing = false;
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
      
      // Restore normal cursor and text selection
      document.body.style.userSelect = 'auto';
      document.body.style.cursor = 'default';
    }
  }

  // Artifact Actions
  function copyArtifactContent() {
    const artifactNameElement = document.getElementById('artifactViewerName');
    const artifactNameText = artifactNameElement.textContent;
    
    // Extract the actual artifact name from "Artifact: artifactname"
    const artifactName = artifactNameText.replace('Artifact: ', '');
    const sampleArtifact = artifacts.find(a => a.title === artifactName) || artifacts[0];
    
    if (sampleArtifact) {
      navigator.clipboard.writeText(sampleArtifact.content).then(() => {
        // Show success feedback
        const copyArtifactBtn = document.getElementById('copyArtifactBtn');
        const originalHTML = copyArtifactBtn.innerHTML;
        copyArtifactBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        copyArtifactBtn.style.color = '#10b981';
        
        setTimeout(() => {
          copyArtifactBtn.innerHTML = originalHTML;
          copyArtifactBtn.style.color = '#6b7280';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy artifact:', err);
      });
    }
  }

  function publishArtifact() {
    alert('Publish artifact functionality coming soon!');
  }

  // Artifacts page helper functions
  function formatArtifactDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    
    // Check if it's the current year
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    }
    
    return date.toLocaleDateString('en-US', options);
  }

  function getTypeDisplayName(type) {
    const typeMap = {
      'html': 'HTML Snippet',
      'css': 'CSS Module',
      'javascript': 'JavaScript Module',
      'template': 'Template',
      'component': 'Component'
    };
    return typeMap[type] || type;
  }

  function viewArtifact(artifact) {
    // Navigate to chat and open artifact viewer
    showSection('chat');
    hideChatListPanel();
    
    // Load the artifact in the viewer
    setTimeout(() => {
      if (!isArtifactViewerOpen) {
        openArtifactViewer();
      }
      
      // Update artifact viewer with selected artifact
      const artifactViewerName = document.getElementById('artifactViewerName');
      const artifactViewerContent = document.getElementById('artifactViewerContent');
      
      if (artifactViewerName) {
        artifactViewerName.textContent = `Artifact: ${artifact.title}`;
      }
      
      if (artifactViewerContent) {
        if (artifact.type === 'html') {
          const iframe = document.createElement('iframe');
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = 'none';
          iframe.srcdoc = artifact.content;
          
          artifactViewerContent.innerHTML = '';
          artifactViewerContent.appendChild(iframe);
        } else {
          artifactViewerContent.innerHTML = `<pre><code>${artifact.content}</code></pre>`;
        }
      }
    }, 100);
  }

  function setupArtifactMenus() {
    // Toggle menu dropdowns
    document.querySelectorAll('.artifact-card-menu').forEach(menu => {
      menu.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Close all other menus and remove z-index classes
        document.querySelectorAll('.artifact-menu-dropdown').forEach(dropdown => {
          if (dropdown !== menu.querySelector('.artifact-menu-dropdown')) {
            dropdown.classList.remove('active');
            // Remove z-index elevation from other cards
            const otherCard = dropdown.closest('.artifact-card');
            if (otherCard) {
              otherCard.classList.remove('menu-active');
            }
          }
        });
        
        // Toggle current menu
        const dropdown = menu.querySelector('.artifact-menu-dropdown');
        const currentCard = menu.closest('.artifact-card');
        
        if (dropdown.classList.contains('active')) {
          dropdown.classList.remove('active');
          currentCard.classList.remove('menu-active');
        } else {
          dropdown.classList.add('active');
          currentCard.classList.add('menu-active');
        }
      });
    });

    // Handle menu item clicks
    document.querySelectorAll('.artifact-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const action = item.dataset.action;
        const menu = item.closest('.artifact-card-menu');
        const artifactId = parseInt(menu.dataset.artifactId);
        const artifact = artifacts.find(a => a.id === artifactId);
        
        // Close menu and remove z-index elevation
        menu.querySelector('.artifact-menu-dropdown').classList.remove('active');
        const menuCard = menu.closest('.artifact-card');
        if (menuCard) {
          menuCard.classList.remove('menu-active');
        }
        
        switch (action) {
          case 'view':
            viewArtifact(artifact);
            break;
          case 'edit':
            editArtifact(artifact);
            break;
          case 'duplicate':
            duplicateArtifact(artifact);
            break;
          case 'delete':
            deleteArtifact(artifact);
            break;
        }
      });
    });

    // Close menus when clicking outside
    document.addEventListener('click', () => {
      document.querySelectorAll('.artifact-menu-dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
        // Remove z-index elevation from all cards
        const card = dropdown.closest('.artifact-card');
        if (card) {
          card.classList.remove('menu-active');
        }
      });
    });
  }

  function editArtifact(artifact) {
    // Redirect to chat interface and start new chat session
    showSection('chat');
    hideChatListPanel();
    addNewChat();
    // Pre-fill the input with artifact editing context
    if (messageInput) {
      messageInput.value = `I'd like to edit the artifact "${artifact.title}". Here's the current content:\n\nTitle: ${artifact.title}\nDescription: ${artifact.description}\nType: ${artifact.type}\nContent: ${artifact.content}\n\nPlease help me modify this artifact.`;
      sendButton.disabled = false;
      autoResizeTextarea();
    }
  }

  function duplicateArtifact(artifact) {
    const newArtifact = {
      ...artifact,
      id: Date.now(),
      title: `${artifact.title} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    artifacts.unshift(newArtifact);
    filteredArtifacts = [...artifacts];
    renderArtifacts();
    
    // Show success message
    alert('Artifact duplicated successfully!');
  }

  function deleteArtifact(artifact) {
    if (confirm(`Are you sure you want to delete "${artifact.title}"?`)) {
      const index = artifacts.findIndex(a => a.id === artifact.id);
      if (index > -1) {
        artifacts.splice(index, 1);
        filteredArtifacts = [...artifacts];
        renderArtifacts();
        
        // Show success message
        alert('Artifact deleted successfully!');
      }
    }
  }


  function filterArtifacts(searchTerm) {
    if (!searchTerm.trim()) {
      filteredArtifacts = [...artifacts];
    } else {
      const term = searchTerm.toLowerCase();
      filteredArtifacts = artifacts.filter(artifact => 
        artifact.title.toLowerCase().includes(term) ||
        artifact.description.toLowerCase().includes(term) ||
        artifact.type.toLowerCase().includes(term)
      );
    }
    
    // Reset view all state when filtering
    showAllArtifacts = false;
    renderArtifacts();
  }



  // Update chat title based on current chat
  function updateChatTitle() {
    const chatHeaderTitle = document.getElementById('chatHeaderTitle');
    if (!chatHeaderTitle) return;
    
    if (currentChatId) {
      const chat = chats.find(c => c.id === currentChatId);
      if (chat) {
        chatHeaderTitle.textContent = chat.title;
      } else {
        chatHeaderTitle.textContent = 'Chat with Loom4';
      }
    } else {
      chatHeaderTitle.textContent = 'Chat with Loom4';
    }
  }

  // Clean up chat-specific UI state (called when leaving chat section)
  function cleanupChatState() {
    // Close artifact viewer if it's open
    if (isArtifactViewerOpen) {
      closeArtifactViewer();
    }
    
    // Ensure all chat-specific classes are removed as a safety measure
    if (chatSection) {
      chatSection.classList.remove('split-view');
    }
    if (chatContainer) {
      chatContainer.classList.remove('split-view');
    }
    if (artifactViewer) {
      artifactViewer.classList.remove('active');
    }
    if (resizeHandle) {
      resizeHandle.classList.remove('active');
    }
    
    // Hide chat list panel
    hideChatListPanel();
    
    // Reset artifact viewer state
    isArtifactViewerOpen = false;
    artifactViewerWidth = 50;
    
    // Reset widths to original state
    if (chatContainer) {
      chatContainer.style.width = '';
    }
    if (artifactViewer) {
      artifactViewer.style.width = '';
    }
    
    // Reset resize handle position
    if (resizeHandle) {
      resizeHandle.style.right = '';
    }
    
    // Reset button state
    if (expandArtifactBtn) {
      expandArtifactBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
      expandArtifactBtn.title = 'Expand Artifact Viewer';
    }
  }

  // Initialize the app
  function init() {
    renderChatHistory();
    renderProjects();
    renderArtifacts();
    renderKnowledgeSources();
    setupEventListeners();
    loadSavedData();
    showSection('chat');
    
    // Initialize chat title
    updateChatTitle();
  }

  // Load saved data from localStorage
  function loadSavedData() {
    const savedChats = localStorage.getItem("claude_chats");
    
    if (savedChats) {
      chats = JSON.parse(savedChats);
      renderChatHistory();
    }
  }

  // Save data to localStorage
  function saveData() {
    localStorage.setItem("claude_chats", JSON.stringify(chats));
  }

  // Show welcome message
  function showWelcomeMessage() {
    chatMessages.innerHTML = `
      <div class="welcome-message">
        <div class="welcome-content">
          <h1>Hello, I'm Loom4</h1>
          <p>I'm an AI assistant that can help you with analysis, writing, coding, math, and many other tasks.</p>
        </div>
      </div>
    `;
  }

  // Helper functions
  function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return new Date(timestamp).toLocaleDateString();
  }

  // Render chat history in sidebar with pagination
  function renderChatHistory() {
    // Store reference to footer before clearing
    const sidebarFooterElement = document.getElementById('sidebarChatFooter');
    
    // Clear existing content
    chatList.innerHTML = "";

    // Determine how many chats to show in sidebar
    const chatsToShow = showAllSidebarChats ? chats : chats.slice(0, SIDEBAR_CHAT_LIMIT);

    chatsToShow.forEach((chat) => {
      const chatItem = document.createElement("div");
      chatItem.className = "chat-item";
      chatItem.innerHTML = `
        <div class="chat-item-content">${chat.title}</div>
        <div class="chat-item-actions">
          <button class="chat-action-btn rename" title="Rename" data-chat-id="${chat.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="chat-action-btn delete" title="Delete" data-chat-id="${chat.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;

      // Add click event for opening chat
      chatItem.querySelector('.chat-item-content').addEventListener("click", () => openChatFromSidebar(chat.id));
      chatList.appendChild(chatItem);
    });

    // Always append the footer back to maintain structure
    if (sidebarFooterElement) {
      chatList.appendChild(sidebarFooterElement);
    }

    // Update sidebar "View All" button
    updateSidebarViewAllButton();

    // Setup chat action button events
    setupChatActionButtons();
  }

  // Update sidebar "View All" button visibility and state
  function updateSidebarViewAllButton() {
    const sidebarChatFooter = document.getElementById('sidebarChatFooter');
    const sidebarViewAllBtn = document.getElementById('sidebarViewAllBtn');

    if (!sidebarChatFooter || !sidebarViewAllBtn) return;

    // Show button ONLY if we have MORE than 10 chats and haven't shown all yet
    if (chats.length > SIDEBAR_CHAT_LIMIT && !showAllSidebarChats) {
      sidebarChatFooter.style.display = 'flex';
      const remainingCount = chats.length - SIDEBAR_CHAT_LIMIT;
      sidebarViewAllBtn.textContent = `View All (${remainingCount} more)`;
    } else {
      // Hide button when we have 10 or fewer chats, or when all chats are shown
      sidebarChatFooter.style.display = 'none';
    }
  }

  // Setup event listeners for chat action buttons
  function setupChatActionButtons() {
    // Handle sidebar chat actions
    document.querySelectorAll('.chat-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent chat from opening
        const chatId = parseInt(btn.dataset.chatId);
        if (btn.classList.contains('delete')) {
          deleteChat(chatId);
        } else if (btn.classList.contains('rename')) {
          startRename(chatId, 'sidebar');
        }
      });
    });
  }

  // Delete chat with confirmation
  function deleteChat(chatId) {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    if (confirm(`Delete "${chat.title}"?`)) {
      chats = chats.filter(c => c.id !== chatId);
      
      // If currently viewing this chat, reset to welcome
      if (currentChatId === chatId) {
        currentChatId = null;
        showWelcomeMessage();
        updateChatTitle();
      }
      
      renderChatHistory();
      updateChatInfoText();
      updateSidebarViewAllButton();
      saveData();
    }
  }

  // Start rename process
  function startRename(chatId, source) {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    
    // Find the appropriate element based on source
    let titleElement;
    if (source === 'list') {
      // Find in chat list panel
      titleElement = document.querySelector(`[data-chat-id="${chatId}"]`).closest('.chat-list-item').querySelector('.chat-item-title');
    } else {
      // Find in sidebar
      titleElement = document.querySelector(`[data-chat-id="${chatId}"]`).closest('.chat-item').querySelector('.chat-item-content');
    }
    
    if (!titleElement) return;
    
    // Store original title
    const originalTitle = chat.title;
    
    // Create input field
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalTitle;
    input.className = 'chat-rename-input';
    input.style.cssText = `
      width: 100%;
      padding: 4px 8px;
      border: 1px solid #3b82f6;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      background: white;
      color: #1f2937;
      outline: none;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    `;
    
    // Create confirm/cancel buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'rename-buttons';
    buttonContainer.style.cssText = `
      display: flex;
      gap: 4px;
      margin-top: 4px;
    `;
    
    const confirmBtn = document.createElement('button');
    confirmBtn.innerHTML = '<i class="fas fa-check"></i>';
    confirmBtn.className = 'rename-confirm-btn';
    confirmBtn.title = 'Confirm';
    confirmBtn.style.cssText = `
      padding: 4px 8px;
      border: none;
      border-radius: 4px;
      background: #10b981;
      color: white;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    const cancelBtn = document.createElement('button');
    cancelBtn.innerHTML = '<i class="fas fa-times"></i>';
    cancelBtn.className = 'rename-cancel-btn';
    cancelBtn.title = 'Cancel';
    cancelBtn.style.cssText = `
      padding: 4px 8px;
      border: none;
      border-radius: 4px;
      background: #ef4444;
      color: white;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    // Store original content
    const originalContent = titleElement.innerHTML;
    
    // Create wrapper for input and buttons
    const wrapper = document.createElement('div');
    wrapper.appendChild(input);
    wrapper.appendChild(buttonContainer);
    buttonContainer.appendChild(confirmBtn);
    buttonContainer.appendChild(cancelBtn);
    
    // Replace content with input
    titleElement.innerHTML = '';
    titleElement.appendChild(wrapper);
    
    // Focus and select text
    input.focus();
    input.select();
    
    // Handle confirm
    const confirmRename = () => {
      const newTitle = input.value.trim();
      if (newTitle && newTitle !== originalTitle) {
        chat.title = newTitle;
        saveData();
        renderChatHistory();
        renderChatListItems();
        updateChatTitle(); // Update header if this is the current chat
      }
      titleElement.innerHTML = originalContent;
      // Update the displayed title
      if (source === 'list') {
        titleElement.textContent = chat.title;
      } else {
        titleElement.textContent = chat.title;
      }
    };
    
    // Handle cancel
    const cancelRename = () => {
      titleElement.innerHTML = originalContent;
    };
    
    // Event listeners
    confirmBtn.addEventListener('click', confirmRename);
    cancelBtn.addEventListener('click', cancelRename);
    
    // Enter key to confirm, Escape to cancel
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        confirmRename();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelRename();
      }
    });
    
    // Click outside to cancel
    const handleClickOutside = (e) => {
      if (!wrapper.contains(e.target)) {
        cancelRename();
        document.removeEventListener('click', handleClickOutside);
      }
    };
    
    // Add click outside listener after a brief delay
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);
  }

  // Open chat
  function openChat(chatId) {
    currentChatId = chatId;

    // Update chat title
    updateChatTitle();

    // Update active chat in sidebar
    document.querySelectorAll(".chat-item").forEach((item) => {
      item.classList.remove("active");
    });

    // Find and activate the clicked chat
    const chatItem = Array.from(document.querySelectorAll(".chat-item")).find((item) => {
      const chatIdFromBtn = item.querySelector('[data-chat-id]')?.dataset.chatId;
      return parseInt(chatIdFromBtn) === chatId;
    });

    if (chatItem) chatItem.classList.add("active");

    // Load chat messages (simplified for demo)
    const chat = chats.find(c => c.id === chatId);
    chatMessages.innerHTML = `
      <div class="welcome-message">
        <div class="welcome-content">
          <h1>${chat ? chat.title : 'New Chat'}</h1>
          <p>Continue your conversation or start a new topic.</p>
        </div>
      </div>
    `;
    
    // Scroll to the latest message (or top for demo purposes)
    chatMessages.scrollTop = 0;
  }

  // Add new chat
  function addNewChat() {
    currentChatId = null;
    
    // Update chat title
    updateChatTitle();
    
    showWelcomeMessage();
    
    // Update sidebar active state
    document.querySelectorAll(".chat-item").forEach((item) => {
      item.classList.remove("active");
    });
    
    // Reset model selection to default
    const modelSelect = document.getElementById('modelSelect');
    if (modelSelect) {
      modelSelect.value = 'loom4-advanced'; // Reset to first option
    }
    
    // Scroll main chat area to the top
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      chatMessages.scrollTop = 0;
    }
    
    // Clear message input and focus
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
      messageInput.value = '';
      messageInput.style.height = 'auto'; // Reset textarea height
      messageInput.focus(); // Focus the input box
    }
    
    // Reset send button state
    const sendButton = document.getElementById('sendButton');
    if (sendButton) {
      sendButton.disabled = true;
    }
  }

  // Setup event listeners
  function setupEventListeners() {
    // Sidebar toggle
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });

    // Add chat button
    addChatBtn.addEventListener("click", () => {
      // First, navigate to chat section if not already there
      showSection('chat');
      // Hide chat list panel to show the actual chat interface
      hideChatListPanel();
      // Initialize new chat
      addNewChat();
    });

    // Navigation menu items
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        showSection(section);
      });
    });

    // Add Knowledge button
    const addKnowledgeBtn = document.getElementById('addKnowledgeBtn');
    if (addKnowledgeBtn) {
      addKnowledgeBtn.addEventListener('click', () => {
        alert('Add Knowledge functionality coming soon!');
      });
    }

    // Connect search
    const connectSearchInput = document.getElementById('connectSearchInput');
    if (connectSearchInput) {
      connectSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.trim() === '') {
          filteredKnowledgeSources = [...knowledgeSources];
        } else {
          filteredKnowledgeSources = knowledgeSources.filter(source => 
            source.title.toLowerCase().includes(searchTerm) ||
            source.description.toLowerCase().includes(searchTerm) ||
            source.type.toLowerCase().includes(searchTerm)
          );
        }
        
        renderKnowledgeSources();
      });
    }

    // Connect View All button
    const connectViewAllBtn = document.getElementById('connectViewAllBtn');
    if (connectViewAllBtn) {
      connectViewAllBtn.addEventListener('click', () => {
        showAllKnowledgeSources = true;
        renderKnowledgeSources();
      });
    }

    // New Project button
    const newProjectBtn = document.getElementById('newProjectBtn');
    if (newProjectBtn) {
      newProjectBtn.addEventListener('click', () => {
        const newProject = {
          id: Date.now(),
          title: "New Project",
          description: "Project description",
          status: "planned",
          lastActive: new Date().toISOString().split('T')[0],
          members: 1,
          tasks: 0,
          completion: 0
        };
        projects.unshift(newProject);
        filteredProjects = [...projects];
        renderProjects();
      });
    }

    // Projects search
    const projectsSearchInput = document.getElementById('projectsSearchInput');
    if (projectsSearchInput) {
      projectsSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        filterProjects(searchTerm);
      });
    }

    // Projects View All button
    const projectsViewAllBtn = document.getElementById('projectsViewAllBtn');
    if (projectsViewAllBtn) {
      projectsViewAllBtn.addEventListener('click', () => {
        showAllProjects = true;
        renderProjects();
      });
    }

    // Message input
    messageInput.addEventListener("input", () => {
      sendButton.disabled = messageInput.value.trim() === "";
      autoResizeTextarea();
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

    // Input control buttons
    const addAttachmentBtn = document.getElementById('addAttachmentBtn');
    const toolsBtn = document.getElementById('toolsBtn');

    if (addAttachmentBtn) {
      addAttachmentBtn.addEventListener('click', () => {
        alert('Add attachment functionality coming soon!');
      });
    }

    if (toolsBtn) {
      toolsBtn.addEventListener('click', () => {
        alert('Tools functionality coming soon!');
      });
    }

    // Chat list panel controls
    const newChatBtnPanel = document.getElementById('newChatBtnPanel');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const cancelSelectionBtn = document.getElementById('cancelSelectionBtn');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    const viewAllBtn = document.getElementById('viewAllBtn');
    const chatSearchInput = document.getElementById('chatSearchInput');

    if (newChatBtnPanel) {
      newChatBtnPanel.addEventListener('click', () => {
        hideChatListPanel();
        addNewChat();
      });
    }

    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.chat-item-checkbox').forEach(checkbox => {
          checkbox.checked = true;
          selectedChatIds.add(parseInt(checkbox.dataset.chatId));
        });
        updateSelectionControls();
      });
    }

    if (cancelSelectionBtn) {
      cancelSelectionBtn.addEventListener('click', () => {
        selectedChatIds.clear();
        document.querySelectorAll('.chat-item-checkbox').forEach(checkbox => {
          checkbox.checked = false;
        });
        updateSelectionControls();
      });
    }

    if (deleteSelectedBtn) {
      deleteSelectedBtn.addEventListener('click', () => {
        if (selectedChatIds.size > 0 && confirm(`Delete ${selectedChatIds.size} selected chats?`)) {
          selectedChatIds.forEach(chatId => {
            chats = chats.filter(c => c.id !== chatId);
          });
          selectedChatIds.clear();
          renderChatListItems();
          renderChatHistory();
          updateChatInfoText();
          updateSidebarViewAllButton();
          saveData();
        }
      });
    }

    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', () => {
        showAllChats = true;
        renderChatListItems();
      });
    }

    // Sidebar View All button
    const sidebarViewAllBtn = document.getElementById('sidebarViewAllBtn');
    if (sidebarViewAllBtn) {
      sidebarViewAllBtn.addEventListener('click', () => {
        showAllSidebarChats = true;
        renderChatHistory();
      });
    }

    if (chatSearchInput) {
      chatSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.trim() === '') {
          // Reset to normal pagination when search is cleared
          showAllChats = false;
          renderChatListItems();
        } else {
          // Show all chats when searching to ensure complete results
          showAllChats = true;
          renderChatListItems();
          
          // Filter the displayed items
          document.querySelectorAll('.chat-list-item').forEach(item => {
            const title = item.querySelector('.chat-item-title').textContent.toLowerCase();
            const preview = item.querySelector('.chat-item-preview').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || preview.includes(searchTerm)) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });
        }
      });
    }

    // Profile Overlay Menu Toggle
    const profileToggle = document.getElementById('profileToggle');
    const profileOverlayMenu = document.getElementById('profileOverlayMenu');
    
    if (profileToggle && profileOverlayMenu) {
      profileToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        profileOverlayMenu.classList.toggle('active');
      });
    }

    // Profile Menu Item Actions
    const profileMenuItems = document.querySelectorAll('.profile-menu-item');
    profileMenuItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.stopPropagation();
        const action = this.dataset.action;
        
        // Close menu first
        if (profileOverlayMenu) {
          profileOverlayMenu.classList.remove('active');
        }
        
        // Handle different actions
        switch(action) {
          case 'settings':
            alert('Settings functionality coming soon!');
            break;
          case 'language':
            alert('Language selection coming soon!');
            break;
          case 'help':
            alert('Help center coming soon!');
            break;
          case 'upgrade':
            alert('Upgrade plan functionality coming soon!');
            break;
          case 'learn':
            alert('Learn more resources coming soon!');
            break;
          case 'logout':
            if (confirm('Are you sure you want to log out?')) {
              alert('Logout functionality coming soon!');
            }
            break;
        }
      });
    });


    // Share Modal Event Listeners
    if (shareBtn) {
      shareBtn.addEventListener('click', openShareModal);
    }

    if (shareModalClose) {
      shareModalClose.addEventListener('click', closeShareModal);
    }

    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', copyShareLink);
    }

    // Close modal when clicking outside
    if (shareModalOverlay) {
      shareModalOverlay.addEventListener('click', (e) => {
        if (e.target === shareModalOverlay) {
          closeShareModal();
        }
      });
    }

    // Artifact Viewer Event Listeners
    if (expandArtifactBtn) {
      expandArtifactBtn.addEventListener('click', () => {
        if (isArtifactViewerOpen) {
          closeArtifactViewer();
        } else {
          openArtifactViewer();
        }
      });
    }

    if (closeArtifactBtn) {
      closeArtifactBtn.addEventListener('click', closeArtifactViewer);
    }

    // Artifact Actions
    const copyArtifactBtn = document.getElementById('copyArtifactBtn');
    const publishArtifactBtn = document.getElementById('publishArtifactBtn');

    if (copyArtifactBtn) {
      copyArtifactBtn.addEventListener('click', copyArtifactContent);
    }

    if (publishArtifactBtn) {
      publishArtifactBtn.addEventListener('click', publishArtifact);
    }

    // Initialize resize handle
    initResizeHandle();

    // Handle window resize
    window.addEventListener('resize', () => {
      if (isArtifactViewerOpen) {
        updateArtifactViewerWidth();
      }
    });

    // Artifacts Page Event Listeners
    const artifactsSearchInput = document.getElementById('artifactsSearchInput');
    const newArtifactBtn = document.getElementById('newArtifactBtn');

    // Search input
    if (artifactsSearchInput) {
      artifactsSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterArtifacts(searchTerm);
      });
    }

    // New artifact button
    if (newArtifactBtn) {
      newArtifactBtn.addEventListener('click', () => {
        // Redirect to chat interface and start new chat session
        showSection('chat');
        hideChatListPanel();
        addNewChat();
        // Pre-fill the input with artifact creation context
        if (messageInput) {
          messageInput.value = "I'd like to create a new artifact. Please help me build something useful.";
          sendButton.disabled = false;
          autoResizeTextarea();
        }
      });
    }

    // View All button
    const artifactsViewAllBtn = document.getElementById('artifactsViewAllBtn');
    if (artifactsViewAllBtn) {
      artifactsViewAllBtn.addEventListener('click', () => {
        showAllArtifacts = true;
        renderArtifacts();
      });
    }


    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (shareModalOverlay.classList.contains('active')) {
          closeShareModal();
        }
        if (profileOverlayMenu && profileOverlayMenu.classList.contains('active')) {
          profileOverlayMenu.classList.remove('active');
        }
        if (isArtifactViewerOpen) {
          closeArtifactViewer();
        }
      }
    });

    // Close profile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (profileOverlayMenu && !profileToggle.contains(e.target) && !profileOverlayMenu.contains(e.target)) {
        profileOverlayMenu.classList.remove('active');
      }
    });

    // Close project menus when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.project-card-menu')) {
        document.querySelectorAll('.project-menu-dropdown').forEach(dropdown => {
          dropdown.classList.remove('active');
        });
      }
    });
  }

  // Send message functionality
  function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // If no chat is active, create a new one
    if (!currentChatId) {
      const newChatId = Date.now();
      const newChat = {
        id: newChatId,
        title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
        lastMessage: message,
        timestamp: new Date().toISOString()
      };
      chats.unshift(newChat);
      currentChatId = newChatId;
      
      // Update chat title
      updateChatTitle();
      
      renderChatHistory();
      
      // Activate the new chat
      setTimeout(() => {
        const newChatItem = document.querySelector(`[data-chat-id="${newChatId}"]`)?.closest('.chat-item');
        if (newChatItem) newChatItem.classList.add('active');
      }, 100);
    }

    // Add user message
    addMessage("user", message);
    messageInput.value = "";
    sendButton.disabled = true;
    autoResizeTextarea();

    // Show typing indicator
    typingIndicator.classList.add("show");

    // Simulate AI response after a delay
    setTimeout(() => {
      typingIndicator.classList.remove("show");

      const responses = [
        "I'd be happy to help you with that. Let me provide some insights...",
        "That's an interesting question. Here's what I think...",
        "I can assist you with this. Based on your query...",
        "Let me break this down for you...",
        "Here's my response to your question..."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      addMessage("assistant", randomResponse);

      // Update chat last message
      updateChatLastMessage(randomResponse);
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

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    contentDiv.innerHTML = `<p>${content}</p>`;

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Update chat last message
  function updateChatLastMessage(response) {
    if (currentChatId) {
      const chat = chats.find((c) => c.id === currentChatId);
      if (chat) {
        chat.lastMessage = response.substring(0, 50) + (response.length > 50 ? '...' : '');
        chat.timestamp = new Date().toISOString();
        renderChatHistory();
        updateSidebarViewAllButton();
        saveData();
        
        // Re-activate current chat
        setTimeout(() => {
          const currentChatItem = document.querySelector(`[data-chat-id="${currentChatId}"]`)?.closest('.chat-item');
          if (currentChatItem) currentChatItem.classList.add('active');
        }, 100);
      }
    }
  }

  // Auto-resize textarea
  function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 200) + 'px';
  }

  // Initialize the app
  init();
});