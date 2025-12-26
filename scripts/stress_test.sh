#!/usr/bin/env bash
# Sovereign Qi Comprehensive Stress Test
set -euo pipefail

BASE_URL="${1:-http://localhost:5000}"
TEST_ID="stress-$(date +%s)"

echo "====================================="
echo "SOVEREIGN QI - STRESS TEST SUITE"
echo "Test ID: $TEST_ID"
echo "Base URL: $BASE_URL"
echo "====================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0

log_test() {
  echo -e "${YELLOW}[TEST]${NC} $1"
}

log_pass() {
  echo -e "${GREEN}[PASS]${NC} $1"
  PASS=$((PASS+1))
}

log_fail() {
  echo -e "${RED}[FAIL]${NC} $1"
  FAIL=$((FAIL+1))
}

# Test 1: Basic connectivity
log_test "Testing basic connectivity..."
if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200\|302"; then
  log_pass "App is accessible"
else
  log_fail "App is not accessible"
fi

# Test 2: Create session for authentication
log_test "Creating test session..."
SESSION_RESPONSE=$(curl -sS -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"stress-test-$TEST_ID@sovereignqi.org\"}")

SESSION_ID=$(echo "$SESSION_RESPONSE" | grep -o '"sessionId":"[^"]*"' | cut -d'"' -f4)
if [ -n "$SESSION_ID" ]; then
  log_pass "Session created: ${SESSION_ID:0:16}..."
else
  log_fail "Failed to create session"
  exit 1
fi

# Test 3: Create multiple pilots in parallel
log_test "Creating 5 test pilots in parallel..."
mkdir -p /tmp/sq_stress
rm -f /tmp/sq_stress/pilots_$TEST_ID.txt

for i in {1..5}; do
  (
    RESPONSE=$(curl -sS -X POST "$BASE_URL/api/pilots" \
      -H "Content-Type: application/json" \
      -H "x-session-id: $SESSION_ID" \
      -d "{
        \"name\": \"Stress Test Pilot $TEST_ID-$i\",
        \"type\": \"ENTERPRISE\",
        \"orgName\": \"Stress Test Org $i\",
        \"region\": \"USA\",
        \"primaryObjective\": \"Load testing scenario $i with complex governance requirements\",
        \"majorityLogicDesc\": \"Maximize efficiency through algorithmic optimization and data-driven decision making with minimal human oversight. Prioritize throughput over individual accommodation.\",
        \"qiLogicDesc\": \"Center dignity, consent, and accessibility. Ensure marginalized voices have veto power. Build in audit trails and community oversight. No surveillance or coercion.\",
        \"ownerEmail\": \"stress-test-$TEST_ID@sovereignqi.org\"
      }")
    
    PILOT_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    ORG_ID=$(echo "$RESPONSE" | grep -o '"orgId":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$PILOT_ID" ] && [ "$PILOT_ID" != "null" ]; then
      echo "$PILOT_ID|$ORG_ID" >> /tmp/sq_stress/pilots_$TEST_ID.txt
      log_pass "Created pilot $i: ${PILOT_ID:0:8}... (orgId: $ORG_ID)"
    else
      log_fail "Failed to create pilot $i: $RESPONSE"
    fi
  ) &
done
wait

echo ""
log_test "Verifying pilot creation..."
if [ -f "/tmp/sq_stress/pilots_$TEST_ID.txt" ]; then
  PILOT_COUNT=$(wc -l < /tmp/sq_stress/pilots_$TEST_ID.txt)
  log_pass "Created $PILOT_COUNT pilots"
else
  log_fail "No pilots were created"
fi

# Test 4: Run simulations on all pilots
echo ""
log_test "Running simulations on all created pilots..."
if [ -f "/tmp/sq_stress/pilots_$TEST_ID.txt" ]; then
  while IFS='|' read -r PILOT_ID ORG_ID; do
    (
      SIM_RESPONSE=$(curl -sS -X POST "$BASE_URL/api/pilots/$PILOT_ID/run" \
        -H "x-session-id: $SESSION_ID" 2>&1)
      if echo "$SIM_RESPONSE" | grep -q "scenarioA\|innovationIndex"; then
        log_pass "Simulation successful for pilot ${PILOT_ID:0:8}..."
      else
        log_fail "Simulation failed for pilot ${PILOT_ID:0:8}..."
      fi
    ) &
  done < /tmp/sq_stress/pilots_$TEST_ID.txt
  wait
fi

# Test 5: Inject Morpheus governance signals
echo ""
log_test "Injecting Morpheus governance signals..."
if [ -f "/tmp/sq_stress/pilots_$TEST_ID.txt" ]; then
  FIRST_LINE=$(head -n1 /tmp/sq_stress/pilots_$TEST_ID.txt)
  FIRST_PILOT=$(echo "$FIRST_LINE" | cut -d'|' -f1)
  FIRST_ORG_ID=$(echo "$FIRST_LINE" | cut -d'|' -f2)
  
  SIGNAL_CATEGORIES=("dog_whistle" "surveillance_concern" "policy_subversion" "queer_coded_hostility" "ableist_language")
  
  for CATEGORY in "${SIGNAL_CATEGORIES[@]}"; do
    SIGNAL_RESPONSE=$(curl -sS -X POST "$BASE_URL/api/signals" \
      -H "Content-Type: application/json" \
      -H "x-session-id: $SESSION_ID" \
      -d "{
        \"orgId\": \"$FIRST_ORG_ID\",
        \"category\": \"$CATEGORY\",
        \"score\": \"0.92\",
        \"summary\": \"Stress test signal: $CATEGORY detected in leadership communications\",
        \"patternCount\": \"$((RANDOM % 20 + 1))\"
      }" 2>&1)
    
    if echo "$SIGNAL_RESPONSE" | grep -q '"id":'; then
      log_pass "Signal injected: $CATEGORY"
    else
      log_fail "Failed to inject signal: $CATEGORY - $SIGNAL_RESPONSE"
    fi
  done
fi

# Test 6: Test Council advice with large payloads
echo ""
log_test "Testing Council advice with maximum payload sizes..."
if [ -f "/tmp/sq_stress/pilots_$TEST_ID.txt" ]; then
  FIRST_LINE=$(head -n1 /tmp/sq_stress/pilots_$TEST_ID.txt)
  FIRST_PILOT=$(echo "$FIRST_LINE" | cut -d'|' -f1)
  
  LARGE_PAYLOAD='{
    "communityVoices": "Trans employees report being misgendered by AI systems in 47 separate incidents over 3 months. Disabled workers cannot access the new interface; screen readers fail on 80% of navigation. Black and Latinx employees flagged at 3x higher rate for productivity issues by algorithm. Chronically ill workers forced to disclose medical details to justify accommodation requests. Queer employees report dog-whistle language in leadership communications: culture fit, team player. Union organizing attempts flagged as disruptive behavior by sentiment analysis. Immigrant workers fear data sharing with ICE; policy lacks explicit protection. Neurodivergent communication styles misread as hostile or unprofessional. Parents and caregivers penalized for inconsistent availability by scheduling AI. Religious minorities report bias in neutral workplace culture enforcement.",
    "harms": "Systemic misgendering causing psychological harm. Digital accessibility failures violating ADA. Algorithmic bias amplifying racial discrimination. Coerced medical disclosure violating privacy. Coded anti-queer language normalizing exclusion. Union suppression disguised as behavior management. Surveillance creating fear among immigrant workers. Pathologizing neurodivergent communication. Caregiving penalty encoded into algorithmic systems. Secular supremacy excluding religious practice."
  }'
  
  COUNCIL_RESPONSE=$(curl -sS -X POST "$BASE_URL/api/pilots/$FIRST_PILOT/advise" \
    -H "Content-Type: application/json" \
    -H "x-session-id: $SESSION_ID" \
    -d "$LARGE_PAYLOAD" 2>&1)
  
  STATUS=$(echo "$COUNCIL_RESPONSE" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
  if [ -n "$STATUS" ]; then
    log_pass "Council advice returned status: $STATUS"
    echo "$COUNCIL_RESPONSE" > "/tmp/sq_stress/council_response_$TEST_ID.json"
    
    if [ "$STATUS" = "BLOCK" ]; then
      log_pass "Alan correctly BLOCKED harmful pilot after reviewing Morpheus signals"
    fi
  else
    log_fail "Council advice failed: $COUNCIL_RESPONSE"
  fi
fi

# Test 7: Test error handling with malformed requests
echo ""
log_test "Testing error handling with malformed requests..."

MALFORMED_RESPONSE=$(curl -sS -X POST "$BASE_URL/api/pilots" \
  -H "Content-Type: application/json" \
  -H "x-session-id: $SESSION_ID" \
  -d '{"invalid json' 2>&1)

if echo "$MALFORMED_RESPONSE" | grep -qi "error\|message\|unexpected\|invalid"; then
  log_pass "App handles malformed JSON gracefully"
else
  log_fail "App may not handle malformed JSON properly"
fi

MISSING_FIELDS=$(curl -sS -X POST "$BASE_URL/api/pilots" \
  -H "Content-Type: application/json" \
  -H "x-session-id: $SESSION_ID" \
  -d '{}' 2>&1)

if echo "$MISSING_FIELDS" | grep -qi "error\|required"; then
  log_pass "App validates required fields"
else
  log_fail "App may not validate required fields"
fi

# Test 8: Test unauthorized access
echo ""
log_test "Testing unauthorized access protection..."
UNAUTH_RESPONSE=$(curl -sS -X GET "$BASE_URL/api/pilots" 2>&1)
if echo "$UNAUTH_RESPONSE" | grep -qi "unauthorized\|error"; then
  log_pass "App blocks unauthorized access"
else
  log_fail "App may not block unauthorized access"
fi

# Test 9: Concurrent Council requests
echo ""
log_test "Testing concurrent Council advice requests..."
if [ -f "/tmp/sq_stress/pilots_$TEST_ID.txt" ]; then
  head -n3 /tmp/sq_stress/pilots_$TEST_ID.txt | while IFS='|' read -r PILOT_ID ORG_ID; do
    (
      ADVICE=$(curl -sS -X POST "$BASE_URL/api/pilots/$PILOT_ID/advise" \
        -H "Content-Type: application/json" \
        -H "x-session-id: $SESSION_ID" \
        -d '{
          "communityVoices": "Test concurrent request",
          "harms": "Testing load handling"
        }' 2>&1)
      
      if echo "$ADVICE" | grep -q '"status":'; then
        log_pass "Concurrent advice request succeeded for ${PILOT_ID:0:8}..."
      else
        log_fail "Concurrent advice request failed for ${PILOT_ID:0:8}..."
      fi
    ) &
  done
  wait
fi

# Test 10: Retrieve Council decision log
echo ""
log_test "Testing Council decision log retrieval..."
if [ -f "/tmp/sq_stress/pilots_$TEST_ID.txt" ]; then
  FIRST_LINE=$(head -n1 /tmp/sq_stress/pilots_$TEST_ID.txt)
  FIRST_PILOT=$(echo "$FIRST_LINE" | cut -d'|' -f1)
  
  LOG_RESPONSE=$(curl -sS -X GET "$BASE_URL/api/pilots/$FIRST_PILOT/council-log" \
    -H "x-session-id: $SESSION_ID" 2>&1)
  
  if echo "$LOG_RESPONSE" | grep -q '"entries":'; then
    ENTRY_COUNT=$(echo "$LOG_RESPONSE" | grep -o '"id":' | wc -l)
    log_pass "Council log retrieved with $ENTRY_COUNT entries"
  else
    log_fail "Failed to retrieve council log"
  fi
fi

# Summary
echo ""
echo "====================================="
echo "STRESS TEST SUMMARY"
echo "====================================="
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo "Total: $((PASS+FAIL))"
echo ""

if [ -f "/tmp/sq_stress/council_response_$TEST_ID.json" ]; then
  echo "Sample Council Response (truncated):"
  head -c 500 "/tmp/sq_stress/council_response_$TEST_ID.json"
  echo "..."
fi

echo ""
echo "Artifacts saved in /tmp/sq_stress with prefix: $TEST_ID"
echo "====================================="

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}ALL TESTS PASSED!${NC}"
  exit 0
else
  echo -e "${RED}SOME TESTS FAILED${NC}"
  exit 1
fi
