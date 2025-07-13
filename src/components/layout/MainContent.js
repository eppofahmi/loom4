/**
 * Main Content Layout Component
 * Manages the main content area and section switching
 */

export class MainContent {
  constructor(eventBus, stateManager) {
    this.eventBus = eventBus;
    this.stateManager = stateManager;
    this.element = null;
    this.currentSection = 'projects';
  }

  async init() {
    this.element = document.querySelector('.main-content');
    if (!this.element) {
      console.warn('Main content element not found');
      return;
    }

    this.setupEventListeners();
    this.showSection(this.currentSection);
  }

  setupEventListeners() {
    // Listen for navigation events
    this.eventBus.on('router:enter', (section) => {
      this.showSection(section);
    });

    // Listen for section changes
    this.eventBus.on('app:navigate', (section) => {
      this.showSection(section);
    });
  }

  showSection(sectionName) {
    if (!this.element) return;

    this.currentSection = sectionName;
    
    // Hide all sections
    const sections = this.element.querySelectorAll('.content-section');
    sections.forEach(section => {
      section.classList.remove('active');
    });

    // Show target section
    const targetSection = this.element.querySelector(`#${sectionName}-section`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update state
    this.stateManager.set('app.currentSection', sectionName);

    // Emit section change event
    this.eventBus.emit('content:section-changed', sectionName);
  }

  getCurrentSection() {
    return this.currentSection;
  }
}