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

Keep these current as you work, in the same change as the work: the owner reviews plans in the docs, and the next session depends on `docs/status.md`. Record new decisions in `docs/plan.md`, not only in chat.

## Commands

```sh
pnpm dev          # dev server
pnpm test         # unit tests (Vitest), game rules
pnpm test:e2e     # plays every level in installed Chrome (Playwright); starts the dev server on 5183
pnpm typecheck    # tsc
pnpm lint         # oxlint
pnpm format       # prettier on src and e2e
pnpm build        # typecheck + production build
```

`SHOTS=1 pnpm test:e2e` saves screenshots to `e2e/.results/shots/`; `node scripts/contact-sheet.mjs <out.jpg> <image>…` tiles several into one image for review. Use them to check visual changes. Run unit tests, typecheck, lint and the e2e test before calling a change done.

## Layout

```
src/
  game/        Pure rules, no React: types.ts (content schema), levelMachine.ts
               (six-phase reducer), scoring.ts, progression.ts (rewards, unlocks)
  content/     Data only: areas.ts, levels/ (one file per level + index.ts), lessons.ts
  state/       save.ts: the persisted save (zustand + localStorage)
  minigames/   One component per mechanic; index.tsx picks by config.type and
               runs `sequence` configs step by step
  screens/     One file per screen; level/ holds the in-level screen, HUD, phases, result
  ui/          Shared pieces: Button, Card, Screen, Sticker, Stars, Logo, Icon, Pin,
               Guide, Player
  assets/art/  Generated pictures (WebP), loaded by id through src/art.ts
  app/         Router and the phone-sized shell
art/           manifest.json (every picture's prompt), spend.json; raw/ is not in git
scripts/       gen-art.mjs (Kie image generation), scene-grid.mjs, contact-sheet.mjs
e2e/           Playwright tests
```

The level flow: `LevelScreen` runs `step(level, state, event)` from `levelMachine.ts` in a reducer; phase components dispatch events; at the end `summarize` then `score` produce the result, and `save.recordResult` stores it.

## Rules that are easy to break

- **Game rules live in `src/game/` and are tested.** Change a rule there with its test, and update the rules table in `docs/plan.md`. Mini-game scoring constants live beside each mechanic in `src/minigames/`.
- **Content rules are tested.** `src/content/levels.test.ts` runs over every level file; keep it passing rather than loosening it.
- **Unsafe options never pass.** An unsafe choice is blocked and can never lead to a pass; a high score cannot make up for a safety mistake. Do not weaken this.
- **Medical content is draft until reviewed.** You may write level and lesson text, but leave `source`, `reviewer` and `reviewedOn` as `null`; the game then labels the lesson as a draft. Never fill these in yourself.
- **Scene safety and calling for help are mandatory steps** in every level's `choose` phase.
- **Every phase needs a hint.** `LevelDef.hints` is typed to require all six.
- **All player-facing text is Vietnamese.** Code, comments and docs are English.
- **Visual style is muted pastel.** Soft pastel colours, simple shapes, no gradients, no saturated colours; blur is allowed. Colours come only from the tokens in `src/index.css` (palette table in `docs/art-and-audio.md`). Text on a pastel fill is `text-ink`, never white; coloured text on a light surface uses the `-ink` shade. Do not copy the characters or artwork of any existing game.
- **No gore**, and victims are never mocked, including on failure.
- **Outside assets** need a CC0 or similarly permissive licence and a row in `docs/credits.md`.
- **Money:** the budget for outside costs is about 10 USD in total. Ask the owner before any spend.
- **No emoji in the interface.** Use `Icon` (line icons) or generated art.
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
2. Fill every field of `LevelDef`: at least as many clues as `observe.required`, 3–4 assessment options with exactly one correct, solution options of all four kinds, `choose.order` listing the correct steps in order, outcome text for all five end states.
3. If the level needs a new mechanic, add its config to `SingleMinigameConfig` in `game/types.ts`, a component in `minigames/`, a case in `minigames/index.tsx`, a check in `levels.test.ts` and a case in `e2e/all-levels.spec.ts`. A mini-game calls `onDone` once with `{ completed, accuracy }` and must stop its timers while `paused`.
4. Add the scene to `art/manifest.json` with the level id as its `id`, generate it (below), and place the clue and mini-game coordinates from the grid picture.
5. Add the level id to `LEVEL_IDS` in `e2e/all-levels.spec.ts`.

## Generating art

Pictures come from the Kie API with the `seedream/5-5-text-to-image` model (the owner's choice). The key is `KIE_API_KEY` in `.env`, which is not in git; never print or commit it. Each picture costs 3.6 credits (about 0.018 USD) and counts against the 10 USD budget, so generate only what is needed and record totals in `docs/art-and-audio.md`.

```sh
node --env-file=.env scripts/gen-art.mjs <id>…     # generate the named pictures
node --env-file=.env scripts/gen-art.mjs --missing  # generate every picture with no output yet
node scripts/gen-art.mjs --process <id>…            # redo only the resize and slicing
node scripts/scene-grid.mjs <level-id>…             # art/raw/_grid-<id>.jpg with a 10% grid
```

Prompts describe only the subject; the shared style text in `manifest.styles` is appended. Keep writing out of pictures, show injuries without blood or gore, and use a white cross on mint green for first-aid items, not a red cross. Look at every generated picture before using it. `art(id)` in `src/art.ts` returns the picture's URL, or undefined if it does not exist.

## Changing the save format

Bump `SAVE_VERSION` in `src/state/save.ts` and add a `migrate` function to the persist options; players' progress lives only in their browser.

## Tooling notes

- TypeScript has `erasableSyntaxOnly` on: no enums, no constructor parameter properties. Use `import type` for types.
- Import from `src` with the `@/` alias.
- The Chrome browser extension was not connected in the setup session; Playwright with `channel: 'chrome'` is the way to look at the app.
