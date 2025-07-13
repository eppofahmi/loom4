/**
 * Chat Feature Plugin
 * Manages chat functionality, history, and real-time messaging
 */

import { Modal } from '../../components/ui/Modal.js';
import { storage } from '../../utils/storage.js';
import { formatTimeAgo, generateId, debounce } from '../../utils/helpers.js';

export default class ChatFeature {
  constructor({ eventBus, stateManager, pluginSystem }) {
    this.eventBus = eventBus;
    this.stateManager = stateManager;
    this.pluginSystem = pluginSystem;
    
    this.metadata = {
      name: 'chat',
      version: '1.0.0',
      description: 'Chat and messaging feature',
      author: 'Loom4 Team'
    };

    // DOM elements
    this.chatList = null;
    this.chatHistoryList = null;
    this.messageInput = null;
    this.sendButton = null;
    this.chatMessages = null;
    this.typingIndicator = null;
    this.addChatBtn = null;

    // Current state
    this.currentChatId = null;
    this.isTyping = false;

    // Bind methods
    this.renderChatHistory = this.renderChatHistory.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * Initialize the chat feature
   */
  async init() {
    // Get DOM elements
    this.chatList = document.getElementById('chatList');
    this.chatHistoryList = document.getElementById('chatHistoryList');
    this.messageInput = document.getElementById('messageInput');
    this.sendButton = document.getElementById('sendButton');
    this.chatMessages = document.getElementById('chatMessages');
    this.typingIndicator = document.getElementById('typingIndicator');
    this.addChatBtn = document.getElementById('addChatBtn');

    // Load chats from storage
    await this.loadChats();

    // Setup event listeners
    this.setupEventListeners();

    // Initial render
    this.renderChatHistory();

    console.log('Chat feature initialized');
  }

  /**
   * Enable the chat feature
   */
  async enable() {
    // Setup navigation
    this.eventBus.on('router:enter', (section) => {
      if (section === 'chat') {
        this.renderChatHistory();
      }
    });

    // Setup state watching
    this.stateManager.subscribe('chats', this.renderChatHistory);

    // Listen for chat events
    this.eventBus.on('chat:open', (chatId) => this.openChat(chatId));
    this.eventBus.on('chat:create', () => this.createNewChat());
    this.eventBus.on('chat:delete', (chatId) => this.deleteChat(chatId));

    console.log('Chat feature enabled');
  }

  /**
   * Disable the chat feature
   */
  async disable() {
    // Remove event listeners
    this.eventBus.off('router:enter', this.renderChatHistory);
    this.eventBus.off('chat:open');
    this.eventBus.off('chat:create');
    this.eventBus.off('chat:delete');
    
    console.log('Chat feature disabled');
  }

  /**
   * Load chats from storage
   */
  async loadChats() {
    const savedChats = storage.get('chats', []);
    
    // If no saved chats, create sample data
    if (savedChats.length === 0) {
      const sampleChats = this.createSampleChats();
      this.stateManager.set('chats', sampleChats);
      this.saveChats();
    } else {
      this.stateManager.set('chats', savedChats);
    }
  }

  /**
   * Save chats to storage
   */
  saveChats() {
    const chats = this.stateManager.get('chats', []);
    storage.set('chats', chats);
  }

  /**
   * Create sample chats for demonstration
   */
  createSampleChats() {
    return [
      {
        id: generateId('chat'),
        title: "Website content ideas",
        lastMessage: "Can you suggest some content for our homepage?",
        timestamp: new Date(Date.now() - 60000).toISOString(),
        projectId: null,
        messages: []
      },
      {
        id: generateId('chat'),
        title: "Code review help",
        lastMessage: "I need help reviewing this React component",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        projectId: null,
        messages: []
      },
      {
        id: generateId('chat'),
        title: "Meeting notes summary",
        lastMessage: "Summary of yesterday's strategy meeting",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        projectId: null,
        messages: []
      }
    ];
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Add chat button
    if (this.addChatBtn) {
      this.addChatBtn.addEventListener('click', () => this.createNewChat());
    }

    // Message input
    if (this.messageInput) {
      this.messageInput.addEventListener('input', this.handleInputChange);
      this.messageInput.addEventListener('keydown', this.handleKeyDown);
    }

    // Send button
    if (this.sendButton) {
      this.sendButton.addEventListener('click', this.handleSendMessage);
    }

    // Chat search
    const chatSearchInput = document.getElementById('chatSearchInput');
    if (chatSearchInput) {
      chatSearchInput.addEventListener('input', debounce((e) => {
        this.filterChats(e.target.value);
      }, 300));
    }
  }

  /**
   * Handle message input changes
   */
  handleInputChange() {
    const hasText = this.messageInput.value.trim() !== '';
    this.sendButton.disabled = !hasText;
  }

  /**
   * Handle keyboard events in message input
   */
  handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!this.sendButton.disabled) {
        this.handleSendMessage();
      }
    }
  }

  /**
   * Handle send message
   */
  async handleSendMessage() {
    const message = this.messageInput.value.trim();
    if (!message) return;

    // Clear input
    this.messageInput.value = '';
    this.sendButton.disabled = true;

    // Add user message
    this.addMessage('user', message);

    // Show typing indicator
    this.showTypingIndicator();

    // Simulate AI response
    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.generateAIResponse(message);
      this.addMessage('assistant', response);
      
      // Update chat metadata
      this.updateChatMetadata(message, response);
    }, 1500);
  }

  /**
   * Generate AI response (simplified for demo)
   */
  generateAIResponse(userMessage) {
    const responses = [
      "I've analyzed your request and here's what I found...",
      "Based on the information available, I'd recommend...",
      "That's an interesting question. Here's what I know...",
      "I can help with that. Here are the details...",
      "After reviewing similar cases, here's my response...",
      `You mentioned "${userMessage.substring(0, 20)}..." - let me provide some insights on that.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Add message to chat interface
   */
  addMessage(role, content) {
    if (!this.chatMessages) return;

    // Remove welcome message if exists
    const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
    if (welcomeMessage) {
      welcomeMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = role === 'user' 
      ? '<i class="fas fa-user"></i>' 
      : '<i class="fas fa-robot"></i>';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `<p>${content}</p>`;

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);

    this.chatMessages.appendChild(messageDiv);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

    // Store message in current chat
    if (this.currentChatId) {
      const chats = this.stateManager.get('chats', []);
      const chat = chats.find(c => c.id === this.currentChatId);
      if (chat) {
        if (!chat.messages) chat.messages = [];
        chat.messages.push({
          id: generateId('message'),
          role,
          content,
          timestamp: new Date().toISOString()
        });
        this.stateManager.set('chats', chats);
        this.saveChats();
      }
    }
  }

  /**
   * Show typing indicator
   */
  showTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.classList.add('show');
    }
  }

  /**
   * Hide typing indicator
   */
  hideTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.classList.remove('show');
    }
  }

  /**
   * Update chat metadata after new messages
   */
  updateChatMetadata(userMessage, aiResponse) {
    if (!this.currentChatId) return;

    const chats = this.stateManager.get('chats', []);
    const chat = chats.find(c => c.id === this.currentChatId);
    
    if (chat) {
      chat.lastMessage = `AI: ${aiResponse.substring(0, 50)}...`;
      chat.timestamp = new Date().toISOString();
      
      // Update title if it's still default
      if (chat.title.startsWith('New Chat')) {
        chat.title = userMessage.substring(0, 30) + (userMessage.length > 30 ? '...' : '');
      }
      
      this.stateManager.set('chats', chats);
      this.saveChats();
    }
  }

  /**
   * Create new chat
   */
  createNewChat() {
    const newChatId = generateId('chat');
    const newChat = {
      id: newChatId,
      title: `New Chat ${new Date().toLocaleTimeString()}`,
      lastMessage: "No messages yet",
      timestamp: new Date().toISOString(),
      projectId: null,
      messages: []
    };

    const chats = this.stateManager.get('chats', []);
    chats.unshift(newChat);
    this.stateManager.set('chats', chats);
    this.saveChats();

    // Open the new chat
    this.openChat(newChatId);

    this.eventBus.emit('notification:show', {
      message: 'New chat created',
      type: 'success'
    });
  }

  /**
   * Open a specific chat
   */
  openChat(chatId) {
    this.currentChatId = chatId;
    
    // Navigate to active chat section
    this.eventBus.emit('router:navigate', 'active-chat');

    // Update UI highlighting
    this.updateChatHighlighting(chatId);

    // Load chat messages
    this.loadChatMessages(chatId);
  }

  /**
   * Update chat highlighting in sidebar and history
   */
  updateChatHighlighting(chatId) {
    // Remove existing highlighting
    document.querySelectorAll('.chat-item, .chat-history-item').forEach(item => {
      item.classList.remove('active');
    });

    // Add highlighting to current chat
    const chatItems = document.querySelectorAll(`[data-chat-id="${chatId}"]`);
    chatItems.forEach(item => {
      const chatItem = item.closest('.chat-item, .chat-history-item');
      if (chatItem) {
        chatItem.classList.add('active');
      }
    });
  }

  /**
   * Load messages for a specific chat
   */
  loadChatMessages(chatId) {
    if (!this.chatMessages) return;

    const chats = this.stateManager.get('chats', []);
    const chat = chats.find(c => c.id === chatId);

    if (!chat) {
      this.chatMessages.innerHTML = `
        <div class="welcome-message">
          <div class="welcome-content">
            <h1>Chat Not Found</h1>
            <p>The requested chat could not be found.</p>
          </div>
        </div>
      `;
      return;
    }

    // Clear current messages
    this.chatMessages.innerHTML = '';

    if (!chat.messages || chat.messages.length === 0) {
      this.chatMessages.innerHTML = `
        <div class="welcome-message">
          <div class="welcome-content">
            <h1>Chat: ${chat.title}</h1>
            <p>Start the conversation by typing a message below.</p>
          </div>
        </div>
      `;
      return;
    }

    // Render messages
    chat.messages.forEach(message => {
      this.addMessageToDOM(message);
    });

    // Scroll to bottom
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  /**
   * Add message to DOM without storing (for loading existing messages)
   */
  addMessageToDOM(message) {
    if (!this.chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.role}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = message.role === 'user' 
      ? '<i class="fas fa-user"></i>' 
      : '<i class="fas fa-robot"></i>';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `<p>${message.content}</p>`;

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);

    this.chatMessages.appendChild(messageDiv);
  }

  /**
   * Delete a chat
   */
  deleteChat(chatId) {
    const chats = this.stateManager.get('chats', []);
    const chat = chats.find(c => c.id === chatId);
    
    if (!chat) return;

    Modal.confirm({
      title: 'Delete Chat',
      content: `Are you sure you want to delete "${chat.title}"? This action cannot be undone.`,
      buttons: [
        { text: 'Cancel', action: 'cancel', variant: 'secondary' },
        { text: 'Delete', action: 'confirm', variant: 'danger' }
      ]
    }).then(confirmed => {
      if (confirmed) {
        const newChats = chats.filter(c => c.id !== chatId);
        this.stateManager.set('chats', newChats);
        this.saveChats();

        // If currently viewing this chat, go to chat list
        if (this.currentChatId === chatId) {
          this.eventBus.emit('router:navigate', 'chat');
          this.currentChatId = null;
        }

        this.eventBus.emit('notification:show', {
          message: 'Chat deleted successfully',
          type: 'success'
        });
      }
    });
  }

  /**
   * Rename a chat
   */
  renameChat(chatId, newTitle) {
    const chats = this.stateManager.get('chats', []);
    const chat = chats.find(c => c.id === chatId);
    
    if (chat) {
      chat.title = newTitle;
      this.stateManager.set('chats', chats);
      this.saveChats();

      this.eventBus.emit('notification:show', {
        message: 'Chat renamed successfully',
        type: 'success'
      });
    }
  }

  /**
   * Filter chats based on search query
   */
  filterChats(query) {
    if (!this.chatHistoryList) return;

    const chatItems = this.chatHistoryList.querySelectorAll('.chat-history-item');
    const lowercaseQuery = query.toLowerCase();

    chatItems.forEach(item => {
      const title = item.querySelector('.chat-history-item-title').textContent.toLowerCase();
      const subtitle = item.querySelector('.chat-history-item-subtitle').textContent.toLowerCase();
      
      const matches = title.includes(lowercaseQuery) || subtitle.includes(lowercaseQuery);
      item.style.display = matches ? 'block' : 'none';
    });
  }

  /**
   * Render chat history
   */
  renderChatHistory() {
    const chats = this.stateManager.get('chats', []);
    
    // Render sidebar chat list
    if (this.chatList) {
      this.renderSidebarChatList(chats);
    }

    // Render main chat history
    if (this.chatHistoryList) {
      this.renderMainChatHistory(chats);
    }
  }

  /**
   * Render sidebar chat list
   */
  renderSidebarChatList(chats) {
    this.chatList.innerHTML = '';

    chats.slice(0, 5).forEach(chat => { // Show only recent 5 in sidebar
      const chatItem = document.createElement('div');
      chatItem.className = 'chat-item';
      chatItem.innerHTML = `
        <div class="chat-item-content">${chat.title}</div>
        <div class="chat-item-actions">
          <button class="chat-action-btn delete" title="Delete" data-chat-id="${chat.id}" data-action="delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;

      // Add click listener for opening chat
      chatItem.querySelector('.chat-item-content').addEventListener('click', () => {
        this.openChat(chat.id);
      });

      // Add action button listeners
      const deleteBtn = chatItem.querySelector('[data-action="delete"]');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.deleteChat(chat.id);
        });
      }

      this.chatList.appendChild(chatItem);
    });
  }

  /**
   * Render main chat history
   */
  renderMainChatHistory(chats) {
    if (chats.length === 0) {
      this.chatHistoryList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-comments"></i>
          <h3>No Chats Yet</h3>
          <p>Start your first conversation</p>
          <button class="btn btn-primary" onclick="this.closest('.empty-state').parentElement.querySelector('#addChatBtn').click()">
            <i class="fas fa-plus"></i> New Chat
          </button>
        </div>
      `;
      return;
    }

    this.chatHistoryList.innerHTML = '';

    chats.forEach(chat => {
      const chatItem = document.createElement('div');
      chatItem.className = 'chat-history-item';
      chatItem.innerHTML = `
        <div class="chat-history-item-content">
          <div class="chat-history-item-title">${chat.title}</div>
          <div class="chat-history-item-subtitle">${chat.lastMessage} • ${formatTimeAgo(chat.timestamp)}</div>
        </div>
        <div class="chat-history-item-actions">
          <button class="chat-history-action-btn rename" title="Rename" data-chat-id="${chat.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="chat-history-action-btn delete" title="Delete" data-chat-id="${chat.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;

      // Add click listener for opening chat
      chatItem.querySelector('.chat-history-item-content').addEventListener('click', () => {
        this.openChat(chat.id);
      });

      // Add action button listeners
      const renameBtn = chatItem.querySelector('.rename');
      const deleteBtn = chatItem.querySelector('.delete');

      if (renameBtn) {
        renameBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.showRenameChatModal(chat);
        });
      }

      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.deleteChat(chat.id);
        });
      }

      this.chatHistoryList.appendChild(chatItem);
    });
  }

  /**
   * Show rename chat modal
   */
  showRenameChatModal(chat) {
    Modal.prompt('Chat Name', chat.title, {
      title: 'Rename Chat'
    }).then(newTitle => {
      if (newTitle && newTitle.trim() !== '') {
        this.renameChat(chat.id, newTitle.trim());
      }
    });
  }

  /**
   * Update plugin configuration
   */
  updateConfig(config) {
    console.log('Chat plugin config updated:', config);
  }

  /**
   * Destroy the plugin
   */
  destroy() {
    // Clean up event listeners
    if (this.addChatBtn) {
      this.addChatBtn.removeEventListener('click', this.createNewChat);
    }

    if (this.messageInput) {
      this.messageInput.removeEventListener('input', this.handleInputChange);
      this.messageInput.removeEventListener('keydown', this.handleKeyDown);
    }

    if (this.sendButton) {
      this.sendButton.removeEventListener('click', this.handleSendMessage);
    }

    console.log('Chat feature destroyed');
  }
}