# Diamond ERP System

## Overview

This is a comprehensive ERP system for lab-grown diamond manufacturing, growing, and retail operations. The system manages 2000+ employees across multiple global locations (Mumbai, Hong Kong, Dubai, Antwerp, New York, Odisha) and handles extensive diamond inventory, R&D projects, and manufacturing processes. The application provides role-based access control for different user types including super admins, admins, regular users, R&D engineers, and scientists.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: TailwindCSS with CSS variables for theming
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful APIs with proper error handling

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless configuration
- **Schema Management**: Drizzle Kit for migrations and schema changes
- **Key Entities**: 
  - Users with role-based permissions
  - Diamond inventory with detailed specifications
  - R&D projects and team collaborations
  - Rough diamonds and cutting plans
  - Industrial allocations and equipment tracking
- **Enums**: Comprehensive enums for locations, diamond grades, certifications, and user roles

### Authentication & Authorization
- **Provider**: Replit Auth using OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions
- **Role-Based Access**: Five user roles with different permission levels
- **Security**: HTTPS-only cookies, session-based authentication

### Data Management
- **Inventory**: 100,000+ polished diamonds with detailed grading information
- **Manufacturing**: Rough diamond processing with multiple cutting plan options
- **R&D**: Project management with team assignments and budget tracking
- **Multi-location**: Global inventory and user management across 6 locations

## External Dependencies

### Third-Party Services
- **Neon Database**: Serverless PostgreSQL database hosting
- **Replit Auth**: Authentication and user management service

### Key Libraries
- **@neondatabase/serverless**: Database connection with WebSocket support
- **@radix-ui/***: Comprehensive UI component primitives
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database ORM
- **drizzle-zod**: Schema validation integration
- **wouter**: Lightweight React router
- **tailwindcss**: Utility-first CSS framework
- **zod**: TypeScript-first schema validation

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Static type checking
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing with Autoprefixer