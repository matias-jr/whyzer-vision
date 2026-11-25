# Black Friday 2026: temporary removal of the free trial

Created 2026-11-17/18. The free-trial language and the /free-trial page were taken
down for the Black Friday sale. **Reinstate after 2 December 2026.**

## How to revert

Preferred (git keeps any unrelated changes made since):

    git log --oneline --grep="Remove free trial"     # find the commit
    git revert <sha>

Fallback (overwrites the files wholesale, so edits made to them since 17 Nov are lost):

    bash _black-friday-revert/revert.sh

`originals/` holds the exact pre-change content of every touched file (same paths as
the repo), taken from origin/main immediately before the change.

## What changed

| Area | Change |
|---|---|
| Home (HomeV8View.tsx, HomeV8.tsx) | CTAs became "Get Started"; removed the "Free for 14 days, then $X/mo" notes, the trial footnote and the FAQ item "How does the free trial work?" |
| public/llms.txt | Removed the "14-day free trial available" line |
| /free-trial (src/routes.tsx) | Route redirects to /#pricing. FreeTrial.tsx is untouched. To reinstate, swap the Navigate line for the commented `lazy` line above it |
| TermsAndConditions.tsx | Removed the "Free Trials" section and the trial references in No Refunds and Cancellation |
| public/compare/*.html (7) | Removed Whyzer's own trial claims (CTAs, "Nothing charged until day 14", trial pricing rows, Rox table row). Competitors' trial statements left alone on purpose |
| centralize-offer.html / -registered.html | Removed "Limited-time free trial · No credit card required" line; "Trial Terms" link text became "Terms" |
| WebinarThankYou.tsx | Trial wording removed (CTAs, FAQ, billing steps, terms band). The $57/mo x 3 months with FLUENCY57, then $97/mo, offer is kept |
| ProcurementSessionWatch.tsx | Step 2 reworded to "Join Whyzer Elite" / "Get Elite" |
| ColdEmailLP.tsx (d1a/d1b/d2a/d2b) | Removed "14 days", "free trial" and "no credit card" wording |
| Pricing.tsx, FAQ.tsx | Same cleanup (these components are not currently imported anywhere) |

## Deliberately NOT changed
- Stripe: the monthly checkout links (subscribe.whyzer.ai/premium-monthly, /elite-monthly)
  may still start a 14-day trial. That lives in Stripe, not here. Check before the sale.
- Internal/back-end trial logic: api/* (webhook, checkout, attribution), src/lib/checkoutPlans.ts,
  admin/Attribution.tsx, CheckoutPreview.tsx. Existing trials still need tracking and billing.
- Variable name `trialUrl` in WebinarThankYou.tsx (not user-visible).

## Thanksgiving banner (added 2026-11-25)
Home page banner "Happy Thanksgiving ... WHYZER10 ... Ends Dec 2, 11:59pm ET".
Files: src/components/home/PromoBanner.tsx (new) and one import + one `<PromoBanner />`
line in src/components/home/HomeV8View.tsx. It hides itself after the deadline, but remove
it after Dec 2 along with the trial revert: delete PromoBanner.tsx and those two lines.
