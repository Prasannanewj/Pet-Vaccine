# Pet Vaccine Product Handoff

**Purpose:** Summarize the product work completed so far and provide a reusable starting point for creating another pet product.  
**Repository:** `Prasannanewj/Pet-Vaccine`  
**Snapshot:** November 11, 2026  
**Status:** Strategy and planning backlog are in place; one local-only canine influenza promotion prototype has been merged. This is not a production platform or an approved commercial campaign.

## Executive summary

The work to date has produced two related outcomes:

1. **A product strategy and planning backlog** for a U.S. pet-vaccine promotions platform, initially focused on canine influenza. It describes the intended product, users, business measures, risks, roadmap, dependencies, epics, and user stories.
2. **A browser-based prototype** for a consent-based canine influenza promotion experience. It demonstrates an owner journey, optional interest-based content, local preference storage, a gated follow-up preview, and an on-device experiment readout.

The prototype demonstrates interaction patterns and guardrails, not live business operations. It does not send communications, verify clinics, redeem offers, connect to a CRM, collect production analytics, or determine whether a dog should be vaccinated. Most broader platform capabilities remain planned work in open GitHub issues.

## Product definition to date

### Vision and mission

The strategy's vision is to help dogs whose veterinarians recommend protection get informed, connect with a participating clinic, and complete the appropriate vaccination course through trusted, measurable engagement.

The mission is to connect approved vaccine education and offers with owner conversations and clinic workflows, while keeping clinical judgment with the veterinarian and measuring incremental outcomes rather than clicks or coupon volume alone.

### Initial scope

- **Geography:** United States.
- **Initial product area:** Canine influenza vaccine promotion.
- **Product type:** A clinic-first campaign and owner-engagement platform, not a veterinary record system or clinical decision-support product.
- **Intended journey:** Approved education → owner-selected next step → participating clinic conversation → eligible offer/referral/redemption → measurement of verified outcomes where authorized.
- **Boundary:** Activities such as boarding, daycare, socializing, or travel may inform educational content when allowed. They do not prove clinical risk or vaccine eligibility.

### Intended users

- **Pet owners:** Need understandable information, transparent terms, and a convenient route to a clinic without pressure or automated medical advice.
- **Veterinarians and clinic teams:** Need accurate, approved materials and straightforward ways to discuss offers and individual care.
- **Clinic managers and practice groups:** Need low-friction enrollment, staff instructions, redemption workflows, and local performance visibility.
- **Marketing and field teams:** Need governed campaigns, approved content, clinic support, and reliable measurement.
- **Approved facility/community partners:** May share approved information and refer owners, but should not make clinical recommendations.

### Strategy's proposed North Star

Incremental, veterinarian-recommended, label-concordant vaccination courses completed among participating clinics, measured against a pre-specified comparison group. Count an outcome only when administration is verified, deduplicated, and authorized for measurement. Clicks, referrals, and coupon claims are not vaccination outcomes, and the metric must not reward vaccination without a veterinarian's recommendation.

## Product principles and guardrails

- Keep the veterinarian central to individual care and vaccination decisions.
- Make claims, offer terms, availability, and participating-clinic status clear and verifiable.
- Use only approved content, offers, and permitted audience attributes.
- Separate personalization consent from analytics consent; honor opt-out, suppression, and frequency controls.
- Minimize personal data and define purpose, retention, access, and deletion rules before production use.
- Distinguish interest, clicks, referrals, and redemptions from verified, veterinarian-recommended outcomes.
- Use an appropriately designed comparison to estimate incrementality; do not treat a small or biased sample as proof.
- Require clinical, regulatory, legal, privacy, security, and business review before any real campaign.
- Do not use AI to diagnose, infer vaccine eligibility, generate unreviewed claims, or optimize toward vaccination volume without clinical guardrails.

## Work completed

### Strategy and planning

- [`PRODUCT_STRATEGY.md`](PRODUCT_STRATEGY.md) documents the proposed U.S. canine influenza promotions platform: vision, mission, strategic themes, objectives, segments/personas, market challenges, capabilities, North Star, candidate success metrics, risks, assumptions, dependencies, and a 12-month roadmap.
- [`PRODUCT_PLANNING_PROMPTS.md`](PRODUCT_PLANNING_PROMPTS.md) preserves prompts used for OKRs, epics, and user stories.
- GitHub issues were created for 2027 OKRs, epics, and user stories. They are planning artifacts; an issue's existence does not mean its capability is implemented.

### Merged prototype: PR #68

[PR #68 — Build a consent-based offer personalization prototype](https://github.com/Prasannanewj/Pet-Vaccine/pull/68) was merged and closes the Offer Personalization epic, issue #45. It added:

- `index.html` — owner-facing page, disclosures, consent controls, illustrative offer, sample clinics, and experiment readout.
- `styles.css` — responsive visual presentation.
- `app.js` — browser-side state, rendering, local preference handling, follow-up preview, and demo measurement.
- `offer-personalization.js` — approved copy variants and reusable consent, frequency, and measurement helpers.
- `tests/offer-personalization.test.js` — Node.js tests for variant selection, follow-up gating, frequency handling, visit recording, and Wilson intervals.
- `run-local.ps1` and `run-local.bat` — Windows launcher for the static site.
- `README.md` — local run instructions and a warning that content and clinic listings are illustrative.

The page has a general experience and three optional interest variants: boarding/daycare, time with other dogs, and travel/outings. Copy encourages a veterinarian conversation and does not diagnose or assert that a particular dog needs vaccination.

### Prototype behavior

1. **Preferences:** An owner can choose an interest. Personalization remains off unless its separate consent checkbox is selected. Without consent or for an unrecognized interest, the general approved copy is shown.
2. **Local persistence:** Preferences, consent flags, demo assignment, and counts are stored in browser `localStorage`; they are not sent to a server.
3. **Opt-out:** The clear/opt-out control resets demo state and returns to a general experience.
4. **Follow-up preview:** The action is a local preview only and never sends a message. The helper blocks without consent, after opt-out, when suppressed, or within seven days of the previous preview. The UI describes a one-per-seven-days limit.
5. **Experiment demo:** The browser randomly assigns a general control or tailored experience. A separate analytics-consent checkbox gates recording. Recording a tailored visit additionally requires personalization consent and no opt-out or suppression. The demo allows at most one visit and one clinic-link action for the current browser state.
6. **Uncertainty display:** The readout shows action counts/rates and 95% Wilson intervals. It warns that the on-device sample is too small and is not a real campaign or clinical outcome.
7. **Clinic and offer content:** Clinic entries and terms are examples. Links are demonstration navigation, not verified live listings or booking integrations.

## Repository planning status

Issue states observed for this handoff:

- **Closed:** Offer Personalization epic #45; the prototype is PR #68.
- **Open 2027 OKRs:** #31–#37, covering product, customer experience, company outcomes, data/analytics, operational excellence, revenue/growth, and AI/personalization.
- **Open platform epics:** #1–#5 cover partner program, promotions/referrals/analytics, reminders/retention, clinic portal, and owner landing page/clinic locator. #38–#47 add customer segmentation, compliance/audit, AI recommendations, analytics dashboard, redemption tracking, promotions management, CRM integration, and campaign management; #45 is closed.
- **Open user stories:** #6–#30 and #48–#67 cover planned owner, clinic, partner, campaign, offer, consent, AI governance, CRM, audit, and measurement workflows.

Open issues represent backlog/planning scope unless their state changes and implementation evidence exists. They are not proof that integrations, clinic processes, redemption, reminders, or verified outcome measurement are live.

## Not built yet

The current site is a static local prototype. The repository does not yet provide:

- User accounts, server-side storage, production consent records, or a consent-management service.
- CRM delivery, email/SMS sending, cross-device preference synchronization, or production suppression lists.
- Campaign authoring/approval, a governed asset library, live offers, or redemption processing.
- Clinic verification, real clinic data/search, appointment booking, practice-management integrations, or clinic portal workflows.
- Verified vaccination records, patient-level clinical data, or production outcome attribution.
- A real randomized experiment service, representative sample, power calculation, or production analytics pipeline.
- Production privacy/security controls, role-based access, retention/deletion operations, audit trails, incident response, or accessibility validation.
- Clinical/regulatory/legal approval of illustrative content for external campaign use.

The strategy's roadmap, capability list, and success targets are recommendations and hypotheses. They require stakeholder decisions, baseline research, approved claims and offer rules, clinic discovery, and feasibility/security review before delivery.

## Reusable approach for another pet product

Reuse the planning method and governance principles, not vaccine-specific claims, audiences, offer assumptions, or measures. Validate those afresh for the next product.

1. **Define the boundary.** Name the species, product/service, geography, intended users, business objective, and whether the work is education, promotion, clinic workflow, or a combination. State explicitly what the product is not.
2. **Research the product context.** Confirm current labels, approved claims, clinical guidance, regulatory requirements, competitive context, availability, and local offer rules with authoritative sources and responsible reviewers. Record sources and review dates.
3. **Identify users and unmet needs.** Interview owners, veterinary teams, clinic managers, field/marketing teams, and relevant partners. Separate validated findings from assumptions.
4. **Write a product strategy.** Reuse the sections in `PRODUCT_STRATEGY.md`: vision, mission, themes, objectives, segments/personas, problems, value proposition, capabilities, North Star, success measures, risks, assumptions, roadmap, dependencies, and decision gates.
5. **Set clinical and trust guardrails first.** Specify who may make care recommendations, allowed content and audience attributes, consent purposes, opt-out/suppression behavior, frequency limits, disclosures, data minimization, and escalation/rollback paths.
6. **Create measurable planning issues.** Define OKRs with baselines, targets, owners, timeframe, and guardrails. Organize epics by capability, then create stories with testable acceptance criteria and explicit dependencies. Label ideas and targets as hypotheses until approved.
7. **Prototype the smallest safe journey.** Use clearly labeled sample data and local-only behavior if appropriate. Avoid implying a live offer, verified clinic, clinical recommendation, or production measurement.
8. **Test behavior and comprehension.** Add focused automated tests for consent, opt-out, suppression, frequency, allowed content, measurement eligibility, and edge cases. Test owner/clinic comprehension, accessibility, and whether prototype limitations are understood.
9. **Plan production separately.** Before connecting CRM, clinic systems, real offers, or health-related outcome data, specify architecture, threat/privacy review, approvals, data lifecycle, operational owners, analytics design, and support.
10. **Pilot with a decision framework.** Predefine comparison design, sample-size requirements, outcome definitions, guardrails, clinic burden measures, economics, and stop/scale criteria. Report null or inconclusive results as well as positive results.

### New-product brief template

| Topic | Decision / evidence |
|---|---|
| Product or service and species | |
| Launch geography and regulatory scope | |
| Primary user and unmet need | |
| Veterinarian/clinic role | |
| Product goal and intended behavior | |
| Out-of-scope uses and clinical boundaries | |
| Approved claims, source, owner, and review date | |
| Offer concept and terms, if applicable | |
| Data collected, purpose, consent, retention, and deletion | |
| Clinic/partner workflow and operational owner | |
| North Star and verified outcome definition | |
| Baseline, target, measurement design, and guardrails | |
| Dependencies, risks, and unresolved decisions | |
| Prototype scope and explicit non-production limitations | |

## Running and testing the existing prototype

- **Windows:** Double-click `run-local.bat`. Python 3 is required. The site runs at `http://localhost:8765/`; keep the server window open.
- **macOS/Linux:** From the repository directory, run `python3 -m http.server 8765`, then visit `http://localhost:8765/`.
- **Focused logic tests:** Run `node --test tests/offer-personalization.test.js` from the repository directory.

Treat the site as a demonstration only. Do not use its sample offers, copy, clinics, counts, or intervals as approved campaign assets, business results, clinical evidence, or production analytics.

## Source-of-truth links

- Strategy: [`PRODUCT_STRATEGY.md`](PRODUCT_STRATEGY.md)
- Saved prompts: [`PRODUCT_PLANNING_PROMPTS.md`](PRODUCT_PLANNING_PROMPTS.md)
- Prototype: [`index.html`](index.html), [`app.js`](app.js), [`offer-personalization.js`](offer-personalization.js)
- Tests: [`tests/offer-personalization.test.js`](tests/offer-personalization.test.js)
- Merged implementation: [PR #68](https://github.com/Prasannanewj/Pet-Vaccine/pull/68)
- Personalization epic: [Issue #45](https://github.com/Prasannanewj/Pet-Vaccine/issues/45)
