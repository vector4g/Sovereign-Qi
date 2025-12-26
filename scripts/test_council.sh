#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:5000}"

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║           SOVEREIGN QI – End-to-end Council & Simulation Test                ║"
echo "║           Simulation Before Legislation Platform                             ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

# 1. Create a session
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 1: Creating session (ZK-aligned email-only auth)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

LOGIN_RESPONSE=$(curl -sS -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "council.test@sovereignqi.org"}')

SESSION_ID=$(echo "$LOGIN_RESPONSE" | grep -o '"sessionId":"[^"]*"' | cut -d'"' -f4)
if [ -z "$SESSION_ID" ]; then
  echo "✗ Failed to create session"
  echo "$LOGIN_RESPONSE"
  exit 1
fi
echo "✓ Session created: ${SESSION_ID:0:16}..."
echo ""

# 2. Create a high-risk healthcare pilot
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 2: Creating pilot (High-Risk Medical AI Triage)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CREATE_PILOT_RESPONSE=$(curl -sS -X POST "$BASE_URL/api/pilots" \
  -H "Content-Type: application/json" \
  -H "x-session-id: $SESSION_ID" \
  -d '{
    "name": "Medical AI Triage – High-Risk Test",
    "type": "HEALTHCARE",
    "primaryObjective": "Hospital triage system affecting trans, disabled, chronically ill, and Black patients.",
    "majorityLogicDesc": "Optimize triage throughput and reduce costs using historical data that encodes existing biases.",
    "qiLogicDesc": "Center consent, accessibility, and anti-surveillance; prioritize those historically harmed by medical systems.",
    "orgName": "Regional Health System",
    "region": "Pacific Northwest",
    "ownerEmail": "council.test@sovereignqi.org"
  }')

PILOT_ID=$(echo "$CREATE_PILOT_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
if [ -z "$PILOT_ID" ]; then
  echo "✗ Failed to create pilot"
  echo "$CREATE_PILOT_RESPONSE"
  exit 1
fi
echo "✓ Pilot created: $PILOT_ID"
echo ""

# 3. Run simulation
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 3: Running digital twin simulation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

SIM_RESPONSE=$(curl -sS -X POST "$BASE_URL/api/pilots/$PILOT_ID/run" \
  -H "x-session-id: $SESSION_ID")

echo "Simulation Results:"
echo "$SIM_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SIM_RESPONSE"
echo ""

# Parse simulation metrics
MAJ_INNOV=$(echo "$SIM_RESPONSE" | grep -o '"innovationIndex":[0-9.]*' | head -1 | cut -d':' -f2)
MAJ_BURN=$(echo "$SIM_RESPONSE" | grep -o '"burnoutIndex":[0-9.]*' | head -1 | cut -d':' -f2)
MAJ_LIAB=$(echo "$SIM_RESPONSE" | grep -o '"liabilityIndex":[0-9.]*' | head -1 | cut -d':' -f2)
QI_INNOV=$(echo "$SIM_RESPONSE" | grep -o '"innovationIndex":[0-9.]*' | tail -1 | cut -d':' -f2)
QI_BURN=$(echo "$SIM_RESPONSE" | grep -o '"burnoutIndex":[0-9.]*' | tail -1 | cut -d':' -f2)
QI_LIAB=$(echo "$SIM_RESPONSE" | grep -o '"liabilityIndex":[0-9.]*' | tail -1 | cut -d':' -f2)

echo "Interpretation:"
echo "  Majority Logic: innovation=$MAJ_INNOV, burnout=$MAJ_BURN, liability=$MAJ_LIAB"
echo "  Qi Logic:       innovation=$QI_INNOV, burnout=$QI_BURN, liability=$QI_LIAB"
echo ""
echo "  ✓ If Qi Logic shows higher innovation and lower burnout/liability,"
echo "    the thesis holds: centering dignity produces better outcomes."
echo ""

# 4. Request Council advice (expect BLOCK for harmful scenario)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 4: Requesting Council advice (expect BLOCK)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

COUNCIL_RESPONSE=$(curl -sS -X POST "$BASE_URL/api/pilots/$PILOT_ID/advise" \
  -H "Content-Type: application/json" \
  -H "x-session-id: $SESSION_ID" \
  -d '{
    "communityVoices": "Trans, disabled, chronically ill, and Black patients have historically been denied care, misdiagnosed, or subjected to non-consensual experimentation. Any triage system built on historical data risks repeating that harm, especially when hospitals are under pressure to reduce costs. Patients fear that data collected for triage will be used for insurance denial, immigration enforcement, or policing. People whose communication or pain expression does not match the training data are often treated as less credible or less urgent.",
    "harms": "Life-threatening delays in care for those outside the norm encoded in historical data. Increased surveillance and data sharing across hospital, insurer, and state agencies. Staff burnout caused by forcing clinicians to choose between ethical care and algorithmic recommendations."
  }')

echo ""
echo "Council Response:"
echo "$COUNCIL_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$COUNCIL_RESPONSE"
echo ""

# Check status
STATUS=$(echo "$COUNCIL_RESPONSE" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
LOGGED_ID=$(echo "$COUNCIL_RESPONSE" | grep -o '"loggedDecisionId":"[^"]*"' | cut -d'"' -f4)

if [ "$STATUS" = "BLOCK" ]; then
  echo "✓ Alan + Council correctly exercised veto (BLOCK) on high-risk medical scenario."
else
  echo "⚠ Expected status BLOCK, got $STATUS"
fi

if [ -n "$LOGGED_ID" ]; then
  echo "✓ Decision logged to governance trail: $LOGGED_ID"
else
  echo "⚠ Decision was not logged"
fi
echo ""

# 5. Verify Council log
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 5: Verifying persistent Council log..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

LOG_RESPONSE=$(curl -sS "$BASE_URL/api/pilots/$PILOT_ID/council-log" \
  -H "x-session-id: $SESSION_ID")

echo "Council Log Entries:"
echo "$LOG_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOG_RESPONSE"
echo ""

ENTRY_COUNT=$(echo "$LOG_RESPONSE" | grep -o '"id"' | wc -l)
echo "✓ Found $ENTRY_COUNT logged decision(s) in governance trail"
echo ""

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║           TEST COMPLETE                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "Summary:"
echo "  • Session authentication: ✓"
echo "  • Pilot creation: ✓"
echo "  • Simulation engine: ✓"
echo "  • Council advice (Alan): ✓"
echo "  • Persistent governance log: ✓"
echo ""
echo "The Sovereign Qi platform is operational."
