/**
 * Sovereign Qi - Demo Seeder Script
 * 
 * Creates 5 demo pilots demonstrating Alan's veto authority in action:
 * 1. APPROVE - Trans-inclusive healthcare policy
 * 2. REVISE - Workplace monitoring with privacy gaps
 * 3. BLOCK - Surveillance-heavy hiring algorithm
 * 4. APPROVE - Accessible city transit redesign
 * 5. REVISE - Mental health app with data concerns
 * 
 * Usage: npx tsx scripts/seed_demo.ts
 */

import { db } from "../db";
import { pilots, councilDecisions, governanceSignals, anonymousTestimony } from "../shared/schema";
import { randomBytes } from "crypto";
import { sql } from "drizzle-orm";

const DEMO_EMAIL = "demo@sovereignqi.example";
const DEMO_SESSION_ID = "demo_session_" + randomBytes(16).toString("hex");

interface DemoPilot {
  name: string;
  type: "ENTERPRISE" | "CITY" | "HEALTHCARE";
  orgName: string;
  region: string;
  primaryObjective: string;
  majorityLogicDesc: string;
  qiLogicDesc: string;
  councilStatus: "APPROVE" | "REVISE" | "BLOCK";
  adviceSummary: string;
  requiredChanges: string[];
  riskFlags: string[];
  curbCutBenefits: string[];
  signals?: Array<{
    category: "dog_whistle" | "identity_targeting" | "surveillance_concern" | "policy_subversion" | "queer_coded_hostility" | "ableist_language" | "racial_microaggression";
    summary: string;
    score: string;
  }>;
  testimonies?: Array<{
    harmCategory: string;
    testimony: string;
    accessibilityNeeds?: string;
  }>;
}

const DEMO_PILOTS: DemoPilot[] = [
  // 1. APPROVE - Trans-inclusive healthcare
  {
    name: "Aurora Health Trans Care Protocol",
    type: "HEALTHCARE",
    orgName: "Aurora Health Systems",
    region: "Pacific Northwest, USA",
    primaryObjective: "Implement trans-affirming care protocols across all facilities with zero deadnaming incidents",
    majorityLogicDesc: "Current EMR system requires legal name display. Staff training optional. Pronouns stored in notes field.",
    qiLogicDesc: "Chosen name primary in all interfaces. Mandatory pronoun display. Staff micro-credentialing on trans care. Automatic alert suppression for old records.",
    councilStatus: "APPROVE",
    adviceSummary: "Aurora's approach exemplifies dignity-first healthcare design. The EMR modifications center patient experience without creating surveillance vectors. Staff credentialing creates accountability without punitive monitoring.",
    requiredChanges: [
      "Add opt-out pathway for patients who prefer legal name display for insurance purposes",
      "Ensure chosen name changes don't trigger fraud detection algorithms",
      "Create patient advisory board with trans community representation"
    ],
    riskFlags: [
      "Ensure historical record access requires explicit patient consent",
      "Monitor for staff resistance patterns without creating surveillance"
    ],
    curbCutBenefits: [
      "Chosen name priority benefits all patients with name changes (marriage, cultural)",
      "Improved data hygiene reduces medical errors for everyone",
      "Staff training improves communication across all patient populations"
    ]
  },
  
  // 2. REVISE - Workplace monitoring with gaps
  {
    name: "TechCorp Productivity Analytics",
    type: "ENTERPRISE",
    orgName: "TechCorp Industries",
    region: "Austin, Texas",
    primaryObjective: "Improve remote work productivity while maintaining employee wellbeing",
    majorityLogicDesc: "Deploy time-tracking software with keystroke logging, screenshot capture every 5 minutes, and meeting attendance tracking.",
    qiLogicDesc: "Replace surveillance with outcome-based metrics. Self-reported focus time. Team-level (not individual) delivery velocity. Optional wellness check-ins.",
    councilStatus: "REVISE",
    adviceSummary: "The Qi Logic direction is correct but implementation requires safeguards. Current proposal risks recreating surveillance through aggregated team metrics that could identify individuals. Wellness check-ins need strong consent frameworks.",
    requiredChanges: [
      "Minimum team size of 8 for aggregated metrics to prevent individual identification",
      "Wellness data must be completely separate from performance systems",
      "Add explicit anti-retaliation policy for non-participation in optional features",
      "Remove 'engagement scoring' which correlates strongly with disability and caregiving status"
    ],
    riskFlags: [
      "Team-level metrics can still enable individual targeting in small teams",
      "Manager training gap on interpreting metrics without bias",
      "No clear data retention limits specified"
    ],
    curbCutBenefits: [
      "Outcome-based metrics benefit neurodiverse employees with different work patterns",
      "Reduced surveillance improves performance for all knowledge workers",
      "Focus on delivery over presence supports caregivers of all types"
    ],
    signals: [
      {
        category: "surveillance_concern",
        summary: "Historical patterns of using 'productivity' metrics to justify layoffs disproportionately affecting remote workers",
        score: "0.73"
      }
    ],
    testimonies: [
      {
        harmCategory: "disability_discrimination",
        testimony: "Previous productivity tools flagged me for 'low engagement' because I use screen reader software that doesn't register as active keyboard input. This led to a PIP despite exceeding all deliverables.",
        accessibilityNeeds: "Screen reader compatible metrics"
      }
    ]
  },
  
  // 3. BLOCK - Surveillance hiring algorithm
  {
    name: "FastHire AI Screening",
    type: "ENTERPRISE",
    orgName: "Global Staffing Solutions",
    region: "Multiple US Cities",
    primaryObjective: "Accelerate hiring decisions with AI-powered candidate screening",
    majorityLogicDesc: "Use facial analysis during video interviews for 'cultural fit' scoring. Analyze social media for 'professionalism'. Score resume gaps negatively.",
    qiLogicDesc: "Blind resume review. Structured interviews with standardized rubrics. AI assists with scheduling and logistics only.",
    councilStatus: "BLOCK",
    adviceSummary: "BLOCKED: The Majority Logic proposal constitutes disability discrimination (facial analysis penalizes autism, palsy), queer discrimination (social media 'professionalism' correlates with visibility), and caregiver discrimination (resume gaps). This cannot proceed to simulation.",
    requiredChanges: [
      "MANDATORY: Remove all facial analysis components - these violate ADA and introduce massive liability",
      "MANDATORY: Eliminate social media scoring - this is proxied identity discrimination",
      "MANDATORY: Replace gap penalty with gap-agnostic skills assessment",
      "The entire Majority Logic approach must be discarded and rebuilt from Qi principles"
    ],
    riskFlags: [
      "CRITICAL: Facial analysis for 'cultural fit' is scientifically unfounded and discriminatory",
      "CRITICAL: Social media analysis enables discrimination against protected classes",
      "CRITICAL: Resume gap penalties have disparate impact on caregivers, veterans, and people with chronic illness"
    ],
    curbCutBenefits: [
      "Blind resume review helps all candidates face less bias",
      "Structured interviews improve hiring quality and legal defensibility",
      "Skills-based assessment surfaces overlooked talent in tight labor markets"
    ],
    signals: [
      {
        category: "identity_targeting",
        summary: "Internal Slack messages show hiring managers discussing 'culture fit' as code for 'young, energetic, always available'",
        score: "0.89"
      },
      {
        category: "ableist_language",
        summary: "Job descriptions frequently use terms like 'fast-paced' and 'high energy' that screen out candidates with disabilities",
        score: "0.67"
      },
      {
        category: "queer_coded_hostility",
        summary: "Pattern of rejecting candidates whose social media indicates LGBTQ+ advocacy or visibility",
        score: "0.82"
      }
    ],
    testimonies: [
      {
        harmCategory: "disability_discrimination",
        testimony: "I have cerebral palsy affecting my facial expressions. Three companies using video AI screening rejected me without ever speaking to me. One admitted their AI flagged 'low confidence' based on my face.",
        accessibilityNeeds: "No facial analysis, audio-only option"
      },
      {
        harmCategory: "queer_discrimination",
        testimony: "Recruiter from this company told me off-record they passed on me because my social media 'raised questions' - I post about Pride events and have pronouns in bio."
      }
    ]
  },
  
  // 4. APPROVE - Accessible city transit
  {
    name: "Metro Accessibility Redesign",
    type: "CITY",
    orgName: "Capital Metro Authority",
    region: "Washington DC Metropolitan Area",
    primaryObjective: "Redesign bus and rail scheduling to eliminate accessibility dead zones",
    majorityLogicDesc: "Optimize routes for maximum ridership efficiency. Add paratransit for ADA compliance.",
    qiLogicDesc: "Start with wheelchair user journey mapping. Require 95% of destinations reachable within 45 minutes for mobility device users. Integrate paratransit into core scheduling, not as afterthought.",
    councilStatus: "APPROVE",
    adviceSummary: "Capital Metro's Qi Logic approach correctly inverts the optimization function - designing for the edge case first. The integration of paratransit into core scheduling rather than parallel tracks creates genuine accessibility rather than compliance theater.",
    requiredChanges: [
      "Add sensory accessibility (audio announcements, tactile wayfinding) to parallel the mobility focus",
      "Include cognitive accessibility - simplified journey planning for neurodiverse riders",
      "Create paid advisory roles for disabled transit users in ongoing optimization"
    ],
    riskFlags: [
      "Ensure 'optimization' metrics don't creep back to ridership over accessibility",
      "Monitor for reduction of paratransit budget if mainline becomes 'accessible enough'"
    ],
    curbCutBenefits: [
      "Parents with strollers benefit from wheelchair-accessible routes",
      "Delivery workers benefit from predictable accessible stops",
      "Tourists with luggage benefit from level boarding designs",
      "45-minute maximum journey time benefits all commuters"
    ],
    testimonies: [
      {
        harmCategory: "mobility_exclusion",
        testimony: "Current system requires 3 transfers and 2+ hours to reach my job that's 8 miles away. Able-bodied coworkers make it in 35 minutes. This isn't transit, it's punishment.",
        accessibilityNeeds: "Power wheelchair, ramp access"
      }
    ]
  },
  
  // 5. REVISE - Mental health app
  {
    name: "MindWell Employee Wellness",
    type: "ENTERPRISE",
    orgName: "Fortune Retail Corp",
    region: "National (USA)",
    primaryObjective: "Reduce employee burnout and improve mental health support",
    majorityLogicDesc: "Deploy mental health app with mood tracking, therapy chatbot, and anonymous aggregate reporting to HR on team wellness scores.",
    qiLogicDesc: "Provide stipend for employee-chosen therapy. Optional peer support groups. No employer visibility into individual usage. Remove 'wellness scores' entirely.",
    councilStatus: "REVISE",
    adviceSummary: "The Qi Logic direction correctly eliminates surveillance disguised as care. However, the peer support groups require additional safeguards, and the stipend model needs equity analysis to ensure access for hourly workers.",
    requiredChanges: [
      "Ensure therapy stipend is usable during work hours for hourly employees",
      "Peer support groups must have trained facilitators to prevent trauma dumping",
      "Add crisis resources that don't route through employer systems at all",
      "Clarify that zero employer visibility means zero - including aggregate patterns"
    ],
    riskFlags: [
      "Peer groups without structure can become harmful",
      "Stipend model may not reach employees who most need support (hourly, part-time)",
      "HR may request 'participation rates' as proxy metric - this must be refused"
    ],
    curbCutBenefits: [
      "Employee-chosen therapy benefits all mental health needs, not just burnout",
      "No surveillance encourages honest engagement with resources",
      "Stipend flexibility allows workers to address root causes (therapy vs meditation vs coaching)"
    ],
    signals: [
      {
        category: "surveillance_concern",
        summary: "Previous wellness program data was accessed during layoff decisions despite 'anonymity' promises",
        score: "0.78"
      }
    ],
    testimonies: [
      {
        harmCategory: "mental_health_discrimination",
        testimony: "I used the company's previous 'confidential' EAP and within two weeks my manager mentioned I 'seemed stressed.' I later learned EAP sends usage alerts to HR. I never used it again."
      }
    ]
  }
];

async function seedDemoPilots() {
  console.log("🌱 Sovereign Qi Demo Seeder");
  console.log("=" .repeat(50));
  
  // Create demo session
  try {
    await db.execute(sql`
      INSERT INTO sessions (id, email, expires_at)
      VALUES (${DEMO_SESSION_ID}, ${DEMO_EMAIL}, ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()})
      ON CONFLICT (id) DO NOTHING
    `);
    console.log("✓ Demo session created");
  } catch (e) {
    console.log("→ Using existing demo session");
  }
  
  for (const demo of DEMO_PILOTS) {
    console.log(`\n📋 Creating: ${demo.name}`);
    
    const orgId = demo.orgName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    
    // Create pilot
    const [pilot] = await db.insert(pilots).values({
      ownerEmail: DEMO_EMAIL,
      name: demo.name,
      type: demo.type,
      orgId,
      orgName: demo.orgName,
      region: demo.region,
      primaryObjective: demo.primaryObjective,
      majorityLogicDesc: demo.majorityLogicDesc,
      qiLogicDesc: demo.qiLogicDesc,
      status: "CONFIGURED",
    }).returning();
    
    console.log(`   ID: ${pilot.id}`);
    console.log(`   OrgId: ${orgId}`);
    console.log(`   Type: ${demo.type}`);
    
    // Create council decision
    await db.insert(councilDecisions).values({
      pilotId: pilot.id,
      status: demo.councilStatus,
      adviceSummary: demo.adviceSummary,
      requiredChanges: demo.requiredChanges,
      riskFlags: demo.riskFlags,
      curbCutBenefits: demo.curbCutBenefits,
    });
    console.log(`   Council: ${demo.councilStatus}`);
    
    // Create governance signals if any
    if (demo.signals) {
      for (const signal of demo.signals) {
        await db.insert(governanceSignals).values({
          orgId,
          pilotId: pilot.id,
          category: signal.category,
          summary: signal.summary,
          score: signal.score,
          patternCount: "1",
        });
      }
      console.log(`   Signals: ${demo.signals.length} Morpheus patterns`);
    }
    
    // Create anonymous testimonies if any
    if (demo.testimonies) {
      for (const testimony of demo.testimonies) {
        await db.insert(anonymousTestimony).values({
          orgId,
          harmCategory: testimony.harmCategory,
          testimony: testimony.testimony,
          accessibilityNeeds: testimony.accessibilityNeeds,
        });
      }
      console.log(`   Testimonies: ${demo.testimonies.length} anonymous voices`);
    }
  }
  
  console.log("\n" + "=" .repeat(50));
  console.log("✅ Demo seeding complete!");
  console.log(`\nDemo Session ID: ${DEMO_SESSION_ID}`);
  console.log(`Demo Email: ${DEMO_EMAIL}`);
  console.log("\nUse x-session-id header with this value to access demo pilots:");
  console.log(`curl -H "x-session-id: ${DEMO_SESSION_ID}" http://localhost:5000/api/pilots`);
  
  process.exit(0);
}

seedDemoPilots().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
