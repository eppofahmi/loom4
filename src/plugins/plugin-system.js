/**
 * Plugin System for Micro SaaS Features
 * Manages loading, enabling, and communication between plugins
 */

export class PluginSystem {
  constructor(eventBus, stateManager) {
    this.eventBus = eventBus;
    this.stateManager = stateManager;
    this.plugins = new Map();
    this.loadedPlugins = new Set();
    this.enabledPlugins = new Set();
    this.pluginDependencies = new Map();
    this.pluginConfigs = new Map();
  }

  /**
   * Register a plugin
   * @param {string} name - Plugin name
   * @param {object} plugin - Plugin definition
   */
  register(name, plugin) {
    if (this.plugins.has(name)) {
      console.warn(`Plugin '${name}' is already registered`);
      return;
    }

    // Validate plugin structure
    if (!this.validatePlugin(plugin)) {
      throw new Error(`Invalid plugin structure for '${name}'`);
    }

    this.plugins.set(name, {
      name,
      ...plugin,
      instance: null,
      loaded: false,
      enabled: false
    });

    // Store dependencies
    if (plugin.dependencies) {
      this.pluginDependencies.set(name, plugin.dependencies);
    }

    console.log(`Plugin '${name}' registered`);
  }

  /**
   * Load a plugin
   * @param {string} name - Plugin name
   * @param {object} options - Load options
   */
  async loadPlugin(name, options = {}) {
    if (this.loadedPlugins.has(name)) {
      console.log(`Plugin '${name}' already loaded`);
      return;
    }

    // Try to load plugin from features or plugins directory
    let plugin;
    try {
      if (options.core) {
        // Load from features directory (core features)
        plugin = await import(`../features/${name}/${name}.js`);
      } else {
        // Load from plugins directory (optional features)
        plugin = await import(`./${name}/${name}.js`);
      }
    } catch (error) {
      console.error(`Failed to load plugin '${name}':`, error);
      throw error;
    }

    // Register the plugin
    const pluginClass = plugin.default || plugin[name];
    if (!pluginClass) {
      throw new Error(`Plugin '${name}' does not export a default class`);
    }

    // Create plugin instance
    const pluginInstance = new pluginClass({
      eventBus: this.eventBus,
      stateManager: this.stateManager,
      pluginSystem: this,
      config: this.pluginConfigs.get(name) || {}
    });

    // Store plugin info
    this.plugins.set(name, {
      name,
      instance: pluginInstance,
      loaded: true,
      enabled: false,
      metadata: pluginInstance.metadata || {}
    });

    this.loadedPlugins.add(name);

    // Initialize plugin
    if (pluginInstance.init) {
      await pluginInstance.init();
    }

    // Auto-enable if specified
    if (options.autoEnable !== false) {
      await this.enablePlugin(name);
    }

    this.eventBus.emit('plugin:loaded', name);
    console.log(`Plugin '${name}' loaded successfully`);
  }

  /**
   * Enable a plugin
   * @param {string} name - Plugin name
   */
  async enablePlugin(name) {
    if (!this.loadedPlugins.has(name)) {
      throw new Error(`Plugin '${name}' is not loaded`);
    }

    if (this.enabledPlugins.has(name)) {
      console.log(`Plugin '${name}' already enabled`);
      return;
    }

    const plugin = this.plugins.get(name);

    // Check dependencies
    if (!await this.checkDependencies(name)) {
      throw new Error(`Dependencies not met for plugin '${name}'`);
    }

    // Enable the plugin
    if (plugin.instance.enable) {
      await plugin.instance.enable();
    }

    this.enabledPlugins.add(name);
    plugin.enabled = true;

    // Update state
    this.stateManager.push('plugins.enabled', name);

    this.eventBus.emit('plugin:enabled', name);
    console.log(`Plugin '${name}' enabled`);
  }

  /**
   * Disable a plugin
   * @param {string} name - Plugin name
   */
  async disablePlugin(name) {
    if (!this.enabledPlugins.has(name)) {
      console.log(`Plugin '${name}' is not enabled`);
      return;
    }

    const plugin = this.plugins.get(name);

    // Check if other plugins depend on this one
    const dependents = this.getDependents(name);
    if (dependents.length > 0) {
      const enabledDependents = dependents.filter(dep => this.enabledPlugins.has(dep));
      if (enabledDependents.length > 0) {
        throw new Error(`Cannot disable '${name}' - plugins ${enabledDependents.join(', ')} depend on it`);
      }
    }

    // Disable the plugin
    if (plugin.instance.disable) {
      await plugin.instance.disable();
    }

    this.enabledPlugins.delete(name);
    plugin.enabled = false;

    // Update state
    this.stateManager.remove('plugins.enabled', p => p === name);

    this.eventBus.emit('plugin:disabled', name);
    console.log(`Plugin '${name}' disabled`);
  }

  /**
   * Unload a plugin
   * @param {string} name - Plugin name
   */
  async unloadPlugin(name) {
    // Disable first if enabled
    if (this.enabledPlugins.has(name)) {
      await this.disablePlugin(name);
    }

    if (!this.loadedPlugins.has(name)) {
      console.log(`Plugin '${name}' is not loaded`);
      return;
    }

    const plugin = this.plugins.get(name);

    // Cleanup plugin
    if (plugin.instance.destroy) {
      await plugin.instance.destroy();
    }

    this.loadedPlugins.delete(name);
    this.plugins.delete(name);

    // Update state
    this.stateManager.remove('plugins.loaded', p => p === name);

    this.eventBus.emit('plugin:unloaded', name);
    console.log(`Plugin '${name}' unloaded`);
  }

  /**
   * Get plugin instance
   * @param {string} name - Plugin name
   * @returns {object|null} Plugin instance
   */
  getPlugin(name) {
    const plugin = this.plugins.get(name);
    return plugin ? plugin.instance : null;
  }

  /**
   * Check if plugin is loaded
   * @param {string} name - Plugin name
   * @returns {boolean} True if loaded
   */
  isLoaded(name) {
    return this.loadedPlugins.has(name);
  }

  /**
   * Check if plugin is enabled
   * @param {string} name - Plugin name
   * @returns {boolean} True if enabled
   */
  isEnabled(name) {
    return this.enabledPlugins.has(name);
  }

  /**
   * Get list of all plugins
   * @returns {array} Array of plugin info objects
   */
  getPlugins() {
    return Array.from(this.plugins.values()).map(plugin => ({
      name: plugin.name,
      loaded: plugin.loaded,
      enabled: plugin.enabled,
      metadata: plugin.metadata || {}
    }));
  }

  /**
   * Set plugin configuration
   * @param {string} name - Plugin name
   * @param {object} config - Configuration object
   */
  setConfig(name, config) {
    this.pluginConfigs.set(name, config);
    
    // Update running plugin if loaded
    const plugin = this.plugins.get(name);
    if (plugin && plugin.instance && plugin.instance.updateConfig) {
      plugin.instance.updateConfig(config);
    }
  }

  /**
   * Get plugin configuration
   * @param {string} name - Plugin name
   * @returns {object} Configuration object
   */
  getConfig(name) {
    return this.pluginConfigs.get(name) || {};
  }

  /**
   * Validate plugin structure
   * @param {object} plugin - Plugin object
   * @returns {boolean} True if valid
   */
  validatePlugin(plugin) {
    // Plugin should be a class or have required methods
    return typeof plugin === 'function' || 
           (typeof plugin === 'object' && plugin.init);
  }

  /**
   * Check plugin dependencies
   * @param {string} name - Plugin name
   * @returns {boolean} True if dependencies are met
   */
  async checkDependencies(name) {
    const dependencies = this.pluginDependencies.get(name);
    if (!dependencies || dependencies.length === 0) {
      return true;
    }

    for (const dependency of dependencies) {
      if (!this.enabledPlugins.has(dependency)) {
        // Try to auto-load dependency
        try {
          await this.loadPlugin(dependency);
        } catch (error) {
          console.error(`Failed to load dependency '${dependency}' for plugin '${name}':`, error);
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Get plugins that depend on the given plugin
   * @param {string} name - Plugin name
   * @returns {array} Array of dependent plugin names
   */
  getDependents(name) {
    const dependents = [];
    
    for (const [pluginName, dependencies] of this.pluginDependencies) {
      if (dependencies.includes(name)) {
        dependents.push(pluginName);
      }
    }
    
    return dependents;
  }

  /**
   * Create a plugin API for external plugins
   * @param {string} pluginName - Name of the requesting plugin
   * @returns {object} Plugin API object
   */
  createPluginAPI(pluginName) {
    return {
      // Event bus access
      on: (event, callback) => this.eventBus.on(`plugin.${pluginName}.${event}`, callback),
      emit: (event, data) => this.eventBus.emit(`plugin.${pluginName}.${event}`, data),
      
      // State management
      getState: (path, defaultValue) => this.stateManager.get(`plugins.${pluginName}.${path}`, defaultValue),
      setState: (path, value) => this.stateManager.set(`plugins.${pluginName}.${path}`, value),
      
      // Plugin communication
      callPlugin: (targetPlugin, method, ...args) => this.callPluginMethod(targetPlugin, method, ...args),
      isPluginEnabled: (name) => this.isEnabled(name),
      
      // Configuration
      getConfig: () => this.getConfig(pluginName),
      updateConfig: (config) => this.setConfig(pluginName, { ...this.getConfig(pluginName), ...config })
    };
  }

  /**
   * Call a method on another plugin
   * @param {string} pluginName - Target plugin name
   * @param {string} method - Method name
   * @param {...any} args - Method arguments
   * @returns {any} Method result
   */
  async callPluginMethod(pluginName, method, ...args) {
    const plugin = this.getPlugin(pluginName);
    if (!plugin) {
      throw new Error(`Plugin '${pluginName}' not found`);
    }

    if (!this.isEnabled(pluginName)) {
      throw new Error(`Plugin '${pluginName}' is not enabled`);
    }

    if (typeof plugin[method] !== 'function') {
      throw new Error(`Method '${method}' not found on plugin '${pluginName}'`);
    }

    return await plugin[method](...args);
  }

  /**
   * Enable development mode for hot reloading
   * @param {boolean} enabled - Whether to enable dev mode
   */
  setDevMode(enabled) {
    this.devMode = enabled;
    
    if (enabled) {
      // Watch for plugin file changes in development
      this.setupHotReload();
    }
  }

  /**
   * Setup hot reload for development
   */
  setupHotReload() {
    // This would integrate with a build system for hot reloading
    console.log('Plugin hot reload enabled');
  }

  /**
   * Export plugin system state
   * @returns {object} Exportable state
   */
  export() {
    return {
      enabled: Array.from(this.enabledPlugins),
      configs: Object.fromEntries(this.pluginConfigs)
    };
  }

  /**
   * Import plugin system state
   * @param {object} state - State to import
   */
  async import(state) {
    if (state.configs) {
      this.pluginConfigs = new Map(Object.entries(state.configs));
    }

    if (state.enabled) {
      for (const pluginName of state.enabled) {
        try {
          if (!this.isLoaded(pluginName)) {
            await this.loadPlugin(pluginName);
          }
          if (!this.isEnabled(pluginName)) {
            await this.enablePlugin(pluginName);
          }
        } catch (error) {
          console.error(`Failed to restore plugin '${pluginName}':`, error);
        }
      }
    }
  }
}