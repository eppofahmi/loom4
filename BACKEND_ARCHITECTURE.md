# Loom4 Backend Architecture

## Architecture Overview

This backend follows Clean Architecture principles with clear separation of concerns across layers:

```
┌─────────────────────────────────────────────┐
│                 Presentation Layer          │
│              (Controllers/Routes)           │
├─────────────────────────────────────────────┤
│                Application Layer            │
│               (Use Cases/Services)          │
├─────────────────────────────────────────────┤
│                  Domain Layer               │
│            (Entities/Business Rules)        │
├─────────────────────────────────────────────┤
│               Infrastructure Layer          │
│          (Repositories/External APIs)       │
└─────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Domain Layer (Core Business Logic)
- **Entities**: Core business objects (User, Project, Chat, Artifact, KnowledgeSource)
- **Value Objects**: Immutable objects (Email, ProjectStatus, ChatMessage)
- **Domain Services**: Business logic that doesn't belong to a single entity
- **Repository Interfaces**: Abstract data access contracts
- **Domain Events**: Business events that trigger side effects

### 2. Application Layer (Use Cases)
- **Use Cases**: Application-specific business rules
- **Command/Query Handlers**: CQRS pattern implementation
- **Application Services**: Orchestrate domain operations
- **DTOs**: Data transfer objects for API communication
- **Interfaces**: Contracts for external dependencies

### 3. Infrastructure Layer (External Concerns)
- **Repository Implementations**: Database access using MongoDB
- **External Services**: AI service integration, file storage
- **Event Handlers**: Domain event processing
- **Configuration**: Database, logging, external API configs

### 4. Presentation Layer (API Interface)
- **Controllers**: HTTP request/response handling
- **Routes**: API endpoint definitions
- **Middleware**: Authentication, validation, logging
- **Serializers**: Request/response data formatting

## Core Domain Models

### User Domain
```javascript
// Domain Entity
class User {
  constructor(id, email, name, hashedPassword, settings) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.hashedPassword = hashedPassword;
    this.settings = settings;
  }
  
  changePassword(newPassword) { /* business logic */ }
  updateSettings(newSettings) { /* business logic */ }
}

// Value Object
class Email {
  constructor(value) {
    if (!this.isValid(value)) throw new Error('Invalid email');
    this.value = value;
  }
  
  isValid(email) { /* validation logic */ }
}
```

### Project Domain
```javascript
class Project {
  constructor(id, userId, title, description, status, knowledgeBase) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.status = status; // ProjectStatus value object
    this.knowledgeBase = knowledgeBase;
    this.members = 0;
    this.tasks = 0;
    this.completion = 0;
  }
  
  activate() { this.status = ProjectStatus.ACTIVE; }
  complete() { this.status = ProjectStatus.COMPLETED; }
  addKnowledgeSource(source) { /* business logic */ }
}

class ProjectStatus {
  static ACTIVE = new ProjectStatus('active');
  static PLANNED = new ProjectStatus('planned');
  static COMPLETED = new ProjectStatus('completed');
}
```

### Chat Domain
```javascript
class Chat {
  constructor(id, userId, projectId, title) {
    this.id = id;
    this.userId = userId;
    this.projectId = projectId;
    this.title = title;
    this.messages = [];
    this.createdAt = new Date();
  }
  
  addMessage(message) {
    this.messages.push(message);
    this.updateTitle();
  }
  
  updateTitle() {
    if (this.messages.length > 0 && !this.title) {
      this.title = this.messages[0].content.substring(0, 30);
    }
  }
}

class ChatMessage {
  constructor(id, role, content, timestamp) {
    this.id = id;
    this.role = role; // 'user' or 'assistant'
    this.content = content;
    this.timestamp = timestamp;
    this.artifacts = [];
  }
}
```

### Knowledge Source Domain
```javascript
class KnowledgeSource {
  constructor(id, userId, title, type, description) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.type = type; // KnowledgeSourceType value object
    this.description = description;
    this.status = ConnectionStatus.PENDING;
    this.connectionConfig = {};
  }
  
  connect(config) {
    this.connectionConfig = config;
    this.status = ConnectionStatus.CONNECTED;
  }
  
  disconnect() {
    this.status = ConnectionStatus.DISCONNECTED;
  }
}

class KnowledgeSourceType {
  static FILE = new KnowledgeSourceType('file');
  static WEB = new KnowledgeSourceType('web');
  static DATABASE = new KnowledgeSourceType('database');
  static API = new KnowledgeSourceType('api');
}
```

## Use Cases (Application Layer)

### Authentication Use Cases
```javascript
class AuthenticateUserUseCase {
  constructor(userRepository, passwordService, tokenService) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.tokenService = tokenService;
  }
  
  async execute(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error('User not found');
    
    if (!await this.passwordService.verify(password, user.hashedPassword)) {
      throw new Error('Invalid credentials');
    }
    
    return this.tokenService.generateToken(user);
  }
}

class RegisterUserUseCase {
  constructor(userRepository, passwordService) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
  }
  
  async execute(email, password, name) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new Error('User already exists');
    
    const hashedPassword = await this.passwordService.hash(password);
    const user = new User(null, email, name, hashedPassword);
    
    return await this.userRepository.save(user);
  }
}
```

### Project Management Use Cases
```javascript
class CreateProjectUseCase {
  constructor(projectRepository, knowledgeBaseRepository) {
    this.projectRepository = projectRepository;
    this.knowledgeBaseRepository = knowledgeBaseRepository;
  }
  
  async execute(userId, projectData) {
    const knowledgeBase = await this.knowledgeBaseRepository.findById(
      projectData.knowledgeBaseId
    );
    
    const project = new Project(
      null,
      userId,
      projectData.title,
      projectData.description,
      ProjectStatus.PLANNED,
      knowledgeBase
    );
    
    return await this.projectRepository.save(project);
  }
}

class GetUserProjectsUseCase {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }
  
  async execute(userId) {
    return await this.projectRepository.findByUserId(userId);
  }
}
```

### Chat Use Cases
```javascript
class CreateChatUseCase {
  constructor(chatRepository, aiService) {
    this.chatRepository = chatRepository;
    this.aiService = aiService;
  }
  
  async execute(userId, projectId, firstMessage) {
    const chat = new Chat(null, userId, projectId, null);
    
    if (firstMessage) {
      const userMessage = new ChatMessage(
        null,
        'user',
        firstMessage,
        new Date()
      );
      chat.addMessage(userMessage);
    }
    
    return await this.chatRepository.save(chat);
  }
}

class SendMessageUseCase {
  constructor(chatRepository, aiService, artifactRepository) {
    this.chatRepository = chatRepository;
    this.aiService = aiService;
    this.artifactRepository = artifactRepository;
  }
  
  async execute(chatId, message) {
    const chat = await this.chatRepository.findById(chatId);
    
    const userMessage = new ChatMessage(null, 'user', message, new Date());
    chat.addMessage(userMessage);
    
    const aiResponse = await this.aiService.generateResponse(
      chat.messages,
      chat.projectId
    );
    
    const assistantMessage = new ChatMessage(
      null,
      'assistant',
      aiResponse.content,
      new Date()
    );
    
    if (aiResponse.artifacts) {
      for (const artifactData of aiResponse.artifacts) {
        const artifact = new Artifact(
          null,
          chat.userId,
          chat.id,
          artifactData.title,
          artifactData.type,
          artifactData.content
        );
        
        const savedArtifact = await this.artifactRepository.save(artifact);
        assistantMessage.artifacts.push(savedArtifact.id);
      }
    }
    
    chat.addMessage(assistantMessage);
    return await this.chatRepository.save(chat);
  }
}
```

### Knowledge Source Use Cases
```javascript
class ConnectKnowledgeSourceUseCase {
  constructor(knowledgeSourceRepository, connectionService) {
    this.knowledgeSourceRepository = knowledgeSourceRepository;
    this.connectionService = connectionService;
  }
  
  async execute(userId, sourceData) {
    const source = new KnowledgeSource(
      null,
      userId,
      sourceData.title,
      sourceData.type,
      sourceData.description
    );
    
    await this.connectionService.testConnection(
      sourceData.type,
      sourceData.connectionConfig
    );
    
    source.connect(sourceData.connectionConfig);
    return await this.knowledgeSourceRepository.save(source);
  }
}
```

## Repository Interfaces (Domain Layer)

```javascript
// Abstract repository interfaces
class UserRepository {
  async findById(id) { throw new Error('Not implemented'); }
  async findByEmail(email) { throw new Error('Not implemented'); }
  async save(user) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
}

class ProjectRepository {
  async findById(id) { throw new Error('Not implemented'); }
  async findByUserId(userId) { throw new Error('Not implemented'); }
  async save(project) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
}

class ChatRepository {
  async findById(id) { throw new Error('Not implemented'); }
  async findByUserId(userId) { throw new Error('Not implemented'); }
  async findByProjectId(projectId) { throw new Error('Not implemented'); }
  async save(chat) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
}
```

## Domain Events

```javascript
class UserRegisteredEvent {
  constructor(user) {
    this.user = user;
    this.occurredAt = new Date();
  }
}

class ProjectCreatedEvent {
  constructor(project) {
    this.project = project;
    this.occurredAt = new Date();
  }
}

class MessageSentEvent {
  constructor(chat, message) {
    this.chat = chat;
    this.message = message;
    this.occurredAt = new Date();
  }
}
```

## Technology Stack

### Backend Framework
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **TypeScript**: Type safety and better development experience

### Database
- **MongoDB**: NoSQL database for flexible document storage
- **Mongoose**: ODM for MongoDB integration

### Authentication
- **JWT**: JSON Web Tokens for stateless authentication
- **bcrypt**: Password hashing

### External Services
- **OpenAI API**: AI response generation
- **AWS S3**: File storage for artifacts
- **Redis**: Caching and session storage

### Development Tools
- **Jest**: Testing framework
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Docker**: Containerization

## Project Structure

```
backend/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   ├── value-objects/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── events/
│   ├── application/
│   │   ├── use-cases/
│   │   ├── services/
│   │   └── dtos/
│   ├── infrastructure/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── database/
│   │   └── config/
│   └── presentation/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       └── serializers/
├── tests/
├── docs/
└── package.json
```

This architecture ensures:
- **Testability**: Each layer can be tested independently
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new features and modify existing ones
- **Flexibility**: Business rules are independent of frameworks and databases