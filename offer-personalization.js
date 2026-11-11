(function (root, factory) {
  const personalization = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = personalization;
  }
  root.OfferPersonalization = personalization;
})(typeof globalThis === "undefined" ? this : globalThis, function () {
  const approvedVariants = Object.freeze({
    general: Object.freeze({
      title: "A question worth asking your vet.",
      copy: "Ask a participating clinic whether a canine influenza vaccine conversation is right for your dog.",
    }),
    boarding: Object.freeze({
      title: "Planning a stay away from home?",
      copy: "Ask your veterinarian what to know about canine influenza before your dog’s next boarding or daycare visit.",
    }),
    social: Object.freeze({
      title: "Lots of time with other dogs?",
      copy: "Your veterinarian can talk through canine influenza and your dog’s time around other dogs.",
    }),
    travel: Object.freeze({
      title: "Taking your dog along?",
      copy: "Ask your veterinarian what to consider about canine influenza for your dog’s outings and travel.",
    }),
  });
  const maxFollowUps = 1;
  const frequencyWindowDays = 7;

  function getApprovedVariant(interest, hasConsent) {
    if (!hasConsent || !Object.hasOwn(approvedVariants, interest)) {
      return approvedVariants.general;
    }
    return approvedVariants[interest];
  }

  function canSendFollowUp({
    consent,
    optedOut,
    suppressed,
    lastSentAt,
    now = Date.now(),
  }) {
    if (!consent) return { allowed: false, reason: "consent" };
    if (optedOut) return { allowed: false, reason: "opted-out" };
    if (suppressed) return { allowed: false, reason: "suppressed" };
    if (lastSentAt != null) {
      const elapsed = now - lastSentAt;
      if (elapsed < frequencyWindowDays * 24 * 60 * 60 * 1000) {
        return { allowed: false, reason: "frequency" };
      }
    }
    return { allowed: true, reason: "eligible" };
  }

  function wilsonInterval(actions, sampleSize) {
    if (sampleSize <= 0) return null;
    const z = 1.96;
    const proportion = actions / sampleSize;
    const denominator = 1 + (z * z) / sampleSize;
    const center = (proportion + (z * z) / (2 * sampleSize)) / denominator;
    const margin =
      (z *
        Math.sqrt(
          (proportion * (1 - proportion)) / sampleSize +
            (z * z) / (4 * sampleSize * sampleSize),
        )) /
      denominator;
    return [Math.max(0, center - margin), Math.min(1, center + margin)];
  }

  return Object.freeze({
    approvedVariants,
    maxFollowUps,
    frequencyWindowDays,
    getApprovedVariant,
    canSendFollowUp,
    wilsonInterval,
  });
});
