# Faizan Noor - Portfolio

My software engineering portfolio, built as a Windows XP desktop. Projects are
files you open, demos run in their own windows, and the resume opens in a PDF
viewer. React + Vite, no UI framework - the XP chrome is hand-written CSS.

Live at [faizannoor.ca](https://faizannoor.ca).

## Running it

```powershell
npm install
npm run dev
```

Vite serves on `http://localhost:5173`, or the next free port if that one is
taken. To check a production build before deploying:

```powershell
npm run build
npm run preview
```

## How it's laid out

`src/components/Desktop.jsx` is the whole shell. It holds the project and demo
data at the top of the file, plus the window manager - open/minimize/maximize
state, z-ordering, and the taskbar. A new project is an object in the `projects`
array, an entry in `desktopFiles` so it gets an icon, and a button in the Start
menu - the project window itself renders off the array and needs no changes.

The rest of `src/components` is the pieces that shell renders: `XpWindow` (title
bar, drag handling, window controls), `RecruiterProfile` (the About tabs),
`ResumeViewer`, and `XpButton`.

`src/demos` holds the two interactive demos. `BudgetOptimizer` runs the 0/1
knapsack from `algorithms.js` against whatever you type in.
`InventoryLifecycleSimulator` walks a synthetic shoe-box label through intake,
validation, inventory, and sale reconciliation - including one sample with a
deliberate size conflict, so the blocked-scan path is visible and not just
described.

## Assets in `public/`

- `resume.pdf` - opened by the in-page PDF viewer, and downloadable from it
- `windows-xp-bliss.webp` + `.jpg` - wallpaper; CSS `image-set` prefers the
  WebP and falls back to the JPEG on older Safari
- `videos/product-scraper-demo.mp4` - 7 MB, so it sits behind a play button and
  downloads nothing until clicked
- `og-image.png` - 1200x630 card for link previews
- `favicon.ico` + `favicon.png`

The OG card and favicons were drawn with Pillow and committed as-is. Nothing in
`npm run build` regenerates them, so if the numbers on the card go stale you
have to redo them by hand.

## Deploying

The origin is hard-coded in `index.html` in four places: `canonical`, `og:url`,
`og:image`, and `twitter:image`. These have to be absolute URLs - Slack,
LinkedIn, and iMessage won't resolve a relative `og:image`, and link previews
come back blank if you get this wrong. Change the domain, change all four.

If this ever moves to a GitHub Pages project site instead of a custom domain,
set `base` in `vite.config.js` and fix the root-absolute asset paths
(`/resume.pdf`, `/videos/...`, `/windows-xp-bliss.*`, `/favicon.*`), which will
otherwise 404 under the `/repo-name/` prefix.
