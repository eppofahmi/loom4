/**
 * Storage Utility for Local Data Persistence
 * Provides a consistent interface for localStorage with error handling
 */

class StorageManager {
  constructor(prefix = 'loom4') {
    this.prefix = prefix;
    this.isAvailable = this.checkStorageAvailability();
  }

  /**
   * Check if localStorage is available
   * @returns {boolean} True if localStorage is available
   */
  checkStorageAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      console.warn('localStorage is not available:', error);
      return false;
    }
  }

  /**
   * Get prefixed key
   * @param {string} key - Original key
   * @returns {string} Prefixed key
   */
  getKey(key) {
    return `${this.prefix}_${key}`;
  }

  /**
   * Store data in localStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @param {object} options - Storage options
   * @returns {boolean} True if successful
   */
  set(key, value, options = {}) {
    if (!this.isAvailable) {
      console.warn('Storage not available, data will not persist');
      return false;
    }

    try {
      const prefixedKey = this.getKey(key);
      const dataToStore = {
        value,
        timestamp: Date.now(),
        expires: options.expires || null,
        version: options.version || 1
      };

      localStorage.setItem(prefixedKey, JSON.stringify(dataToStore));
      return true;
    } catch (error) {
      console.error('Failed to store data:', error);
      
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError') {
        this.cleanup();
        // Try again after cleanup
        try {
          const prefixedKey = this.getKey(key);
          const dataToStore = {
            value,
            timestamp: Date.now(),
            expires: options.expires || null,
            version: options.version || 1
          };
          localStorage.setItem(prefixedKey, JSON.stringify(dataToStore));
          return true;
        } catch (retryError) {
          console.error('Failed to store data after cleanup:', retryError);
        }
      }
      
      return false;
    }
  }

  /**
   * Retrieve data from localStorage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key doesn't exist
   * @returns {any} Retrieved value or default value
   */
  get(key, defaultValue = null) {
    if (!this.isAvailable) {
      return defaultValue;
    }

    try {
      const prefixedKey = this.getKey(key);
      const item = localStorage.getItem(prefixedKey);
      
      if (item === null) {
        return defaultValue;
      }

      const data = JSON.parse(item);
      
      // Check if data has expired
      if (data.expires && Date.now() > data.expires) {
        this.remove(key);
        return defaultValue;
      }

      return data.value;
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      return defaultValue;
    }
  }

  /**
   * Remove data from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} True if successful
   */
  remove(key) {
    if (!this.isAvailable) {
      return false;
    }

    try {
      const prefixedKey = this.getKey(key);
      localStorage.removeItem(prefixedKey);
      return true;
    } catch (error) {
      console.error('Failed to remove data:', error);
      return false;
    }
  }

  /**
   * Check if key exists in storage
   * @param {string} key - Storage key
   * @returns {boolean} True if key exists
   */
  has(key) {
    if (!this.isAvailable) {
      return false;
    }

    const prefixedKey = this.getKey(key);
    return localStorage.getItem(prefixedKey) !== null;
  }

  /**
   * Clear all data with the current prefix
   * @returns {boolean} True if successful
   */
  clear() {
    if (!this.isAvailable) {
      return false;
    }

    try {
      const keysToRemove = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix + '_')) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  }

  /**
   * Get all keys with the current prefix
   * @returns {array} Array of keys (without prefix)
   */
  keys() {
    if (!this.isAvailable) {
      return [];
    }

    const keys = [];
    const prefixWithSeparator = this.prefix + '_';
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefixWithSeparator)) {
          keys.push(key.slice(prefixWithSeparator.length));
        }
      }
    } catch (error) {
      console.error('Failed to get keys:', error);
    }

    return keys;
  }

  /**
   * Get storage size information
   * @returns {object} Storage size information
   */
  getSize() {
    if (!this.isAvailable) {
      return { used: 0, available: 0, total: 0 };
    }

    try {
      let used = 0;
      const prefixWithSeparator = this.prefix + '_';
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefixWithSeparator)) {
          const value = localStorage.getItem(key);
          used += key.length + (value ? value.length : 0);
        }
      }

      // Estimate total available space (this is approximate)
      let total = 0;
      try {
        const testKey = '__size_test__';
        const testData = 'x'.repeat(1024); // 1KB
        let testSize = 0;
        
        while (testSize < 10 * 1024 * 1024) { // Test up to 10MB
          try {
            localStorage.setItem(testKey, 'x'.repeat(testSize));
            localStorage.removeItem(testKey);
            testSize += 1024;
          } catch (e) {
            total = testSize;
            break;
          }
        }
      } catch (error) {
        total = 5 * 1024 * 1024; // Default estimate: 5MB
      }

      return {
        used,
        available: total - used,
        total,
        usedMB: (used / (1024 * 1024)).toFixed(2),
        availableMB: ((total - used) / (1024 * 1024)).toFixed(2),
        totalMB: (total / (1024 * 1024)).toFixed(2)
      };
    } catch (error) {
      console.error('Failed to calculate storage size:', error);
      return { used: 0, available: 0, total: 0 };
    }
  }

  /**
   * Cleanup expired items and old data
   * @param {number} maxAge - Maximum age in milliseconds (optional)
   */
  cleanup(maxAge = null) {
    if (!this.isAvailable) {
      return;
    }

    try {
      const keysToRemove = [];
      const now = Date.now();
      const prefixWithSeparator = this.prefix + '_';
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefixWithSeparator)) {
          try {
            const item = localStorage.getItem(key);
            if (item) {
              const data = JSON.parse(item);
              
              // Remove if expired
              if (data.expires && now > data.expires) {
                keysToRemove.push(key);
                continue;
              }
              
              // Remove if older than maxAge
              if (maxAge && data.timestamp && (now - data.timestamp) > maxAge) {
                keysToRemove.push(key);
                continue;
              }
            }
          } catch (parseError) {
            // Remove corrupted items
            keysToRemove.push(key);
          }
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      if (keysToRemove.length > 0) {
        console.log(`Cleaned up ${keysToRemove.length} storage items`);
      }
    } catch (error) {
      console.error('Failed to cleanup storage:', error);
    }
  }

  /**
   * Export all data with current prefix
   * @returns {object} Exported data
   */
  export() {
    if (!this.isAvailable) {
      return {};
    }

    const exported = {};
    const keys = this.keys();
    
    keys.forEach(key => {
      exported[key] = this.get(key);
    });

    return {
      data: exported,
      exportDate: new Date().toISOString(),
      version: 1
    };
  }

  /**
   * Import data into storage
   * @param {object} importData - Data to import
   * @param {boolean} overwrite - Whether to overwrite existing data
   * @returns {boolean} True if successful
   */
  import(importData, overwrite = false) {
    if (!this.isAvailable || !importData.data) {
      return false;
    }

    try {
      Object.entries(importData.data).forEach(([key, value]) => {
        if (overwrite || !this.has(key)) {
          this.set(key, value);
        }
      });
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  /**
   * Create a scoped storage instance
   * @param {string} scope - Scope name
   * @returns {StorageManager} Scoped storage instance
   */
  scope(scope) {
    return new StorageManager(`${this.prefix}_${scope}`);
  }

  /**
   * Watch for changes to a key
   * @param {string} key - Key to watch
   * @param {function} callback - Callback function
   * @returns {function} Unwatch function
   */
  watch(key, callback) {
    if (!this.isAvailable) {
      return () => {};
    }

    const prefixedKey = this.getKey(key);
    let lastValue = this.get(key);

    const checkForChanges = () => {
      const currentValue = this.get(key);
      if (JSON.stringify(currentValue) !== JSON.stringify(lastValue)) {
        callback(currentValue, lastValue);
        lastValue = currentValue;
      }
    };

    // Check for changes periodically
    const interval = setInterval(checkForChanges, 1000);

    // Listen for storage events from other tabs
    const storageListener = (event) => {
      if (event.key === prefixedKey) {
        checkForChanges();
      }
    };

    window.addEventListener('storage', storageListener);

    // Return unwatch function
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', storageListener);
    };
  }

  /**
   * Set data with automatic serialization
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @param {number} ttl - Time to live in milliseconds
   * @returns {boolean} True if successful
   */
  setWithTTL(key, value, ttl) {
    const expires = Date.now() + ttl;
    return this.set(key, value, { expires });
  }

  /**
   * Increment a numeric value
   * @param {string} key - Storage key
   * @param {number} increment - Amount to increment (default: 1)
   * @returns {number} New value
   */
  increment(key, increment = 1) {
    const currentValue = this.get(key, 0);
    const newValue = (typeof currentValue === 'number' ? currentValue : 0) + increment;
    this.set(key, newValue);
    return newValue;
  }

  /**
   * Append to an array
   * @param {string} key - Storage key
   * @param {any} item - Item to append
   * @param {number} maxLength - Maximum array length (optional)
   * @returns {array} Updated array
   */
  push(key, item, maxLength = null) {
    const currentArray = this.get(key, []);
    const newArray = Array.isArray(currentArray) ? [...currentArray] : [];
    
    newArray.push(item);
    
    if (maxLength && newArray.length > maxLength) {
      newArray.splice(0, newArray.length - maxLength);
    }
    
    this.set(key, newArray);
    return newArray;
  }

  /**
   * Remove item from array
   * @param {string} key - Storage key
   * @param {any|function} item - Item to remove or predicate function
   * @returns {array} Updated array
   */
  pull(key, item) {
    const currentArray = this.get(key, []);
    if (!Array.isArray(currentArray)) {
      return [];
    }
    
    const newArray = typeof item === 'function' 
      ? currentArray.filter(arrayItem => !item(arrayItem))
      : currentArray.filter(arrayItem => arrayItem !== item);
    
    this.set(key, newArray);
    return newArray;
  }
}

// Create and export default storage instance
export const storage = new StorageManager();

// Export the class for creating custom instances
export { StorageManager };