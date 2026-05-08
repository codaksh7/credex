# Automated Tests

**Framework:** Vitest
**File:** `__tests__/auditEngine.test.ts`
**How to run:** `npm run test`

## Test Coverage
1. **Cursor Business vs Pro Optimization:** Checks if a team with < 5 seats on Cursor Business is correctly recommended to downgrade to Pro, calculating the exact $20/seat savings.
2. **Claude Team Optimization:** Validates that a team with < 5 seats on Claude Team is recommended to downgrade to Pro, and checks that savings are accurate.
3. **Copilot Enterprise Utilization:** Ensures that an enterprise of size < 20 is told to downgrade to Business, saving $20/seat.
4. **Credex Credit Opportunity:** Checks the generic credit logic: if a user spends >$500/mo and no tier changes are recommended, it correctly calculates the 20% Credex spread savings.
5. **Optimal Spend (No Savings):** Validates that if a team of 1 is using Cursor Pro for $20, the engine correctly returns $0 savings and an "Optimal" status.
