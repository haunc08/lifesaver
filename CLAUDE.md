# Lifesaver — agent guide

Lifesaver is a Vietnamese-language web game for phone screens that teaches first aid through short levels. Static single-page app, no backend. Start every session by reading `docs/status.md` (what is done, what is next), then the doc for the area you are touching.

## Docs

| File | Holds |
| --- | --- |
| `high-level-req.md` | The owner's requirements. Do not edit unless asked |
| `docs/plan.md` | MVP plan: decisions, game rules, level list, milestones, open questions |
| `docs/art-and-audio.md` | Art direction, how art and sound are produced, budget |
| `docs/status.md` | Handoff: current state, next steps, what is waiting on the owner |
| `docs/credits.md` | Source and licence of every outside asset |
| `docs/demo/lifesaver-screens.jpg` | One picture of the main screens with captions, for product documents. Made by `pnpm demo:sheet`; rebuild it when a screen it shows changes |

Keep these current as you work, in the same change as the work: the owner reviews plans in the docs, and the next session depends on `docs/status.md`. Record new decisions in `docs/plan.md`, not only in chat.

## Commands

```sh
pnpm dev          # dev server
pnpm test         # unit tests (Vitest), game rules
pnpm test:e2e     # plays every level in installed Chrome (Playwright); starts the dev server on 5183
pnpm test:e2e:safari  # the same tests in WebKit; needs `pnpm exec playwright install webkit` once
pnpm typecheck    # tsc
pnpm lint         # oxlint
pnpm format       # prettier on src and e2e
pnpm build        # typecheck + production build
pnpm deploy:pages # build and publish to GitHub Pages (at the end of each round, after the checks pass)
pnpm demo:sheet   # retake the demo screenshots and rebuild docs/demo/lifesaver-screens.jpg
```

`SHOTS=1 pnpm test:e2e` saves screenshots to `e2e/.results/shots/`; `node scripts/contact-sheet.mjs <out.jpg> <image>…` tiles several into one image for review. Use them to check visual changes. Run unit tests, typecheck, lint and the e2e test before calling a change done.

## Layout

```
src/
  game/        Pure rules, no React: types.ts (content schema), levelMachine.ts
               (six-phase reducer), scoring.ts, progression.ts (rewards, unlocks)
  content/     Data only: areas.ts, levels/ (one file per level + index.ts), lessons.ts,
               emergency.ts (the three emergency numbers)
  state/       save.ts: the persisted save (zustand + localStorage);
               unlocks.ts: the unlock rules applied to the save
  audio/       Sound effects and background sound; a sound with no file is skipped
  minigames/   One component per mechanic; index.tsx picks by config.type and
               runs `sequence` configs step by step. geometry.ts holds the tested
               maths for the gesture games; art.ts lists a config's pictures
  screens/     One file per screen; level/ holds the in-level screen, HUD, phases, result
  ui/          Shared pieces: Button, Card, Dialog, UnlockDialog, Screen, Sticker, Stars,
               Logo, Icon, Pin, Guide, Player (and PlayerAvatar)
  assets/art/  Generated pictures (WebP), loaded by id through src/art.ts
  assets/audio/  sfx-<name>.mp3, music-<name>.mp3 and ambience-<area or level id>.mp3, made by
               scripts/import-audio.mjs
  app/         Router and the phone-sized shell
art/           manifest.json (every picture's prompt), spend.json; raw/ is not in git
scripts/       gen-art.mjs (Kie image generation), scene-grid.mjs, contact-sheet.mjs,
               import-audio.mjs (downloads -> MP3), deploy-pages.mjs (publish to GitHub Pages),
               demo-sheet.mjs (tiles the demo screenshots into one captioned picture)
e2e/           Playwright tests; helpers.ts holds the shared steps. demo-shots.spec.ts takes the
               demo sheet's screenshots and runs only with DEMO=1 (`pnpm demo:sheet`)
```

The level flow: `LevelScreen` runs `step(level, state, event)` from `levelMachine.ts` in a reducer; phase components dispatch events; at the end `summarize` then `score` produce the result, and `save.recordResult` stores it.

## Rules that are easy to break

- **Game rules live in `src/game/` and are tested.** Change a rule there with its test, and update the rules table in `docs/plan.md`. Mini-game scoring constants live beside each mechanic in `src/minigames/`.
- **Content rules are tested.** `src/content/levels.test.ts` runs over every level file; keep it passing rather than loosening it.
- **Unsafe options never pass.** An unsafe choice is blocked and can never lead to a pass; a high score cannot make up for a safety mistake. Do not weaken this.
- **Medical content is draft until reviewed.** You may write level and lesson text, but leave `source`, `reviewer` and `reviewedOn` as `null`. Never fill these in yourself. The game no longer shows a "draft, not reviewed" line on such a lesson (the owner had it removed on 2026-11-16); do not add it back unasked. A reviewed lesson shows its source and reviewer.
- **Scene safety and calling for help are mandatory steps** in every level's `choose` phase.
- **Every phase needs a hint.** `LevelDef.hints` is typed to require all six.
- **All player-facing text is Vietnamese.** Code, comments and docs are English.
- **Visual style is muted pastel.** Soft pastel colours, simple shapes, no gradients, no saturated colours; blur is allowed. Colours come only from the tokens in `src/index.css` (palette table in `docs/art-and-audio.md`). Text on a pastel fill is `text-ink`, never white; coloured text on a light surface uses the `-ink` shade. Do not copy the characters or artwork of any existing game.
- **No gore**, and victims are never mocked, including on failure.
- **Outside assets** need a CC0 or similarly permissive licence and a row in `docs/credits.md`.
- **Money:** the budget for outside costs is about 10 USD in total. Ask the owner before any spend.
- **No emoji in the interface.** Use `Icon` (line icons) or generated art.
- **Buttons carry an icon and must be easy to tell apart.** Pass `icon` to `Button`. The `plain` variant is outlined so it shows on a card of its own colour; stack buttons inside `Dialog`, which spaces them.
- **Home is the map.** There is no separate map screen; `/lobby` shows the town with one marker per area.
- **Nothing can be skipped.** No skip button on the town intro or a level's story, also on a replay.
- **The clock is hidden when it is not running** (intro, observe, outcome).
- **Nothing moves on its own.** Motion answers an action (a screen opening, feedback, the result); no looping or wiggling decorations, such as bobbing map markers.
- **Locked things can be opened by hand, one at a time** (`UnlockDialog`), for demos. Do not add an "unlock everything" control.
- **Wrong answers come from the lesson.** Every unsafe or irrelevant option, mini-game decoy and "should not" card must match a line in that level's `lesson.donts`; add the line if it is missing. Never add an option that is a weaker or reworded twin of a right one (the content test rejects answers that share more than half their words).
- **Clues are essential or not** (`Clue.essential`). The observe phase ends when all essential clues are opened; never go back to counting clues. All pins look the same.
- **Choosing is two steps** (`screens/level/ChoosePhase.tsx`, stages from `chooseStage` in the machine). Pick: every right step, in any order; a pick is final, with no undo and no confirm, and the step ends by itself. Order: the picked steps are dragged into order and confirmed with "Thực hiện"; the review then shows the right order, marks the steps the player had elsewhere, and waits for "Tiếp tục". A wrong order costs points but never blocks the action. Do not show the two steps as tabs or chips, and keep the message for a right order to "Đúng thứ tự rồi!" (owner, 2026-11-16). The list takes the pointer, not the row, because a row that changes place in the page loses the pointer.
- **Leave room at the bottom.** Level phases use `min-h-full`, not `h-full`, so the page's bottom padding comes after the last control; bottom padding adds the phone's safe area on top (`calc(… + env(safe-area-inset-bottom))`).
- **After an area's last level, "next" opens the new area**, not its first level.
- **Keep labels short.** A locked level says only "Đang khoá", and the home screen's play button names the level without its area (owner, 2026-11-16).
- **Every round has its own clock** (constants at the top of `game/levelMachine.ts`): assess, picking, ordering, each mini-game. Keep them generous.
- **Speech boxes grow on tall screens.** The story, clue and outcome boxes use the `tall:` variant (`src/index.css`, screens at least 700 px high) for larger type and padding; on short screens the larger type pushed the main button off the screen.
- **No zoom on scenes.** It was tried on the clue view and removed at the owner's request.
- **Things the player drags, holds, rubs with or turns have a picture** (`art` on drag items, `tool` on a hold, trace or rub, `dial` on a rotate), and `tap-targets` needs at least one decoy.
- **A right answer is never red.** In the hazard scan a found hazard is mint with a tick; coral is for mistakes and refusals only.
- **Gesture mini-games play on a close-up** (`art: 'closeup-<level id>'` on a trace or rub), because people in a scene are too small to work on. Draw what changes in code on top of it; do not zoom the scene.
- **Gestures follow the finger but not across the path.** `followPath` in `minigames/geometry.ts` walks the tool forward along the path; do not replace it with "nearest point", which lets a straight swipe finish a zigzag. Distances there are in units (percent of the picture's width), not pixels.
- **A gesture stands for something simple.** Do not turn a complex technique (back blows, chest compressions, the recovery position) into one gesture; state the real-life version in `realityNote`.
- **The phone call does not give the number.** Its instruction names the service; the content test rejects an instruction that contains the number. A wrong reply is explained and never ends the call.
- **Background sound belongs to the place.** Each area's recording (`ambience-<area>.mp3`) plays only inside that area's levels; every menu, including an area's level list, keeps the town tune (owner, 2026-11-16). A level set somewhere unlike the rest of its area has its own recording, `ambience-<level id>.mp3`, which replaces the area's in that level (the school library and football pitch, the park at midday); give a level one only when its place really sounds different. Do not add music inside levels.
- **Sound** comes only from CC0 or public-domain files, mapped in `scripts/import-audio.mjs`. Play effects with `sfx(name)` from `@/audio`. Buttons get the tap sound automatically; wrap an area in `data-sfx="none"` when its buttons make their own sound.
- **Scenes must stay visible.** Mark places on a scene with `Pin` (small, numbered) and put names in a list under the scene, not label chips on the picture.
- **No rhythm-based first-aid mini-games**, and a `hold` must state the real-life duration in `realityNote`.
- **MVP scope:** one fixed player character (name only). Shop, coins, leaderboard, quizzes and the like are Phase 2; do not build them.

## Design skills

Agent skills are installed in `.claude/skills/` (tracked by `skills-lock.json`). Use the first two for any visual work:

- `frontend-design` (Anthropic): plan a small token system first, check it against the brief, build, then critique your own screenshots. Run `SHOTS=1 pnpm test:e2e` and look at the images before calling visual work done.
- `game-ui-ux`: safe areas, contrast, never colour as the only signal. Its engine-specific parts (Godot, Unity) do not apply here.
- `kie-models`: how to call the Kie API. Read it before changing `scripts/gen-art.mjs` or using another Kie model; fetch a model's schema from the API instead of assuming its fields.

`leonxlnx/taste-skill@design-taste-frontend` was installed and removed: it builds company landing pages, and it registers a hook that runs a large third-party script at the end of every turn. Do not reinstall it without the owner's say. Find more skills with `npx skills find <query>`; read a skill's files before using it.

## Adding a level

1. Copy a level file in `src/content/levels/`, name it `<level-id>-<topic>.ts`, keep the `id` from `LEVEL_OUTLINE` in `levels/index.ts`, and default-export the `LevelDef`. Every file matching `*-*.ts` in that folder is registered automatically.
2. Fill every field of `LevelDef`: clues with at least two marked `essential`, 3–4 assessment options with exactly one correct, solution options of all three kinds (correct, unsafe, irrelevant), `choose.order` listing the correct steps in order, outcome text for all five end states.
3. If the level needs a new mechanic, add its config to `SingleMinigameConfig` in `game/types.ts`, a component in `minigames/`, a case in `minigames/index.tsx`, its pictures in `minigames/art.ts`, its time in `minigameTimeSec` if 90 seconds does not fit, a check in `levels.test.ts` and a case in `playMinigame` in `e2e/helpers.ts`. A mini-game calls `onDone` once with `{ completed, accuracy }` and must stop its timers while `paused`.
4. Add the scene to `art/manifest.json` with the level id as its `id` (and a close-up as `closeup-<level id>` if a gesture needs one), generate it (below), and place the clue and mini-game coordinates from the grid picture.
5. Add the level id to `LEVEL_IDS` in `e2e/helpers.ts`.

## Generating art

Pictures come from the Kie API with the `seedream/5-5-text-to-image` model (the owner's choice). The key is `KIE_API_KEY` in `.env`, which is not in git; never print or commit it. Each picture costs 3.6 credits (about 0.018 USD) and counts against the 10 USD budget, so generate only what is needed and record totals in `docs/art-and-audio.md`.

```sh
node --env-file=.env scripts/gen-art.mjs <id>…     # generate the named pictures
node --env-file=.env scripts/gen-art.mjs --missing  # generate every picture with no output yet
node scripts/gen-art.mjs --process <id>…            # redo only the resize and slicing
node scripts/scene-grid.mjs <id>…                   # art/raw/_grid-<id>.jpg with a 10% grid (scenes and close-ups)
```

Small objects are generated six to a sheet (`items-1` … in the manifest, style `item`) and cut into `item-<name>.webp`; a sheet's `out` field sets that shared prefix. Prompts describe only the subject; the shared style text in `manifest.styles` is appended. Keep writing out of pictures, show injuries without blood or gore, and use a white cross on mint green for first-aid items, not a red cross. Look at every generated picture before using it. `art(id)` in `src/art.ts` returns the picture's URL, or undefined if it does not exist.

## Sound

Files are `src/assets/audio/sfx-<name>.mp3`, `music-<name>.mp3` and `ambience-<area id>.mp3` or `ambience-<level id>.mp3`; names are the `SfxName` and `MusicName` types in `src/audio/index.ts`, the area ids and the level ids. A level plays its own recording if that file exists, otherwise its area's. `setBackground` in `src/audio` chooses what plays behind a screen; `AppShell` calls it from the route. To swap a sound, change its line in the tables at the top of `scripts/import-audio.mjs` and run the script on a folder holding the downloads, naming the group to convert (`sfx`, `music` or `ambience`; layout in the script's header; sources in `docs/credits.md`). Downloading a new file needs the owner's permission first, with its name, source and size. Update `docs/credits.md` and the table in `docs/art-and-audio.md` section 3 in the same change. No agent can hear the result: say so, and ask the owner to listen.

## Deploying

`pnpm deploy:pages` builds with `BASE_PATH=/lifesaver/` and force-pushes the result to the `gh-pages` branch, which GitHub Pages serves at https://haunc08.github.io/lifesaver/ about a minute later. It publishes the working folder as it is, so run the checks and commit first. The owner's standing instruction (2026-11-16): at the end of every round of changes, once unit tests, typecheck, lint and the end-to-end tests pass, commit, push to `main` and run `pnpm deploy:pages`, without asking. There is no automatic deploy: a GitHub Action was tried on 2026-11-16 and GitHub refused to start it ("account is locked due to a billing issue"); do not add one back unless the owner says that is resolved.

The site lives in a sub-folder, so never hard-code a path that starts with `/`: use imports for assets and the router for links. `BASE_PATH=/lifesaver/ pnpm build && BASE_PATH=/lifesaver/ pnpm exec vite preview` serves the same build locally.

## Changing the save format

Bump `SAVE_VERSION` in `src/state/save.ts` and add a `migrate` function to the persist options; players' progress lives only in their browser.

## Tooling notes

- TypeScript has `erasableSyntaxOnly` on: no enums, no constructor parameter properties. Use `import type` for types.
- Import from `src` with the `@/` alias.
- The Chrome browser extension was not connected in the setup session; Playwright with `channel: 'chrome'` is the way to look at the app.
- Entrance animations (`animate-screen-in`, `animate-pop`) fill backwards only. With `both`, a finished animation keeps a transform on the element, which then becomes the anchor of any `position: fixed` child; that broke the dragged item once. Draw such overlays through `createPortal(…, document.body)`.
- Playwright empties `e2e/.results` at the start of every run, so screenshots from an earlier run are gone; run the specs you want pictures of together.
- Screenshots taken by the `shot` helper finish CSS animations first; the result screen's count-up is JavaScript, so wait for it.
- If an end-to-end run takes many minutes and the hold or card tests time out, the machine was throttling timers (it happened once while the computer sat idle). Run it again before looking for a bug.
- Gesture tests move the mouse in small steps on purpose: one big jump is further than a tool can follow in one move.
- In end-to-end tests, `choosePlan` in `e2e/helpers.ts` plays the choose phase (arrow keys to order); `dragPlan` orders with the mouse.
