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

### AI Integration Layer - 8-Agent Liberation Pioneer Council

All agents are named after liberation pioneers who were persecuted, erased, or excluded but made crucial contributions to justice and human rights.

**CULTURAL SPECIALIST (VETO POWER):**
- **Alan (Turing)**: The "Cultural Codebreaker" with VETO authority. Named after Alan Turing, the gay mathematician who cracked Enigma and was chemically castrated for his sexuality. Decrypts coded threats against vulnerable communities. Detects dog-whistles, identity-targeting patterns, and surveillance mechanisms disguised as policy. Alan's BLOCK overrides all other votes regardless of consensus. Uses NVIDIA NIM API as primary provider (Meta Llama 3.1 70B), with Lambda Labs and Nous Research as fallbacks.

**ADVISORY AGENTS (Context providers, non-voting):**
- **Hume AI**: Emotional intelligence analysis for community testimony (distress detection)
- **Cohere**: Policy RAG for current context retrieval and signal reranking

**VOTING AGENTS (Liberation Pioneer Council):**
- **Lynn (Conway)**: Technical Architecture Specialist via Anthropic Claude. Named after Lynn Conway, the transgender computer scientist fired from IBM in 1968 for being trans, who went on to make fundamental contributions to VLSI chip design. Analyzes technical architecture with the perspective of someone who has been excluded.
- **Bayard (Rustin)**: Strategic Coordination Specialist via OpenAI GPT-4o. Named after Bayard Rustin, the gay civil rights organizer who was the chief architect of the 1963 March on Washington but was erased from history due to his sexuality. Sees the big picture and builds coalitions.
- **Sylvia (Rivera)**: Street-Level Harm Detection via Google Gemini 2.5 Flash. Named after Sylvia Rivera, the trans Latina activist at Stonewall who co-founded STAR (Street Transvestite Action Revolutionaries). Sees harm at the street level, where it actually happens.
- **Elizebeth (Friedman)**: Signal Intelligence Specialist via Mistral AI. Named after Elizebeth Friedman, America's first female cryptanalyst who was often overshadowed by her husband. Detects hidden patterns and coded signals.
- **Claudette (Colvin)**: Erasure Detection via NVIDIA NIM / Groq / Together Llama. Named after Claudette Colvin, the 15-year-old who refused to give up her bus seat nine months before Rosa Parks but was deemed "not the right image." Detects when voices are being silenced.
- **Audre (Lorde)**: Intersectional Critical Analysis via Lambda Labs / Nous Research Hermes. Named after Audre Lorde, the Black lesbian feminist poet who wrote "the master's tools will never dismantle the master's house." Analyzes how race, gender, sexuality, and disability intersect.

**EDGE CASE SPECIALIST (Non-voting):**
- **Temple (Grandin)**: Alternative Perspective & Edge Case Analysis via NVIDIA NIM / Lambda / Nous. Named after Temple Grandin, the autistic scientist who revolutionized livestock handling through her different way of perceiving the world. Sees edge cases and failure modes that neurotypical designers miss.

- **Pattern**: Multi-model fallback chain OR 8-agent multi-agent deliberation
  - Fallback: Lynn → Bayard → Sylvia → Elizebeth → Audre → Static fallback
  - Deliberation: Advisory prep → 6 voting agents + Alan in parallel → Cross-review → Alan veto review → Consensus synthesis
  - All integrations work in degraded mode when API keys absent

- **Multi-Agent Deliberation** (POST /api/pilots/:id/deliberate):
  - Phase 1: Advisory agents (Hume, Cohere) gather emotional + policy context
  - Phase 2: Alan + 6 voting agents vote in parallel with advisory context
  - Phase 3: Lynn, Bayard, Sylvia cross-review all votes
  - Phase 4: Alan veto review - can escalate to BLOCK after seeing all votes
  - Phase 5: Consensus synthesis - Alan's BLOCK overrides all other votes
  - Modes: `?mode=full` (8 agents + all phases) or `?mode=quick` (Alan + 3 agents + advisory)
  - Response includes: consensusLevel (unanimous/majority/plurality/single/veto), statusVotes, vetoTriggered, codedThreatsDetected, advisoryContext

- **Key Features**:
  - Alan's VETO power - protects vulnerable communities regardless of majority vote
  - Liberation pioneer naming honors those excluded from history
  - Emotional intelligence from Hume integrated into deliberation
  - Policy RAG from Cohere provides current context
  - Multi-agent deliberation with consensus synthesis
  - Coded threat detection (dog whistles, surveillance patterns)
  - Deliberation observability tracking (GET /api/observability/deliberations)

- **What If Scenario Exploration** (Temple agent via NVIDIA/Hermes):
  - `POST /api/pilots/:id/whatif` - Explore edge cases and hypothetical scenarios
  - `POST /api/pilots/:id/whatif/community` - Targeted questions for specific communities (trans, disabled, neurodivergent, trauma_survivors, intersectional)
  - `POST /api/pilots/:id/whatif/consequences` - Analyze unintended consequences of policy changes
  - Uses NVIDIA NIM API as primary provider, with Lambda/Nous as fallbacks
  - Heuristic fallbacks when no API keys configured

- **Demo Deliberation** (4-Phase Structured Case Hearing):
  - `GET /api/demo/deliberation` - Run 4-phase structured deliberation demo
  - Modes: `?mode=quick` (instant heuristic) or `?mode=full` (30-60s AI-powered)
  - **Scenario**: LGBTQ+ Travel Safety case with embedded tensions:
    - Legal vs. lived risk, Corporate liability vs. employee autonomy
    - Short-term PR vs. long-term ESG, Business necessity vs. safety
  - **Phase 1: Initial Briefs** - Each agent analyzes independently from their unique lens
  - **Phase 2: Cross-Critique** - Agents acknowledge agreements and flag blind spots in others
  - **Phase 3: Council Synthesis** - Identify conflicts, force trade-offs, produce unified policy with attribution
  - **Phase 4: Reflection** - Show counterfactuals ("if only X decided...") proving collective intelligence wins
  - **Files**: `server/lib/demo-scenario.ts`, `server/lib/demo-deliberation.ts`, `client/src/pages/demo.tsx`
  - **UI**: Timeline layout with phase cards, agent cards, expandable details, and Framer Motion animations

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
- `NVIDIA_API_KEY` - NVIDIA NIM API for Alan, Claudette, and Temple agents (PRIMARY provider)
- `NVIDIA_LLAMA_MODEL` - NVIDIA Llama model override (default: meta/llama-3.1-70b-instruct)
- `COHERE_API_KEY` - Cohere API for policy RAG, signal reranking, and embeddings
- `HUME_API_KEY` - Hume AI for emotional intelligence in testimony analysis
- `LAMBDA_API_KEY` - Lambda Labs API for Alan/Temple/Audre (fallback after NVIDIA)
- `NOUS_API_KEY` - Nous Research API for Alan/Temple/Audre (fallback after Lambda)
- `HERMES_MODEL` - Hermes model override for Lambda/Nous (default: hermes-3-llama-3.1-405b)
- `GROQ_API_KEY` - Groq API for Claudette agent (fallback after NVIDIA)
- `TOGETHER_API_KEY` - Together AI for Claudette agent (fallback after Groq)
- `LLAMA_MODEL` - Llama model override for Groq/Together (default: llama-3.1-70b-versatile)
- `MISTRAL_API_KEY` - Mistral AI for Elizebeth agent (European policy analysis)
- `MISTRAL_MODEL` - Mistral model override (default: mistral-large-latest)

### Provider Fallback Chains
- **Alan/Temple agents**: NVIDIA → Lambda → Nous → Heuristic fallback
- **Claudette agent**: NVIDIA → Groq → Together → Unavailable
- **Audre agent**: Lambda → Nous → Unavailable
- **Primary agents** (Lynn, Bayard, Sylvia, Elizebeth): Replit AI Integrations

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