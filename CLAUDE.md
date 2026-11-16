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
pnpm test:e2e     # one full playthrough in installed Chrome (Playwright); starts the dev server on 5183
pnpm typecheck    # tsc
pnpm lint         # oxlint
pnpm format       # prettier on src and e2e
pnpm build        # typecheck + production build
```

`SHOTS=1 pnpm test:e2e` saves a screenshot of every screen to `e2e/.results/shots/`; use it to check visual changes. Run unit tests, typecheck, lint and the e2e test before calling a change done.

## Layout

```
src/
  game/        Pure rules, no React: types.ts (content schema), levelMachine.ts
               (six-phase reducer), scoring.ts, progression.ts (rewards, unlocks)
  content/     Data only: areas.ts, levels/ (one file per level + index.ts), lessons.ts
  state/       save.ts: the persisted save (zustand + localStorage)
  minigames/   One component per mechanic; index.tsx picks by config.type
  screens/     One file per screen; level/ holds the in-level screen, HUD, phases, result
  ui/          Shared pieces: Button, Card, Screen, Sticker, Stars, Logo
  app/         Router and the phone-sized shell
e2e/           Playwright tests
```

The level flow: `LevelScreen` runs `step(level, state, event)` from `levelMachine.ts` in a reducer; phase components dispatch events; at the end `summarize` then `score` produce the result, and `save.recordResult` stores it.

## Rules that are easy to break

- **Game rules live in `src/game/` and are tested.** Change a rule there with its test, and update the rules table in `docs/plan.md`.
- **Unsafe options never pass.** An unsafe choice is blocked and can never lead to a pass; a high score cannot make up for a safety mistake. Do not weaken this.
- **Medical content is draft until reviewed.** You may write level and lesson text, but leave `source`, `reviewer` and `reviewedOn` as `null`; the game then labels the lesson as a draft. Never fill these in yourself.
- **Scene safety and calling for help are mandatory steps** in every level's `choose` phase.
- **Every phase needs a hint.** `LevelDef.hints` is typed to require all six.
- **All player-facing text is Vietnamese.** Code, comments and docs are English.
- **Visual style is muted pastel.** Soft pastel colours, simple shapes, no gradients, no saturated colours; blur is allowed. Colours come only from the tokens in `src/index.css` (palette table in `docs/art-and-audio.md`). Text on a pastel fill is `text-ink`, never white; coloured text on a light surface uses the `-ink` shade. Do not copy the characters or artwork of any existing game.
- **No gore**, and victims are never mocked, including on failure.
- **Outside assets** need a CC0 or similarly permissive licence and a row in `docs/credits.md`.
- **Money:** the budget for outside costs is about 10 USD in total. Ask the owner before any spend.
- **MVP scope:** one fixed player character (name only). Shop, coins, leaderboard, quizzes and the like are Phase 2; do not build them.

## Design skills

Two agent skills are installed in `.claude/skills/` (tracked by `skills-lock.json`). Use them for any visual work:

- `frontend-design` (Anthropic): plan a small token system first, check it against the brief, build, then critique your own screenshots. Run `SHOTS=1 pnpm test:e2e` and look at the images before calling visual work done.
- `game-ui-ux`: safe areas, contrast, never colour as the only signal. Its engine-specific parts (Godot, Unity) do not apply here.

`leonxlnx/taste-skill@design-taste-frontend` was installed and removed: it builds company landing pages, and it registers a hook that runs a large third-party script at the end of every turn. Do not reinstall it without the owner's say. Find more skills with `npx skills find <query>`; read a skill's files before using it.

## Adding a level

1. Copy `src/content/levels/school-01-fainting.ts`, keep the `id` from `LEVEL_OUTLINE` in `levels/index.ts`, and register it in `LEVELS`.
2. Fill every field of `LevelDef`: at least as many clues as `observe.required`, 3–4 assessment options with exactly one correct, solution options of all four kinds, `choose.order` listing the correct steps in order, outcome text for all five end states.
3. If the level needs a new mechanic, add its config to `MinigameConfig` in `game/types.ts`, a component in `minigames/`, and a case in `minigames/index.tsx`. A mini-game calls `onDone` once with `{ completed, accuracy }`.
4. Add the level to the e2e test or write a machine test for its tricky branches.

## Changing the save format

Bump `SAVE_VERSION` in `src/state/save.ts` and add a `migrate` function to the persist options; players' progress lives only in their browser.

## Tooling notes

- TypeScript has `erasableSyntaxOnly` on: no enums, no constructor parameter properties. Use `import type` for types.
- Import from `src` with the `@/` alias.
- The Chrome browser extension was not connected in the setup session; Playwright with `channel: 'chrome'` is the way to look at the app.
