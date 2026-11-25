# The BrandzStory: Website

**A Story Behind Every Brand.** Creative & Tech studio, Salem.

## Tech stack (all free)
| Part | Tool |
|---|---|
| Site builder | [Astro](https://astro.build) (static output) |
| Animations | GSAP + SplitText + ScrollTrigger |
| Smooth scroll | Lenis |
| Fonts | Space Grotesk (headings) · Inter (body), self-hosted via Fontsource |
| Contact form | Web3Forms (free) + WhatsApp button |
| Hosting | Cloudflare Pages (free) |

## Run on your laptop
```bash
npm install
npm run dev      # open http://localhost:4321
npm run build    # production build into dist/
```

## Work on two laptops
- **Start work:** `git pull`
- **Finish work:** `git add . && git commit -m "what you did" && git push`

## Project structure
```
src/
  pages/index.astro       ← all homepage sections and content
  components/LogoB.astro  ← the striped "B" logo as SVG (animated)
  styles/global.css       ← colours, glass cards, glossy buttons
  scripts/main.js         ← hero intro + scroll animations + smooth scroll
public/
  images/                 ← client logos and reel thumbnails
  favicon.svg
```

## Hero animation order
1. Background stripe lines open from the centre and spread to both sides; the blue glow settles.
2. The big **B** rises stripe by stripe from the centre.
3. The headline slides up line by line, then the subline, buttons and menu.

## Deploy to Cloudflare Pages
1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Choose this repository.
3. Framework preset: **Astro** · Build command: `npm run build` · Output folder: `dist`
4. Save and deploy. The site goes live at `https://<project-name>.pages.dev`.
5. Later: **Custom domains** → add `thebrandzstory.in`.

## To do
- [ ] Add a Web3Forms access key in `src/pages/index.astro` (replace `YOUR_ACCESS_KEY`)
- [ ] Client testimonials (Rasikas, HillSide)
- [ ] Team photos
- [ ] FAQ answers
- [ ] Original logo file (SVG) to replace the redrawn B
- [ ] High-quality reel covers in `public/images/`
