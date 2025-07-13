/**
 * Simple Router for Managing Application Sections
 * Handles navigation between different parts of the application
 */

export class Router {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.routes = new Map();
    this.currentRoute = null;
    this.defaultRoute = 'projects';
    this.isStarted = false;
  }

  /**
   * Register a route
   * @param {string} name - Route name
   * @param {object} config - Route configuration
   */
  register(name, config) {
    this.routes.set(name, {
      name,
      component: config.component,
      beforeEnter: config.beforeEnter || null,
      beforeLeave: config.beforeLeave || null,
      data: config.data || {}
    });
  }

  /**
   * Start the router
   */
  start() {
    if (this.isStarted) return;

    // Listen to navigation events
    this.eventBus.on('router:navigate', (routeName, data) => {
      this.navigate(routeName, data);
    });

    // Listen to browser back/forward
    window.addEventListener('popstate', (event) => {
      const routeName = event.state?.route || this.getRouteFromHash();
      this.navigate(routeName, event.state?.data, false);
    });

    // Navigate to initial route
    const initialRoute = this.getRouteFromHash() || this.defaultRoute;
    this.navigate(initialRoute, {}, false);

    this.isStarted = true;
  }

  /**
   * Navigate to a route
   * @param {string} routeName - Name of the route
   * @param {object} data - Optional data to pass to the route
   * @param {boolean} pushState - Whether to push to browser history
   */
  async navigate(routeName, data = {}, pushState = true) {
    // Check if route exists
    if (!this.routes.has(routeName)) {
      console.warn(`Route '${routeName}' not found, falling back to default`);
      routeName = this.defaultRoute;
    }

    const route = this.routes.get(routeName);
    const previousRoute = this.currentRoute;

    try {
      // Call beforeLeave on current route
      if (previousRoute && previousRoute.beforeLeave) {
        const canLeave = await previousRoute.beforeLeave(previousRoute, route);
        if (canLeave === false) {
          return false;
        }
      }

      // Call beforeEnter on new route
      if (route.beforeEnter) {
        const canEnter = await route.beforeEnter(route, previousRoute);
        if (canEnter === false) {
          return false;
        }
      }

      // Update browser history
      if (pushState) {
        const url = `#${routeName}`;
        history.pushState({ route: routeName, data }, '', url);
      }

      // Hide previous section
      if (previousRoute) {
        this.eventBus.emit('router:leave', previousRoute.name);
        this.hideSection(previousRoute.name);
      }

      // Show new section
      this.showSection(routeName);
      this.currentRoute = { ...route, data };

      // Emit navigation events
      this.eventBus.emit('router:enter', routeName, data);
      this.eventBus.emit('router:changed', {
        from: previousRoute?.name || null,
        to: routeName,
        data
      });

      return true;
    } catch (error) {
      console.error('Navigation error:', error);
      this.eventBus.emit('router:error', error);
      return false;
    }
  }

  /**
   * Go back in history
   */
  back() {
    window.history.back();
  }

  /**
   * Go forward in history
   */
  forward() {
    window.history.forward();
  }

  /**
   * Replace current route
   * @param {string} routeName - Name of the route
   * @param {object} data - Optional data
   */
  replace(routeName, data = {}) {
    const url = `#${routeName}`;
    history.replaceState({ route: routeName, data }, '', url);
    this.navigate(routeName, data, false);
  }

  /**
   * Get current route
   * @returns {object|null} Current route object
   */
  getCurrentRoute() {
    return this.currentRoute;
  }

  /**
   * Get route from URL hash
   * @returns {string|null} Route name from hash
   */
  getRouteFromHash() {
    const hash = window.location.hash.slice(1);
    return hash || null;
  }

  /**
   * Check if a route exists
   * @param {string} routeName - Name of the route
   * @returns {boolean} True if route exists
   */
  hasRoute(routeName) {
    return this.routes.has(routeName);
  }

  /**
   * Get all registered routes
   * @returns {array} Array of route names
   */
  getRoutes() {
    return Array.from(this.routes.keys());
  }

  /**
   * Set default route
   * @param {string} routeName - Default route name
   */
  setDefaultRoute(routeName) {
    this.defaultRoute = routeName;
  }

  /**
   * Show a section
   * @param {string} sectionName - Section to show
   */
  showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
      section.classList.remove('active');
    });

    // Show target section
    const sectionId = sectionName.includes('-section') ? sectionName : sectionName + '-section';
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update navigation highlighting
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.classList.remove('active');
    });

    const navItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (navItem) {
      navItem.classList.add('active');
    }

    // Emit section change event
    this.eventBus.emit('section:changed', sectionName);
  }

  /**
   * Hide a section
   * @param {string} sectionName - Section to hide
   */
  hideSection(sectionName) {
    const sectionId = sectionName.includes('-section') ? sectionName : sectionName + '-section';
    const section = document.getElementById(sectionId);
    if (section) {
      section.classList.remove('active');
    }

    // Emit section hide event
    this.eventBus.emit('section:hidden', sectionName);
  }

  /**
   * Register multiple routes at once
   * @param {object} routes - Object with route configurations
   */
  registerRoutes(routes) {
    Object.entries(routes).forEach(([name, config]) => {
      this.register(name, config);
    });
  }

  /**
   * Add route middleware
   * @param {function} middleware - Middleware function
   */
  use(middleware) {
    this.eventBus.on('router:beforeNavigate', middleware);
  }

  /**
   * Generate URL for a route
   * @param {string} routeName - Route name
   * @param {object} params - URL parameters
   * @returns {string} Generated URL
   */
  url(routeName, params = {}) {
    let url = `#${routeName}`;
    
    if (Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    
    return url;
  }

  /**
   * Parse URL parameters
   * @returns {object} Parsed parameters
   */
  getParams() {
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};
    
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    
    return params;
  }

  /**
   * Destroy the router
   */
  destroy() {
    window.removeEventListener('popstate', this.handlePopState);
    this.eventBus.removeAllListeners('router:navigate');
    this.routes.clear();
    this.currentRoute = null;
    this.isStarted = false;
  }
}