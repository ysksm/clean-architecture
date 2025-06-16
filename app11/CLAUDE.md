 CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is app11 in a clean architecture examples repository. It's a freshly generated Angular 20 application that can be structured following clean architecture principles similar to the other example apps in this repository.

## Common Development Commands

### Development
```bash
npm install        # Install dependencies
npm start          # Start development server (runs ng serve)
ng serve           # Alternative: start dev server at http://localhost:4200/
```

### Testing
```bash
npm test           # Run unit tests with Karma
ng test            # Alternative: run unit tests
ng test --no-watch --code-coverage  # Run tests once with coverage
```

### Building
```bash
npm run build      # Build for production
ng build           # Alternative: build for production
ng build --watch --configuration development  # Build and watch for changes
```

### Code Generation
```bash
ng generate component components/component-name  # Generate a new component
ng generate service services/service-name        # Generate a new service
ng generate module modules/module-name           # Generate a new module
ng generate directive directives/directive-name  # Generate a new directive
ng generate pipe pipes/pipe-name                 # Generate a new pipe
```

## Clean Architecture Structure

Based on the patterns in other apps in this repository, particularly app1, app2, and app6, the recommended clean architecture structure for Angular is:

```
src/
├── domain/                 # Enterprise business rules
│   ├── entities/          # Domain entities
│   ├── repositories/      # Repository interfaces
│   └── value-objects/     # Value objects
├── application/           # Application business rules
│   ├── use-cases/        # Use case implementations
│   └── services/         # Application services
├── infrastructure/        # Frameworks and drivers
│   ├── repositories/     # Repository implementations
│   ├── api/             # API clients and services
│   └── persistence/     # Data persistence
└── presentation/         # Interface adapters
    ├── components/      # Angular components
    ├── services/        # Angular services
    └── pages/          # Page components

```

## Architecture Principles

1. **Dependency Rule**: Dependencies should point inward. Domain layer should not depend on any other layer.

2. **Use Cases**: Each use case should represent a single user action or business operation, coordinating between repositories and domain entities.

3. **Repository Pattern**: Use interfaces in the domain layer and implementations in the infrastructure layer to abstract data access.

4. **Dependency Injection**: Use Angular's DI system to inject dependencies, maintaining the dependency inversion principle.

## Angular-Specific Configuration

- **Framework**: Angular 20.0.2
- **TypeScript**: Strict mode enabled
- **Styling**: SCSS
- **Testing**: Karma + Jasmine
- **Change Detection**: Zoneless (experimental feature enabled)

## Related Examples in Repository

- **app1**: React implementation with adapters/application/domain/infrastructure layers
- **app2**: React with core/adapters/frameworks structure
- **app6**: Full-stack DDD implementation with custom binary protocol, detailed Japanese documentation
- **app8**: React with Next.js
- **app10**: React implementation
- **app12**: Remix implementation