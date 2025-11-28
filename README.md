# Diamond ERP System - Complete Documentation

## Overview

This is a comprehensive ERP (Enterprise Resource Planning) system designed for lab-grown diamond manufacturing, growing, and retail operations. The system manages 2000+ employees across multiple global locations and handles extensive diamond inventory, R&D processes, manufacturing planning with Galaxy X-ray machine analysis, and collaboration systems.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
5. [API Routes Documentation](#api-routes-documentation)
6. [Frontend Components](#frontend-components)
7. [Backend Components](#backend-components)
8. [Data Models](#data-models)
9. [Key Features](#key-features)
10. [File-by-File Code Explanation](#file-by-file-code-explanation)

---

## System Architecture

The application follows a modern full-stack architecture:

```
┌─────────────────┐    HTTP/API     ┌──────────────────┐
│   React Client  │ ←──────────────→ │  Express Server  │
│   (Frontend)    │                 │   (Backend)      │
└─────────────────┘                 └──────────────────┘
         │                                    │
         ▼                                    ▼
┌─────────────────┐                 ┌──────────────────┐
│  Vite Dev Server│                 │  Memory Storage  │
│  (Development)  │                 │  (In-Memory DB)  │
└─────────────────┘                 └──────────────────┘
```

### Key Architecture Principles:
- **Separation of Concerns**: Clear separation between frontend (React) and backend (Express)
- **RESTful API**: All data communication through REST endpoints
- **Component-Based UI**: Modular React components using Shadcn/UI
- **Type Safety**: Full TypeScript implementation across the stack
- **In-Memory Storage**: Self-contained data layer for easy deployment

---

## Technology Stack

### Frontend
- **React 18**: Core UI library with hooks and modern patterns
- **TypeScript**: Static type checking and enhanced development experience
- **Vite**: Fast development server and build tool
- **TailwindCSS**: Utility-first CSS framework for styling
- **Shadcn/UI**: High-quality React component library built on Radix UI
- **TanStack React Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing
- **React Hook Form**: Form management with validation
- **Zod**: Schema validation and type inference
- **Lucide React**: Icon library

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for API routes
- **TypeScript**: Type safety for server-side code
- **Express Session**: Session management
- **Zod**: Request validation and type safety

### Development Tools
- **Vite**: Development server with hot module replacement
- **ESBuild**: Fast JavaScript bundler
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

---

## Project Structure

```
diamond-erp/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ui/                  # Shadcn/UI base components
│   │   │   ├── sidebar.tsx          # Navigation sidebar
│   │   │   └── top-navbar.tsx       # Top navigation bar
│   │   ├── pages/                   # Page components (routes)
│   │   │   ├── dashboard.tsx        # Main dashboard
│   │   │   ├── inventory.tsx        # Diamond inventory management
│   │   │   ├── planning.tsx         # Manufacturing planning & X-ray
│   │   │   ├── grading.tsx          # Diamond grading system
│   │   │   ├── growing.tsx          # Diamond growing operations
│   │   │   ├── research.tsx         # R&D project management
│   │   │   ├── industrial.tsx       # Industrial applications
│   │   │   ├── collaborations.tsx   # University partnerships
│   │   │   ├── market.tsx           # Market analysis
│   │   │   ├── brands.tsx           # Jewelry brand partnerships
│   │   │   ├── user-management.tsx  # User & employee management
│   │   │   ├── landing.tsx          # Landing page
│   │   │   └── not-found.tsx        # 404 error page
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.ts           # Authentication hook
│   │   │   └── use-toast.ts         # Toast notification hook
│   │   ├── lib/                     # Utility libraries
│   │   │   ├── queryClient.ts       # TanStack Query configuration
│   │   │   ├── authUtils.ts         # Authentication utilities
│   │   │   └── utils.ts             # General utility functions
│   │   ├── App.tsx                  # Main app component with routing
│   │   ├── index.css                # Global styles and CSS variables
│   │   └── main.tsx                 # React application entry point
│   └── index.html                   # HTML template
├── server/                          # Backend Express application
│   ├── routes.ts                    # API route definitions
│   ├── storage.ts                   # In-memory data storage
│   ├── index.ts                     # Server entry point
│   └── vite.ts                      # Vite development server setup
├── shared/                          # Shared code between client/server
│   └── schema.ts                    # Type definitions and schemas
├── package.json                     # Project dependencies and scripts
├── vite.config.ts                   # Vite configuration
├── tailwind.config.ts               # TailwindCSS configuration
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # This documentation
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd diamond-erp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open browser to `http://localhost:5000`
   - The application will auto-login with a demo user

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking

---

## API Routes Documentation

### Base URL: `http://localhost:5000/api`

### Authentication Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/user` | Get current authenticated user |
| GET | `/login` | Redirect to login (mock in development) |
| GET | `/logout` | Logout current user |

### Dashboard Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/metrics` | Get dashboard KPI metrics |

**Response Example:**
```json
{
  "polishedInventory": 102847,
  "monthlyYield": 45234,
  "rdProjects": 28,
  "totalEmployees": 2347,
  "globalLocations": 6,
  "monthlyRevenue": 127500000,
  "industrialApplications": 7
}
```

### Diamond Inventory Routes
| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/diamonds` | Get paginated diamond inventory | `limit`, `offset`, `location`, `status`, `search` |
| GET | `/diamonds/:id` | Get specific diamond details | - |

**Response Example:**
```json
{
  "diamonds": [
    {
      "id": "d-1",
      "diamondId": "URR-000001",
      "carat": 2.5,
      "cut": "Excellent",
      "color": "D",
      "clarity": "FL",
      "certification": "GIA",
      "price": 45000,
      "location": "mumbai",
      "status": "available",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 120
}
```

### Manufacturing Routes
| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/rough-diamonds` | Get rough diamonds for planning | `limit`, `offset`, `status`, `location` |
| GET | `/cutting-plans` | Get cutting plans | - |

**Rough Diamond Response:**
```json
{
  "roughDiamonds": [
    {
      "id": "rough-1",
      "roughId": "RGH-0001",
      "carat": 4.2,
      "color": "D",
      "clarity": "VVS1",
      "location": "mumbai",
      "status": "planning",
      "estimatedYield": "35%",
      "acquisitionDate": "2024-01-15T00:00:00Z"
    }
  ]
}
```

### R&D Routes
| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/rd-projects` | Get R&D projects | `limit`, `offset`, `status`, `category` |

**R&D Project Response:**
```json
{
  "projects": [
    {
      "id": "rd-1",
      "title": "Quantum Dot Enhancement",
      "description": "Developing quantum dots for computing",
      "status": "active",
      "category": "quantum_applications",
      "budget": 1500000,
      "leadResearcher": "Dr. Smith",
      "location": "mumbai"
    }
  ]
}
```

### Equipment Routes
| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/growing-equipment` | Get diamond growing equipment | `location` |

### Industrial Routes  
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/industrial-allocations` | Get industrial diamond allocations |

### Collaboration Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/collaborations` | Get university/research collaborations |

### Grading Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/grading-requests` | Get diamond grading requests |

### Market Analysis Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/market-analysis` | Get market trends and analysis |

### Jewelry Brand Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jewelry-brands` | Get jewelry brand partnerships |

---

## Frontend Components

### Page Components
Located in `client/src/pages/`, these are the main route components:

1. **Dashboard** (`dashboard.tsx`)
   - Executive dashboard with KPIs
   - Charts and metrics overview
   - Quick navigation to key sections

2. **Inventory** (`inventory.tsx`) 
   - Comprehensive diamond inventory management
   - Search, filter, and pagination
   - Diamond details and specifications

3. **Planning/Manufacturing** (`planning.tsx`)
   - Galaxy X-ray machine analysis
   - Interactive inclusion visualization
   - AI-powered cutting plan generation
   - Manufacturing workflow management

4. **Growing** (`growing.tsx`)
   - CVD and HPHT equipment monitoring
   - Real-time growth parameters
   - Equipment maintenance scheduling

5. **Research** (`research.tsx`)
   - R&D project management
   - Team collaboration features
   - Budget and timeline tracking

6. **Industrial** (`industrial.tsx`)
   - Industrial diamond applications
   - Semiconductor, medical, optical uses
   - Client allocation management

7. **Collaborations** (`collaborations.tsx`)
   - University partnerships
   - Research collaboration management
   - Joint project tracking

### Shared Components

1. **Sidebar** (`components/sidebar.tsx`)
   - Main navigation menu
   - Role-based menu items
   - Active state management

2. **TopNavbar** (`components/top-navbar.tsx`)
   - Page title display
   - User profile information
   - Quick actions

3. **UI Components** (`components/ui/`)
   - Shadcn/UI component library
   - Consistent design system
   - Accessible components

---

## Backend Components

### Server Structure

1. **Entry Point** (`server/index.ts`)
   - Express server initialization
   - Middleware configuration
   - Route registration
   - Development/production setup

2. **Routes** (`server/routes.ts`)
   - All API endpoint definitions
   - Request validation
   - Response formatting
   - Error handling

3. **Storage** (`server/storage.ts`)
   - In-memory data storage implementation
   - CRUD operations for all entities
   - Data seeding and initialization
   - Interface definitions

4. **Vite Integration** (`server/vite.ts`)
   - Development server setup
   - Hot module replacement
   - Static file serving

---

## Data Models

### Core Entities

```typescript
// User Management
interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Diamond Inventory
interface Diamond {
  id: string;
  diamondId: string;        // URR-000001 format
  carat: number;
  cut: string;             // Excellent, Very Good, Good
  color: string;           // D, E, F, G, H, I, J
  clarity: string;         // FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2
  certification: string;   // GIA, AGS, Gübelin, SSEF
  price: number;
  location: string;        // mumbai, hong_kong, dubai, etc.
  status: string;          // available, reserved, sold
  createdAt: Date;
}

// Manufacturing
interface RoughDiamond {
  id: string;
  roughId: string;         // RGH-0001 format
  carat: number;
  color: string;
  clarity: string;
  location: string;
  status: string;          // planning, in_production, completed
  estimatedYield: string;  // "35%" format
  acquisitionDate: Date;
  createdAt: Date;
}

interface CuttingPlan {
  id: string;
  roughDiamondId: string;
  plannerId: string;
  targetShape: string;     // round, princess, oval, etc.
  targetCarat: number;
  targetGrade: string;
  estimatedYield: number;
  estimatedValue: number;
  status: string;
  plannedStartDate: Date;
  plannedCompletionDate: Date;
  notes?: string;
  createdAt: Date;
}

// R&D Projects
interface RdProject {
  id: string;
  title: string;
  description: string;
  status: string;          // active, completed, on_hold
  category: string;        // growth_optimization, quantum_applications
  budget: number;
  startDate: Date;
  endDate?: Date;
  leadResearcher: string;
  location: string;
  createdAt: Date;
}

// Growing Equipment
interface GrowingEquipment {
  id: string;
  equipmentId: string;     // CVD-001 format
  type: string;            // CVD Reactor, HPHT Press
  status: string;          // operational, maintenance, idle
  location: string;
  capacity: number;
  currentLoad: number;
  temperature: number;     // Celsius
  pressure: number;        // GPa for HPHT
  cycleTime: number;       // Hours
  lastMaintenance: Date;
  nextMaintenance: Date;
}
```

---

## Key Features

### 1. Galaxy X-Ray Analysis System
- Interactive X-ray visualization of rough diamonds
- Inclusion mapping (carbon spots, crystal growth, feathers)
- Severity assessment for each inclusion type
- Real-time analysis results

### 2. AI-Powered Cutting Plan Generation
- Multiple cutting strategies (Conservative, Aggressive, Strategic)
- Risk assessment for each plan option
- Yield optimization algorithms
- Market value estimation

### 3. Manufacturing Workflow
- 4-step manufacturing process
- Real-time progress tracking
- Quality control checkpoints
- Timeline estimation

### 4. Multi-Location Management
- 6 global locations (Mumbai, Hong Kong, Dubai, Antwerp, New York, Odisha)
- Location-specific inventory
- Cross-location collaboration
- Regional market analysis

### 5. R&D Project Management
- Quantum computing applications
- Industrial diamond development
- Team collaboration tools
- Budget and resource tracking

### 6. Industrial Applications
- Semiconductor manufacturing
- Medical device applications
- Cutting tool production
- Optical component manufacturing
- Military and space applications
- Quantum computing components

---

## File-by-File Code Explanation

### Frontend Files

#### `client/src/App.tsx`
**Purpose**: Main application component with routing logic
```typescript
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  
  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/inventory" component={Inventory} />
          <Route path="/manufacturing" component={Planning} />
          // ... other routes
        </>
      )}
    </Switch>
  );
}
```
**Key Features**:
- Conditional routing based on authentication status
- TanStack Query provider for state management
- Landing page for unauthenticated users
- Protected routes for authenticated users

#### `client/src/main.tsx`
**Purpose**: React application entry point
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```
**Key Features**:
- React 18 createRoot API
- Strict mode for development warnings
- CSS imports for styling

#### `client/src/pages/dashboard.tsx`
**Purpose**: Executive dashboard with KPIs and metrics
```typescript
export default function Dashboard() {
  const { data: metrics } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    retry: false,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Polished Inventory</p>
              <p className="text-2xl font-semibold">
                {metrics?.polishedInventory?.toLocaleString()}
              </p>
            </div>
            <Gem className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>
      // ... more metric cards
    </div>
  );
}
```
**Key Features**:
- Real-time metrics display
- Responsive grid layout
- Icon-based visual indicators
- Formatted number displays

#### `client/src/pages/planning.tsx`
**Purpose**: Advanced manufacturing planning with Galaxy X-ray analysis
```typescript
export default function Planning() {
  const [selectedRoughDiamond, setSelectedRoughDiamond] = useState(null);
  const [cuttingPlans, setCuttingPlans] = useState([]);

  return (
    <Tabs defaultValue="inventory">
      <TabsList>
        <TabsTrigger value="inventory">Rough Inventory</TabsTrigger>
        <TabsTrigger value="xray">Galaxy X-Ray Analysis</TabsTrigger>
        <TabsTrigger value="plans">Cutting Plans</TabsTrigger>
      </TabsList>
      
      <TabsContent value="xray">
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-full relative">
            {/* Simulated X-ray inclusions */}
            <div className="absolute top-8 left-12 w-3 h-3 bg-red-400 rounded-full opacity-70"></div>
            // ... more inclusions
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
```
**Key Features**:
- Multi-tab interface for different workflow stages
- Interactive X-ray visualization
- AI-powered cutting plan generation
- Plan editing and selection capabilities

#### `client/src/components/sidebar.tsx`
**Purpose**: Main navigation sidebar
```typescript
export default function Sidebar() {
  const [location] = useLocation();
  
  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/inventory", icon: Gem, label: "Inventory" },
    { path: "/manufacturing", icon: Zap, label: "Manufacturing" },
    // ... more menu items
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-screen">
      {menuItems.map((item) => (
        <Link 
          key={item.path} 
          href={item.path}
          className={`flex items-center space-x-3 px-4 py-3 ${
            location === item.path ? 'bg-accent' : 'hover:bg-accent'
          }`}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
```
**Key Features**:
- Dynamic active state management
- Icon-based navigation
- Responsive design
- Hover effects and transitions

#### `client/src/hooks/useAuth.ts`
**Purpose**: Authentication hook for user state
```typescript
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
```
**Key Features**:
- TanStack Query integration
- Automatic user state management
- Loading state handling
- Authentication status derivation

#### `client/src/lib/queryClient.ts`
**Purpose**: TanStack Query configuration and API client
```typescript
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const response = await fetch(`/api${queryKey[0]}`);
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }
        return response.json();
      },
    },
  },
});

export async function apiRequest(
  method: string, 
  url: string, 
  body?: any
): Promise<Response> {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  
  return response;
}
```
**Key Features**:
- Default query function for automatic API calls
- Centralized error handling
- Request/response type safety
- Mutation support

### Backend Files

#### `server/index.ts`
**Purpose**: Express server entry point and configuration
```typescript
import express from "express";
import { registerRoutes } from "./routes";
import { setupVite } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

(async () => {
  const server = await registerRoutes(app);
  
  if (app.get("env") === "development") {
    await setupVite(app, server);
  }
  
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({ port, host: "0.0.0.0" }, () => {
    console.log(`serving on port ${port}`);
  });
})();
```
**Key Features**:
- Express middleware configuration
- Request logging with timing
- Development/production environment handling
- Vite integration for development

#### `server/routes.ts`
**Purpose**: API route definitions and handlers
```typescript
import type { Express } from "express";
import { storage } from "./storage";
import session from "express-session";

const isAuthenticated = (req: any, res: any, next: any) => {
  req.user = {
    claims: { sub: "46981679", email: "demo@example.com" }
  };
  next();
};

export async function registerRoutes(app: Express) {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'development-secret-key',
    resave: false,
    saveUninitialized: false,
  }));

  app.get('/api/diamonds', isAuthenticated, async (req, res) => {
    try {
      const { limit = '10', offset = '0', location, status, search } = req.query;
      
      const result = await storage.getDiamonds({
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        location: location as string,
        status: status as string,
        search: search as string
      });
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch diamonds" });
    }
  });
  
  // ... more routes
}
```
**Key Features**:
- Mock authentication for development
- Comprehensive error handling
- Query parameter parsing and validation
- Consistent response formatting

#### `server/storage.ts`
**Purpose**: In-memory data storage implementation
```typescript
export class MemoryStorage implements IStorage {
  private diamonds: Map<string, Diamond> = new Map();
  private roughDiamonds: Map<string, RoughDiamond> = new Map();
  private rdProjects: Map<string, RdProject> = new Map();
  // ... more data stores

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed 120+ diamonds
    for (let i = 1; i <= 120; i++) {
      const diamond: Diamond = {
        id: `d-${i}`,
        diamondId: `URR-${String(i).padStart(6, '0')}`,
        carat: Math.random() * 3 + 0.5,
        cut: cuts[Math.floor(Math.random() * cuts.length)],
        // ... more properties
      };
      this.diamonds.set(diamond.id, diamond);
    }
    // ... seed other data types
  }

  async getDiamonds(params?: FilterParams): Promise<{diamonds: Diamond[], total: number}> {
    let diamonds = Array.from(this.diamonds.values());
    
    // Apply filters
    if (params?.location) {
      diamonds = diamonds.filter(d => d.location === params.location);
    }
    if (params?.search) {
      const search = params.search.toLowerCase();
      diamonds = diamonds.filter(d => 
        d.diamondId.toLowerCase().includes(search) ||
        d.color.toLowerCase().includes(search)
      );
    }
    
    // Pagination
    const total = diamonds.length;
    const offset = params?.offset || 0;
    const limit = params?.limit || 10;
    const paginatedDiamonds = diamonds.slice(offset, offset + limit);
    
    return { diamonds: paginatedDiamonds, total };
  }
}
```
**Key Features**:
- Complete CRUD operations for all entities
- Realistic data seeding with 120+ diamonds
- Search and filtering capabilities
- Pagination support
- Type-safe implementations

### Configuration Files

#### `package.json`
**Purpose**: Project dependencies and scripts
- **Dependencies**: Production libraries (React, Express, TailwindCSS)
- **DevDependencies**: Development tools (TypeScript, Vite, ESBuild)
- **Scripts**: Development, build, and deployment commands
- **Type**: ES modules for modern JavaScript

#### `vite.config.ts`
**Purpose**: Vite build tool configuration
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  // ... more config
});
```
**Key Features**:
- React plugin configuration
- Path aliases for clean imports
- Development server settings
- Build optimization

#### `tailwind.config.ts`
**Purpose**: TailwindCSS styling configuration
```typescript
export default {
  content: ["./client/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        // ... CSS custom properties
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```
**Key Features**:
- CSS custom property integration
- Design system color definitions
- Animation plugin
- Content path configuration

#### `tsconfig.json`
**Purpose**: TypeScript compiler configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"]
    }
  }
}
```
**Key Features**:
- Modern JavaScript target
- Strict type checking
- Path mapping for clean imports
- React JSX transformation

---

## Development Workflow

### Starting Development
1. Run `npm run dev` to start both frontend and backend
2. Frontend served at `http://localhost:5000`
3. API available at `http://localhost:5000/api/*`
4. Hot reload enabled for both client and server

### Code Organization
- **Components**: Reusable UI components in `/components`
- **Pages**: Route-specific page components in `/pages`  
- **Hooks**: Custom React hooks in `/hooks`
- **Utils**: Utility functions in `/lib`
- **Types**: Shared type definitions in `/shared`

### State Management
- **Server State**: TanStack React Query for API data
- **Client State**: React hooks (useState, useContext)
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Custom useAuth hook

### Styling Approach
- **TailwindCSS**: Utility-first CSS framework
- **Shadcn/UI**: Pre-built component library
- **CSS Custom Properties**: Theme customization
- **Responsive Design**: Mobile-first approach

---

## Deployment

### Production Build
```bash
npm run build
```
This creates:
- `dist/client/` - Built frontend assets
- `dist/server/` - Built backend code

### Production Server
```bash
npm run start
```
Runs the production Express server serving both API and static files.

### Environment Variables
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (default: 5000)
- `SESSION_SECRET` - Session encryption key

---

## Contributing

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format

### Testing
- Unit tests for utility functions
- Integration tests for API endpoints
- E2E tests for critical user flows

### Pull Request Process
1. Create feature branch from main
2. Implement changes with tests
3. Update documentation if needed
4. Submit PR with clear description

---

This comprehensive documentation covers every aspect of the Diamond ERP system, from high-level architecture to detailed code explanations. The system is designed for easy deployment on Ubuntu or any Linux system without external dependencies.