const test = require("node:test");
const assert = require("node:assert/strict");
const portal = require("../clinic-portal.js");

test("clinic verification requires a name, valid email, and license or practice ID", () => {
  assert.equal(portal.validateClinic({ clinicName: "", clinicEmail: "", clinicLicense: "" }), "Enter the practice legal name.");
  assert.equal(portal.validateClinic({ clinicName: "Oak & Paws", clinicEmail: "not-an-email", clinicLicense: "VET-1" }), "Enter a valid practice email.");
  assert.equal(portal.validateClinic({ clinicName: "Oak & Paws", clinicEmail: "clinic@example.com", clinicLicense: "  " }), "Enter a veterinary license or practice ID.");
  assert.equal(portal.validateClinic({ clinicName: " Oak & Paws ", clinicEmail: " clinic@example.com ", clinicLicense: "VET-1" }), "");
});

test("redemption preview requires code, non-identifying reference, and vet recommendation", () => {
  assert.equal(portal.validateRedemption({ offerCode: "", visitReference: "", veterinarianRecommended: false }), "Enter the campaign or offer code.");
  assert.equal(portal.validateRedemption({ offerCode: "DEMO-1234", visitReference: "", veterinarianRecommended: true }), "Enter a non-identifying visit reference.");
  assert.equal(portal.validateRedemption({ offerCode: "DEMO-1234", visitReference: "VISIT-1", veterinarianRecommended: false }), "Confirm a veterinary professional recommended the product.");
  assert.equal(portal.validateRedemption({ offerCode: "DEMO-1234", visitReference: "VISIT-1", veterinarianRecommended: true }), "");
});

test("only practice managers can view reporting totals", () => {
  assert.equal(portal.canViewReports("manager"), true);
  assert.equal(portal.canViewReports("veterinarian"), false);
  assert.equal(portal.canViewReports("staff"), false);
});
