<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/logo-dark.svg">
    <img alt="Flipsy" src=".github/logo-light.svg" height="90">
  </picture>
</p>

---

<p align="center">
  A fast, private image converter that runs entirely in your browser.
</p>

<p align="center">
  <a href="https://flipsy.me">flipsy.me</a>
</p>

## What it is

Flipsy converts images between formats without uploading anything. Files are read, converted, and saved entirely on your machine, so your images never leave your computer.

## Features

- Convert between **JPEG, PNG, WebP, GIF, and BMP**
- 100% client-side, no server uploads
- Batch convert and download everything as a zip
- Drag-and-drop, responsive interface

## Tech stack

- **React** + **TypeScript**
- **Vite**
- `jszip` + `file-saver` for batch downloads
- **Firebase Hosting**, with optional Firebase Analytics

## Getting started

```bash
npm install
npm run dev
```

Analytics is optional. To enable it, add your Firebase config to a `.env` file:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint + Stylelint |
| `npm run format` | Prettier |
| `npm run typecheck` | `tsc --noEmit` |

## How to use

1. Drop image files onto the dropzone, or click to pick them.
2. Choose the output format.
3. Convert, then download a single file or a zip for batches.

## License

MIT
