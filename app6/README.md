# Task Management System

A full-stack task management application built with Domain-Driven Design (DDD) and layered architecture principles. Features binary communication between frontend and backend using IDL-defined structures.

## Architecture

### Frontend (React + TypeScript)
- **Presentation Layer**: React components, contexts, UI logic
- **Application Layer**: Use cases and business logic coordination
- **Domain Layer**: Entities, value objects, repository interfaces
- **Infrastructure Layer**: HTTP client with binary protocol communication

### Backend (Bun.sh + Express)
- **Presentation Layer**: Controllers, REST API endpoints
- **Application Layer**: Application services, DTOs
- **Domain Layer**: Entities, value objects, domain services, repository interfaces  
- **Infrastructure Layer**: Repository implementations, external dependencies

### Communication
- Binary protocol using IDL-defined structures
- Memory-mapped data structures for efficient serialization/deserialization
- GET and POST operations only, no JSON - pure binary data exchange

## Features

- **Task Management**: Create, read, update, delete tasks
- **Task Properties**: Title, description, status, priority, due date
- **Task Status**: Pending, In Progress, Completed, Cancelled
- **Task Priority**: Low, Medium, High, Urgent
- **Statistics**: Real-time task count by status
- **UI**: Responsive design with task grouping and inline editing

## Project Structure

```
app6/
├── backend/                 # Backend application
│   ├── src/
│   │   ├── domain/         # Domain layer
│   │   │   ├── entities/   # Domain entities
│   │   │   ├── valueObjects/ # Value objects
│   │   │   ├── enums/      # Domain enums
│   │   │   └── repositories/ # Repository interfaces
│   │   ├── application/    # Application layer
│   │   │   ├── dto/        # Data transfer objects
│   │   │   └── services/   # Application services
│   │   ├── infrastructure/ # Infrastructure layer
│   │   │   └── repositories/ # Repository implementations
│   │   └── presentation/   # Presentation layer
│   │       └── controllers/ # REST controllers
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── domain/        # Domain layer
│   │   │   ├── entities/  # Domain entities
│   │   │   └── repositories/ # Repository interfaces
│   │   ├── application/   # Application layer
│   │   │   └── usecases/  # Use cases
│   │   ├── infrastructure/ # Infrastructure layer
│   │   │   └── repositories/ # HTTP repository implementations
│   │   ├── presentation/  # Presentation layer
│   │   │   ├── components/ # React components
│   │   │   └── contexts/  # React contexts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── shared/                # Shared code
    └── idl/              # Interface Definition Language
        ├── task.idl      # IDL schema definition
        └── generator.ts  # Binary protocol generator
```

## Getting Started

### Prerequisites
- [Bun.sh](https://bun.sh/) installed
- Node.js 18+ (for frontend)

### Backend Setup
```bash
cd backend
bun install
bun run dev
```
The backend will start on http://localhost:3001

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on http://localhost:3000

## Development

### Backend Scripts
- `bun run dev` - Start development server with hot reload
- `bun run build` - Build for production
- `bun run test` - Run unit tests
- `bun run lint` - Run ESLint
- `bun run typecheck` - Run TypeScript type checking

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests with Vitest
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Binary Protocol

The application uses a custom binary protocol for communication:

1. **IDL Definition**: `shared/idl/task.idl` defines the data structures
2. **Code Generation**: `shared/idl/generator.ts` provides TypeScript interfaces and serialization
3. **Memory Mapping**: Efficient binary serialization/deserialization
4. **Type Safety**: Full TypeScript support for binary structures

## Testing Strategy

The project is designed to support multiple testing levels:

- **Unit Tests**: Test individual components and functions in isolation
- **Integration Tests**: Test interaction between layers
- **UI Tests**: Test React components and user interactions  
- **E2E Tests**: Test complete user workflows end-to-end

## Design Principles

### Domain-Driven Design (DDD)
- **Ubiquitous Language**: Consistent terminology across all layers
- **Bounded Contexts**: Clear separation of concerns
- **Domain Entities**: Rich domain models with behavior
- **Value Objects**: Immutable objects representing domain concepts

### Layered Architecture
- **Dependency Inversion**: Domain layer independent of infrastructure
- **Separation of Concerns**: Each layer has single responsibility
- **Testability**: Easy to test each layer in isolation
- **Maintainability**: Clear structure and dependencies

### Clean Code
- **SOLID Principles**: Single responsibility, open/closed, etc.
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Consistent error handling patterns
- **Documentation**: Self-documenting code with clear naming

## Learning Objectives

This project demonstrates:
- Domain-Driven Design implementation
- Layered architecture with dependency inversion
- Binary communication protocols
- TypeScript best practices
- React patterns and state management
- Testing strategies across the stack
- Clean code principles