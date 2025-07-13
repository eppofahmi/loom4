# Loom4 - AI-Powered Productivity Platform

## Overview

Loom4 is a modern AI-powered productivity platform that combines project management, knowledge integration, and AI assistance in a single interface. It's designed to help teams and individuals streamline their workflows by connecting various knowledge sources and leveraging AI for enhanced productivity.

## Features

### Core Functionality
- **Project Management**: Organize and track projects with status indicators
- **Knowledge Integration**: Connect various data sources including files, web content, databases, and APIs
- **AI Chat Interface**: Interact with an AI assistant that has context from your connected knowledge
- **Artifact Generation**: Automatically create and store artifacts from conversations
- **Resizable Sidebars**: Customizable interface with collapsible and resizable side panels

### Key Components
- **Projects Section**: View and manage all your projects
- **Connect Section**: Link external knowledge sources
- **Artifacts Section**: Browse generated artifacts (code snippets, documents, etc.)
- **Chat Interface**: Communicate with the AI assistant
- **Artifact Viewer**: Resizable sidebar for viewing generated artifacts

## Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for loading external resources)

### Setup
1. Clone this repository:
   ```bash
   git clone https://github.com/eppofahmi/loom4.git
   ```
2. Open `index.html` in your web browser

## Usage

### Basic Navigation
- Use the left sidebar to switch between Projects, Connect, Artifacts, and Chat sections
- The right sidebar displays artifacts when they're generated
- Click the toggle button in the header to collapse/expand the left sidebar

### Working with Projects
1. Click "Add Project" to create a new project
2. Fill in project details (name, description, instructions)
3. Select or create a knowledge base for the project
4. Click "Save Project"

### Connecting Knowledge Sources
1. Navigate to the Connect section
2. Choose a connection type (Files, Web Content, Database, or API)
3. Follow the prompts to establish the connection
4. View connected sources in the Knowledge Overview section

### Using the AI Chat
1. Start a new chat or select an existing one
2. Type your message in the input field
3. The AI will respond with context from your connected knowledge
4. Relevant artifacts may be generated from the conversation

### Working with Artifacts
- Click any artifact to view it in the resizable right sidebar
- Drag the left edge of the sidebar to resize it
- Click the close button (X) to hide the artifact viewer

## Technical Details

### Technologies Used
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome for icons
- Custom CSS animations and transitions
- LocalStorage for persistent data

### File Structure
```
loom4/
├── index.html          # Main application file
├── styles.css          # All CSS styles
├── script.js           # Main JavaScript functionality
└── README.md           # This documentation file
```

## Customization

### Theme Settings
You can change the application theme:
1. Click your profile picture in the bottom left
2. Select "Settings"
3. Choose between Light, Dark, or System theme

### Resizing the Artifact Viewer
- Hover over the left edge of the artifact viewer to see the resize handle
- Click and drag to adjust the width
- On mobile devices, the artifact viewer becomes a bottom panel that can be resized vertically

## Known Limitations
- Currently uses browser localStorage for persistence (limited to ~5MB)
- No backend integration (all processing happens client-side)
- Mobile experience could be improved

## Future Enhancements
- Add backend integration for larger data storage
- Implement user authentication
- Add more knowledge source integrations
- Improve mobile responsiveness
- Add collaboration features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## Contact

For questions or feedback, please contact: [info@kedata.online](mailto:info@kedata.online)
