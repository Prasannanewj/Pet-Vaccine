(function () {
  const storageKey = "pet-vaccine-personalization-demo-v1";
  function createInitialState() {
    return {
      interest: "general",
      consent: false,
      analyticsConsent: false,
      optedOut: false,
      suppressed: false,
      lastSentAt: null,
      variant: Math.random() < 0.5 ? "control" : "tailored",
      counts: {
        control: { visits: 0, actions: 0 },
        tailored: { visits: 0, actions: 0 },
      },
      visitRecorded: false,
      actionRecorded: false,
    };
  }
  const elements = {
    interest: document.querySelector("#interest"),
    consent: document.querySelector("#personalization-consent"),
    analyticsConsent: document.querySelector("#analytics-consent"),
    preferenceStatus: document.querySelector("#preference-status"),
    offerTitle: document.querySelector("#offer-title"),
    offerCopy: document.querySelector("#offer-copy"),
    optOut: document.querySelector("#opt-out"),
    sendFollowUp: document.querySelector("#send-follow-up"),
    followStatus: document.querySelector("#follow-status"),
    followStatusDot: document.querySelector("#follow-status-dot"),
    followResult: document.querySelector("#follow-result"),
    clinicAction: document.querySelector("#clinic-action"),
    controlResult: document.querySelector("#control-result"),
    controlRate: document.querySelector("#control-rate"),
    treatmentResult: document.querySelector("#treatment-result"),
    treatmentRate: document.querySelector("#treatment-rate"),
    uncertaintyResult: document.querySelector("#uncertainty-result"),
    experimentLimits: document.querySelector("#experiment-limits"),
  };

  function readState() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey));
      if (stored && stored.counts && stored.variant) {
        const freshState = createInitialState();
        return { ...freshState, ...stored, counts: { ...freshState.counts, ...stored.counts } };
      }
    } catch (error) {
      localStorage.removeItem(storageKey);
    }
    return createInitialState();
  }

  let state = readState();

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function personalized() {
    return state.consent && !state.optedOut && !state.suppressed;
  }

  function showExperience() {
    const variant = window.OfferPersonalization.getApprovedVariant(
      state.interest,
      personalized() && state.variant === "tailored",
    );
    elements.offerTitle.textContent = variant.title;
    elements.offerCopy.textContent = variant.copy;
    elements.interest.value = state.interest;
    elements.consent.checked = state.consent && !state.optedOut;
    elements.analyticsConsent.checked = state.analyticsConsent;
    elements.preferenceStatus.textContent = !personalized()
      ? "Personalization is off. You’ll see the general experience."
      : state.variant === "tailored"
        ? "Your selected interest is being used on this device only."
        : "Consent is saved. This demo assigned the general control experience.";
    elements.followStatus.textContent = personalized() ? "Consent is on for this preview" : "Follow-up is off";
    elements.followStatusDot.classList.toggle("is-active", personalized());
    const deliveryCheck = window.OfferPersonalization.canSendFollowUp({
      consent: state.consent,
      optedOut: state.optedOut,
      suppressed: state.suppressed,
      lastSentAt: state.lastSentAt,
    });
    elements.sendFollowUp.disabled = !deliveryCheck.allowed;
    const followUpMessages = {
      consent: "Turn on personalization consent above to enable the preview.",
      "opted-out": "Personalization is off; no follow-up preview is available.",
      suppressed: "Follow-up is suppressed; no preview is available.",
      frequency: "Preview limit reached: one follow-up per seven days.",
      eligible: "Preview is available. It will not be sent outside this browser.",
    };
    elements.followResult.textContent = followUpMessages[deliveryCheck.reason];
    if (
      window.OfferPersonalization.canRecordVisit({
        analyticsConsent: state.analyticsConsent,
        visitRecorded: state.visitRecorded,
        variant: state.variant,
        consent: state.consent,
        optedOut: state.optedOut,
        suppressed: state.suppressed,
      })
    ) {
      state.counts[state.variant].visits += 1;
      state.visitRecorded = true;
      saveState();
    }
    showExperiment();
  }

  function formatRate(count) {
    if (count.visits === 0) return "No opted-in visits";
    const rate = Math.round((count.actions / count.visits) * 100);
    const interval = window.OfferPersonalization.wilsonInterval(count.actions, count.visits);
    return `${rate}% action rate · 95% CI ${Math.round(interval[0] * 100)}–${Math.round(interval[1] * 100)}%`;
  }

  function showExperiment() {
    const control = state.counts.control;
    const tailored = state.counts.tailored;
    elements.controlResult.textContent = `${control.actions} / ${control.visits}`;
    elements.controlRate.textContent = formatRate(control);
    elements.treatmentResult.textContent = `${tailored.actions} / ${tailored.visits}`;
    elements.treatmentRate.textContent = formatRate(tailored);
    if (control.visits === 0 || tailored.visits === 0) {
      elements.uncertaintyResult.textContent = "Not estimable";
    } else {
      const controlInterval = window.OfferPersonalization.wilsonInterval(control.actions, control.visits);
      const tailoredInterval = window.OfferPersonalization.wilsonInterval(tailored.actions, tailored.visits);
      const low = (tailoredInterval[0] - controlInterval[1]) * 100;
      const high = (tailoredInterval[1] - controlInterval[0]) * 100;
      elements.uncertaintyResult.textContent = `${low > 0 ? "+" : ""}${Math.round(low)} to ${high > 0 ? "+" : ""}${Math.round(high)} percentage points`;
    }
    const total = control.visits + tailored.visits;
    elements.experimentLimits.textContent =
      `Opted-in sample size on this device: ${total} (${control.visits} control, ${tailored.visits} tailored). ` +
      "The uncertainty range is a conservative difference of 95% Wilson intervals; with this small, local sample, results are inconclusive. " +
      "A real study needs a pre-specified sample size, approved delivery, and a representative randomized control.";
  }

  elements.interest.addEventListener("change", () => {
    state.interest = elements.interest.value;
    saveState();
    showExperience();
  });

  elements.consent.addEventListener("change", () => {
    state.consent = elements.consent.checked;
    state.optedOut = !elements.consent.checked;
    state.suppressed = !elements.consent.checked;
    saveState();
    showExperience();
  });

  elements.analyticsConsent.addEventListener("change", () => {
    state.analyticsConsent = elements.analyticsConsent.checked;
    if (!state.analyticsConsent) {
      state.counts = { control: { visits: 0, actions: 0 }, tailored: { visits: 0, actions: 0 } };
      state.visitRecorded = false;
      state.actionRecorded = false;
    }
    saveState();
    showExperience();
  });

  elements.optOut.addEventListener("click", () => {
    state = createInitialState();
    saveState();
    showExperience();
  });

  elements.sendFollowUp.addEventListener("click", () => {
    const check = window.OfferPersonalization.canSendFollowUp({
      consent: state.consent,
      optedOut: state.optedOut,
      suppressed: state.suppressed,
      lastSentAt: state.lastSentAt,
    });
    if (!check.allowed) {
      const messages = {
        consent: "No preview shown: personalization consent is required.",
        "opted-out": "No preview shown: you opted out.",
        suppressed: "No preview shown: follow-up is suppressed.",
        frequency: "No preview shown: the one-per-seven-days frequency limit applies.",
      };
      elements.followResult.textContent = messages[check.reason];
      showExperience();
      return;
    }
    const message = window.OfferPersonalization.getApprovedVariant(
      state.interest,
      personalized() && state.variant === "tailored",
    );
    state.lastSentAt = Date.now();
    saveState();
    showExperience();
    elements.followResult.textContent = `Preview only—not sent: “${message.title}” ${message.copy}`;
  });

  elements.clinicAction.addEventListener("click", () => {
    if (
      !state.analyticsConsent ||
      !state.visitRecorded ||
      (state.variant === "tailored" && !personalized())
    ) return;
    if (!state.actionRecorded) {
      state.counts[state.variant].actions += 1;
      state.actionRecorded = true;
      saveState();
      showExperiment();
    }
  });

  showExperience();
})();
