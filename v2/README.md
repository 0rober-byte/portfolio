# RobGD portfolio v2

Independent preview built from production commit `ed0a6d45ccc8407e68af87746a31eab87df50518`. The original production branch and domains are not changed.

## Build

Node.js 22 or later. No application dependencies.

```sh
node v2/build.mjs
node --test v2/tests.mjs
```

Vercel publishes `dist/`. The generator produces 33 server-rendered HTML pages: home, project archive, process, and eight case studies in Spanish, English and Italian. All original asset folders are copied without modifying their files. Preview pages send `noindex` to avoid competing with the live portfolio.

## Content

- `content.json`: original project content and translations from the published portfolio.
- `locales.mjs`: interface, services, biography and process copy in ES/EN/IT.
- `build.mjs`: semantic templates and route generation.
- `style.css`: layout, typography, responsive rules and animations.
- `app.js`: menu, language handoff, motion controls, previews, accordion behavior and contact composition.

The official RobGD SVG files remain unchanged. Fifteen client logos, eight cover images, both portraits and every current project image/video are retained. Legacy asset folders are preserved as well.

## Interaction and accessibility

Native links and separate HTML routes support deep links, reloads, browser history and use without JavaScript. The menu uses a modal dialog with focus containment and Escape support. Videos have a single native control surface. Motion follows `prefers-reduced-motion`; the hero also has a pause control. Touch layouts use one project per row at 560px and below, two below 981px, and three on desktop, matching the reference.

## Contact

The form validates fields and prepares an email in the visitor's mail application. It explicitly says that the visitor must review and send it. A copy action and WhatsApp handoff are provided. No backend or third-party form account is required, and no false sent confirmation is displayed. Drafts are stored only in the tab's session storage. Theme preference uses local storage. Analytics are intentionally absent from the independent preview.

## Reference study

Reference: https://www.cancreativestudio.com/ (inspected 2026-11-25). Reviewed home, archive, contact, services, process and all 36 linked project routes. Layout observations: 100svh three-row animated mosaic, 6px tile gutters, fixed top-right controls, centered introduction, five-line word wheel, 4:5 project thumbnails in a 3/2/1 grid, 1320px content maximum, 120px desktop section rhythm, split project introductions, mixed media galleries, full-width service accordions and rounded dark contact/footer. The current RobGD portfolio supplies all project content and brand assets. No CAN logos, projects, imagery or commercial text are included.

## Publishing

Branch: `portfolio-v2`. Dedicated Vercel project: `robgd-portfolio-v2`. Build as a preview; do not promote or reassign production domains.
