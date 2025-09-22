Fix for "Rollup failed to resolve import 'firebase/auth'":

Two ways to fix:
A) Install Firebase (recommended)
   - This pack's package.json adds: "firebase": "^10.12.3"
   - After overwriting, run `npm i` (locally) or redeploy on Vercel.

Optional (safer at runtime):
- Use src/lib/firebaseSafe.js instead of importing firebase directly.
  Example:
    // BEFORE
    // import { getAuth } from 'firebase/auth'
    // AFTER
    import { auth } from './lib/firebaseSafe'
  And check `if (!auth) { ... }` when Firebase envs are not set.

If you want to keep existing imports but avoid runtime usage,
you can still just install the firebase package and set your VITE_FIREBASE_* envs later.
