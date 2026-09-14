# Janet's Docusaurus Docs' Hosting Website

A personal documentation and blog site built with [Docusaurus](https://docusaurus.io/), hosted on GitHub Pages at [janetjotw.github.io/my-website](https://janetjotw.github.io/my-website).

## Content

- **Docs** — Tutorials and API documentation under the `docs/` directory
- **Blog** — Posts under the `blog/` directory

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions on every push to `main`. No manual deployment steps are needed.

## Local Development

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run start
```

The site will be available at `http://localhost:3000/my-website`. Most changes are reflected live without restarting the server.

## Build

Generate the static site into the `build/` directory:

```bash
npm run build
```
