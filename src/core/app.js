/**
 * Main Application Entry Point
 * Initializes all core systems and manages application lifecycle
 */

import { StateManager } from './state-manager.js';
import { Router } from './router.js';
import { EventBus } from './event-bus.js';
import { PluginSystem } from '../plugins/plugin-system.js';
import { Sidebar } from '../components/layout/Sidebar.js';
import { MainContent } from '../components/layout/MainContent.js';

class LoomApp {
  constructor() {
    this.stateManager = new StateManager();
    this.eventBus = new EventBus();
    this.router = new Router(this.eventBus);
    this.pluginSystem = new PluginSystem(this.eventBus, this.stateManager);
    
    this.components = new Map();
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    try {
      // Initialize core systems
      await this.initializeCore();
      
      // Initialize layout components
      await this.initializeLayout();
      
      // Load and initialize plugins
      await this.loadPlugins();
      
      // Setup global event listeners
      this.setupGlobalListeners();
      
      // Start the router
      this.router.start();
      
      this.isInitialized = true;
      this.eventBus.emit('app:initialized');
      
      console.log('Loom4 application initialized successfully');
    } catch (error) {
      console.error('Failed to initialize application:', error);
      this.eventBus.emit('app:error', error);
    }
  }

  async initializeCore() {
    // Initialize state manager
    await this.stateManager.init();
    
    // Load saved application state
    await this.loadApplicationState();
  }

  async initializeLayout() {
    // Initialize sidebar
    const sidebar = new Sidebar(this.eventBus, this.stateManager);
    this.components.set('sidebar', sidebar);
    await sidebar.init();

    // Initialize main content area
    const mainContent = new MainContent(this.eventBus, this.stateManager);
    this.components.set('mainContent', mainContent);
    await mainContent.init();
  }

  async loadPlugins() {
    // Load core feature plugins
    const corePlugins = [
      'projects',
      'chat', 
      'knowledge',
      'artifacts'
    ];

    for (const pluginName of corePlugins) {
      try {
        await this.pluginSystem.loadPlugin(pluginName, { core: true });
      } catch (error) {
        console.warn(`Failed to load core plugin ${pluginName}:`, error);
      }
    }

    // Load optional micro SaaS plugins based on configuration
    const optionalPlugins = this.stateManager.get('app.enabledPlugins', []);
    for (const pluginName of optionalPlugins) {
      try {
        await this.pluginSystem.loadPlugin(pluginName);
      } catch (error) {
        console.warn(`Failed to load plugin ${pluginName}:`, error);
      }
    }
  }

  async loadApplicationState() {
    // Load user preferences
    const savedTheme = localStorage.getItem('loom4_theme') || 'light';
    this.stateManager.set('app.theme', savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Load sidebar state
    const sidebarCollapsed = localStorage.getItem('loom4_sidebar_collapsed') === 'true';
    this.stateManager.set('app.sidebarCollapsed', sidebarCollapsed);

    // Load user data
    const userData = this.loadFromStorage('loom4_user_data');
    if (userData) {
      this.stateManager.set('user', userData);
    }

    // Initialize sample data if needed
    await this.initializeSampleData();
    
    // Force initial render of projects (since it's the default section)
    setTimeout(() => {
      this.eventBus.emit('router:enter', 'projects');
    }, 100);
  }

  /**
   * Initialize sample data for demo purposes
   */
  async initializeSampleData() {
    // Check if we need to create sample data
    const hasProjects = this.loadFromStorage('loom4_projects');
    const hasChats = this.loadFromStorage('loom4_chats');
    const hasArtifacts = this.loadFromStorage('loom4_artifacts');

    // Create sample data if none exists
    if (!hasProjects || hasProjects.length === 0) {
      const sampleProjects = this.createSampleProjects();
      localStorage.setItem('loom4_projects', JSON.stringify(sampleProjects));
      this.stateManager.set('projects', sampleProjects);
    }

    if (!hasChats || hasChats.length === 0) {
      const sampleChats = this.createSampleChats();
      localStorage.setItem('loom4_chats', JSON.stringify(sampleChats));
      this.stateManager.set('chats', sampleChats);
    }

    if (!hasArtifacts || hasArtifacts.length === 0) {
      const sampleArtifacts = this.createSampleArtifacts();
      localStorage.setItem('loom4_artifacts', JSON.stringify(sampleArtifacts));
      this.stateManager.set('artifacts', sampleArtifacts);
    }
  }

  /**
   * Create sample projects
   */
  createSampleProjects() {
    return [
      {
        id: Date.now() + 1,
        title: "Website Redesign",
        description: "Complete redesign of company website with modern UI/UX",
        status: "active",
        lastActive: "2023-05-15",
        knowledgeBase: "web-design-kb",
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() + 2,
        title: "Mobile App Development",
        description: "Building a cross-platform mobile app for iOS and Android",
        status: "active",
        lastActive: "2023-05-10",
        knowledgeBase: "mobile-dev-kb",
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() + 3,
        title: "Marketing Campaign",
        description: "Q3 marketing campaign for new product launch",
        status: "planned",
        lastActive: "",
        knowledgeBase: "marketing-kb",
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() + 4,
        title: "API Integration",
        description: "Integrating third-party APIs for payment processing",
        status: "completed",
        lastActive: "2023-04-28",
        knowledgeBase: "api-integration-kb",
        createdAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Create sample chats
   */
  createSampleChats() {
    return [
      {
        id: Date.now() + 10,
        title: "Website content ideas",
        lastMessage: "Can you suggest some content for our homepage?",
        timestamp: new Date(Date.now() - 60000).toISOString(),
        projectId: null,
        messages: []
      },
      {
        id: Date.now() + 11,
        title: "Code review help",
        lastMessage: "I need help reviewing this React component",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        projectId: null,
        messages: []
      },
      {
        id: Date.now() + 12,
        title: "Meeting notes summary",
        lastMessage: "Summary of yesterday's strategy meeting",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        projectId: null,
        messages: []
      },
      {
        id: Date.now() + 13,
        title: "Design system discussion",
        lastMessage: "Let's talk about our design tokens",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        projectId: Date.now() + 1,
        messages: []
      }
    ];
  }

  /**
   * Create sample artifacts
   */
  createSampleArtifacts() {
    return [
      {
        id: Date.now() + 20,
        title: "Homepage HTML",
        type: "html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome Website</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .header { 
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            padding: 40px; 
            border-radius: 20px; 
            text-align: center;
            margin-bottom: 40px;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .header h1 {
            font-size: 3rem;
            margin: 0 0 20px 0;
            font-weight: 700;
        }
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
            margin: 0;
        }
        .content { 
            background: rgba(255,255,255,0.95);
            color: #333;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .content h2 {
            color: #667eea;
            font-size: 2rem;
            margin-bottom: 20px;
        }
        .content p {
            line-height: 1.6;
            font-size: 1.1rem;
        }
        .cta {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
            transition: transform 0.2s;
        }
        .cta:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to My Website</h1>
            <p>This is a beautiful homepage created with AI assistance</p>
        </div>
        <div class="content">
            <h2>About Our Company</h2>
            <p>We are a modern company focused on innovative solutions that help businesses grow and succeed in today's digital landscape. Our team combines creativity with technical expertise to deliver exceptional results.</p>
            <button class="cta">Get Started Today</button>
        </div>
    </div>
</body>
</html>`,
        preview: "Modern homepage with gradient design and glass morphism effects",
        createdAt: new Date().toISOString(),
        size: "2.8 KB"
      },
      {
        id: Date.now() + 21,
        title: "Responsive CSS Grid",
        type: "css",
        content: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8fafc;
  min-height: 100vh;
}

.grid-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.grid-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.grid-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.grid-item h3 {
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 16px;
  font-weight: 600;
}

.grid-item p {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 20px;
}

.grid-item .tag {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    padding: 16px;
    gap: 16px;
  }
  
  .grid-item {
    padding: 20px;
  }
  
  .grid-item h3 {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .grid-container {
    padding: 12px;
  }
  
  .grid-item {
    padding: 16px;
  }
}`,
        preview: "Modern responsive CSS grid layout with hover effects and mobile optimization",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        size: "2.1 KB"
      },
      {
        id: Date.now() + 22,
        title: "React Dashboard Component",
        type: "javascript",
        content: `import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UserDashboard = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user details
        const userResponse = await fetch(\`/api/users/\${userId}\`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        setUser(userData);
        
        // Fetch user statistics
        const statsResponse = await fetch(\`/api/users/\${userId}/stats\`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
        
      } catch (err) {
        setError(err.message);
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleRefresh = async () => {
    await fetchUserData();
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button onClick={handleRefresh} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-empty">
        <h3>No user data found</h3>
        <p>Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <div className="user-info">
          <img 
            src={user.avatar || '/default-avatar.png'} 
            alt={user.name}
            className="user-avatar"
          />
          <div>
            <h1>Welcome back, {user.name}!</h1>
            <p className="user-email">{user.email}</p>
            <span className="user-badge">{user.plan || 'Free'} Plan</span>
          </div>
        </div>
        <button onClick={handleRefresh} className="refresh-btn">
          <RefreshIcon />
          Refresh
        </button>
      </header>
      
      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Projects</h3>
            <p className="stat-number">{user.projectCount || 0}</p>
            <span className="stat-change positive">+12% this month</span>
          </div>
          <div className="stat-card">
            <h3>Tasks Completed</h3>
            <p className="stat-number">{user.taskCount || 0}</p>
            <span className="stat-change positive">+5% this week</span>
          </div>
          <div className="stat-card">
            <h3>Time Saved</h3>
            <p className="stat-number">{user.timeSaved || '0h'}</p>
            <span className="stat-change neutral">Same as last week</span>
          </div>
        </div>
        
        {stats.length > 0 && (
          <div className="chart-container">
            <h3>Activity Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="activity" 
                  stroke="#667eea" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
  </svg>
);

export default UserDashboard;`,
        preview: "Complete React dashboard component with charts, loading states, and error handling",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        size: "4.1 KB"
      },
      {
        id: Date.now() + 23,
        title: "API Documentation",
        type: "markdown",
        content: `# User Management API v2.0

## Overview
This API provides comprehensive endpoints for managing user accounts, authentication, and user data. Built with REST principles and includes rate limiting, authentication, and comprehensive error handling.

## Base URL
\`\`\`
https://api.example.com/v2
\`\`\`

## Authentication
All endpoints require a valid API key passed in the \`Authorization\` header:

\`\`\`http
Authorization: Bearer YOUR_API_KEY
\`\`\`

### Getting Your API Key
1. Log into your dashboard
2. Navigate to Settings → API Keys
3. Click "Generate New Key"
4. Copy and securely store your key

## Endpoints

### GET /users
Retrieve a paginated list of users.

**Parameters:**
- \`page\` (optional): Page number (default: 1)
- \`limit\` (optional): Items per page (default: 20, max: 100)
- \`search\` (optional): Search query for name or email
- \`sort\` (optional): Sort field (\`name\`, \`email\`, \`created_at\`)
- \`order\` (optional): Sort order (\`asc\`, \`desc\`)

**Example Request:**
\`\`\`bash
curl -X GET "https://api.example.com/v2/users?page=1&limit=10&search=john" \\
  -H "Authorization: Bearer YOUR_API_KEY"
\`\`\`

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": "usr_123",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://cdn.example.com/avatars/123.jpg",
      "plan": "pro",
      "created_at": "2023-01-01T00:00:00Z",
      "last_login": "2023-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
\`\`\`

### POST /users
Create a new user account.

**Request Body:**
\`\`\`json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "secure_password_123",
  "plan": "free"
}
\`\`\`

**Validation Rules:**
- \`name\`: Required, 2-50 characters
- \`email\`: Required, valid email format, unique
- \`password\`: Required, minimum 8 characters, must include numbers
- \`plan\`: Optional, one of: \`free\`, \`pro\`, \`enterprise\`

**Response:**
\`\`\`json
{
  "data": {
    "id": "usr_124",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "plan": "free",
    "created_at": "2023-01-16T12:00:00Z"
  }
}
\`\`\`

### GET /users/{id}
Retrieve a specific user by ID.

**Parameters:**
- \`id\`: User ID (required)

**Response:**
\`\`\`json
{
  "data": {
    "id": "usr_123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://cdn.example.com/avatars/123.jpg",
    "plan": "pro",
    "created_at": "2023-01-01T00:00:00Z",
    "last_login": "2023-01-15T10:30:00Z",
    "stats": {
      "projects": 15,
      "tasks_completed": 127,
      "time_saved_hours": 45
    }
  }
}
\`\`\`

### PUT /users/{id}
Update an existing user.

**Request Body:** (All fields optional)
\`\`\`json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "plan": "enterprise"
}
\`\`\`

### DELETE /users/{id}
Delete a user account.

**Response:**
\`\`\`json
{
  "message": "User deleted successfully"
}
\`\`\`

## Error Handling

All errors return a consistent format:

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    },
    "timestamp": "2023-01-16T12:00:00Z"
  }
}
\`\`\`

### Error Codes
- \`400\` - Bad Request (validation errors)
- \`401\` - Unauthorized (invalid API key)
- \`403\` - Forbidden (insufficient permissions)
- \`404\` - Not Found (resource doesn't exist)
- \`429\` - Too Many Requests (rate limit exceeded)
- \`500\` - Internal Server Error

## Rate Limiting

API requests are limited to:
- **Free Plan**: 100 requests per hour
- **Pro Plan**: 1,000 requests per hour  
- **Enterprise Plan**: 10,000 requests per hour

Rate limit headers are included in responses:
\`\`\`
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1642334400
\`\`\`

## SDKs and Libraries

Official SDKs available for:
- **JavaScript/Node.js**: \`npm install @example/user-api\`
- **Python**: \`pip install example-user-api\`
- **PHP**: \`composer require example/user-api\`
- **Ruby**: \`gem install example-user-api\`

## Support

- **Documentation**: [https://docs.example.com](https://docs.example.com)
- **Status Page**: [https://status.example.com](https://status.example.com)
- **Support Email**: api-support@example.com`,
        preview: "Complete API documentation with authentication, endpoints, and error handling",
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        size: "5.2 KB"
      }
    ];
  }

  setupGlobalListeners() {
    // Handle theme changes
    this.eventBus.on('app:theme-changed', (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('loom4_theme', theme);
      this.stateManager.set('app.theme', theme);
    });

    // Handle sidebar toggle
    this.eventBus.on('app:sidebar-toggle', () => {
      const current = this.stateManager.get('app.sidebarCollapsed', false);
      const newState = !current;
      this.stateManager.set('app.sidebarCollapsed', newState);
      localStorage.setItem('loom4_sidebar_collapsed', newState.toString());
    });

    // Handle navigation
    this.eventBus.on('app:navigate', (section) => {
      this.router.navigate(section);
    });

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleGlobalKeyboard(e));

    // Handle window unload to save state
    window.addEventListener('beforeunload', () => this.saveApplicationState());
  }

  handleGlobalKeyboard(event) {
    // Escape key handling
    if (event.key === 'Escape') {
      this.eventBus.emit('app:escape-pressed');
      return;
    }

    // Ctrl/Cmd + K for search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.eventBus.emit('app:search-requested');
      return;
    }

    // Ctrl/Cmd + B for sidebar toggle
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault();
      this.eventBus.emit('app:sidebar-toggle');
      return;
    }
  }

  saveApplicationState() {
    // Save current application state to localStorage
    const appState = {
      theme: this.stateManager.get('app.theme'),
      sidebarCollapsed: this.stateManager.get('app.sidebarCollapsed'),
      lastSection: this.stateManager.get('app.currentSection')
    };
    
    localStorage.setItem('loom4_app_state', JSON.stringify(appState));
    
    // Let plugins save their state
    this.eventBus.emit('app:save-state');
  }

  loadFromStorage(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Failed to load ${key} from storage:`, error);
      return null;
    }
  }

  getComponent(name) {
    return this.components.get(name);
  }

  getStateManager() {
    return this.stateManager;
  }

  getEventBus() {
    return this.eventBus;
  }

  getPluginSystem() {
    return this.pluginSystem;
  }
}

// Create and export global app instance
const app = new LoomApp();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

export default app;