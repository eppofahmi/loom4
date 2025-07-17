# Reusable List Page Components

This guide explains how to use the reusable list page components that provide a consistent, modern, and minimal design for list-based pages throughout the application.

## Core Components

### 1. List Page Container (`.list-page`)
Main container for list-based pages with consistent padding and max-width.

```html
<div class="list-page active">
  <!-- Your list content -->
</div>
```

**Features:**
- Seamless integration with the rest of the application
- No hard borders or card-style containers
- Consistent 40px padding
- Max-width of 900px with auto-centering
- Transparent background
- Fixed height with overflow hidden to prevent panel scrolling

### 2. List Header (`.list-header`)
Header section with title and primary action button.

```html
<div class="list-header">
  <h2 class="list-title">Your Items</h2>
  <button class="list-action-btn">
    <i class="fas fa-plus"></i>
    Add Item
  </button>
</div>
```

**Features:**
- Large, prominent title (28px, weight 600)
- Primary action button with hover effects
- Space-between layout for title and action

### 3. Search Component (`.list-search`)
Search box with icon for filtering list items.

```html
<div class="list-search">
  <div class="search-box">
    <i class="fas fa-search search-icon"></i>
    <input type="text" placeholder="Search items...">
  </div>
</div>
```

**Features:**
- Icon positioned inside input field
- Max-width of 400px for optimal usability
- Focus states with blue border and shadow
- Consistent border-radius and padding

### 4. Info Row with Selection Toolbar (`.chat-list-info-row`)
Dual-purpose row that shows default information or selection controls.

```html
<div class="chat-list-info-row">
  <!-- Default info text -->
  <div class="chat-info-text" id="chatInfoText">
    You have <span id="totalChatsCount">4</span> previous chats with Loom4.
  </div>
  
  <!-- Selection toolbar (conditionally visible) -->
  <div class="chat-list-selection" id="chatListSelection" style="display: none;">
    <div class="selection-left">
      <span class="selected-count" id="selectedCount">3 Selected</span>
    </div>
    <div class="selection-right">
      <button class="selection-btn select-all-btn">Select All</button>
      <button class="selection-btn cancel-btn">Cancel</button>
      <button class="selection-btn delete-btn">Delete Selected</button>
    </div>
  </div>
</div>
```

**Features:**
- **Default state**: Shows total count of items with descriptive text
- **Selection state**: Replaces default text with selection toolbar
- **Smart switching**: Automatically toggles between states based on selections
- **Count updates**: Dynamic count updates when items are added/removed
- **Button variants**: Styled selection buttons with proper spacing
- **Responsive layout**: Maintains proper alignment across screen sizes

### 5. List Container (`.list-container`)
Container for list items with intelligent scrolling.

```html
<div class="list-container" id="listContainer">
  <!-- List items go here -->
</div>
```

**Features:**
- Intelligent scrolling: only scrolls when content exceeds available height
- Max-height of 60vh to trigger scrolling when necessary
- Smooth scrolling behavior
- Custom scrollbar styling
- Fixed other elements (header, search, toolbar, footer) remain visible
- **Integrated pagination**: "View All" button appears within scrollable content
- **Smart loading**: Shows limited items initially, full list on demand

### 6. List Item (`.list-item`)
Individual list item with hover effects and actions.

```html
<div class="list-item">
  <input type="checkbox" class="list-item-checkbox" data-item-id="1">
  <div class="list-item-content">
    <div class="list-item-title">Item Title</div>
    <div class="list-item-description">Item description or preview text...</div>
    <div class="list-item-meta">
      <span>Last updated 2 hours ago</span>
      <span>•</span>
      <span>Active</span>
    </div>
  </div>
  <div class="list-item-actions">
    <button class="list-item-action">
      <i class="fas fa-edit"></i>
    </button>
    <button class="list-item-action danger">
      <i class="fas fa-trash"></i>
    </button>
  </div>
</div>
```

**Features:**
- Clean, minimal design with border-bottom separators
- Hover effects: background change and action reveal
- Checkbox appears on hover (normal mode) or stays visible (selection mode)
- Multiple action buttons with `.danger` variant
- Responsive padding and spacing
- Selection mode: when any checkbox is selected, all checkboxes remain visible

### 7. Integrated List Footer (`.list-footer`)
Footer with pagination controls inside the scrollable list.

```html
<!-- Inside the list container -->
<div class="list-container" id="listContainer">
  <!-- List items -->
  
  <!-- Integrated footer (conditionally visible) -->
  <div class="list-footer" id="listFooter" style="display: none;">
    <button class="list-footer-btn" id="viewAllBtn">View All (5 more)</button>
  </div>
</div>
```

**Features:**
- **Integrated within scrollable area**: User must scroll to see the button
- **Conditional visibility**: Only appears when there are more items than the limit
- **Dynamic text**: Shows count of remaining items
- **Smart behavior**: Disappears after showing all items
- **Search integration**: Automatically handles search interactions

## Usage Examples

### Example 1: Projects List Page
```html
<div class="list-page active">
  <!-- Header -->
  <div class="list-header">
    <h2 class="list-title">Your Projects</h2>
    <button class="list-action-btn">
      <i class="fas fa-plus"></i>
      New Project
    </button>
  </div>

  <!-- Search -->
  <div class="list-search">
    <div class="search-box">
      <i class="fas fa-search search-icon"></i>
      <input type="text" placeholder="Search projects...">
    </div>
  </div>

  <!-- Selection Toolbar -->
  <div class="selection-toolbar" id="selectionToolbar" style="display: none;">
    <div class="selection-info">
      <span class="selection-count" id="selectionCount">Selected</span>
    </div>
    <div class="selection-actions">
      <button class="selection-btn primary">Select All</button>
      <button class="selection-btn">Cancel</button>
      <button class="selection-btn danger">Archive Selected</button>
    </div>
  </div>

  <!-- List Items -->
  <div class="list-container" id="listContainer">
    <div class="list-item">
      <input type="checkbox" class="list-item-checkbox" data-item-id="1">
      <div class="list-item-content">
        <div class="list-item-title">Website Redesign</div>
        <div class="list-item-description">Complete redesign of company website with modern UI/UX</div>
        <div class="list-item-meta">
          <span>Updated 2 days ago</span>
          <span>•</span>
          <span>Active</span>
        </div>
      </div>
      <div class="list-item-actions">
        <button class="list-item-action">
          <i class="fas fa-edit"></i>
        </button>
        <button class="list-item-action danger">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="list-footer">
    <button class="list-footer-btn">View All Projects</button>
  </div>
</div>
```

### Example 2: Files List Page
```html
<div class="list-page active">
  <div class="list-header">
    <h2 class="list-title">Your Files</h2>
    <button class="list-action-btn">
      <i class="fas fa-upload"></i>
      Upload File
    </button>
  </div>

  <div class="list-search">
    <div class="search-box">
      <i class="fas fa-search search-icon"></i>
      <input type="text" placeholder="Search files...">
    </div>
  </div>

  <div class="list-container">
    <div class="list-item">
      <input type="checkbox" class="list-item-checkbox" data-item-id="1">
      <div class="list-item-content">
        <div class="list-item-title">document.pdf</div>
        <div class="list-item-description">Important project documentation and specifications</div>
        <div class="list-item-meta">
          <span>2.4 MB</span>
          <span>•</span>
          <span>Modified yesterday</span>
        </div>
      </div>
      <div class="list-item-actions">
        <button class="list-item-action">
          <i class="fas fa-download"></i>
        </button>
        <button class="list-item-action">
          <i class="fas fa-share"></i>
        </button>
        <button class="list-item-action danger">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  </div>
</div>
```

## Design Principles

1. **Seamless Integration**: No hard borders or visual containers that separate the list from the rest of the application
2. **Consistent Spacing**: All components use consistent padding and margins that align with global layout styles
3. **Progressive Disclosure**: Interactive elements appear on hover to reduce visual clutter, with enhanced selection mode
4. **Smart Selection Mode**: Once any checkbox is selected, all checkboxes remain visible for easier multi-selection
5. **Intelligent Scrolling**: Only the list content scrolls while other elements remain fixed and visible
6. **Modern Interactions**: Smooth transitions and hover effects for better user experience
7. **Responsive Design**: Components adapt gracefully to different screen sizes
8. **Accessibility**: Proper focus states and semantic HTML structure

## Selection Mode Behavior

The list components include intelligent selection mode behavior:

- **Normal Mode**: Checkboxes appear only on hover to maintain clean visual design
- **Selection Mode**: When any item is selected, ALL checkboxes become visible and remain visible
- **Exit Selection**: When all selections are cleared, returns to normal hover-only mode
- **Delete Actions**: Delete icons can still appear on hover regardless of selection mode

### JavaScript Implementation
```javascript
// Add this logic to your selection handling
function updateSelectionMode() {
  const listContainer = document.getElementById('listContainer');
  const hasSelections = selectedItems.size > 0;
  
  if (hasSelections) {
    listContainer.classList.add('selection-mode');
  } else {
    listContainer.classList.remove('selection-mode');
  }
}
```

## Integrated Pagination System

The list components include a reusable pagination system that provides smart loading behavior:

### Implementation Logic
```javascript
// Configuration
const INITIAL_ITEM_LIMIT = 10;
let showAllItems = false;

// Render function with pagination
function renderListItems() {
  const itemsToShow = showAllItems ? allItems : allItems.slice(0, INITIAL_ITEM_LIMIT);
  
  // Render items
  itemsToShow.forEach(item => {
    // Render logic
  });
  
  // Update "View All" button
  updateViewAllButton();
}

// View All button logic
function updateViewAllButton() {
  const footer = document.getElementById('listFooter');
  const viewAllBtn = document.getElementById('viewAllBtn');
  
  if (allItems.length > INITIAL_ITEM_LIMIT && !showAllItems) {
    footer.style.display = 'flex';
    viewAllBtn.textContent = `View All (${allItems.length - INITIAL_ITEM_LIMIT} more)`;
  } else {
    footer.style.display = 'none';
  }
}

// Handle View All click
viewAllBtn.addEventListener('click', () => {
  showAllItems = true;
  renderListItems();
});
```

### Key Features
1. **Initial Limit**: Shows only 10 items by default
2. **Strict Visibility Rule**: "View All" appears ONLY when there are MORE than 10 items (>10)
3. **Integrated Position**: Button appears at bottom of scrollable list, after the 10th item
4. **Scroll Required**: User must scroll down to see the "View All" button
5. **Dynamic Count**: Shows exact number of remaining items
6. **Load on Demand**: Clicking loads all remaining chats below existing ones
7. **Search Integration**: Automatically shows all items during search
8. **State Management**: Proper reset when returning to list

### Visual Behavior Example

```
Scenario 1: User has 8 chats
┌─────────────────────┐
│ Chat 1              │
│ Chat 2              │
│ Chat 3              │
│ Chat 4              │
│ Chat 5              │
│ Chat 6              │
│ Chat 7              │
│ Chat 8              │
│                     │ ← No "View All" button (≤10 chats)
└─────────────────────┘

Scenario 2: User has 15 chats
┌─────────────────────┐
│ Chat 1              │
│ Chat 2              │
│ Chat 3              │
│ Chat 4              │
│ Chat 5              │
│ Chat 6              │
│ Chat 7              │
│ Chat 8              │
│ Chat 9              │
│ Chat 10             │ ← User must scroll to see below
│ ───────────────────  │
│ View All (5 more)   │ ← Button appears after 10th item
└─────────────────────┘

After clicking "View All":
┌─────────────────────┐
│ Chat 1              │
│ Chat 2              │
│ ...                 │
│ Chat 10             │
│ Chat 11             │ ← New chats loaded below
│ Chat 12             │
│ Chat 13             │
│ Chat 14             │
│ Chat 15             │
│                     │ ← Button disappears
└─────────────────────┘
```

### Usage in Other Components
This pagination system can be applied to any list component by:
1. Adding the `INITIAL_ITEM_LIMIT` configuration
2. Implementing the `showAllItems` state variable
3. Using the conditional rendering logic in your render function
4. Adding the integrated footer HTML structure
5. Implementing the `updateViewAllButton()` logic

## Customization

### Button Variants
- `.selection-btn.primary` - Blue primary button
- `.selection-btn.danger` - Red danger button
- `.list-item-action.danger` - Danger variant for item actions

### Color Customization
All colors follow the application's color palette and can be customized by modifying the CSS custom properties or color values in the stylesheet.

### Responsive Behavior
Components automatically adapt to smaller screens with adjusted spacing and layout changes defined in the media queries.

This component system ensures consistency across all list-based pages while maintaining the clean, modern aesthetic of the Loom4 application.