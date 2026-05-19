# Seed admin users

After running schema.sql, create the three admin accounts in Supabase Auth:

## Option A — Invite via Dashboard (recommended)

In Supabase Studio → Authentication → Users → "Invite user", invite:

- matias@whyzer.ai
- nadia@whyzer.ai
- luciana@whyzer.ai

Each gets an email with a magic-link to set their password.

## Option B — Create with passwords directly

Authentication → Users → "Add user" → "Create new user". Set the email, choose a password, and tick "Auto Confirm User" so they can log in immediately without verifying email.

## Notes

- Once these three are created, **disable public signups** so no one else can self-register:
  Authentication → Providers → Email → toggle off "Enable sign-up"
- Adding admins later is one click in the same Users dashboard.
