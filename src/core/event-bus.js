/**
 * Event Bus for Component Communication
 * Provides a centralized event system for loose coupling between components
 */

export class EventBus {
  constructor() {
    this.events = new Map();
    this.onceEvents = new Map();
    this.maxListeners = 100;
    this.debug = false;
  }

  /**
   * Subscribe to an event
   * @param {string} eventName - Name of the event
   * @param {function} callback - Callback function
   * @param {object} options - Options for the subscription
   * @returns {function} Unsubscribe function
   */
  on(eventName, callback, options = {}) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }

    const listeners = this.events.get(eventName);
    
    // Check max listeners
    if (listeners.size >= this.maxListeners) {
      console.warn(`Max listeners (${this.maxListeners}) exceeded for event: ${eventName}`);
    }

    // Create listener wrapper with options
    const listenerWrapper = {
      callback,
      once: options.once || false,
      priority: options.priority || 0,
      context: options.context || null
    };

    listeners.add(listenerWrapper);

    if (this.debug) {
      console.log(`Event listener added for: ${eventName}`);
    }

    // Return unsubscribe function
    return () => this.off(eventName, callback);
  }

  /**
   * Subscribe to an event once
   * @param {string} eventName - Name of the event
   * @param {function} callback - Callback function
   * @returns {function} Unsubscribe function
   */
  once(eventName, callback) {
    return this.on(eventName, callback, { once: true });
  }

  /**
   * Unsubscribe from an event
   * @param {string} eventName - Name of the event
   * @param {function} callback - Callback function to remove
   */
  off(eventName, callback) {
    if (!this.events.has(eventName)) {
      return;
    }

    const listeners = this.events.get(eventName);
    const toRemove = Array.from(listeners).find(wrapper => wrapper.callback === callback);
    
    if (toRemove) {
      listeners.delete(toRemove);
      
      if (listeners.size === 0) {
        this.events.delete(eventName);
      }

      if (this.debug) {
        console.log(`Event listener removed for: ${eventName}`);
      }
    }
  }

  /**
   * Remove all listeners for an event
   * @param {string} eventName - Name of the event
   */
  removeAllListeners(eventName) {
    if (eventName) {
      this.events.delete(eventName);
      this.onceEvents.delete(eventName);
    } else {
      this.events.clear();
      this.onceEvents.clear();
    }

    if (this.debug) {
      console.log(`All listeners removed for: ${eventName || 'all events'}`);
    }
  }

  /**
   * Emit an event
   * @param {string} eventName - Name of the event
   * @param {...any} args - Arguments to pass to listeners
   * @returns {boolean} True if event had listeners
   */
  emit(eventName, ...args) {
    if (this.debug) {
      console.log(`Emitting event: ${eventName}`, args);
    }

    let hasListeners = false;

    // Handle regular listeners
    if (this.events.has(eventName)) {
      const listeners = Array.from(this.events.get(eventName));
      
      // Sort by priority (higher priority first)
      listeners.sort((a, b) => b.priority - a.priority);
      
      const toRemove = [];

      for (const wrapper of listeners) {
        hasListeners = true;
        
        try {
          if (wrapper.context) {
            wrapper.callback.call(wrapper.context, ...args);
          } else {
            wrapper.callback(...args);
          }

          // Mark for removal if it's a once listener
          if (wrapper.once) {
            toRemove.push(wrapper);
          }
        } catch (error) {
          console.error(`Error in event listener for ${eventName}:`, error);
        }
      }

      // Remove once listeners
      const eventListeners = this.events.get(eventName);
      toRemove.forEach(wrapper => eventListeners.delete(wrapper));
      
      if (eventListeners.size === 0) {
        this.events.delete(eventName);
      }
    }

    // Handle wildcard listeners (events ending with .*)
    const eventParts = eventName.split('.');
    for (let i = 0; i < eventParts.length; i++) {
      const wildcardEvent = eventParts.slice(0, i + 1).join('.') + '.*';
      if (this.events.has(wildcardEvent)) {
        const listeners = Array.from(this.events.get(wildcardEvent));
        
        for (const wrapper of listeners) {
          hasListeners = true;
          
          try {
            if (wrapper.context) {
              wrapper.callback.call(wrapper.context, eventName, ...args);
            } else {
              wrapper.callback(eventName, ...args);
            }
          } catch (error) {
            console.error(`Error in wildcard event listener for ${wildcardEvent}:`, error);
          }
        }
      }
    }

    return hasListeners;
  }

  /**
   * Emit an event asynchronously
   * @param {string} eventName - Name of the event
   * @param {...any} args - Arguments to pass to listeners
   * @returns {Promise<boolean>} Promise that resolves to true if event had listeners
   */
  async emitAsync(eventName, ...args) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = this.emit(eventName, ...args);
        resolve(result);
      }, 0);
    });
  }

  /**
   * Wait for an event to be emitted
   * @param {string} eventName - Name of the event
   * @param {number} timeout - Timeout in milliseconds (optional)
   * @returns {Promise} Promise that resolves with event arguments
   */
  waitFor(eventName, timeout = null) {
    return new Promise((resolve, reject) => {
      let timeoutId = null;

      const cleanup = this.once(eventName, (...args) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        resolve(args);
      });

      if (timeout) {
        timeoutId = setTimeout(() => {
          cleanup();
          reject(new Error(`Timeout waiting for event: ${eventName}`));
        }, timeout);
      }
    });
  }

  /**
   * Create a namespaced event bus
   * @param {string} namespace - Namespace prefix
   * @returns {object} Namespaced event bus
   */
  namespace(namespace) {
    return {
      on: (eventName, callback, options) => this.on(`${namespace}.${eventName}`, callback, options),
      once: (eventName, callback) => this.once(`${namespace}.${eventName}`, callback),
      off: (eventName, callback) => this.off(`${namespace}.${eventName}`, callback),
      emit: (eventName, ...args) => this.emit(`${namespace}.${eventName}`, ...args),
      emitAsync: (eventName, ...args) => this.emitAsync(`${namespace}.${eventName}`, ...args),
      waitFor: (eventName, timeout) => this.waitFor(`${namespace}.${eventName}`, timeout)
    };
  }

  /**
   * Get list of events with listener counts
   * @returns {object} Object with event names as keys and listener counts as values
   */
  getEvents() {
    const result = {};
    for (const [eventName, listeners] of this.events) {
      result[eventName] = listeners.size;
    }
    return result;
  }

  /**
   * Get listener count for an event
   * @param {string} eventName - Name of the event
   * @returns {number} Number of listeners
   */
  listenerCount(eventName) {
    return this.events.has(eventName) ? this.events.get(eventName).size : 0;
  }

  /**
   * Enable or disable debug mode
   * @param {boolean} enabled - Whether to enable debug mode
   */
  setDebug(enabled) {
    this.debug = enabled;
  }

  /**
   * Set maximum number of listeners per event
   * @param {number} max - Maximum number of listeners
   */
  setMaxListeners(max) {
    this.maxListeners = max;
  }

  /**
   * Create a middleware system for events
   * @param {function} middleware - Middleware function
   */
  use(middleware) {
    const originalEmit = this.emit.bind(this);
    
    this.emit = (eventName, ...args) => {
      const context = {
        eventName,
        args,
        preventDefault: false
      };

      try {
        middleware(context);
        
        if (!context.preventDefault) {
          return originalEmit(eventName, ...context.args);
        }
        return false;
      } catch (error) {
        console.error('Error in event middleware:', error);
        return originalEmit(eventName, ...args);
      }
    };
  }

  /**
   * Pipe events from one bus to another
   * @param {EventBus} targetBus - Target event bus
   * @param {string|array} events - Event names to pipe (or '*' for all)
   * @param {string} prefix - Optional prefix for piped events
   */
  pipe(targetBus, events = '*', prefix = '') {
    if (events === '*') {
      this.on('*', (eventName, ...args) => {
        targetBus.emit(prefix + eventName, ...args);
      });
    } else {
      const eventList = Array.isArray(events) ? events : [events];
      eventList.forEach(eventName => {
        this.on(eventName, (...args) => {
          targetBus.emit(prefix + eventName, ...args);
        });
      });
    }
  }
}