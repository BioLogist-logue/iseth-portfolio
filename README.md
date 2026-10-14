# iSETH Portfolio Tower

An interactive 3D portfolio that works like a building. Above-ground floors hold visible work, basement floors hold deeper experience, and the rooftop garden is a free space for side projects.

Built with Next.js 16, React 19, React Three Fiber, drei, Zustand, Framer Motion and Tailwind CSS 4.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
```

## Phase 1 (MVP) scope

- Exterior in day and night modes. It follows the OS theme by default and has a manual toggle.
- Click the building to move closer, then **들어가기 / Enter** takes you into the 1F lobby with a spatial transition.
- One continuous elevator. Pressing a button lights it, then the doors close, the indicator counts through each floor, a ding plays, and the doors open. All sounds are synthesized with Web Audio, and there is a sound toggle.
- 1F lobby: reception (about), wall directory, featured work and lounge (updates + recommended routes).
- 4F App Development Lab is the fully implemented floor, with 4 category zones.
- RF rooftop garden prototype.
- Every other floor runs on a reusable scene template with sample content.
- Content is read in 2D detail panels, and the 3D view is kept as it was when a panel closes.
- Search with Korean initial-consonant (초성) matching, a 2D directory and deep links.
- Responsive controls for desktop and mobile, `prefers-reduced-motion` support, and a non-WebGL fallback.

## Adding content (no scene code needed)

All content lives in `src/content/`. **For a step-by-step guide in Korean (written for non-developers), see [CONTENT_GUIDE.md](CONTENT_GUIDE.md).**

| File | What it holds |
| --- | --- |
| `floors.ts` | Building directory: one entry per floor |
| `zones.ts` | Zones per floor. Each floor can have 1–6, and they lay out automatically |
| `portfolio/*.ts` | Portfolio entries, one file per content area (`PortfolioEntry`, see `schema.ts`) |
| `schema.ts` | Authoring schema: shared fields + one template per content type, and how each field is displayed |
| `normalize.ts` / `validate.ts` | Entry → runtime `PortfolioItem`; lightweight checks (duplicate ids, floor/zone, required fields, links) |
| `site.ts` | Profile, recommended routes, latest updates |

### Add a floor

Add an entry to `floors.ts`:

```ts
{
  id: "7f",
  floorNumber: 7,              // basement: -5, -6 ...
  name: "새 층 이름",
  nameEn: "New Floor",
  tagline: "한 줄 소개",
  description: "층 설명",
  type: "standard",            // "basement" for underground floors
  publishedAt: "2026-11-01",   // shows NEW for 14 days
  sceneType: "gallery",        // see "Interior archetypes" below
  accent: "#3aa0a0",
}
```

The elevator buttons, directories, search and URL routes update on their own. The exterior also adds a floor module, extends the elevator core and raises the roof. Basement floors appear in the diorama's section cut.

### Add zones and items

```ts
// zones.ts
{ id: "7f-main", floorId: "7f", name: "구역 이름", sceneType: "gallery-wall", description: "…", order: 1 }

// portfolio/apps.ts — copy a blank form from content-templates/app-template.ts
{
  id: "my-app",
  template: "app",             // decides the extra fields (see src/content/schema.ts)
  title: "앱 이름",
  shortDescription: "짧은 설명",
  floor: "7f",
  zone: "7f-main",
  publishedAt: "2026-11-01",
  description: "긴 설명.

문단은 빈 줄로 구분합니다.",   // optional from here on
  status: "PROTOTYPE",
  thumbnail: "/images/my-app.png",
  externalLinks: [{ label: "앱 열기", url: "https://…", kind: "live" }],
  attachments: [{ label: "지도안", url: "/files/plan.pdf", preview: true }],
  coreFeatures: ["기능 1", "기능 2"], // template field → labelled section in the panel
  techStack: ["React"],
}
```

`object` (optional) picks the 3D model. The choices are `tablet`, `monitor`, `book`, `folder`, `poster`, `frame`, `badge`, `screen`, `device`, `model-dna`, `model-cell`, `terrarium` and `kiosk`. When it is left out, the model is derived from `type`.

Put downloadable files and images in `public/`. `public/files/sample.pdf` is a placeholder.

Template fields are shown in the detail panel by a per-template display spec (`TEMPLATES` in `schema.ts`): short facts go in the info box, lists and steps become titled sections, and empty fields are never rendered. Validation problems are printed in the dev console; a production build fails on errors (duplicate id, unknown floor/zone, missing required field). Blank, commented forms for every template are in `content-templates/`.

## Interior archetypes

A floor picks its spatial identity with `sceneType`. Everything spatial lives in `src/lib/archetypes.ts`; scene code never checks floor numbers. Each archetype defines:

- **Zone layouts** (`layouts[n]`): curated placements (position, facing, size) for each zone count. A count without a curated layout falls back to the two-column aisle, so adding or removing zones never breaks a floor.
- **Zone frame**: the architecture around each zone. `panel` (freestanding back panel), `alcove` (bookshelf walls), `wall` (gallery wall with track lights), `niche` (warm museum recess), `stage` (presentation wall + stage), `board` (wall-mounted workspace) or `open` (open bay).
- **Hall**: the central-hall composition, the floor runner and the position of the directory sign.
- **Light**: tint (warm / neutral / cool), key strength and pendants. Only uniform values change, never the set of lights.
- **Camera**: the pitch and distance for zone close-ups. Cameras are kept inside the solid walls automatically.

| Floor | sceneType | Layout & identity |
| --- | --- | --- |
| 1F | `lobby` | custom stations (reception, featured wall, lounge) |
| 2F | `library` | bookshelf alcoves on the back and side walls, central reading hall with lamp-lit tables, document stands |
| 3F | `smart-classroom` | two classroom wings facing wall displays, central media plaza with a collaboration table and kiosks, cool light |
| 4F | `development-lab` | reference floor: two-column aisle with panel booths (unchanged) |
| 5F | `conference` | stage zone with rows of seats, workshop bay, materials wall, breakout tables |
| 6F | `gallery` | tall display walls under track lights, freestanding art partitions, open centre |
| B1 | `operations` | workflow boards on the side walls, ops island, process maps, storage |
| B2 | `archive` | cabinet alcoves, shelving stacks, reading desk, before/after display |
| B3 | `museum` | warm niches, central exhibit, statement panels, calm bench |
| B4 | `homeroom` | blackboard + student desks, bulletin and schedule boards, consultation corner |
| RF | `garden` | free-form garden (no central-hall layout) |

Every hall floor keeps the same navigation: the elevator leads to the central hall (arrival camera + directory sign), then to the zones and their objects. A floor can pass optional hints such as `decor: { density: "low" | "medium" | "high", plants: boolean }`.

To add a new archetype, add an entry to `ARCHETYPES` (and, if it needs one, a hall composition in `HallDecor.tsx`). Content doesn't change.

## Floor transitions & profiling

1. Pressing a floor button starts loading the destination scene's code.
2. Once the doors shut, the destination floor mounts behind them.
3. `FloorPreparer` uploads its textures and compiles its shaders (`compileAsync`). The doors stay closed until this has finished.
4. The light rig always has the same structure, both inside and outside (hemisphere, ambient, one shadowed sun, two point lights, fog). As a result, changing floors only updates uniforms and never forces a global shader recompile.

Every transition is recorded with the User Timing API (`tower:*` marks in the DevTools Performance panel) and saved to `window.__towerPerf`. In development the records are also logged; in production, add `?perf` to the URL to log them. Each record holds start → swap → mounted → prepared → firstFrame → doorsOpen → arrived, the worst frame after the doors open, and the timestamps of any long frames.

## Scene-preparation failures

There are four states: loading, ready and failed (timeout / load-error / render-error / gpu-error). The floor scene sits inside an error boundary, so a failed code chunk or a render error is caught there instead of crashing the canvas.

A failure or timeout (10 s) **never opens the doors**:

- **In the elevator:** the cab stops at the destination with the doors shut and the indicator shows `!`. A recovery card offers **Retry**, **Return to Lobby** (or **Go Outside** if the lobby itself failed) and **View as list**. The floor buttons stay active, so the visitor is never trapped.
- **Entering from outside:** the entry fade stays up and the same recovery card appears.
- **Retry** remounts the scene with a fresh error boundary. If preparation finished late (just after a timeout), Retry continues straight away.

In development, every step is logged to the console and saved to `window.__towerPrepLog`. To test failures, inject a fault from the console before riding:

```js
__towerFail = { floorId: "4f", mode: "throw" }   // render error
__towerFail = { floorId: "4f", mode: "reject" }  // GPU-prep error
__towerFail = { floorId: "4f", mode: "hang" }    // timeout (shorten with __tower.setState({ prepTimeoutMs: 2500 }))
```

## Architecture

```
content-templates/     blank, commented forms to copy (one per content template)
src/
  content/            data only (floors, zones, portfolio entries, profile)
    schema.ts         authoring schema + per-template display spec
    portfolio/        one data file per content area
  lib/
    types.ts          Floor / Zone / PortfolioItem / Attachment / Recommendation
    building.ts       derived model: shaft order, labels, NEW logic, travel time
    layout.ts         room/zone geometry + every camera pose
    search.ts         search index (title, tag, type, 초성)
    audio.ts          Web Audio synth (click, doors, hum, ding)
  store/tower.ts      Zustand store + navigation/elevator orchestration
  components/
    scene/            3D only — reads data, never contains content
      CameraRig.tsx   cinematic moves + limited orbit/zoom per view
      exterior/       modular building (instanced facade parts, 3 facade variants), island, basements
      interior/       ElevatorCab (persistent), RoomShell, templates,
                      HallFloorScene (generic), LobbyScene, GardenScene,
                      ZoneBooth + ZoneFurniture sets, PortfolioObject
      common/         shared materials/surfaces, rounded + instanced geometry, vegetation,
                      LightRig, GPU prepare, props, sky, glow, DOM labels
    ui/               2D overlays (top bar, floor panel, elevator UI, detail panel, search, directory)
```

Some key decisions:

- **The world is 3D and the information is 2D.** All readable text, and Korean text especially, is DOM: overlays, drei `Html` labels and the CSS3D wall directory. Nothing readable is baked into textures. The only exception is the English brand sign.
- **There is one elevator cab.** It sits outside the floor scenes, so the floor behind the closed doors is swapped without anyone seeing it. The destination scene's code is preloaded as soon as a button is pressed.
- **Floor scenes are lazy-loaded** per template family (lobby / hall / garden), and only the current floor is mounted.
- **Diorama walls.** The front walls and ceilings are single-sided planes facing inward. They disappear when the camera is outside and show up when it is inside.
- **Shared materials and unit geometries** are reused across every prop. Textures are generated procedurally, so no image assets are shipped.

## Accessibility

- Every 3D object can also be reached from DOM lists (zone panel, search, 2D directory) with the keyboard.
- Keyboard shortcuts: `/` or `Ctrl+K` opens search, and `Esc` closes the top-most layer or steps back one level.
- `prefers-reduced-motion` shortens camera moves and elevator travel and stops decorative motion.
- Browsers without WebGL get the full 2D directory.
