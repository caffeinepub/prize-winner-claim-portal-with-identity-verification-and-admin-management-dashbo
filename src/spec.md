# Specification

## Summary
**Goal:** Build a prize-winner claim portal with Internet Identity sign-in, a winner claim flow (ticket verification, claim submission, identity photo upload), and an admin-only dashboard to review/manage claims and testimonials.

**Planned changes:**
- Add Internet Identity authentication and role-gated navigation for Winner Portal vs Admin Dashboard (admin principals configured in backend).
- Implement winner ticket/prize verification + activation with clear statuses (valid/invalid/already claimed) and binding activation to the signed-in principal.
- Build claim submission flow with delivery details, payout method selection (ATM card/certified check/bank transfer) and conditional fields; store claims and display claim status + claim ID.
- Add identity verification capture: upload/capture selfie and ID card images with previews, basic client validation, backend type/size limits, and re-upload before finalization.
- Add a confirmation/legitimacy page with submission confirmation (claim ID + status) and an “Is this real?” English-only guidance/disclaimer section.
- Create an admin-only dashboard to list/filter claims, view claim details (including uploaded images), and update claim status with an admin response message visible to the winner.
- Add Testimonials section (seeded with Ronnie Lee (USA) and Hans Cusveller (Canada)), plus admin tooling to add/edit/remove testimonials and show a disclaimer.
- Apply a consistent, accessible visual theme across Winner Portal and Admin Dashboard.
- Implement Motoko backend models + typed APIs with stable storage for winning entries, claims, identity uploads, admin responses, and testimonials, including backend authorization for admin-only actions.

**User-visible outcome:** Users can sign in with Internet Identity, verify and activate a winning entry, submit a claim with payout and delivery details plus selfie/ID photos, and track claim status and confirmations; admins can securely review/manage all claims and testimonials from a dedicated dashboard.
