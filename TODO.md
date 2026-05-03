# TODO.md - Run HTML/React App ✅

## Completed Steps
- [x] Install @types/node (TS error fixed)
- [x] Clean npm install (rm node_modules/package-lock.json && npm i)
- [x] Upgrade Node.js to v20.20.2 via nvm
- [x] Run `npm run dev` - Vite server running at http://localhost:5173/

## Why HTML Can't Run Directly
index.html loads React via ES modules (`/src/main.tsx`) – browsers block file:// ES modules. **Always use `npm run dev` for Vite/React apps.**

Open http://localhost:5173/ to view the dashboard.

**Task complete!**
