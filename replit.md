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

### AI Integration Layer - 7-Agent Council

**CULTURAL SPECIALIST (VETO POWER):**
- **Alan (NVIDIA/Hermes-based)**: Named after Alan Turing, the "Cultural Codebreaker" with VETO authority. Decrypts coded threats against vulnerable communities. Detects dog-whistles, identity-targeting patterns, and surveillance mechanisms disguised as policy. Alan's BLOCK overrides all other votes regardless of consensus. Uses NVIDIA NIM API as primary provider (Meta Llama 3.1 70B), with Lambda Labs and Nous Research as fallbacks.

**ADVISORY AGENTS (Context providers, non-voting):**
- **Hume AI**: Emotional intelligence analysis for community testimony (distress detection)
- **Cohere**: Policy RAG for current context retrieval and signal reranking

**VOTING AGENTS:**
- **Claude**: Anthropic Claude (claude-sonnet-4-5) - General policy analysis
- **OpenAI**: GPT-4o for policy summaries
- **Gemini**: Google's Gemini 2.5 Flash for fast policy analysis
- **Mistral**: European AI for GDPR-conscious policy analysis
- **Llama**: Meta Llama 3.1 via NVIDIA NIM / Groq / Together for open-source reasoning

- **Pattern**: Multi-model fallback chain OR 7-agent multi-agent deliberation
  - Fallback: Claude → OpenAI → Gemini → Mistral → Hermes → Static fallback
  - Deliberation: Advisory prep → 6 voting agents + Alan in parallel → Cross-review → Alan veto review → Consensus synthesis
  - All integrations work in degraded mode when API keys absent

- **Multi-Agent Deliberation** (POST /api/pilots/:id/deliberate):
  - Phase 1: Advisory agents (Hume, Cohere) gather emotional + policy context
  - Phase 2: Alan + 5 voting agents vote in parallel with advisory context
  - Phase 3: Claude, OpenAI, Gemini cross-review all votes
  - Phase 4: Alan veto review - can escalate to BLOCK after seeing all votes
  - Phase 5: Consensus synthesis - Alan's BLOCK overrides all other votes
  - Modes: `?mode=full` (7 agents + all phases) or `?mode=quick` (Alan + 3 agents + advisory)
  - Response includes: consensusLevel (unanimous/majority/plurality/single/veto), statusVotes, vetoTriggered, codedThreatsDetected, advisoryContext

- **Key Features**:
  - Alan's VETO power - protects vulnerable communities regardless of majority vote
  - Emotional intelligence from Hume integrated into deliberation
  - Policy RAG from Cohere provides current context
  - Multi-agent deliberation with consensus synthesis
  - Coded threat detection (dog whistles, surveillance patterns)
  - Deliberation observability tracking (GET /api/observability/deliberations)

- **What If Scenario Exploration** (WhatIf agent via NVIDIA/Hermes):
  - `POST /api/pilots/:id/whatif` - Explore edge cases and hypothetical scenarios
  - `POST /api/pilots/:id/whatif/community` - Targeted questions for specific communities (trans, disabled, neurodivergent, trauma_survivors, intersectional)
  - `POST /api/pilots/:id/whatif/consequences` - Analyze unintended consequences of policy changes
  - Uses NVIDIA NIM API as primary provider, with Lambda/Nous as fallbacks
  - Heuristic fallbacks when no API keys configured

### Morpheus Governance Signal Integration
- **Purpose**: Detect dog whistles, coded language, and surveillance patterns in organizational communications
- **Schema**: `governanceSignals` table with 7 categories: dog_whistle, identity_targeting, surveillance_concern, policy_subversion, queer_coded_hostility, ableist_language, racial_microaggression
- **Canonical orgId**: Pilots have auto-generated `orgId` normalized from `orgName` (lowercase, underscores). Signals must use this canonical orgId for matching.
- **API Endpoints**:
  - `POST /api/signals` - Ingest signals from GPU pipeline (requires pilot ownership with matching orgId)
  - `GET /api/signals/org/:orgId` - Retrieve signals for org (requires pilot ownership with matching orgId)
- **Council Integration**: Signals are aggregated by category and injected into Claude/OpenAI prompts with safety caveats ("treat as early warning, not accusation")
- **Authorization**: Signal access requires user owns at least one pilot with matching canonical orgId
- **Note for Production**: Consider enforcing org verification at registration to prevent spoofing

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
- `AI_INTEGRATIONS_GEMINI_API_KEY` - Gemini API key (via Replit AI Integrations)
- `AI_INTEGRATIONS_GEMINI_BASE_URL` - Gemini API base URL (via Replit AI Integrations)

### Optional AI Services (enhanced capabilities when configured)
- `NVIDIA_API_KEY` - NVIDIA NIM API for Alan, Llama, and WhatIf agents (PRIMARY provider)
- `NVIDIA_LLAMA_MODEL` - NVIDIA Llama model override (default: meta/llama-3.1-70b-instruct)
- `COHERE_API_KEY` - Cohere API for policy RAG, signal reranking, and embeddings
- `HUME_API_KEY` - Hume AI for emotional intelligence in testimony analysis
- `LAMBDA_API_KEY` - Lambda Labs API for Alan/WhatIf (fallback after NVIDIA)
- `NOUS_API_KEY` - Nous Research API for Alan/WhatIf (fallback after Lambda)
- `HERMES_MODEL` - Hermes model override for Lambda/Nous (default: hermes-3-llama-3.1-405b)
- `GROQ_API_KEY` - Groq API for Llama agent (fallback after NVIDIA)
- `TOGETHER_API_KEY` - Together AI for Llama agent (fallback after Groq)
- `LLAMA_MODEL` - Llama model override for Groq/Together (default: llama-3.1-70b-versatile)
- `MISTRAL_API_KEY` - Mistral AI for European policy analysis
- `MISTRAL_MODEL` - Mistral model override (default: mistral-large-latest)

### Provider Fallback Chains
- **Alan/WhatIf agents**: NVIDIA → Lambda → Nous → Heuristic fallback
- **Llama agent**: NVIDIA → Groq → Together → Unavailable
- **Primary agents** (Claude, OpenAI, Gemini, Mistral): Replit AI Integrations

## Testing

### Stress Test Suite
Run comprehensive stress tests with:
```bash
./scripts/stress_test.sh http://localhost:5000
```

Tests include:
- Basic connectivity and authentication
- Parallel pilot creation (5 concurrent)
- Simulation execution on all pilots
- Morpheus governance signal injection (5 categories)
- Council advice with large payloads and signal integration
- Error handling (malformed JSON, missing fields)
- Authorization protection
- Concurrent Council requests
- Council decision log retrieval