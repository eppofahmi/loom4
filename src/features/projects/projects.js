/**
 * Projects Feature Plugin
 * Manages project creation, editing, and navigation
 */

import { Modal } from '../../components/ui/Modal.js';
import { storage } from '../../utils/storage.js';
import { formatDate, generateId } from '../../utils/helpers.js';

export default class ProjectsFeature {
  constructor({ eventBus, stateManager, pluginSystem }) {
    this.eventBus = eventBus;
    this.stateManager = stateManager;
    this.pluginSystem = pluginSystem;
    
    this.metadata = {
      name: 'projects',
      version: '1.0.0',
      description: 'Project management feature',
      author: 'Loom4 Team'
    };

    // DOM elements
    this.projectsGrid = null;
    this.addProjectBtn = null;
    this.projectModal = null;

    // Bind methods
    this.renderProjects = this.renderProjects.bind(this);
    this.handleAddProject = this.handleAddProject.bind(this);
    this.handleProjectAction = this.handleProjectAction.bind(this);
  }

  /**
   * Initialize the projects feature
   */
  async init() {
    // Get DOM elements
    this.projectsGrid = document.getElementById('projectsGrid');
    this.addProjectBtn = document.getElementById('addProjectBtn');

    if (!this.projectsGrid || !this.addProjectBtn) {
      console.error('Projects feature: Required DOM elements not found');
      return;
    }

    // Load projects from storage
    await this.loadProjects();

    // Setup event listeners
    this.setupEventListeners();

    // Initial render
    this.renderProjects();

    console.log('Projects feature initialized');
  }

  /**
   * Enable the projects feature
   */
  async enable() {
    // Setup navigation
    this.eventBus.on('router:enter', (section) => {
      if (section === 'projects') {
        this.renderProjects();
      }
    });

    // Setup state watching
    this.stateManager.subscribe('projects', this.renderProjects);

    console.log('Projects feature enabled');
  }

  /**
   * Disable the projects feature
   */
  async disable() {
    // Remove event listeners
    this.eventBus.off('router:enter', this.renderProjects);
    
    console.log('Projects feature disabled');
  }

  /**
   * Load projects from storage
   */
  async loadProjects() {
    const savedProjects = storage.get('projects', []);
    
    // If no saved projects, create sample data
    if (savedProjects.length === 0) {
      const sampleProjects = this.createSampleProjects();
      this.stateManager.set('projects', sampleProjects);
      this.saveProjects();
    } else {
      this.stateManager.set('projects', savedProjects);
    }
  }

  /**
   * Save projects to storage
   */
  saveProjects() {
    const projects = this.stateManager.get('projects', []);
    storage.set('projects', projects);
  }

  /**
   * Create sample projects for demonstration
   */
  createSampleProjects() {
    return [
      {
        id: generateId('project'),
        title: "Website Redesign",
        description: "Complete redesign of company website with modern UI/UX",
        status: "active",
        lastActive: "2023-05-15",
        knowledgeBase: "web-design-kb",
        createdAt: new Date().toISOString()
      },
      {
        id: generateId('project'),
        title: "Mobile App Development",
        description: "Building a cross-platform mobile app for iOS and Android",
        status: "active",
        lastActive: "2023-05-10",
        knowledgeBase: "mobile-dev-kb",
        createdAt: new Date().toISOString()
      },
      {
        id: generateId('project'),
        title: "Marketing Campaign",
        description: "Q3 marketing campaign for new product launch",
        status: "planned",
        lastActive: "",
        knowledgeBase: "marketing-kb",
        createdAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    if (this.addProjectBtn) {
      this.addProjectBtn.addEventListener('click', this.handleAddProject);
    }
  }

  /**
   * Handle add project button click
   */
  handleAddProject() {
    this.showProjectModal();
  }

  /**
   * Show project creation/edit modal
   */
  showProjectModal(project = null) {
    const isEdit = !!project;
    const title = isEdit ? 'Edit Project' : 'Create New Project';

    const content = `
      <form id="projectForm" class="project-form">
        <div class="form-group">
          <label for="projectName">Project Name *</label>
          <input type="text" id="projectName" name="name" required 
                 value="${project ? project.title : ''}"
                 placeholder="e.g. Marketing Campaign">
        </div>
        
        <div class="form-group">
          <label for="projectDescription">Description</label>
          <textarea id="projectDescription" name="description" rows="3"
                    placeholder="Brief project description">${project ? project.description : ''}</textarea>
        </div>
        
        <div class="form-group">
          <label for="projectInstructions">Instructions</label>
          <textarea id="projectInstructions" name="instructions" rows="4"
                    placeholder="Specific guidelines for this project">${project ? project.instructions || '' : ''}</textarea>
        </div>
        
        <div class="form-group">
          <label>Knowledge Base</label>
          <div class="knowledge-options">
            <div class="option-card ${!project || !project.knowledgeBase ? 'active' : ''}" data-kb-type="new">
              <i class="fas fa-plus"></i>
              <span>Create New</span>
            </div>
            <div class="option-card ${project && project.knowledgeBase ? 'active' : ''}" data-kb-type="existing">
              <i class="fas fa-link"></i>
              <span>Use Existing</span>
            </div>
          </div>
          <select id="existingKnowledge" class="form-control ${!project || !project.knowledgeBase ? 'hidden' : ''}">
            <option value="">Select knowledge base</option>
            <option value="web-design-kb" ${project && project.knowledgeBase === 'web-design-kb' ? 'selected' : ''}>Web Design KB</option>
            <option value="mobile-dev-kb" ${project && project.knowledgeBase === 'mobile-dev-kb' ? 'selected' : ''}>Mobile Dev KB</option>
            <option value="marketing-kb" ${project && project.knowledgeBase === 'marketing-kb' ? 'selected' : ''}>Marketing KB</option>
          </select>
        </div>
      </form>
    `;

    this.projectModal = new Modal({
      title,
      content,
      size: 'medium',
      buttons: [
        {
          text: 'Cancel',
          action: 'cancel',
          variant: 'secondary'
        },
        {
          text: isEdit ? 'Update Project' : 'Create Project',
          action: 'confirm',
          variant: 'primary'
        }
      ],
      onShow: () => this.setupModalEventListeners(),
      onConfirm: () => this.handleProjectSubmit(project)
    });

    this.projectModal.show();
  }

  /**
   * Setup modal event listeners
   */
  setupModalEventListeners() {
    const modal = this.projectModal.getElement();
    
    // Knowledge base selection
    const optionCards = modal.querySelectorAll('.option-card');
    const existingSelect = modal.querySelector('#existingKnowledge');

    optionCards.forEach(card => {
      card.addEventListener('click', () => {
        optionCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        if (card.dataset.kbType === 'existing') {
          existingSelect.classList.remove('hidden');
        } else {
          existingSelect.classList.add('hidden');
        }
      });
    });
  }

  /**
   * Handle project form submission
   */
  handleProjectSubmit(existingProject) {
    const form = document.getElementById('projectForm');
    const formData = new FormData(form);
    
    const name = formData.get('name').trim();
    const description = formData.get('description').trim();
    const instructions = formData.get('instructions').trim();

    if (!name) {
      alert('Please enter a project name');
      return false;
    }

    // Determine knowledge base
    const kbType = form.querySelector('.option-card.active').dataset.kbType;
    let knowledgeBase = null;
    
    if (kbType === 'existing') {
      knowledgeBase = form.querySelector('#existingKnowledge').value;
    } else {
      knowledgeBase = generateId('kb');
    }

    const projectData = {
      id: existingProject ? existingProject.id : generateId('project'),
      title: name,
      description: description || "No description provided",
      instructions: instructions || "",
      status: existingProject ? existingProject.status : "active",
      lastActive: new Date().toISOString().split('T')[0],
      knowledgeBase,
      createdAt: existingProject ? existingProject.createdAt : new Date().toISOString()
    };

    if (existingProject) {
      this.updateProject(projectData);
    } else {
      this.createProject(projectData);
    }

    return true; // Allow modal to close
  }

  /**
   * Create a new project
   */
  createProject(projectData) {
    const projects = this.stateManager.get('projects', []);
    projects.unshift(projectData);
    this.stateManager.set('projects', projects);
    this.saveProjects();

    this.eventBus.emit('notification:show', {
      message: 'Project created successfully',
      type: 'success'
    });
  }

  /**
   * Update an existing project
   */
  updateProject(projectData) {
    const projects = this.stateManager.get('projects', []);
    const index = projects.findIndex(p => p.id === projectData.id);
    
    if (index !== -1) {
      projects[index] = projectData;
      this.stateManager.set('projects', projects);
      this.saveProjects();

      this.eventBus.emit('notification:show', {
        message: 'Project updated successfully',
        type: 'success'
      });
    }
  }

  /**
   * Delete a project
   */
  deleteProject(projectId) {
    const projects = this.stateManager.get('projects', []);
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return;

    Modal.confirm({
      title: 'Delete Project',
      content: `Are you sure you want to delete "${project.title}"? This action cannot be undone.`,
      buttons: [
        { text: 'Cancel', action: 'cancel', variant: 'secondary' },
        { text: 'Delete', action: 'confirm', variant: 'danger' }
      ]
    }).then(confirmed => {
      if (confirmed) {
        const newProjects = projects.filter(p => p.id !== projectId);
        this.stateManager.set('projects', newProjects);
        this.saveProjects();

        this.eventBus.emit('notification:show', {
          message: 'Project deleted successfully',
          type: 'success'
        });
      }
    });
  }

  /**
   * Start a chat for a project
   */
  startProjectChat(projectId) {
    const project = this.stateManager.get('projects', []).find(p => p.id === projectId);
    if (!project) return;

    // Create new chat with project context
    const chatData = {
      id: generateId('chat'),
      projectId: project.id,
      title: `Chat: ${project.title}`,
      lastMessage: "New chat started",
      timestamp: new Date().toISOString(),
      knowledgeBase: project.knowledgeBase
    };

    // Add to chats
    const chats = this.stateManager.get('chats', []);
    chats.unshift(chatData);
    this.stateManager.set('chats', chats);

    // Navigate to chat
    this.eventBus.emit('router:navigate', 'active-chat');
    this.eventBus.emit('chat:open', chatData.id);

    this.eventBus.emit('notification:show', {
      message: `Chat started for project: ${project.title}`,
      type: 'success'
    });
  }

  /**
   * Handle project card actions
   */
  handleProjectAction(action, projectId) {
    switch (action) {
      case 'edit':
        const project = this.stateManager.get('projects', []).find(p => p.id === projectId);
        if (project) {
          this.showProjectModal(project);
        }
        break;
        
      case 'delete':
        this.deleteProject(projectId);
        break;
        
      case 'start-chat':
        this.startProjectChat(projectId);
        break;
        
      case 'duplicate':
        this.duplicateProject(projectId);
        break;
    }
  }

  /**
   * Duplicate a project
   */
  duplicateProject(projectId) {
    const projects = this.stateManager.get('projects', []);
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      const duplicatedProject = {
        ...project,
        id: generateId('project'),
        title: `${project.title} (Copy)`,
        createdAt: new Date().toISOString(),
        lastActive: ""
      };

      this.createProject(duplicatedProject);
    }
  }

  /**
   * Format project status for display
   */
  formatStatus(status) {
    const statusMap = {
      active: "Active",
      planned: "Planned",
      completed: "Completed",
      paused: "Paused"
    };
    return statusMap[status] || status;
  }

  /**
   * Render projects grid
   */
  renderProjects() {
    if (!this.projectsGrid) return;

    const projects = this.stateManager.get('projects', []);
    
    if (projects.length === 0) {
      this.projectsGrid.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-folder-open"></i>
          <h3>No Projects Yet</h3>
          <p>Create your first project to get started</p>
          <button class="btn btn-primary" onclick="this.closest('.empty-state').parentElement.querySelector('#addProjectBtn').click()">
            <i class="fas fa-plus"></i> Create Project
          </button>
        </div>
      `;
      return;
    }

    this.projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
      const projectCard = this.createProjectCard(project);
      this.projectsGrid.appendChild(projectCard);
    });
  }

  /**
   * Create a project card element
   */
  createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-card-header">
        <div class="project-card-title">${project.title}</div>
        <div class="project-card-status ${project.status}">${this.formatStatus(project.status)}</div>
      </div>
      <div class="project-card-description">${project.description}</div>
      <div class="project-meta">
        ${project.lastActive ? `<span class="last-active">Last active: ${formatDate(project.lastActive)}</span>` : ""}
      </div>
      <div class="project-actions">
        <button class="project-action-btn" data-action="start-chat" title="Start Chat">
          <i class="fas fa-comment"></i> Start Chat
        </button>
        <div class="project-menu">
          <button class="project-menu-btn" title="More actions">
            <i class="fas fa-ellipsis-v"></i>
          </button>
          <div class="project-menu-dropdown">
            <button data-action="edit"><i class="fas fa-edit"></i> Edit</button>
            <button data-action="duplicate"><i class="fas fa-copy"></i> Duplicate</button>
            <button data-action="delete" class="danger"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </div>
      </div>
    `;

    // Setup event listeners for project actions
    const actionButtons = card.querySelectorAll('[data-action]');
    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = button.dataset.action;
        this.handleProjectAction(action, project.id);
      });
    });

    // Setup menu toggle
    const menuBtn = card.querySelector('.project-menu-btn');
    const menuDropdown = card.querySelector('.project-menu-dropdown');
    
    if (menuBtn && menuDropdown) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuDropdown.classList.toggle('show');
      });

      // Close menu when clicking outside
      document.addEventListener('click', () => {
        menuDropdown.classList.remove('show');
      });
    }

    return card;
  }

  /**
   * Update plugin configuration
   */
  updateConfig(config) {
    // Handle configuration updates
    console.log('Projects plugin config updated:', config);
  }

  /**
   * Destroy the plugin
   */
  destroy() {
    // Clean up event listeners and DOM
    if (this.addProjectBtn) {
      this.addProjectBtn.removeEventListener('click', this.handleAddProject);
    }

    if (this.projectModal) {
      this.projectModal.destroy();
    }

    console.log('Projects feature destroyed');
  }
}