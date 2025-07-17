# Reusable Collapsed Sidebar Component System

This system provides a flexible, reusable framework for creating collapsible sidebar menus that work consistently across different components.

## CSS Classes Overview

### Base Classes
- `.sidebar` - Main sidebar container
- `.sidebar.collapsed` - Collapsed state modifier

### Reusable Component Classes

#### 1. Sidebar Items (`.sidebar-item`)
Generic items that center their icons when collapsed.
```html
<div class="sidebar-item nav-item">
  <i class="item-icon fas fa-home"></i>
  <span class="item-text">Home</span>
</div>
```

#### 2. Sidebar Buttons (`.sidebar-btn`)
Circular buttons that show only icons when collapsed.
```html
<button class="sidebar-btn new-chat-btn">
  <i class="btn-icon fas fa-plus"></i>
  <span class="btn-text">New Chat</span>
</button>
```

#### 3. Sidebar Avatars (`.sidebar-avatar`)
User profile/avatar components that become circular when collapsed.
```html
<div class="sidebar-avatar profile-item">
  <i class="avatar-icon fas fa-user-circle"></i>
  <span class="avatar-text">User Name</span>
</div>
```

#### 4. Sidebar Text (`.sidebar-text`)
Any text that should be hidden when collapsed.
```html
<span class="sidebar-text">This text will be hidden</span>
```

#### 5. Sidebar Sections (`.sidebar-section`)
Containers that center their content when collapsed.
```html
<div class="sidebar-section new-chat-section">
  <!-- Content here will be centered -->
</div>
```

## Implementation Examples

### Example 1: Navigation Menu Item
```html
<div class="nav-item sidebar-item">
  <i class="item-icon fas fa-dashboard"></i>
  <span class="item-text">Dashboard</span>
</div>
```

### Example 2: Action Button
```html
<button class="action-btn sidebar-btn">
  <i class="btn-icon fas fa-settings"></i>
  <span class="btn-text">Settings</span>
</button>
```

### Example 3: User Profile
```html
<div class="profile-section sidebar-section">
  <div class="profile-item sidebar-avatar">
    <i class="avatar-icon fas fa-user-circle"></i>
    <span class="avatar-text">John Doe</span>
  </div>
</div>
```

### Example 4: Custom Menu Item with Badge
```html
<div class="menu-item sidebar-item">
  <i class="item-icon fas fa-bell"></i>
  <span class="item-text">Notifications</span>
  <span class="sidebar-text badge">3</span>
</div>
```

## Customization Guidelines

### Icon Alignment
- Default icons are centered with a slight left offset (-3px) for visual balance
- Adjust `margin-left` on `.btn-icon` for specific icons if needed

### Size Variations
```css
/* Small button variant */
.sidebar.collapsed .sidebar-btn.small {
  width: 32px;
  height: 32px;
}

/* Large avatar variant */
.sidebar.collapsed .sidebar-avatar.large {
  width: 48px;
  height: 48px;
}
```

### Color Variants
```css
/* Primary button */
.sidebar-btn.primary {
  background: #3b82f6;
  color: white;
}

/* Success avatar */
.sidebar-avatar.success {
  background: #10b981;
}
```

## Adding New Menu Components

1. **Create the HTML structure** using the appropriate base classes
2. **Add specific styling** for the expanded state
3. **The collapsed behavior** will be handled automatically by the reusable system
4. **Test both states** to ensure proper functionality

## Best Practices

- Always use semantic class names alongside the reusable classes
- Keep icon sizes consistent (16px for items, 24px for avatars)
- Use Font Awesome classes for consistency
- Test collapsed behavior with different text lengths
- Ensure touch targets are at least 40px for mobile accessibility

## Browser Support
- Modern browsers with CSS flexbox support
- Tested on Chrome, Firefox, Safari, Edge
- Mobile responsive design included