# PROJECT NEXUS
Original open-world Three.js browser game prototype.

## Netlify deployment
1. Push this folder to GitHub, or drag the **unzipped project folder** into Netlify Drop.
2. Netlify reads `netlify.toml`; publish directory is the project root and no build command is needed.
3. Open the generated `https://your-site.netlify.app` URL.

## Local run
```bash
npx serve .
```

## Controls
WASD move/drive • Shift sprint • Space jump/handbrake • Mouse camera • E enter/exit vehicle • Esc pause.

## Notes
- Requires internet on first load for the Three.js CDN module.
- If Netlify shows a blank page, open browser DevTools (F12) → Console and check for a missing-file/404 error.
