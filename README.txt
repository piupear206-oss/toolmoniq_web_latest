TOOLMONIQ — Fixed files pack

Included:
- package.json      (valid JSON, pinned Node 20.x, Vite + React + Tailwind deps)
- vercel.json       (SPA rewrite only)
- vite.config.js    (minimal config for Vite + React)

How to apply:
1) Unzip into the ROOT of your project (same folder as your current package.json) and overwrite.
2) In Vercel > Project > Settings:
   - Framework Preset: Vite
   - Build Command: npm run build
   - Output Directory: dist
3) If you use an ENV for the chart:
   - Add VITE_MONIQ_CHART_URL in Vercel Environment Variables.
4) Redeploy.
