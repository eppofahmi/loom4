/**
 * Enhanced Artifacts Feature Plugin
 * Manages artifact viewing with resizable sidebar functionality
 */

import { ResizablePanel } from '../../components/layout/ResizablePanel.js';
import { Modal } from '../../components/ui/Modal.js';
import { storage } from '../../utils/storage.js';
import { formatDate, generateId, copyToClipboard, downloadFile } from '../../utils/helpers.js';

export default class ArtifactsFeature {
  constructor({ eventBus, stateManager, pluginSystem }) {
    this.eventBus = eventBus;
    this.stateManager = stateManager;
    this.pluginSystem = pluginSystem;
    
    this.metadata = {
      name: 'artifacts',
      version: '1.0.0',
      description: 'Enhanced artifact management with resizable viewer',
      author: 'Loom4 Team'
    };

    // DOM elements
    this.artifactsGrid = null;
    this.lastArtifactBtn = null;
    this.artifactPanel = null;

    // Current state
    this.currentArtifact = null;
    this.lastArtifact = null;

    // Bind methods
    this.renderArtifacts = this.renderArtifacts.bind(this);
    this.handleArtifactClick = this.handleArtifactClick.bind(this);
    this.handleLastArtifactClick = this.handleLastArtifactClick.bind(this);
  }

  /**
   * Initialize the artifacts feature
   */
  async init() {
    // Get DOM elements
    this.artifactsGrid = document.getElementById('artifactsGrid');
    this.lastArtifactBtn = document.getElementById('lastArtifactBtn');

    // Create enhanced artifact panel
    this.createArtifactPanel();

    // Load artifacts from storage
    await this.loadArtifacts();

    // Setup event listeners
    this.setupEventListeners();

    // Initial render
    this.renderArtifacts();

    console.log('Enhanced Artifacts feature initialized');
  }

  /**
   * Create the resizable artifact panel
   */
  createArtifactPanel() {
    this.artifactPanel = new ResizablePanel({
      minWidth: 300,
      maxWidth: 900,
      defaultWidth: 500,
      persistKey: 'artifact-panel',
      className: 'artifact-panel',
      smoothTransitions: true
    });

    // Initialize the panel
    this.artifactPanel.init();

    // Set up panel event listeners
    this.setupPanelEventListeners();
  }

  /**
   * Setup panel-specific event listeners
   */
  setupPanelEventListeners() {
    // Listen for panel events
    document.addEventListener('resizable-panel:open', () => {
      this.eventBus.emit('artifact:panel-opened');
    });

    document.addEventListener('resizable-panel:close', () => {
      this.eventBus.emit('artifact:panel-closed');
      this.currentArtifact = null;
    });

    document.addEventListener('resizable-panel:resize', (e) => {
      this.eventBus.emit('artifact:panel-resized', e.detail);
    });
  }

  /**
   * Enable the artifacts feature
   */
  async enable() {
    // Setup navigation
    this.eventBus.on('router:enter', (section) => {
      if (section === 'artifacts') {
        this.renderArtifacts();
      }
    });

    // Setup state watching
    this.stateManager.subscribe('artifacts', this.renderArtifacts);

    // Listen for artifact events
    this.eventBus.on('artifact:view', (artifactId) => this.viewArtifact(artifactId));
    this.eventBus.on('artifact:create', (artifactData) => this.createArtifact(artifactData));

    console.log('Enhanced Artifacts feature enabled');
  }

  /**
   * Disable the artifacts feature
   */
  async disable() {
    // Remove event listeners
    this.eventBus.off('router:enter', this.renderArtifacts);
    this.eventBus.off('artifact:view');
    this.eventBus.off('artifact:create');
    
    // Close and destroy panel
    if (this.artifactPanel) {
      this.artifactPanel.destroy();
    }
    
    console.log('Enhanced Artifacts feature disabled');
  }

  /**
   * Load artifacts from storage
   */
  async loadArtifacts() {
    const savedArtifacts = storage.get('artifacts', []);
    
    // If no saved artifacts, create sample data
    if (savedArtifacts.length === 0) {
      const sampleArtifacts = this.createSampleArtifacts();
      this.stateManager.set('artifacts', sampleArtifacts);
      this.saveArtifacts();
    } else {
      this.stateManager.set('artifacts', savedArtifacts);
    }
  }

  /**
   * Save artifacts to storage
   */
  saveArtifacts() {
    const artifacts = this.stateManager.get('artifacts', []);
    storage.set('artifacts', artifacts);
  }

  /**
   * Create sample artifacts for demonstration
   */
  createSampleArtifacts() {
    return [
      {
        id: generateId('artifact'),
        title: "Homepage HTML",
        type: "html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome Website</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; border-radius: 8px; }
        .content { margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to My Website</h1>
        <p>This is a beautiful homepage created with AI assistance</p>
    </div>
    <div class="content">
        <h2>About Us</h2>
        <p>We are a modern company focused on innovative solutions.</p>
    </div>
</body>
</html>`,
        preview: "Modern homepage with header and content sections",
        createdAt: new Date().toISOString(),
        size: "2.1 KB"
      },
      {
        id: generateId('artifact'),
        title: "Responsive CSS Grid",
        type: "css",
        content: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.grid-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.grid-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .grid-item {
    padding: 20px;
  }
}`,
        preview: "Responsive CSS grid layout with hover effects",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        size: "1.8 KB"
      },
      {
        id: generateId('artifact'),
        title: "React Component",
        type: "javascript",
        content: `import React, { useState, useEffect } from 'react';

const UserDashboard = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(\`/api/users/\${userId}\`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading user data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!user) {
    return <div className="no-data">No user data found</div>;
  }

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {user.name}!</h1>
        <p>{user.email}</p>
      </header>
      
      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Projects</h3>
            <p>{user.projectCount || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Tasks</h3>
            <p>{user.taskCount || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;`,
        preview: "React component for user dashboard with loading states",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        size: "3.2 KB"
      },
      {
        id: generateId('artifact'),
        title: "API Documentation",
        type: "markdown",
        content: `# User Management API

## Overview
This API provides endpoints for managing user accounts, authentication, and user data.

## Base URL
\`https://api.example.com/v1\`

## Authentication
All endpoints require a valid API key passed in the \`Authorization\` header:

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Endpoints

### GET /users
Retrieve a list of users.

**Parameters:**
- \`page\` (optional): Page number (default: 1)
- \`limit\` (optional): Items per page (default: 20)
- \`search\` (optional): Search query

**Response:**
\`\`\`json
{
  "users": [
    {
      "id": "123",
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2023-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
\`\`\`

### POST /users
Create a new user account.

**Request Body:**
\`\`\`json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secure_password"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "124",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "created_at": "2023-01-01T00:00:00Z"
}
\`\`\`

### GET /users/{id}
Retrieve a specific user by ID.

**Response:**
\`\`\`json
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2023-01-01T00:00:00Z",
  "last_login": "2023-01-15T10:30:00Z"
}
\`\`\`

## Error Handling

All errors return a consistent format:

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {}
  }
}
\`\`\`

## Rate Limiting

API requests are limited to 1000 requests per hour per API key.`,
        preview: "Complete API documentation with examples and error handling",
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        size: "4.1 KB"
      }
    ];
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Last artifact button
    if (this.lastArtifactBtn) {
      this.lastArtifactBtn.addEventListener('click', this.handleLastArtifactClick);
    }
  }

  /**
   * Handle last artifact button click
   */
  handleLastArtifactClick() {
    if (this.lastArtifact) {
      this.viewArtifact(this.lastArtifact.id);
    } else {
      this.eventBus.emit('notification:show', {
        message: 'No recent artifacts to display',
        type: 'info'
      });
    }
  }

  /**
   * View artifact in the resizable panel
   */
  viewArtifact(artifactId) {
    const artifacts = this.stateManager.get('artifacts', []);
    const artifact = artifacts.find(a => a.id === artifactId);
    
    if (!artifact) {
      this.eventBus.emit('notification:show', {
        message: 'Artifact not found',
        type: 'error'
      });
      return;
    }

    this.currentArtifact = artifact;
    this.lastArtifact = artifact;

    // Set panel title and content
    this.artifactPanel.setTitle(artifact.title, `${artifact.type.toUpperCase()} • ${artifact.size || 'Unknown size'}`);
    this.artifactPanel.setContent(this.renderArtifactContent(artifact));

    // Open the panel
    this.artifactPanel.open();

    // Update last artifact button state
    this.updateLastArtifactButton();
  }

  /**
   * Render artifact content based on type
   */
  renderArtifactContent(artifact) {
    const container = document.createElement('div');
    container.className = 'artifact-content-container';

    // Add artifact actions toolbar
    const toolbar = this.createArtifactToolbar(artifact);
    container.appendChild(toolbar);

    // Add main content based on type
    const contentArea = document.createElement('div');
    contentArea.className = 'artifact-main-content';
    
    switch (artifact.type) {
      case 'html':
        contentArea.appendChild(this.renderHTMLContent(artifact));
        break;
      case 'css':
        contentArea.appendChild(this.renderCSSContent(artifact));
        break;
      case 'javascript':
        contentArea.appendChild(this.renderJavaScriptContent(artifact));
        break;
      case 'markdown':
        contentArea.appendChild(this.renderMarkdownContent(artifact));
        break;
      default:
        contentArea.appendChild(this.renderTextContent(artifact));
    }

    container.appendChild(contentArea);
    return container;
  }

  /**
   * Create artifact actions toolbar
   */
  createArtifactToolbar(artifact) {
    const toolbar = document.createElement('div');
    toolbar.className = 'artifact-toolbar';
    toolbar.innerHTML = `
      <div class="artifact-meta">
        <span class="artifact-created">Created ${formatDate(artifact.createdAt)}</span>
        <span class="artifact-size">${artifact.size || 'Unknown size'}</span>
      </div>
      <div class="artifact-actions">
        <button class="artifact-action-btn" data-action="copy" title="Copy to clipboard">
          <i class="fas fa-copy"></i>
        </button>
        <button class="artifact-action-btn" data-action="download" title="Download file">
          <i class="fas fa-download"></i>
        </button>
        <button class="artifact-action-btn" data-action="fullscreen" title="View fullscreen">
          <i class="fas fa-expand"></i>
        </button>
        <button class="artifact-action-btn" data-action="share" title="Share artifact">
          <i class="fas fa-share-alt"></i>
        </button>
      </div>
    `;

    // Setup toolbar event listeners
    this.setupToolbarEventListeners(toolbar, artifact);

    return toolbar;
  }

  /**
   * Setup toolbar event listeners
   */
  setupToolbarEventListeners(toolbar, artifact) {
    const actionButtons = toolbar.querySelectorAll('.artifact-action-btn');
    
    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const action = button.dataset.action;
        this.handleArtifactAction(action, artifact);
      });
    });
  }

  /**
   * Handle artifact actions
   */
  async handleArtifactAction(action, artifact) {
    switch (action) {
      case 'copy':
        const success = await copyToClipboard(artifact.content);
        this.eventBus.emit('notification:show', {
          message: success ? 'Copied to clipboard' : 'Failed to copy',
          type: success ? 'success' : 'error'
        });
        break;
        
      case 'download':
        const filename = `${artifact.title.replace(/[^a-z0-9]/gi, '_')}.${this.getFileExtension(artifact.type)}`;
        downloadFile(artifact.content, filename, this.getMimeType(artifact.type));
        break;
        
      case 'fullscreen':
        this.showFullscreenArtifact(artifact);
        break;
        
      case 'share':
        this.showShareModal(artifact);
        break;
    }
  }

  /**
   * Get file extension for artifact type
   */
  getFileExtension(type) {
    const extensions = {
      html: 'html',
      css: 'css',
      javascript: 'js',
      markdown: 'md',
      text: 'txt'
    };
    return extensions[type] || 'txt';
  }

  /**
   * Get MIME type for artifact type
   */
  getMimeType(type) {
    const mimeTypes = {
      html: 'text/html',
      css: 'text/css',
      javascript: 'text/javascript',
      markdown: 'text/markdown',
      text: 'text/plain'
    };
    return mimeTypes[type] || 'text/plain';
  }

  /**
   * Render HTML content
   */
  renderHTMLContent(artifact) {
    const container = document.createElement('div');
    container.className = 'html-content';
    
    // Create tabs for code and preview
    container.innerHTML = `
      <div class="content-tabs">
        <button class="tab-btn active" data-tab="preview">Preview</button>
        <button class="tab-btn" data-tab="code">Code</button>
      </div>
      <div class="tab-content preview-tab active">
        <iframe class="html-preview" srcdoc="${this.escapeHtml(artifact.content)}"></iframe>
      </div>
      <div class="tab-content code-tab">
        <pre class="code-content"><code>${this.escapeHtml(artifact.content)}</code></pre>
      </div>
    `;

    this.setupTabSwitching(container);
    return container;
  }

  /**
   * Render CSS content
   */
  renderCSSContent(artifact) {
    const container = document.createElement('div');
    container.className = 'css-content';
    container.innerHTML = `
      <pre class="code-content css-code"><code>${this.escapeHtml(artifact.content)}</code></pre>
    `;
    return container;
  }

  /**
   * Render JavaScript content
   */
  renderJavaScriptContent(artifact) {
    const container = document.createElement('div');
    container.className = 'javascript-content';
    container.innerHTML = `
      <pre class="code-content js-code"><code>${this.escapeHtml(artifact.content)}</code></pre>
    `;
    return container;
  }

  /**
   * Render Markdown content
   */
  renderMarkdownContent(artifact) {
    const container = document.createElement('div');
    container.className = 'markdown-content';
    
    // Simple markdown to HTML conversion (in production, use a proper markdown parser)
    let htmlContent = artifact.content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');

    container.innerHTML = `
      <div class="content-tabs">
        <button class="tab-btn active" data-tab="rendered">Rendered</button>
        <button class="tab-btn" data-tab="source">Source</button>
      </div>
      <div class="tab-content rendered-tab active">
        <div class="markdown-rendered">${htmlContent}</div>
      </div>
      <div class="tab-content source-tab">
        <pre class="code-content"><code>${this.escapeHtml(artifact.content)}</code></pre>
      </div>
    `;

    this.setupTabSwitching(container);
    return container;
  }

  /**
   * Render plain text content
   */
  renderTextContent(artifact) {
    const container = document.createElement('div');
    container.className = 'text-content';
    container.innerHTML = `
      <pre class="text-display">${this.escapeHtml(artifact.content)}</pre>
    `;
    return container;
  }

  /**
   * Setup tab switching functionality
   */
  setupTabSwitching(container) {
    const tabButtons = container.querySelectorAll('.tab-btn');
    const tabContents = container.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabName = button.dataset.tab;
        
        // Update active tab button
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update active tab content
        tabContents.forEach(content => content.classList.remove('active'));
        const targetContent = container.querySelector(`.${tabName}-tab`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }

  /**
   * Show fullscreen artifact modal
   */
  showFullscreenArtifact(artifact) {
    const content = this.renderArtifactContent(artifact);
    content.classList.add('fullscreen-artifact');
    
    const modal = new Modal({
      title: artifact.title,
      content: content.outerHTML,
      size: 'full',
      className: 'artifact-fullscreen-modal'
    });

    modal.show();
  }

  /**
   * Show share modal
   */
  showShareModal(artifact) {
    Modal.prompt('Share URL', `${window.location.origin}/artifact/${artifact.id}`, {
      title: 'Share Artifact',
      buttons: [
        { text: 'Copy Link', action: 'confirm', variant: 'primary' },
        { text: 'Cancel', action: 'cancel', variant: 'secondary' }
      ]
    }).then(url => {
      if (url) {
        copyToClipboard(url).then(success => {
          this.eventBus.emit('notification:show', {
            message: success ? 'Share link copied!' : 'Failed to copy link',
            type: success ? 'success' : 'error'
          });
        });
      }
    });
  }

  /**
   * Escape HTML for safe rendering
   */
  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Update last artifact button state
   */
  updateLastArtifactButton() {
    if (this.lastArtifactBtn) {
      this.lastArtifactBtn.disabled = !this.lastArtifact;
      this.lastArtifactBtn.title = this.lastArtifact 
        ? `Open ${this.lastArtifact.title}` 
        : 'No recent artifacts';
    }
  }

  /**
   * Create a new artifact
   */
  createArtifact(artifactData) {
    const artifact = {
      id: generateId('artifact'),
      title: artifactData.title || 'Untitled Artifact',
      type: artifactData.type || 'text',
      content: artifactData.content || '',
      preview: artifactData.preview || '',
      createdAt: new Date().toISOString(),
      size: this.calculateSize(artifactData.content || '')
    };

    const artifacts = this.stateManager.get('artifacts', []);
    artifacts.unshift(artifact);
    this.stateManager.set('artifacts', artifacts);
    this.saveArtifacts();

    // Automatically view the new artifact
    this.viewArtifact(artifact.id);

    this.eventBus.emit('notification:show', {
      message: 'Artifact created successfully',
      type: 'success'
    });
  }

  /**
   * Calculate content size
   */
  calculateSize(content) {
    const bytes = new Blob([content]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /**
   * Render artifacts grid
   */
  renderArtifacts() {
    if (!this.artifactsGrid) return;

    const artifacts = this.stateManager.get('artifacts', []);
    
    if (artifacts.length === 0) {
      this.artifactsGrid.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-cube"></i>
          <h3>No Artifacts Yet</h3>
          <p>Artifacts will appear here as you create them in chats</p>
        </div>
      `;
      return;
    }

    this.artifactsGrid.innerHTML = '';
    
    artifacts.forEach(artifact => {
      const artifactCard = this.createArtifactCard(artifact);
      this.artifactsGrid.appendChild(artifactCard);
    });
  }

  /**
   * Create artifact card element
   */
  createArtifactCard(artifact) {
    const card = document.createElement('div');
    card.className = 'artifact-card';
    card.innerHTML = `
      <div class="artifact-card-header">
        <div class="artifact-card-title">${artifact.title}</div>
        <div class="artifact-card-type">${artifact.type.toUpperCase()}</div>
      </div>
      <div class="artifact-card-preview">${artifact.preview}</div>
      <div class="artifact-card-meta">
        <span class="artifact-date">${formatDate(artifact.createdAt)}</span>
        <span class="artifact-size">${artifact.size}</span>
      </div>
    `;

    // Add click listener
    card.addEventListener('click', () => {
      this.viewArtifact(artifact.id);
    });

    return card;
  }

  /**
   * Update plugin configuration
   */
  updateConfig(config) {
    console.log('Enhanced Artifacts plugin config updated:', config);
  }

  /**
   * Destroy the plugin
   */
  destroy() {
    // Clean up event listeners
    if (this.lastArtifactBtn) {
      this.lastArtifactBtn.removeEventListener('click', this.handleLastArtifactClick);
    }

    // Destroy artifact panel
    if (this.artifactPanel) {
      this.artifactPanel.destroy();
    }

    console.log('Enhanced Artifacts feature destroyed');
  }
}