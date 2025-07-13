/**
 * Resizable Panel Component
 * Creates a resizable sidebar panel with drag functionality and state persistence
 */

import { storage } from '../../utils/storage.js';
import { debounce, throttle } from '../../utils/helpers.js';

export class ResizablePanel {
  constructor(options = {}) {
    this.options = {
      minWidth: 300,
      maxWidth: 800,
      defaultWidth: 400,
      persistKey: 'resizable-panel',
      resizeHandle: 'left', // left, right, both
      smoothTransitions: true,
      mobileBreakpoint: 768,
      snapThreshold: 20,
      snapSizes: [300, 400, 500, 600],
      className: 'resizable-panel',
      ...options
    };

    // State
    this.isOpen = false;
    this.currentWidth = this.options.defaultWidth;
    this.isResizing = false;
    this.isDragging = false;
    this.startX = 0;
    this.startWidth = 0;
    this.animationFrame = null;

    // DOM elements
    this.panel = null;
    this.resizeHandle = null;
    this.content = null;
    this.widthIndicator = null;

    // Event handlers
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleWindowResize = debounce(this.handleWindowResize.bind(this), 250);

    // Throttled resize handler for performance
    this.throttledResize = throttle(this.updateWidth.bind(this), 16); // 60fps
  }

  /**
   * Initialize the resizable panel
   */
  init() {
    this.createElement();
    this.loadState();
    this.setupEventListeners();
    this.updateLayout();
    
    console.log('ResizablePanel initialized');
  }

  /**
   * Create the panel DOM structure
   */
  createElement() {
    this.panel = document.createElement('div');
    this.panel.className = `${this.options.className} resizable-panel`;
    this.panel.innerHTML = this.getPanelHTML();

    // Get child elements
    this.resizeHandle = this.panel.querySelector('.resize-handle');
    this.content = this.panel.querySelector('.panel-content');
    this.widthIndicator = this.panel.querySelector('.width-indicator');

    // Set initial styles
    this.panel.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      height: 100vh;
      width: ${this.currentWidth}px;
      background: var(--color-bg-primary);
      border-left: 1px solid var(--color-border-light);
      box-shadow: var(--shadow-lg);
      z-index: var(--z-dropdown);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      display: flex;
      flex-direction: column;
    `;
  }

  /**
   * Get panel HTML structure
   */
  getPanelHTML() {
    return `
      <div class="resize-handle resize-handle-${this.options.resizeHandle}">
        <div class="resize-handle-indicator">
          <div class="resize-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      
      <div class="panel-header">
        <div class="panel-title">
          <h3 id="panelTitle">Panel</h3>
          <span class="panel-subtitle" id="panelSubtitle"></span>
        </div>
        <div class="panel-controls">
          <button class="panel-control-btn" id="panelMinimize" title="Minimize">
            <i class="fas fa-minus"></i>
          </button>
          <button class="panel-control-btn" id="panelMaximize" title="Maximize">
            <i class="fas fa-expand"></i>
          </button>
          <button class="panel-control-btn" id="panelClose" title="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="panel-content">
        <!-- Content will be inserted here -->
      </div>

      <div class="width-indicator">
        <span class="width-value">${this.currentWidth}px</span>
      </div>

      <div class="size-presets">
        <button class="size-preset-btn" data-size="300" title="Small">S</button>
        <button class="size-preset-btn" data-size="400" title="Medium">M</button>
        <button class="size-preset-btn" data-size="500" title="Large">L</button>
        <button class="size-preset-btn" data-size="600" title="Extra Large">XL</button>
      </div>
    `;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Resize handle events
    if (this.resizeHandle) {
      this.resizeHandle.addEventListener('mousedown', this.handleMouseDown);
      this.resizeHandle.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    }

    // Panel control buttons
    const minimizeBtn = this.panel.querySelector('#panelMinimize');
    const maximizeBtn = this.panel.querySelector('#panelMaximize');
    const closeBtn = this.panel.querySelector('#panelClose');

    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => this.minimize());
    }
    if (maximizeBtn) {
      maximizeBtn.addEventListener('click', () => this.maximize());
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Size preset buttons
    const presetButtons = this.panel.querySelectorAll('.size-preset-btn');
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const size = parseInt(btn.dataset.size);
        this.setWidth(size);
      });
    });

    // Global events
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd);
    window.addEventListener('resize', this.handleWindowResize);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (this.isOpen && e.key === 'Escape') {
        this.close();
      }
    });
  }

  /**
   * Handle mouse down on resize handle
   */
  handleMouseDown(e) {
    if (e.button !== 0) return; // Only left mouse button
    
    e.preventDefault();
    this.startResize(e.clientX);
  }

  /**
   * Handle touch start on resize handle
   */
  handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    this.startResize(touch.clientX);
  }

  /**
   * Start resize operation
   */
  startResize(clientX) {
    this.isDragging = true;
    this.isResizing = true;
    this.startX = clientX;
    this.startWidth = this.currentWidth;

    // Add visual feedback
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    this.panel.classList.add('resizing');
    
    // Show width indicator
    if (this.widthIndicator) {
      this.widthIndicator.classList.add('visible');
    }

    // Disable transitions during resize
    if (this.options.smoothTransitions) {
      this.panel.style.transition = 'none';
    }
  }

  /**
   * Handle mouse move during resize
   */
  handleMouseMove(e) {
    if (!this.isDragging) return;
    
    e.preventDefault();
    this.updateResize(e.clientX);
  }

  /**
   * Handle touch move during resize
   */
  handleTouchMove(e) {
    if (!this.isDragging) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    this.updateResize(touch.clientX);
  }

  /**
   * Update resize position
   */
  updateResize(clientX) {
    if (!this.isDragging) return;

    // Calculate new width (resize from left edge)
    const deltaX = this.startX - clientX;
    let newWidth = this.startWidth + deltaX;

    // Apply constraints
    newWidth = Math.max(this.options.minWidth, Math.min(this.options.maxWidth, newWidth));

    // Check for snapping
    const snapSize = this.getSnapSize(newWidth);
    if (snapSize !== null) {
      newWidth = snapSize;
    }

    // Update width using animation frame for smooth performance
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.animationFrame = requestAnimationFrame(() => {
      this.throttledResize(newWidth);
    });
  }

  /**
   * Check if width should snap to preset size
   */
  getSnapSize(width) {
    for (const snapSize of this.options.snapSizes) {
      if (Math.abs(width - snapSize) <= this.options.snapThreshold) {
        return snapSize;
      }
    }
    return null;
  }

  /**
   * Handle mouse up - end resize
   */
  handleMouseUp(e) {
    if (!this.isDragging) return;
    
    this.endResize();
  }

  /**
   * Handle touch end - end resize
   */
  handleTouchEnd(e) {
    if (!this.isDragging) return;
    
    this.endResize();
  }

  /**
   * End resize operation
   */
  endResize() {
    this.isDragging = false;
    this.isResizing = false;

    // Remove visual feedback
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    this.panel.classList.remove('resizing');
    
    // Hide width indicator
    if (this.widthIndicator) {
      this.widthIndicator.classList.remove('visible');
    }

    // Re-enable transitions
    if (this.options.smoothTransitions) {
      this.panel.style.transition = '';
    }

    // Save state
    this.saveState();

    // Emit resize end event
    this.emit('resizeEnd', { width: this.currentWidth });
  }

  /**
   * Update panel width
   */
  updateWidth(width) {
    this.currentWidth = width;
    this.panel.style.width = `${width}px`;
    
    // Update width indicator
    if (this.widthIndicator) {
      const valueSpan = this.widthIndicator.querySelector('.width-value');
      if (valueSpan) {
        valueSpan.textContent = `${width}px`;
      }
    }

    // Update main content margin
    this.updateMainContentMargin();

    // Update size preset active state
    this.updatePresetActiveState(width);

    // Emit resize event
    this.emit('resize', { width });
  }

  /**
   * Update main content margin to accommodate panel
   */
  updateMainContentMargin() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      const margin = this.isOpen ? this.currentWidth : 0;
      mainContent.style.marginRight = `${margin}px`;
    }
  }

  /**
   * Update active state of size preset buttons
   */
  updatePresetActiveState(width) {
    const presetButtons = this.panel.querySelectorAll('.size-preset-btn');
    presetButtons.forEach(btn => {
      const size = parseInt(btn.dataset.size);
      btn.classList.toggle('active', Math.abs(size - width) <= 10);
    });
  }

  /**
   * Handle window resize
   */
  handleWindowResize() {
    if (window.innerWidth <= this.options.mobileBreakpoint) {
      this.handleMobileMode();
    } else {
      this.handleDesktopMode();
    }
  }

  /**
   * Handle mobile mode
   */
  handleMobileMode() {
    if (this.isOpen) {
      this.panel.style.width = '100%';
      this.panel.style.transform = 'translateX(0)';
      this.updateMainContentMargin();
    }
  }

  /**
   * Handle desktop mode
   */
  handleDesktopMode() {
    this.panel.style.width = `${this.currentWidth}px`;
    this.updateLayout();
  }

  /**
   * Open the panel
   */
  open() {
    this.isOpen = true;
    this.panel.style.transform = 'translateX(0)';
    this.updateMainContentMargin();
    
    // Add to DOM if not already there
    if (!this.panel.parentNode) {
      document.body.appendChild(this.panel);
    }

    this.emit('open');
  }

  /**
   * Close the panel
   */
  close() {
    this.isOpen = false;
    this.panel.style.transform = 'translateX(100%)';
    this.updateMainContentMargin();
    
    this.emit('close');
  }

  /**
   * Toggle panel open/close
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Set panel width
   */
  setWidth(width) {
    const constrainedWidth = Math.max(
      this.options.minWidth, 
      Math.min(this.options.maxWidth, width)
    );
    
    this.updateWidth(constrainedWidth);
    this.saveState();
  }

  /**
   * Minimize panel to minimum width
   */
  minimize() {
    this.setWidth(this.options.minWidth);
  }

  /**
   * Maximize panel to maximum width
   */
  maximize() {
    this.setWidth(this.options.maxWidth);
  }

  /**
   * Update layout
   */
  updateLayout() {
    if (this.isOpen) {
      this.panel.style.transform = 'translateX(0)';
    } else {
      this.panel.style.transform = 'translateX(100%)';
    }
    this.updateMainContentMargin();
  }

  /**
   * Set panel content
   */
  setContent(content) {
    if (this.content) {
      if (typeof content === 'string') {
        this.content.innerHTML = content;
      } else {
        this.content.innerHTML = '';
        this.content.appendChild(content);
      }
    }
  }

  /**
   * Set panel title
   */
  setTitle(title, subtitle = '') {
    const titleElement = this.panel.querySelector('#panelTitle');
    const subtitleElement = this.panel.querySelector('#panelSubtitle');
    
    if (titleElement) titleElement.textContent = title;
    if (subtitleElement) subtitleElement.textContent = subtitle;
  }

  /**
   * Load state from storage
   */
  loadState() {
    const savedState = storage.get(this.options.persistKey);
    if (savedState) {
      this.currentWidth = savedState.width || this.options.defaultWidth;
      this.isOpen = savedState.isOpen || false;
    }
  }

  /**
   * Save state to storage
   */
  saveState() {
    storage.set(this.options.persistKey, {
      width: this.currentWidth,
      isOpen: this.isOpen,
      timestamp: Date.now()
    });
  }

  /**
   * Get panel element
   */
  getElement() {
    return this.panel;
  }

  /**
   * Get current state
   */
  getState() {
    return {
      isOpen: this.isOpen,
      width: this.currentWidth,
      isResizing: this.isResizing
    };
  }

  /**
   * Event emitter
   */
  emit(eventName, data = {}) {
    const event = new CustomEvent(`resizable-panel:${eventName}`, {
      detail: { panel: this, ...data }
    });
    document.dispatchEvent(event);
  }

  /**
   * Destroy the panel
   */
  destroy() {
    // Remove event listeners
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);
    window.removeEventListener('resize', this.handleWindowResize);

    // Remove from DOM
    if (this.panel && this.panel.parentNode) {
      this.panel.parentNode.removeChild(this.panel);
    }

    // Reset main content margin
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.marginRight = '';
    }

    // Cancel animation frame
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}