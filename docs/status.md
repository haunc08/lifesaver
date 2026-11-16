# Lifesaver — status

Last updated: 2026-11-16, after the pastel restyle.

## Where things stand

Milestone M0 (setup and walking skeleton) is done. The app runs, one level is playable from start to finish, and progress is saved. All art is placeholder and there is no sound. Milestones are defined in [plan.md](plan.md).

### Working now

- First launch: loading screen, three-slide town intro (skippable), character creation (name only), lobby.
- Lobby with player name, level, XP bar, play button pointing at the next level, links to map, library and settings.
- World map of the five MVP areas and a level list per area, with locked and "coming soon" states.
- Level 1, "Tiết bốn oi ả" (fainting, School): all six phases, clock, progress bar, hint and pause in every phase, one mini-game (tap the targets).
- Result screen: outcome, stars, score by component, XP reward, what was right and wrong with reasons, when to call for help, links to the lesson, replay and next level.
- Knowledge library with one core lesson open from the start and one lesson per level played; lessons are labelled as unreviewed drafts.
- Settings: music and sound-effect switches (saved, but nothing plays yet) and a reset of saved data.
- Progress, XP and lessons persist across reloads.

### Checked

- 28 unit tests for scoring, the level state machine and progression pass.
- 2 end-to-end tests pass in Chrome at a 390 × 844 phone viewport: a full first-launch playthrough including reload, and the guard that blocks levels without a character.
- Typecheck, lint and production build pass.

### Not done or not checked

- Not tried on a real phone, on Safari or on iOS.
- Levels 2–12 are listed but not built.
- Four of the five planned mini-game mechanics are not built.
- No clue zoom or other motion yet; the Motion library is installed but unused.
- No art, no sound.
- Not deployed, and nothing is committed to git (the repository is initialised with no commits).

## Waiting on the owner

These are listed with detail in [plan.md](plan.md) section 5 and [art-and-audio.md](art-and-audio.md).

1. Verdict on the pastel palette, and confirm how it is read against section 9 of the requirements.
2. Original logo and loading screen files, if they exist.
3. Who reviews the medical content, and which reference lessons should cite.
4. Guide character's name and look (placeholder: "Bông").
5. Whether saving on one device only is acceptable for the MVP.
6. Hosting preference.

## Next steps, in order

1. **Art sample (start of M3):** draw the player character, the guide with six expressions and the level 1 classroom scene as flat SVG, and show them for a verdict.
2. **M1:** build the scan-the-scene, hold, drag-and-place and quick-decision mini-games; add the clue zoom and feedback motion.
3. **M2:** write levels 2–12 as drafts, plus an automated check of the content rules.
4. Then sound (M4), polish (M5), review and playtest (M6), release (M7).

## Decisions log

| Date | Decision | Source |
| --- | --- | --- |
| 2026-11-16 | Stack: React, TypeScript, Vite, Tailwind, zustand, no backend | Proposed in plan.md, awaiting review |
| 2026-11-16 | MVP has one fixed player character; creation asks for a name only | Owner |
| 2026-11-16 | Outside costs capped at about 10 USD; tools and services may be installed as needed | Owner |
| 2026-11-16 | Sound and music come from public sources, not made from scratch | Owner |
| 2026-11-16 | Visual style: muted pastel colours, simple shapes, no gradients; blur is allowed | Owner |
| 2026-11-16 | Agent skills installed in the project: `frontend-design` (Anthropic) and `game-ui-ux`. `design-taste-frontend` was tried and removed | Owner asked for design skills |
| 2026-11-16 | Art is drawn as SVG in code, sample first; AI generation is the fallback | Proposed in art-and-audio.md, awaiting review |
