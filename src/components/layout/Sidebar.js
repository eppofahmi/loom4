/**
 * Sidebar Layout Component
 * Manages the main navigation sidebar
 */

export class Sidebar {
  constructor(eventBus, stateManager) {
    this.eventBus = eventBus;
    this.stateManager = stateManager;
    this.element = null;
  }

  async init() {
    this.element = document.getElementById('sidebar');
    if (!this.element) {
      console.warn('Sidebar element not found');
      return;
    }

    this.setupEventListeners();
    this.updateState();
  }

  setupEventListeners() {
    // Navigation items
    const navItems = this.element.querySelectorAll('.nav-item[data-section]');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        this.eventBus.emit('app:navigate', section);
      });
    });

    // Sidebar toggle
    const toggleBtn = this.element.querySelector('#sidebarToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.eventBus.emit('app:sidebar-toggle');
      });
    }

    // Profile toggle
    const profileToggle = this.element.querySelector('#profileToggle');
    if (profileToggle) {
      profileToggle.addEventListener('click', () => {
        const overlay = document.getElementById('profileOverlay');
        if (overlay) {
          overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
        }
      });
    }

    // Listen for state changes
    this.stateManager.subscribe('app.sidebarCollapsed', this.updateState.bind(this));
  }

  updateState() {
    const collapsed = this.stateManager.get('app.sidebarCollapsed', false);
    if (this.element) {
      this.element.classList.toggle('collapsed', collapsed);
    }
  }

  setActiveSection(section) {
    if (!this.element) return;
    
    const navItems = this.element.querySelectorAll('.nav-item[data-section]');
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === section);
    });
  }
}