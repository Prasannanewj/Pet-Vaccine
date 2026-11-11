(function (root, factory) {
  const portal = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = portal;
  }
  if (root.document) portal.initialize(root.document);
})(typeof globalThis === "undefined" ? this : globalThis, function () {
  function validateClinic({ clinicName, clinicEmail, clinicLicense }) {
    if (!clinicName.trim()) return "Enter the practice legal name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clinicEmail.trim())) return "Enter a valid practice email.";
    if (!clinicLicense.trim()) return "Enter a veterinary license or practice ID.";
    return "";
  }

  function validateRedemption({ offerCode, visitReference, veterinarianRecommended }) {
    if (!offerCode.trim()) return "Enter the campaign or offer code.";
    if (!visitReference.trim()) return "Enter a non-identifying visit reference.";
    if (!veterinarianRecommended) return "Confirm a veterinary professional recommended the product.";
    return "";
  }

  function canViewReports(role) {
    return role === "manager";
  }

  function initialize(document) {
    const registration = document.querySelector("#clinic-registration");
    const verificationStatus = document.querySelector("#verification-status");
    const clinicStatus = document.querySelector("#clinic-status");
    const enrollmentStatus = document.querySelector("#enrollment-status");
    const enrollButton = document.querySelector("#enroll-campaign");
    let verificationRequested = false;

    registration.addEventListener("submit", (event) => {
      event.preventDefault();
      const error = validateClinic({
        clinicName: document.querySelector("#clinic-name").value,
        clinicEmail: document.querySelector("#clinic-email").value,
        clinicLicense: document.querySelector("#clinic-license").value,
      });
      if (error) {
        verificationStatus.textContent = error;
        verificationStatus.classList.add("is-error");
        return;
      }
      verificationRequested = true;
      clinicStatus.textContent = "Pending review";
      verificationStatus.textContent = "Demo only: request previewed. No clinic details were sent or saved.";
      verificationStatus.classList.remove("is-error");
      enrollmentStatus.textContent = "Verification is pending; campaign enrollment is not available.";
      enrollmentStatus.classList.remove("is-error");
      enrollButton.disabled = true;
    });

    enrollButton.addEventListener("click", () => {
      if (!verificationRequested) {
        enrollmentStatus.textContent = "Complete clinic verification first. A real request also requires program approval.";
        enrollmentStatus.classList.add("is-error");
        return;
      }
    });

    document.querySelector("#redemption-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const error = validateRedemption({
        offerCode: document.querySelector("#offer-code").value,
        visitReference: document.querySelector("#visit-reference").value,
        veterinarianRecommended: document.querySelector("#vet-recommended").checked,
      });
      const status = document.querySelector("#redemption-status");
      status.textContent = error || "Demo field check passed only. Campaign eligibility was not verified and no redemption was recorded.";
      status.classList.toggle("is-error", Boolean(error));
    });

    const roleSelect = document.querySelector("#staff-role");
    const report = document.querySelector("#report-summary");
    const roleNote = document.querySelector("#role-note");
    roleSelect.addEventListener("change", () => {
      const canReport = canViewReports(roleSelect.value);
      report.hidden = !canReport;
      roleNote.textContent = canReport
        ? "Practice managers can review clinic-level activity and reporting gaps."
        : "Reporting totals are limited to practice managers in this preview. Clinic activity remains visible without owner or patient details.";
    });

    document.querySelector("#report-period").addEventListener("change", (event) => {
      document.querySelector("#period-caption").textContent = `last ${event.target.value} days`;
    });

    const loyaltyStatus = document.querySelector("#loyalty-status");
    const loyaltyOptIn = document.querySelector("#loyalty-opt-in");
    const loyaltyOptOut = document.querySelector("#loyalty-opt-out");
    loyaltyOptIn.addEventListener("click", () => {
      loyaltyStatus.textContent = "Demo preference only: opted in for this page view. No benefits are active.";
      loyaltyOptIn.disabled = true;
      loyaltyOptOut.disabled = false;
    });
    loyaltyOptOut.addEventListener("click", () => {
      loyaltyStatus.textContent = "Demo preference turned off for this page view.";
      loyaltyOptIn.disabled = false;
      loyaltyOptOut.disabled = true;
    });

    document.querySelectorAll(".resource-preview").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelector("#resource-feedback").textContent =
          `${button.dataset.resource} is a draft preview and is not approved for clinic or owner use.`;
      });
    });
    document.querySelector("#support-request").addEventListener("click", () => {
      document.querySelector("#support-status").textContent = "Support is not connected in this preview.";
    });

    return { get verificationRequested() { return verificationRequested; } };
  }

  return Object.freeze({ validateClinic, validateRedemption, canViewReports, initialize });
});
