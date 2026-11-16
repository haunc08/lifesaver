# Lifesaver — status

Last updated: 2026-11-16, after the round that gave the loading screen the new logo.

## Where things stand

Milestones M0 to M5 are built, and the owner called the MVP done on 2026-11-16: all twelve levels are playable from start to finish with illustrated scenes, sound and saved progress, and a demo build is published. M8, richer mini-games, is built too: eight levels now use a gesture or a phone call (plan.md, section 8). What remains before a release to real players is M6, which needs people: a qualified reviewer for the first-aid content, and playtesters. All first-aid content is still unreviewed draft. Milestones are defined in [plan.md](plan.md).

- Code: https://github.com/haunc08/lifesaver (public since 2026-11-16, because GitHub Pages on a free plan requires it).
- Demo: https://haunc08.github.io/lifesaver/ — published by running `pnpm deploy:pages`. It does not update by itself: GitHub refused to run a deploy Action with the message "your account is locked due to a billing issue", so publishing is a manual command.

### Working now

- First launch: loading screen with the logo (shown for at least 2.2 seconds, lengthened from 0.9 at the owner's request on 2026-11-16), three-slide town intro, character creation (name only), home.
- Home is the town map: one marker per area, the player's name, level and XP bar above, the library and "play the next level" below. There is no separate map screen.
- Locked areas and levels: tapping one explains how it opens and offers to open it at once. The choice is saved.
- Twelve levels across five areas, each with all six phases, a progress bar, and hint and pause in every phase. The clock is shown only in the phases where it runs, and every round (assess, choose, each mini-game) has its own clock that starts afresh.
- Observing: the player can move on once every clue marked essential in the data has been opened. There is no zoom.
- Choosing, in two steps. First the player picks every right step, in any order: picks are final, with no undo and nothing to confirm, and the step ends by itself. Then the picked steps are dragged into order (arrow keys also work) and carried out with "Thực hiện". The game says whether the order was right; if not, the steps slide into the right order, and each one the player had elsewhere says where they put it and why it belongs there. "Tiếp tục" starts the action. No near-duplicate answers.
- Nothing can be skipped: the town intro and each level's story are read line by line.
- Nine mini-game mechanics. From the MVP: tap the targets (with things that must not be done mixed in), scan for hazards (a hazard that was found turns mint with a tick, not red), hold (the held thing is pictured on the scene), drag and place (the item's picture follows the finger and lands in the nearest slot; tapping an item, then a slot, also works), quick decision. New: follow a path with a tool on a close-up picture (wrap a bandage, scrape a stinger off, slide a ring off slowly), rub a tool over marked places (wet towel, soap), turn a dial the right way (gas valve), and a phone call (dial 114 or 115 yourself, then answer the dispatcher). Nine levels chain two or three mechanics. The third school level now ends with wrapping the ankle in an elastic bandage, in place of holding the cold pack.
- Result screen: the score counts up, stars land one by one, then score by component, XP reward, what was right and wrong with reasons, when to call for help, links to the lesson, replay and next level.
- Knowledge library: one core lesson open from the start and one lesson per level played; none is reviewed yet. The lesson screen no longer says so: the owner had the "draft, not reviewed by an expert" line removed on 2026-11-16, so nothing in the game now tells a player the content is unreviewed.
- Sound: ten effects, the town tune, and one background recording per area (classroom, quiet room, street, restaurant, garden birds) that plays inside the area's levels; menus, including an area's level list, keep the town tune. Three levels set somewhere unlike the rest of their area have a recording of their own: the school library, the school football pitch, and the park's jogging track at midday (cicadas). The school's classroom recording is new: the first one was mostly a low drone. All CC0 or public domain. The two switches in Settings control them.
- Settings: a switch for music and background sound, a switch for effects, and a reset of saved data.
- Art: twelve level scenes, six close-ups for the gesture mini-games, the town, five area pictures, 26 item pictures, the call operator, the player and the guide with six expressions, all generated with Seedream 5.5 through Kie. Icons are line drawings in code, and every main button carries one.

### Checked

- 129 unit tests pass: scoring, the level state machine (essential clues, final picks, ordering and confirming, a clock per round and per chained step), progression (including opening by hand), the geometry behind the gestures (following a path without cutting across it, turning angles), and the content rules applied to every level (at least two essential clues, no near-duplicate answers, a decoy in every tap-the-targets game, a picture for every tool, paths long enough and inside the picture, one good reply per dispatcher question).
- 29 end-to-end tests pass in Chrome and in WebKit (the engine behind Safari), at a 390 × 844 phone viewport unless stated:
  - the first-launch playthrough with reload, and the guard that blocks levels without a character;
  - opening a locked area and a locked level by hand;
  - a correct playthrough of each of the twelve levels;
  - dragging: the picture travels with the pointer, an item let go a little off-centre lands in the nearest slot, one let go far from every slot goes back, and a decoy is refused;
  - the first level checks that an optional clue does not unlock the next phase, that each round's clock starts afresh (1:00, 2:00, 1:00, 1:30), that picking has no undo or confirm button, that the picked steps can be dragged into order with the mouse and carried out, and that a decoy is refused with its reason;
  - a wrong order: the steps are carried out as listed, the review shows them in the right order with each misplaced one marked, and the level is still passed with the order noted in the result;
  - mistake paths: a failed quick-decision run, a card that runs out of time, an early release of a hold, a harmless spot in a scan;
  - the new mechanics, played with real pointer movement: each path is followed, each place rubbed, the valve turned, each call dialled and answered. Mistakes: a bandage dragged straight across the arm stays behind and can be picked up again; a ring pulled off fast is refused and comes off slowly; the valve turned the wrong way makes no progress; a wrong emergency number and an unhelpful reply are explained;
  - the home screen and a whole level at 320 × 568 and 360 × 640, with no sideways scrolling and the main buttons on screen; and at 320 × 568 the two levels that between them use every new mechanic (gas leak, sting), played to a pass;
  - the sound engine: silent before the first tap, effects loaded and the town tune playing after it, the switch obeyed, the town tune on an area's level list, each area's own recording inside its levels, the three levels with a recording of their own, the town tune again outside.
- A demo sheet for product documents, [demo/lifesaver-screens.jpg](demo/lifesaver-screens.jpg): 24 captioned screens in four rows (getting in, one level from story to ordering, mini-games, other mini-games with hint and result). It is written for the product team, so it does not call anything "new" or "demo"; the character in it is named Nhi (owner, 2026-11-16). `pnpm demo:sheet` retakes the screenshots and rebuilds it; it does not update by itself when the game changes.
- Typecheck, lint and production build pass, and the build served from a sub-folder (as on GitHub Pages) loads, saves and survives a reload.
- I looked at screenshots of the home screen (four sizes), pause and unlock dialogs, the level phases (including picking, ordering and both reviews, also at 320 × 568), the result and the mistake paths.

### Not done or not checked

- **Nobody has listened to the sound.** I cannot hear audio; files were chosen by name, description and measurement. The owner should listen once and name any sound to swap. This matters most for the eight recordings of places: none was made in Vietnam, and the restaurant and football ones contain voices that may be clear enough to sound foreign. Of the four added in the last round, the football pitch is the weakest fit (quiet, with a few groups of distant shouts and a faint aeroplane); art-and-audio.md, section 3, says what was measured on each and names two alternatives.
- Recordings of places loop after one minute with a two-second dip, not seamlessly.
- Not tried on a real phone. WebKit on a computer is close to Safari on iOS but not the same. Dragging (items, and the steps being put in order) and the new gestures are tested with a simulated mouse only: under a real finger the tolerances (how far from the path counts as leaving it, how fast is too fast for the ring, how far to rub) may need tuning, and the finger covers part of what it is doing.
- The level-timeout path (letting the whole clock run out) has unit tests but no end-to-end test.
- Music restarts with a short fade at the loop point; it is not seamless.
- Side characters have no portraits; they appear only inside their scene.
- The logo follows the original artwork from the owner's project poster: the "Lifesaver" letters are still set in type, and the beacon, the two crosses and the heartbeat line are redrawn as flat SVGs in the game's palette (`src/assets/logo/`). Its crosses are mint, not red. The loading screen still has no helicopter or running character (requirements section 9).
- Kie's and the model's terms on ownership and commercial use of the generated pictures have not been read.

## Things a reviewer should look at first

- **Choking (food-district-01)** carries the most risk of teaching something wrong.
- **Gas leak (dormitory-02)**: the level's order is no sparks, close the valve, open doors and windows, get out and call 114. I did not check this order against a Vietnamese fire-service source.
- **The phone calls (dormitory-02, streets-01)**: what a 114 or 115 dispatcher in Vietnam actually asks, and in what order. I wrote the questions from general practice (where, what happened, how the person is, what to do while waiting), not from a Vietnamese source.
- **The elastic bandage on a sprained ankle (school-03)**: the last mini-game has the player wrap the ankle from the foot upward. Check that this is right for a student to do, and the wording of when to loosen it.
- **The gas valve** closes clockwise in the game. That is the usual direction for a cylinder valve, but I did not check it against a Vietnamese supplier's instructions.
- **Hold mini-games** last 3–8 seconds of game time and state the real duration in text (for example about 10 minutes of pressure, about 20 minutes of cooling). Check each stated duration.
- Every generated picture, for anything that contradicts its lesson.

## Waiting on the owner

0. Optional: GitHub reports a billing lock on the account, which stops GitHub Actions. Automatic deploys on push are only possible once that is cleared in GitHub's billing settings.
1. Listen to the sound effects, the town tune and the eight recordings of places; say which to swap. Start with the four new ones: the three school levels and the park's first level.
2. Verdict on the generated art and the pastel palette.
3. Who reviews the medical content, and which reference lessons should cite.
4. The original loading screen as a file, if it exists. The logo now follows the one on the project poster; say if it should differ.
5. Guide character's name and look (placeholder: "Bông", a cotton ball with a first-aid satchel).
6. Whether saving on one device only is acceptable for the MVP.

## Next steps, in order

1. Act on the owner's feedback on sound, art and the new mini-games.
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
| 2026-11-16 | Each area has its own background sound instead of more music; five CC0 or public-domain recordings approved for download | Owner. I removed the piano track that played inside levels, since the area sound replaces it |
| 2026-11-16 | In the hazard scan, a hazard that was found is not shown in red | Owner. It is mint with a tick; a harmless spot that was tapped is grey with a cross |
| 2026-11-16 | The MVP is done; next, plan and build mini-games with richer interaction where they fit | Owner. I added follow a path, rub, turn and phone call to seven levels, on close-up pictures; details in plan.md section 8 |
| 2026-11-16 | Choking stays as decision cards; back blows and abdominal thrusts are not made a gesture | Mine: the requirements forbid reducing a complex technique to a swipe |
| 2026-11-16 | Hosting on GitHub Pages; the repository became public for it | Owner |
| 2026-11-16 | An area's level list keeps the town tune; the area's own sound plays only inside its levels | Owner |
| 2026-11-16 | Remove the "draft, not reviewed by an expert" line from lessons | Owner. The content is still unreviewed, and the `source`, `reviewer` and `reviewedOn` fields stay empty until a reviewer signs off; the line that the game does not replace a practical course stays |
| 2026-11-16 | Choosing is two steps: pick the right steps with no confirm, then reorder them and confirm with "Thực hiện"; afterwards the game gives feedback and puts the steps in the right order if needed | Owner. This replaces "no confirm button" and "no message about the order". I gave ordering its own 60-second clock, start the list in the order the options were listed, and wait for "Tiếp tục" after the feedback so that it gets read |
| 2026-11-16 | The two choosing steps are not shown as tabs, and the message for a right order is only "Đúng thứ tự rồi!" | Owner, after seeing the first version |
| 2026-11-16 | The third school level gets one of the new mini-games | Owner. I added wrapping the ankle with an elastic bandage as a third step, on a new close-up; the lesson already allowed it |
| 2026-11-16 | A locked level's button says only "Đang khoá"; the home screen's play button drops the area name; speech boxes get larger type and more padding | Owner. The larger type applies on screens at least 700 px high, because on shorter ones it pushed the main button off the screen |
| 2026-11-16 | Remove "hold the cold pack" from the third school level | Owner agreed to my proposal: the step before it already places the cold pack, and the level had grown to three steps |
| 2026-11-16 | Where an old mini-game repeats a new one in the same level, remove the old one | Owner. I checked all nine chained levels and found no such pair, so nothing was removed |
| 2026-11-16 | The logo takes the decorations of the original artwork on the project poster (beacon, crosses, heartbeat line), redrawn flat in the palette; the letters stay set in type | Owner supplied the poster. I made the crosses mint instead of red, following the rule for first-aid symbols |
| 2026-11-16 | Replace the school's background sound; a level may have a background sound of its own where that is reasonable, in any area | Owner, who approved four CC0 downloads from Freesound. I gave a level its own sound only where its place differs from the rest of its area: the school library and football pitch, and the park's first level (midday heat, cicadas). The dormitory, streets and food district keep one sound each |
