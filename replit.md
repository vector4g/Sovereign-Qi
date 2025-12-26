# Sovereign Qi

## Overview

Sovereign Qi is a "Simulation Before Legislation" SaaS platform that enables enterprises, cities, and healthcare organizations to run digital twin simulations with a focus on accessibility-first, queer-led governance principles. The platform allows users to create pilot projects, configure simulation parameters comparing "Majority Logic" vs "Qi Logic" approaches, and receive AI-powered council advice on policy recommendations.

The core concept centers on testing policy decisions in simulated environments before real-world implementation, with emphasis on protecting vulnerable populations and ensuring dignity-centered outcomes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, React Context for auth state
- **Styling**: Tailwind CSS v4 with custom theme variables for dark mode design
- **UI Components**: shadcn/ui component library (Radix primitives) with custom theming
- **Animations**: Framer Motion for page transitions and micro-interactions

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Design**: RESTful JSON APIs under `/api/*` prefix
- **Authentication**: Session-based auth using email-only login (simplified magic link pattern)
- **Session Storage**: Database-backed sessions with expiration

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for shared type definitions
- **Migrations**: Drizzle Kit for schema management (`drizzle-kit push`)
- **Tables**: 
  - `sessions` - Auth session storage
  - `pilots` - Simulation project configurations
  - `simulations` - Simulation result storage
  - `conversations`/`messages` - Chat history for AI interactions

### AI Integration Layer
- **Primary AI**: Anthropic Claude (claude-sonnet-4-5) for policy analysis and council advice
- **Secondary AI**: OpenAI GPT-4o for policy summaries and image generation
- **Pattern**: Multi-model fallback - tries OpenAI first, falls back to Anthropic
- **Key Features**:
  - Council advice generation with structured output (APPROVE/REVISE/BLOCK)
  - Community voice summarization for accessibility constraints
  - Simulation metrics generation (innovation, burnout, liability indices)

### Morpheus Governance Signal Integration
- **Purpose**: Detect dog whistles, coded language, and surveillance patterns in organizational communications
- **Schema**: `governanceSignals` table with 7 categories: dog_whistle, identity_targeting, surveillance_concern, policy_subversion, queer_coded_hostility, ableist_language, racial_microaggression
- **API Endpoints**:
  - `POST /api/signals` - Ingest signals from GPU pipeline (requires pilot ownership in org)
  - `GET /api/signals/org/:orgId` - Retrieve signals for org (requires pilot ownership)
- **Council Integration**: Signals are aggregated by category and injected into Claude/OpenAI prompts with safety caveats ("treat as early warning, not accusation")
- **Authorization**: Signal access requires user owns at least one pilot with matching orgName
- **Note for Production**: Consider adding canonical orgId field to pilots and enforcing org verification to prevent spoofing

### Build System
- **Client Build**: Vite for development and production builds
- **Server Build**: esbuild for bundling server code
- **Output**: Combined build outputs to `dist/` directory

## External Dependencies

### AI Services
- **Anthropic API**: Primary AI provider for policy analysis
  - Configured via `AI_INTEGRATIONS_ANTHROPIC_API_KEY` and `AI_INTEGRATIONS_ANTHROPIC_BASE_URL`
  - Models used: claude-sonnet-4-5
- **OpenAI API**: Secondary AI provider and image generation
  - Configured via `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`
  - Models used: gpt-4o, gpt-image-1

### Database
- **PostgreSQL**: Primary data store
  - Connection via `DATABASE_URL` environment variable
  - Connection pooling with pg Pool (max 10 connections)

### Third-Party Libraries
- **Radix UI**: Accessible component primitives for all UI elements
- **React Hook Form + Zod**: Form handling with schema validation
- **date-fns**: Date formatting utilities

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `AI_INTEGRATIONS_ANTHROPIC_API_KEY` - Anthropic API key
- `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` - Anthropic API base URL
- `AI_INTEGRATIONS_OPENAI_API_KEY` - OpenAI API key
- `AI_INTEGRATIONS_OPENAI_BASE_URL` - OpenAI API base URL