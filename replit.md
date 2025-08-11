# Eventra - Calendar & Event Management

## Overview

Eventra is a modern calendar application built with a full-stack TypeScript architecture. It provides event management capabilities with dual view modes (grid and list), theme switching (light/dark), and a responsive design. The application allows users to create, view, edit, and delete calendar events with a clean, Google-inspired interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack React Query for server state management and local React state for UI state
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives wrapped in custom components for accessibility and consistency

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling and request logging
- **Development Server**: Integrated Vite development server with HMR support

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **Development Storage**: In-memory storage implementation for development/testing
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Connection**: Neon Database serverless PostgreSQL for production deployment

### Authentication and Authorization
- **Current Implementation**: Basic structure in place with user schema defined
- **Session Management**: Connect-pg-simple for PostgreSQL session storage (configured but not fully implemented)
- **Architecture**: Prepared for cookie-based sessions with user/event ownership model

### Component Architecture
- **Design System**: shadcn/ui components with consistent theming through CSS variables
- **Theme System**: Context-based theme provider supporting light/dark modes with localStorage persistence
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing
- **Error Handling**: Toast notifications for user feedback and comprehensive error boundaries

### Key Features Implementation
- **Calendar Views**: Grid view with month navigation and list view for chronological event display
- **Event Management**: Full CRUD operations with real-time UI updates through React Query
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: ARIA-compliant components using Radix UI primitives
- **Internationalization Ready**: Date-fns for date formatting and manipulation

## External Dependencies

### Core Framework Dependencies
- **React**: Frontend framework with TypeScript support
- **Vite**: Development server and build tool with React plugin
- **Express**: Backend web framework for API routes

### Database and ORM
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL dialect
- **@neondatabase/serverless**: PostgreSQL database connection for serverless environments
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Headless UI components for accessibility and functionality
- **Lucide React**: Icon library for consistent iconography

### State Management and Data Fetching
- **TanStack React Query**: Server state management with caching and synchronization
- **React Hook Form**: Form handling with @hookform/resolvers for validation
- **Zod**: Runtime type validation and schema validation

### Development and Build Tools
- **TypeScript**: Static type checking for both frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer
- **tsx**: TypeScript execution for development server

### Utility Libraries
- **date-fns**: Date manipulation and formatting library
- **clsx & tailwind-merge**: Utility for conditional CSS classes
- **class-variance-authority**: Utility for component variant management
- **wouter**: Lightweight routing library for React