# Lifesaver — status

Last updated: 2026-11-16, after the second round of owner feedback on the level rounds (clues, choosing, clocks, drag and drop, item pictures).

## Where things stand

Milestones M0 to M5 are built: all twelve MVP levels are playable from start to finish with illustrated scenes, sound and saved progress, and a demo build is published. What remains before a release to real players is M6, which needs people: a qualified reviewer for the first-aid content, and playtesters. All first-aid content is still unreviewed draft. Milestones are defined in [plan.md](plan.md).

- Code: https://github.com/haunc08/lifesaver (public since 2026-11-16, because GitHub Pages on a free plan requires it).
- Demo: https://haunc08.github.io/lifesaver/ — published by running `pnpm deploy:pages`. It does not update by itself: GitHub refused to run a deploy Action with the message "your account is locked due to a billing issue", so publishing is a manual command.

### Working now

- First launch: loading screen, three-slide town intro, character creation (name only), home.
- Home is the town map: one marker per area, the player's name, level and XP bar above, the library and "play the next level" below. There is no separate map screen.
- Locked areas and levels: tapping one explains how it opens and offers to open it at once. The choice is saved.
- Twelve levels across five areas, each with all six phases, a progress bar, and hint and pause in every phase. The clock is shown only in the phases where it runs, and every round (assess, choose, each mini-game) has its own clock that starts afresh.
- Observing: the player can move on once every clue marked essential in the data has been opened. There is no zoom.
- Choosing: picks are final, and the round ends by itself when every right step is picked. No undo, no confirm button, no message about the order, no near-duplicate answers.
- Nothing can be skipped: the town intro and each level's story are read line by line.
- Five mini-game mechanics: tap the targets (with things that must not be done mixed in), scan for hazards, hold (the held thing is pictured on the scene), drag and place (the item's picture follows the finger and lands in the nearest slot; tapping an item, then a slot, also works), quick decision. Four levels chain two mechanics.
- Result screen: the score counts up, stars land one by one, then score by component, XP reward, what was right and wrong with reasons, when to call for help, links to the lesson, replay and next level.
- Knowledge library: one core lesson open from the start and one lesson per level played; all are labelled as unreviewed drafts.
- Sound: ten effects and two music tracks (town, level), all CC0. The two switches in Settings control them.
- Settings: music and sound-effect switches, and a reset of saved data.
- Art: twelve level scenes, the town, five area pictures, 19 item pictures, the player and the guide with six expressions, all generated with Seedream 5.5 through Kie. Icons are line drawings in code, and every main button carries one.

### Checked

- 115 unit tests pass: scoring, the level state machine (essential clues, final picks, a clock per round), progression (including opening by hand), and the content rules applied to every level (at least two essential clues, no near-duplicate answers, a decoy in every tap-the-targets game, a picture for every dragged or held thing).
- 23 end-to-end tests pass in Chrome and in WebKit (the engine behind Safari), at a 390 × 844 phone viewport unless stated:
  - the first-launch playthrough with reload, and the guard that blocks levels without a character;
  - opening a locked area and a locked level by hand;
  - a correct playthrough of each of the twelve levels;
  - dragging: the picture travels with the pointer, an item let go a little off-centre lands in the nearest slot, one let go far from every slot goes back, and a decoy is refused;
  - the first level checks that an optional clue does not unlock the next phase, that each round's clock starts afresh (1:00, 2:00, 1:30), that there is no undo or confirm button, and that a decoy is refused with its reason;
  - mistake paths: a failed quick-decision run, a card that runs out of time, an early release of a hold, a harmless spot in a scan;
  - the home screen and a whole level at 320 × 568 and 360 × 640, with no sideways scrolling and the main buttons on screen;
  - the sound engine: silent before the first tap, effects loaded and music playing after it, music switch obeyed, calmer track inside a level.
- Typecheck, lint and production build pass, and the build served from a sub-folder (as on GitHub Pages) loads, saves and survives a reload.
- I looked at screenshots of the home screen (four sizes), pause and unlock dialogs, the level phases, the result and the mistake paths.

### Not done or not checked

- **Nobody has listened to the sound.** I cannot hear audio; files were chosen by name, description and measurement. The owner should listen once and name any sound to swap.
- Not tried on a real phone. WebKit on a computer is close to Safari on iOS but not the same. Dragging is tested with a simulated mouse only: the finger case (the picture rides 48 px above the touch point, and the drop is judged at the picture) has no automated test.
- The level-timeout path (letting the whole clock run out) has unit tests but no end-to-end test.
- Music restarts with a short fade at the loop point; it is not seamless.
- Side characters have no portraits; they appear only inside their scene.
- The logo is still type set in code, not artwork. The loading screen has no helicopter or running character (requirements section 9).
- Kie's and the model's terms on ownership and commercial use of the generated pictures have not been read.

## Things a reviewer should look at first

- **Choking (food-district-01)** carries the most risk of teaching something wrong.
- **Gas leak (dormitory-02)**: the level's order is no sparks, close the valve, open doors and windows, get out and call 114. I did not check this order against a Vietnamese fire-service source.
- **Hold mini-games** last 3–8 seconds of game time and state the real duration in text (for example about 10 minutes of pressure, about 20 minutes of cooling). Check each stated duration.
- Every generated picture, for anything that contradicts its lesson.

## Waiting on the owner

0. Optional: GitHub reports a billing lock on the account, which stops GitHub Actions. Automatic deploys on push are only possible once that is cleared in GitHub's billing settings.
1. Listen to the sound effects and both music tracks; say which to swap.
2. Verdict on the generated art and the pastel palette.
3. Who reviews the medical content, and which reference lessons should cite.
4. Original logo and loading screen files, if they exist.
5. Guide character's name and look (placeholder: "Bông", a cotton ball with a first-aid satchel).
6. Whether saving on one device only is acceptable for the MVP.

## Next steps, in order

1. Act on the owner's feedback on sound and art.
2. Try the demo on a real iPhone and a real Android phone; fix what shows up.
3. **M6 review and playtest:** fill in source, reviewer and date for each lesson once a reviewer has signed off; fix what playtesters trip over.
4. Then announce the release (M7); the hosting is already in place.

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
| 2026-11-16 | Mini-games mark places with small numbered pins plus a list under the scene, not label chips on the picture | Mine: chips hid the artwork on a phone screen |
| 2026-11-16 | Only the guide and the player have separate character art; other characters live in their scene | Mine, to limit cost and style drift; open to change |
| 2026-11-16 | The home screen is the map; no separate map screen | Owner |
| 2026-11-16 | Buttons must be easy to tell apart when stacked, and carry an icon | Owner. Plain buttons got an outline; dialogs space their buttons further apart |
| 2026-11-16 | The clock is hidden whenever it is not running | Owner |
| 2026-11-16 | Locked areas and levels can be opened by hand, one at a time, for demos. No "unlock everything" in Settings | Owner |
| 2026-11-16 | Nothing can be skipped (town intro, level story) | Owner |
| 2026-11-16 | No looping or wiggling animation on the map's markers | Owner |
| 2026-11-16 | No zoom when a clue is opened | Owner, after the zoom-out looked choppy |
| 2026-11-16 | Clues are marked essential or not; the observe phase ends on the essential ones, not on a count | Owner |
| 2026-11-16 | No undo and no confirm button when choosing; the round ends by itself | Owner |
| 2026-11-16 | Wrong answers must be in the lesson's "do not" list; no duplicate or near-duplicate answers | Owner. I removed the "partial" kind of option, which was the source of the near-duplicates, and added "do not" lines for the irrelevant options |
| 2026-11-16 | Tap-the-targets needs at least one decoy | Owner |
| 2026-11-16 | A clock per round, set generously | Owner. I chose 60 s to assess, 120 s to choose, 90 s per mini-game, 12 s per quick-decision card |
| 2026-11-16 | Dragged and held things have pictures; the dragged item follows the finger | Owner |
| 2026-11-16 | No message when the chosen order is wrong (or right): the action starts at once | Owner |
| 2026-11-16 | After an area's last level, "next" goes to the new area, not into its first level | Owner |
| 2026-11-16 | Level screens keep clear space under the last control | Owner |
| 2026-11-16 | In drag and place, a refused decoy disappears instead of being struck through | Owner |
| 2026-11-16 | At the end of every round of changes: commit, push and publish to the demo once the checks pass, without asking | Owner |
| 2026-11-16 | Four CC0 sound downloads approved (two Kenney packs, two music tracks) | Owner |
| 2026-11-16 | Hosting on GitHub Pages; the repository became public for it | Owner |
