# Lifesaver — status

Last updated: 2026-11-16, after building the mini-games, all twelve levels and the generated art.

## Where things stand

Milestones M0 to M3 are built: the app runs, all twelve MVP levels are playable from start to finish with illustrated scenes, and progress is saved. There is no sound yet. All first-aid content is unreviewed draft. Milestones are defined in [plan.md](plan.md).

The code is on GitHub at https://github.com/haunc08/lifesaver (private).

### Working now

- First launch: loading screen (preloads fonts and character art), three-slide town intro (skippable), character creation (name only), lobby.
- Lobby with player name, level, XP bar, play button pointing at the next level, links to map, library and settings.
- World map: the town picture with one pin per area, locked until the area before it is cleared. Each area has a level list.
- Twelve levels across five areas, each with all six phases, a clock, a progress bar, and hint and pause in every phase.
- Five mini-game mechanics: tap the targets, scan for hazards, hold, drag and place (also works by tapping an item, then a place), quick decision. Four levels chain two mechanics.
- Tapping a clue zooms the scene in on it.
- Result screen: outcome, stars, score by component, XP reward, what was right and wrong with reasons, when to call for help, links to the lesson, replay and next level.
- Knowledge library: one core lesson open from the start and one lesson per level played; all are labelled as unreviewed drafts.
- Settings: music and sound-effect switches (saved, but nothing plays yet) and a reset of saved data.
- Art: twelve level scenes, the town, five area pictures, the player and the guide with six expressions, all generated with Seedream 5.5 through Kie. Icons are line drawings in code; no emoji remain.

### Checked

- 113 unit tests pass: scoring, the level state machine, progression, and the content rules applied to every level (one right assessment, mandatory safety and call-for-help steps, all four option kinds, valid mini-game, a flawless run earns three stars, lessons left unreviewed).
- 15 end-to-end tests pass in Chrome at a 390 × 844 phone viewport: the first-launch playthrough with reload, the guard that blocks levels without a character, a correct playthrough of each of the twelve levels, and dragging plus refusing a decoy item.
- Typecheck, lint and production build pass.
- I looked at screenshots of the loading screen, intro, lobby, map, level phases, result and each mini-game type, and at every generated picture with its markers.

### Not done or not checked

- Not tried on a real phone, on Safari or on iOS. Touch dragging and press-and-hold are only tested with a simulated mouse in Chrome.
- Wrong-answer paths inside the new mini-games (failing a quick-decision run, repeated early release of a hold) are not covered by end-to-end tests.
- No sound.
- No screen transitions or result animation; the only motion is the clue zoom and the loading bar.
- Side characters have no portraits; they appear only inside their scene.
- The logo is still type set in code, not artwork.
- Not deployed.

## Things a reviewer should look at first

- **Choking (food-district-01)** carries the most risk of teaching something wrong.
- **Gas leak (dormitory-02)**: the level's order is no sparks, close the valve, open doors and windows, get out and call 114. I did not check this order against a Vietnamese fire-service source.
- **Hold mini-games** last 3–8 seconds of game time and state the real duration in text (for example about 10 minutes of pressure, about 20 minutes of cooling). Check each stated duration.
- Every generated picture, for anything that contradicts its lesson.

## Waiting on the owner

These are listed with detail in [plan.md](plan.md) section 5 and [art-and-audio.md](art-and-audio.md).

1. Verdict on the generated art and the pastel palette.
2. Permission to download sound files (see next steps), since sound is the next milestone.
3. Who reviews the medical content, and which reference lessons should cite.
4. Original logo and loading screen files, if they exist.
5. Guide character's name and look (placeholder: "Bông", a cotton ball with a first-aid satchel).
6. Whether saving on one device only is acceptable for the MVP.
7. Hosting preference.

## Next steps, in order

1. **M4 sound:** pick effects from the Kenney CC0 packs and one or two CC0 music loops, list file names, sources and sizes for the owner's approval, then wire them to the two settings switches.
2. **M5 polish:** screen transitions, result animation, feedback motion, a check on small phones and on a real device, load size.
3. **M6 review and playtest**, then **M7 release**.

## Decisions log

| Date | Decision | Source |
| --- | --- | --- |
| 2026-11-16 | Stack: React, TypeScript, Vite, Tailwind, zustand, no backend | Proposed in plan.md, awaiting review |
| 2026-11-16 | MVP has one fixed player character; creation asks for a name only | Owner |
| 2026-11-16 | Outside costs capped at about 10 USD; tools and services may be installed as needed | Owner |
| 2026-11-16 | Sound and music come from public sources, not made from scratch | Owner |
| 2026-11-16 | Visual style: muted pastel colours, simple shapes, no gradients; blur is allowed | Owner |
| 2026-11-16 | Agent skills installed in the project: `frontend-design` (Anthropic), `game-ui-ux` and `kie-models`. `design-taste-frontend` was tried and removed | Owner asked for design skills and named the Kie skill |
| 2026-11-16 | Art is generated with `seedream/5-5-text-to-image` through Kie; the key is in `.env` | Owner |
| 2026-11-16 | Code is pushed to the private GitHub repository `haunc08/lifesaver` | Owner |
| 2026-11-16 | Mini-games mark places with small numbered pins plus a list under the scene, not label chips on the picture | Mine: chips hid the artwork on a phone screen |
| 2026-11-16 | Only the guide and the player have separate character art; other characters live in their scene | Mine, to limit cost and style drift; open to change |
