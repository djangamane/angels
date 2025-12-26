# Angel's Gentlemen's Club

Concept marketing site for Angel's Gentlemen's Club in Vinton, Louisiana. Built as
a static single-page layout with a looping hero video and placeholder zones for
future imagery.

## Project Structure
- `index.html` main page layout
- `styles.css` site styling
- `angels_loop.mp4` hero background video
- `angel_logo.png` logo asset

## Local Preview
- Open `index.html` directly in a browser, or
- Run a local server: `python -m http.server 8000` and visit `http://localhost:8000`

## Customize
- Replace the placeholder blocks in `index.html` (events, VIP, gallery, map).
- Update the address, hours, phone, and email copy in the Location section.
- Swap in new imagery as files in the project root.

## Deploy to Vercel
1. Push this repo to GitHub.
2. In Vercel, create a new project and import the repo.
3. Select Framework Preset: "Other".
4. Build Command: leave empty.
5. Output Directory: `.`
