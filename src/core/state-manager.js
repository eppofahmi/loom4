/**
 * Centralized State Management System
 * Manages application state with reactive updates and persistence
 */

export class StateManager {
  constructor() {
    this.state = {};
    this.listeners = new Map();
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    
    // Initialize with default state
    this.state = {
      app: {
        theme: 'light',
        sidebarCollapsed: false,
        currentSection: 'projects',
        loading: false,
        error: null
      },
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        plan: 'free',
        initials: 'JD'
      },
      projects: [],
      chats: [],
      artifacts: [],
      knowledgeSources: [],
      plugins: {
        loaded: [],
        enabled: [],
        config: {}
      }
    };

    this.isInitialized = true;
  }

  /**
   * Get a value from state using dot notation
   * @param {string} path - Dot notation path (e.g., 'user.name')
   * @param {any} defaultValue - Default value if path doesn't exist
   * @returns {any} The value at the path
   */
  get(path, defaultValue = undefined) {
    const keys = path.split('.');
    let current = this.state;

    for (const key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return defaultValue;
      }
      current = current[key];
    }

    return current;
  }

  /**
   * Set a value in state using dot notation
   * @param {string} path - Dot notation path
   * @param {any} value - Value to set
   * @param {boolean} notify - Whether to notify listeners (default: true)
   */
  set(path, value, notify = true) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = this.state;

    // Navigate to the parent object
    for (const key of keys) {
      if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
        current[key] = {};
      }
      current = current[key];
    }

    // Set the value
    const oldValue = current[lastKey];
    current[lastKey] = value;

    // Notify listeners if value changed and notify is true
    if (notify && oldValue !== value) {
      this.notifyListeners(path, value, oldValue);
    }
  }

  /**
   * Update state by merging objects
   * @param {string} path - Dot notation path
   * @param {object} updates - Object to merge
   */
  update(path, updates) {
    const currentValue = this.get(path, {});
    const newValue = { ...currentValue, ...updates };
    this.set(path, newValue);
  }

  /**
   * Add item to an array in state
   * @param {string} path - Dot notation path to array
   * @param {any} item - Item to add
   * @param {boolean} prepend - Add to beginning if true, end if false
   */
  push(path, item, prepend = false) {
    const currentArray = this.get(path, []);
    const newArray = prepend ? [item, ...currentArray] : [...currentArray, item];
    this.set(path, newArray);
  }

  /**
   * Remove item from array in state
   * @param {string} path - Dot notation path to array
   * @param {function|any} predicate - Function to test items or value to remove
   */
  remove(path, predicate) {
    const currentArray = this.get(path, []);
    let newArray;

    if (typeof predicate === 'function') {
      newArray = currentArray.filter(item => !predicate(item));
    } else {
      newArray = currentArray.filter(item => item !== predicate);
    }

    this.set(path, newArray);
  }

  /**
   * Subscribe to state changes
   * @param {string} path - Path to watch (supports wildcards)
   * @param {function} callback - Callback function
   * @returns {function} Unsubscribe function
   */
  subscribe(path, callback) {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, new Set());
    }
    
    this.listeners.get(path).add(callback);

    // Return unsubscribe function
    return () => {
      const pathListeners = this.listeners.get(path);
      if (pathListeners) {
        pathListeners.delete(callback);
        if (pathListeners.size === 0) {
          this.listeners.delete(path);
        }
      }
    };
  }

  /**
   * Notify listeners of state changes
   * @param {string} path - Path that changed
   * @param {any} newValue - New value
   * @param {any} oldValue - Previous value
   */
  notifyListeners(path, newValue, oldValue) {
    // Notify exact path listeners
    if (this.listeners.has(path)) {
      this.listeners.get(path).forEach(callback => {
        try {
          callback(newValue, oldValue, path);
        } catch (error) {
          console.error('Error in state listener:', error);
        }
      });
    }

    // Notify wildcard listeners
    const pathParts = path.split('.');
    for (let i = 0; i < pathParts.length; i++) {
      const wildcardPath = pathParts.slice(0, i + 1).join('.') + '.*';
      if (this.listeners.has(wildcardPath)) {
        this.listeners.get(wildcardPath).forEach(callback => {
          try {
            callback(newValue, oldValue, path);
          } catch (error) {
            console.error('Error in wildcard state listener:', error);
          }
        });
      }
    }

    // Notify global listeners (*)
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(callback => {
        try {
          callback(newValue, oldValue, path);
        } catch (error) {
          console.error('Error in global state listener:', error);
        }
      });
    }
  }

  /**
   * Get entire state (use sparingly)
   * @returns {object} Complete state object
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Reset state to initial values
   */
  reset() {
    this.state = {};
    this.listeners.clear();
    this.init();
  }

  /**
   * Create a computed value that updates when dependencies change
   * @param {function} computeFn - Function that computes the value
   * @param {array} dependencies - Array of paths to watch
   * @param {string} targetPath - Path to store computed value
   */
  computed(computeFn, dependencies, targetPath) {
    const recompute = () => {
      try {
        const newValue = computeFn(this.state);
        this.set(targetPath, newValue, false); // Don't notify to avoid loops
      } catch (error) {
        console.error('Error in computed value:', error);
      }
    };

    // Initial computation
    recompute();

    // Subscribe to dependencies
    const unsubscribers = dependencies.map(dep => 
      this.subscribe(dep, recompute)
    );

    // Return cleanup function
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }

  /**
   * Batch multiple state updates
   * @param {function} updateFn - Function that performs updates
   */
  batch(updateFn) {
    const originalNotify = this.notifyListeners;
    const pendingNotifications = [];

    // Temporarily override notify to collect notifications
    this.notifyListeners = (path, newValue, oldValue) => {
      pendingNotifications.push({ path, newValue, oldValue });
    };

    try {
      updateFn();
    } finally {
      // Restore original notify function
      this.notifyListeners = originalNotify;

      // Send all pending notifications
      pendingNotifications.forEach(({ path, newValue, oldValue }) => {
        this.notifyListeners(path, newValue, oldValue);
      });
    }
  }

  /**
   * Export state for persistence
   * @param {array} paths - Specific paths to export (optional)
   * @returns {object} Serializable state object
   */
  export(paths = null) {
    if (paths) {
      const exportState = {};
      paths.forEach(path => {
        const value = this.get(path);
        if (value !== undefined) {
          this.setNestedValue(exportState, path, value);
        }
      });
      return exportState;
    }
    return this.getState();
  }

  /**
   * Import state from external source
   * @param {object} importState - State to import
   * @param {boolean} merge - Whether to merge with existing state
   */
  import(importState, merge = true) {
    if (merge) {
      this.state = this.deepMerge(this.state, importState);
    } else {
      this.state = { ...importState };
    }
    
    // Notify all listeners of the change
    this.notifyListeners('*', this.state, {});
  }

  // Helper methods
  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = obj;

    for (const key of keys) {
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key];
    }

    current[lastKey] = value;
  }

  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
}