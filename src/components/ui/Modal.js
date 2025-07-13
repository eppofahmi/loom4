/**
 * Reusable Modal Component
 * Provides consistent modal behavior and styling across the application
 */

export class Modal {
  constructor(options = {}) {
    this.options = {
      title: '',
      content: '',
      size: 'medium', // small, medium, large, full
      closable: true,
      backdrop: true,
      keyboard: true,
      animation: true,
      className: '',
      onShow: null,
      onHide: null,
      onConfirm: null,
      onCancel: null,
      buttons: [],
      ...options
    };

    this.element = null;
    this.backdrop = null;
    this.isVisible = false;
    this.isDestroyed = false;
    
    // Bind methods
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
  }

  /**
   * Create modal element
   * @returns {HTMLElement} Modal element
   */
  createElement() {
    if (this.element) {
      return this.element;
    }

    // Create modal structure
    this.element = document.createElement('div');
    this.element.className = this.getModalClasses();
    this.element.style.display = 'none';
    this.element.innerHTML = this.getModalHTML();

    // Setup event listeners
    this.setupEventListeners();

    return this.element;
  }

  /**
   * Get modal CSS classes
   * @returns {string} CSS classes
   */
  getModalClasses() {
    const classes = ['modal'];

    classes.push(`modal-${this.options.size}`);

    if (this.options.animation) {
      classes.push('modal-animated');
    }

    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  /**
   * Get modal HTML structure
   * @returns {string} Modal HTML
   */
  getModalHTML() {
    return `
      <div class="modal-backdrop"></div>
      <div class="modal-container">
        <div class="modal-content">
          ${this.getHeaderHTML()}
          ${this.getBodyHTML()}
          ${this.getFooterHTML()}
        </div>
      </div>
    `;
  }

  /**
   * Get modal header HTML
   * @returns {string} Header HTML
   */
  getHeaderHTML() {
    if (!this.options.title && !this.options.closable) {
      return '';
    }

    return `
      <div class="modal-header">
        ${this.options.title ? `<h3 class="modal-title">${this.options.title}</h3>` : ''}
        ${this.options.closable ? '<button type="button" class="modal-close" aria-label="Close">&times;</button>' : ''}
      </div>
    `;
  }

  /**
   * Get modal body HTML
   * @returns {string} Body HTML
   */
  getBodyHTML() {
    return `<div class="modal-body">${this.options.content}</div>`;
  }

  /**
   * Get modal footer HTML
   * @returns {string} Footer HTML
   */
  getFooterHTML() {
    if (!this.options.buttons || this.options.buttons.length === 0) {
      return '';
    }

    const buttonsHTML = this.options.buttons.map(button => {
      const classes = ['btn', `btn-${button.variant || 'secondary'}`];
      if (button.className) classes.push(button.className);

      return `
        <button type="button" 
                class="${classes.join(' ')}" 
                data-action="${button.action || ''}"
                ${button.disabled ? 'disabled' : ''}>
          ${button.icon ? `<i class="${button.icon}"></i>` : ''}
          ${button.text || ''}
        </button>
      `;
    }).join('');

    return `<div class="modal-footer">${buttonsHTML}</div>`;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    if (!this.element) return;

    // Close button
    const closeButton = this.element.querySelector('.modal-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.hide());
    }

    // Footer buttons
    const footerButtons = this.element.querySelectorAll('.modal-footer button');
    footerButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const action = button.dataset.action;
        this.handleButtonClick(action, event, button);
      });
    });

    // Backdrop click
    const backdrop = this.element.querySelector('.modal-backdrop');
    if (backdrop && this.options.backdrop) {
      backdrop.addEventListener('click', this.handleBackdropClick);
    }
  }

  /**
   * Handle button clicks
   * @param {string} action - Button action
   * @param {Event} event - Click event
   * @param {HTMLElement} button - Button element
   */
  handleButtonClick(action, event, button) {
    const buttonConfig = this.options.buttons.find(btn => btn.action === action);
    
    if (buttonConfig && buttonConfig.onClick) {
      const result = buttonConfig.onClick(event, this);
      
      // Don't close modal if onClick returns false
      if (result === false) {
        return;
      }
    }

    // Handle common actions
    switch (action) {
      case 'confirm':
        if (this.options.onConfirm) {
          const result = this.options.onConfirm(this);
          if (result === false) return;
        }
        this.hide();
        break;
        
      case 'cancel':
        if (this.options.onCancel) {
          const result = this.options.onCancel(this);
          if (result === false) return;
        }
        this.hide();
        break;
        
      case 'close':
        this.hide();
        break;
        
      default:
        // Custom action, let the button handler decide if modal should close
        if (!buttonConfig || buttonConfig.closeModal !== false) {
          this.hide();
        }
    }
  }

  /**
   * Handle backdrop click
   * @param {Event} event - Click event
   */
  handleBackdropClick(event) {
    if (this.options.backdrop === 'static') {
      return;
    }
    
    this.hide();
  }

  /**
   * Handle keyboard events
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeydown(event) {
    if (!this.isVisible) return;

    if (event.key === 'Escape' && this.options.keyboard) {
      event.preventDefault();
      this.hide();
    }
  }

  /**
   * Show the modal
   * @returns {Promise} Promise that resolves when modal is shown
   */
  show() {
    return new Promise((resolve) => {
      if (this.isVisible || this.isDestroyed) {
        resolve();
        return;
      }

      // Create element if not exists
      if (!this.element) {
        this.createElement();
      }

      // Add to DOM
      document.body.appendChild(this.element);

      // Set up global listeners
      document.addEventListener('keydown', this.handleKeydown);

      // Show modal
      this.element.style.display = 'flex';
      
      // Force reflow for animation
      this.element.offsetHeight;
      
      // Add show class for animation
      if (this.options.animation) {
        this.element.classList.add('modal-show');
      }

      this.isVisible = true;

      // Callback
      if (this.options.onShow) {
        this.options.onShow(this);
      }

      // Focus management
      this.focusModal();

      // Resolve after animation
      setTimeout(resolve, this.options.animation ? 300 : 0);
    });
  }

  /**
   * Hide the modal
   * @returns {Promise} Promise that resolves when modal is hidden
   */
  hide() {
    return new Promise((resolve) => {
      if (!this.isVisible || this.isDestroyed) {
        resolve();
        return;
      }

      // Animation
      if (this.options.animation) {
        this.element.classList.remove('modal-show');
        this.element.classList.add('modal-hide');
      }

      // Hide after animation
      const hideDelay = this.options.animation ? 300 : 0;
      
      setTimeout(() => {
        if (this.element) {
          this.element.style.display = 'none';
          this.element.classList.remove('modal-hide');
          
          // Remove from DOM
          if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
          }
        }

        // Remove global listeners
        document.removeEventListener('keydown', this.handleKeydown);

        this.isVisible = false;

        // Callback
        if (this.options.onHide) {
          this.options.onHide(this);
        }

        resolve();
      }, hideDelay);
    });
  }

  /**
   * Toggle modal visibility
   */
  toggle() {
    return this.isVisible ? this.hide() : this.show();
  }

  /**
   * Focus modal for accessibility
   */
  focusModal() {
    if (!this.element) return;

    // Focus first focusable element or modal container
    const focusableElements = this.element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      const container = this.element.querySelector('.modal-container');
      if (container) {
        container.focus();
      }
    }
  }

  /**
   * Update modal content
   * @param {object} updates - Updates to apply
   */
  update(updates) {
    this.options = { ...this.options, ...updates };
    
    if (this.element) {
      // Update title
      if (updates.title !== undefined) {
        const titleElement = this.element.querySelector('.modal-title');
        if (titleElement) {
          titleElement.textContent = updates.title;
        }
      }

      // Update content
      if (updates.content !== undefined) {
        const bodyElement = this.element.querySelector('.modal-body');
        if (bodyElement) {
          bodyElement.innerHTML = updates.content;
        }
      }

      // Update buttons
      if (updates.buttons !== undefined) {
        const footerElement = this.element.querySelector('.modal-footer');
        if (footerElement) {
          footerElement.innerHTML = this.getFooterHTML().replace(/<div class="modal-footer">|<\/div>$/g, '');
          this.setupEventListeners();
        }
      }
    }
  }

  /**
   * Set modal content
   * @param {string} content - New content
   */
  setContent(content) {
    this.update({ content });
  }

  /**
   * Set modal title
   * @param {string} title - New title
   */
  setTitle(title) {
    this.update({ title });
  }

  /**
   * Add button to modal
   * @param {object} button - Button configuration
   */
  addButton(button) {
    this.options.buttons = [...(this.options.buttons || []), button];
    this.update({ buttons: this.options.buttons });
  }

  /**
   * Remove button from modal
   * @param {string} action - Button action to remove
   */
  removeButton(action) {
    this.options.buttons = (this.options.buttons || []).filter(btn => btn.action !== action);
    this.update({ buttons: this.options.buttons });
  }

  /**
   * Get modal element
   * @returns {HTMLElement} Modal element
   */
  getElement() {
    return this.element || this.createElement();
  }

  /**
   * Destroy the modal
   */
  destroy() {
    if (this.isDestroyed) return;

    this.hide().then(() => {
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }

      document.removeEventListener('keydown', this.handleKeydown);

      this.element = null;
      this.options = null;
      this.isDestroyed = true;
    });
  }

  /**
   * Static method to create confirmation modal
   * @param {object} options - Modal options
   * @returns {Promise} Promise that resolves with user choice
   */
  static confirm(options = {}) {
    return new Promise((resolve) => {
      const modal = new Modal({
        title: 'Confirm Action',
        content: 'Are you sure?',
        size: 'small',
        buttons: [
          {
            text: 'Cancel',
            action: 'cancel',
            variant: 'secondary'
          },
          {
            text: 'Confirm',
            action: 'confirm',
            variant: 'primary'
          }
        ],
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
        onHide: () => resolve(false),
        ...options
      });

      modal.show();
    });
  }

  /**
   * Static method to create alert modal
   * @param {string} message - Alert message
   * @param {object} options - Additional options
   * @returns {Promise} Promise that resolves when closed
   */
  static alert(message, options = {}) {
    return new Promise((resolve) => {
      const modal = new Modal({
        title: 'Alert',
        content: message,
        size: 'small',
        buttons: [
          {
            text: 'OK',
            action: 'close',
            variant: 'primary'
          }
        ],
        onHide: resolve,
        ...options
      });

      modal.show();
    });
  }

  /**
   * Static method to create prompt modal
   * @param {string} message - Prompt message
   * @param {string} defaultValue - Default input value
   * @param {object} options - Additional options
   * @returns {Promise} Promise that resolves with input value or null
   */
  static prompt(message, defaultValue = '', options = {}) {
    return new Promise((resolve) => {
      const inputId = 'modal-prompt-input';
      const content = `
        <div class="form-group">
          <label>${message}</label>
          <input type="text" id="${inputId}" value="${defaultValue}" class="form-control">
        </div>
      `;

      const modal = new Modal({
        title: 'Input Required',
        content,
        size: 'small',
        buttons: [
          {
            text: 'Cancel',
            action: 'cancel',
            variant: 'secondary'
          },
          {
            text: 'OK',
            action: 'confirm',
            variant: 'primary'
          }
        ],
        onConfirm: (modalInstance) => {
          const input = modalInstance.element.querySelector(`#${inputId}`);
          resolve(input ? input.value : null);
        },
        onCancel: () => resolve(null),
        onHide: () => resolve(null),
        onShow: (modalInstance) => {
          // Focus and select input
          setTimeout(() => {
            const input = modalInstance.element.querySelector(`#${inputId}`);
            if (input) {
              input.focus();
              input.select();
            }
          }, 100);
        },
        ...options
      });

      modal.show();
    });
  }
}