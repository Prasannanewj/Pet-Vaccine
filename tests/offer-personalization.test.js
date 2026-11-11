const test = require("node:test");
const assert = require("node:assert/strict");
const personalization = require("../offer-personalization.js");

test("personalization selects only approved variants with consent", () => {
  assert.equal(personalization.getApprovedVariant("boarding", true).title, "Planning a stay away from home?");
  assert.equal(personalization.getApprovedVariant("boarding", false).title, "A question worth asking your vet.");
  assert.equal(personalization.getApprovedVariant("unapproved", true).title, "A question worth asking your vet.");
});

test("follow-up requires consent and honors opt-out and suppression", () => {
  const base = { consent: true, optedOut: false, suppressed: false, now: 1_000_000_000 };
  assert.equal(personalization.canSendFollowUp(base).allowed, true);
  assert.equal(personalization.canSendFollowUp({ ...base, consent: false }).reason, "consent");
  assert.equal(personalization.canSendFollowUp({ ...base, optedOut: true }).reason, "opted-out");
  assert.equal(personalization.canSendFollowUp({ ...base, suppressed: true }).reason, "suppressed");
});

test("follow-up frequency limit blocks repeat delivery within seven days", () => {
  const now = 1_000_000_000;
  assert.equal(
    personalization.canSendFollowUp({
      consent: true,
      optedOut: false,
      suppressed: false,
      lastSentAt: now - 6 * 24 * 60 * 60 * 1000,
      now,
    }).reason,
    "frequency",
  );
  assert.equal(
    personalization.canSendFollowUp({
      consent: true,
      optedOut: false,
      suppressed: false,
      lastSentAt: now - 7 * 24 * 60 * 60 * 1000,
      now,
    }).allowed,
    true,
  );
});

test("Wilson interval is bounded and unavailable for an empty sample", () => {
  assert.equal(personalization.wilsonInterval(0, 0), null);
  const interval = personalization.wilsonInterval(5, 10);
  assert.ok(interval[0] >= 0);
  assert.ok(interval[1] <= 1);
  assert.ok(interval[0] < 0.5 && interval[1] > 0.5);
});
