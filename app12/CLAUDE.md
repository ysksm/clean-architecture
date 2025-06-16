# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Remix application (app12) that is part of a larger clean architecture demonstration repository. The repository contains multiple implementations (app1-app12) showcasing clean architecture patterns across different JavaScript/TypeScript frameworks.

## Technology Stack

- **Framework**: Remix (React-based full-stack framework)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Runtime**: Node.js (v20+)
- **Package Manager**: npm

## Common Commands

```bash
# Development
npm run dev          # Start development server (Remix with Vite)

# Build
npm run build        # Build for production

# Production
npm start           # Run production server

# Code Quality
npm run lint        # Run ESLint
npm run typecheck   # Run TypeScript type checking
```

## Architecture Overview

This repository demonstrates Clean Architecture principles with the following layer structure:

1. **Presentation Layer**: UI components, routes, controllers
2. **Application Layer**: Use cases, application services, DTOs
3. **Domain Layer**: Entities, value objects, business logic, repository interfaces
4. **Infrastructure/Data Layer**: Repository implementations, external APIs, data sources

### Key Architectural Principles

- **Dependency Inversion**: Core business logic doesn't depend on frameworks or external libraries
- **Separation of Concerns**: Each layer has distinct responsibilities
- **Domain-Centric Design**: Business logic is isolated in the domain layer
- **Framework Independence**: Core layers are framework-agnostic

## Project Structure

```
app12/
├── app/                    # Remix application directory
│   ├── routes/            # Route components
│   ├── root.tsx           # Root layout component
│   └── entry.*.tsx        # Entry points for client/server
├── public/                # Static assets
├── build/                 # Production build output
└── node_modules/          # Dependencies
```

## TypeScript Configuration

- Path alias configured: `~/*` maps to `./app/*`
- Strict type checking enabled
- Module resolution set to "Bundler"

## Important Notes

- No test runner is currently configured in app12
- For clean architecture examples with tests, refer to app6 which includes Jest configuration
- The repository uses various approaches across different apps - app6 has the most comprehensive documentation including a custom binary protocol (MIDL) implementation