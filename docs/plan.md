# Lifesaver — MVP plan

Status: draft for review, 2026-11-16. Requirements live in [high-level-req.md](../high-level-req.md); this plan covers the MVP column of its section 10. Art and sound have their own plan in [art-and-audio.md](art-and-audio.md). Current progress is in [status.md](status.md).

## 1. What the MVP is

A Vietnamese-language web game for phone screens. A new player opens it, names their character, lands on the town map, plays 12 levels across five areas (School, Dormitory, Streets, Food district, Park), sees a score and rewards after each, can re-read each lesson in a library, and finds their progress saved on the next visit.

There is no backend. The game is a static site, and progress is saved in the browser on the player's device.

## 2. Decisions that need your review

These are the choices I made where the requirements left room. Tell me which ones to change.

### Technical choices

| Choice | Decision | Why |
| --- | --- | --- |
| App type | Static single-page web app, no server | The MVP has no feature that needs one; hosting is free and there is no account system to build |
| Framework | React 19 + TypeScript + Vite | Most of the game is screens, cards and buttons, which a UI framework does well |
| Game rendering | HTML/CSS with touch events, not a canvas game engine | Levels are fixed viewpoints with tappable spots and simple gestures; an engine such as Phaser would add size and complexity for little gain. Revisit only if a mini-game needs physics or many moving sprites |
| Styling | Tailwind CSS with one shared palette | One place for the colours; fast to build rounded cards and chunky buttons |
| Visual style | Muted pastel colours, simple shapes, no gradients; blur allowed | Your instructions on 2026-11-16; this differs from section 9 of the requirements, see art-and-audio.md |
| Art production | Generated with the Seedream 5.5 model through the Kie API, from prompts kept in the repository; interface icons are drawn in code | Your instruction on 2026-11-16. One shared style prompt keeps the images consistent; cost is tracked in art-and-audio.md |
| Animation | CSS only: screens and level phases ease in, feedback pops or shakes, the result counts up and its stars land one by one | Small, and it respects the "reduce motion" setting. Nothing loops or wiggles on its own (your instruction) |
| Sound | Web Audio for effects, one audio element for music, MP3 files | Works on phone browsers, which only allow sound after the first tap |
| Hosting | GitHub Pages, published by running `pnpm deploy:pages`, which pushes the built site to the `gh-pages` branch | Your choice on 2026-11-16; it is free and needs no other account. It required making the repository public. Publishing is a manual command because GitHub would not run an Action on the account (billing lock) |
| Saved progress | Browser localStorage, versioned | Meets "progress still there on the next visit" on the same device and browser |
| Tests | Vitest for game rules and content rules; Playwright plays every level, the mistake paths, small screens and the sound engine | Rules and scoring are where bugs would hurt most |

### Limits that follow from these choices

- Progress does not follow the player to another device or browser, and clearing browser data erases it. Fixing that needs accounts and a server, which I have left for Phase 2 along with the leaderboard.
- The game needs a connection to load. Offline play is possible later as an installable web app.

### Game rules I filled in

The requirements give the shape of the rules; these are the specifics I chose so the engine could be built. Level rules live in [src/game/](../src/game/); the mini-game rules at the end of the table live in [src/minigames/](../src/minigames/). All are easy to change.

| Rule | Decision |
| --- | --- |
| Player character | One fixed character; creation only asks for a name (your instruction on 2026-11-16; the requirements table still says "a small set of looks") |
| Clock | Runs only in the assess, choose and act phases. Intro and observe are untimed so there is time to read, and the clock is not shown there at all (your instruction: a clock that stands still confuses). Opening the hint or pause stops it |
| Skipping | Nothing can be skipped: the town intro and each level's story are read line by line, also on a replay (your instruction) |
| Assessment | Right first time: 20 points. Right second time: 10. Wrong twice: the level ends as a recoverable mistake |
| Unsafe option | Blocked with an explanation and never carried out; costs 8 of the 15 safety points. A second unsafe choice in the same run ends the level as an unsafe failure |
| Irrelevant option | Rejected with an explanation; lowers the solution score |
| Partial option | Accepted; counts as half of the step it replaces and makes the result a partial success |
| Mandatory steps | Each level marks some steps as mandatory, always including scene safety and calling for help. Confirming a plan without them ends the level as a recoverable mistake |
| Order | Doing the right steps in the wrong order costs 5 safety points |
| Time points | Full 10 points for using up to half the clock, falling to 0 at the limit |
| Passing | Requires all mandatory steps, a completed action and no unsafe failure. Stars at 60, 75 and 90 points only count on a pass |
| Rewards | 50 XP on the first clear and 25 XP the first time 3 stars are reached; replays give nothing more (replay rules are Phase 2). A player level is every 100 XP |
| Unlocking | A level opens when the one before it is cleared; an area opens when every level of the area before it is cleared. Tapping a locked area or level explains this and offers to open it straight away, so any level can be shown to someone (your instruction). There is no "unlock everything" switch |
| Home | The home screen is the town map: a marker per area, the player's name and level above, the library and "play the next level" below. There is no separate map screen (your instruction) |
| Library | A lesson is added when its level is finished with any result. One core safety lesson is open from the start |
| Mini-game accuracy | The first slip in a mini-game is free (a stray tap, a wrong drop, letting go of a hold). After that each slip lowers the action score |
| Hold | Letting go early loses a quarter of the progress. The hold lasts a few seconds of game time, and the screen states the real-life duration so the short hold teaches nothing wrong |
| Quick decision | Each card has its own short timer; running out counts as a wrong answer. At least 60% of cards must be right, otherwise the level ends as a recoverable mistake |
| Chained mini-games | The action score is the average of the steps; failing one step ends the level as a recoverable mistake |

## 3. Levels

Twelve levels, 2–3 per area. Titles and themes are proposals. All twelve are built as drafts and playable.

| # | Area | Title | Theme | Main mechanic |
| --- | --- | --- | --- | --- |
| 1 | School | Tiết bốn oi ả | Fainting | Tap the targets |
| 2 | School | Giờ tự học ở thư viện | Seizure | Drag and place: clear the space, protect the head |
| 3 | School | Trận bóng chiều thứ sáu | Sprain | Drag and place, then hold |
| 4 | Dormitory | Đĩa trái cây đêm khuya | Cut | Hold: steady pressure |
| 5 | Dormitory | Mùi lạ trong bếp chung | Gas leak | Scan the scene for hazards |
| 6 | Streets | Ngã tư giờ tan tầm | Scene safety at a traffic accident | Scan the scene, quick decision |
| 7 | Streets | Cú ngã ở trạm xe buýt | Bleeding | Hold, then drag and place |
| 8 | Food district | Miếng bánh vội vàng | Choking | Quick decision; needs the most care from the reviewer |
| 9 | Food district | Ấm nước sau quầy | Burn | Hold: cool under running water |
| 10 | Park | Chạy bộ giữa trưa | Heat illness | Drag and place |
| 11 | Park | Vị khách không mời | Insect sting | Tap the targets, watch for allergy signs |
| 12 | Park | Buổi dã ngoại cuối tuần | Sports injury | Mixed |

All five mini-game mechanics are built: tap the targets, scan the scene, hold, drag and place, and quick decision. A level can also chain two or three of them. Rotate, swipe and multi-tasking are Phase 2.

### Medical content

I write level and lesson text as drafts from general first-aid knowledge. I am not a qualified reviewer, and the requirements say each lesson must name its source, reviewer and review date. Until a lesson has all three, the game labels it "Bản nháp: nội dung chưa được chuyên gia thẩm định". The MVP should not go to real players with draft lessons.

## 4. Milestones

| # | Milestone | Done when | State |
| --- | --- | --- | --- |
| M0 | Setup and walking skeleton | Project runs; all MVP screens exist with placeholder art; one level is playable through all six phases; progress saves; tests pass | Done |
| M1 | Mini-game set and level feel | The four remaining mechanics exist; clues zoom; feedback has motion; each mechanic has guidance, tolerance and retry | Done |
| M2 | All 12 levels as drafts | Every level is playable with placeholder art; an automated check enforces the content rules (for example exactly one right assessment answer, a mandatory safety step and call-for-help step) | Done; all content is unreviewed draft |
| M3 | Art | A sample (player, guide with six expressions, one scene) is approved; then logo, loading screen, characters, scenes, map and icons replace all placeholders | Scenes, characters, town map and area pictures are in; the logo is still drawn in code. Waiting on your verdict |
| M4 | Sound | Sound effects and music play; the two settings switches control them | Done; nobody has listened to the result yet (see status.md) |
| M5 | Polish | Screen transitions, result animation, empty and locked states reviewed, works on small phones, loads fast on mobile data | Done in the browser test at 320 × 568 and 360 × 640; not yet tried on a real phone |
| M6 | Review and playtest | Every lesson has a source, reviewer and date; a few people from the target group have played it; fixes are in | Needs a reviewer |
| M7 | Release | Deployed to a public address | A demo build is published on GitHub Pages; a release to real players waits for M6 |

M0 to M5 were built on 2026-11-16. What remains is M6, which needs people: a medical reviewer and playtesters.

## 5. Questions for you

1. **Medical reviewer.** Who will review the first-aid content, and which reference should lessons cite (for example Vietnam Red Cross or Ministry of Health material)?
2. **Original logo and loading screen.** The requirements say all visuals must match them. Do these exist as image files? If so, please put them in the project; I have only the one style reference image.
3. **Art direction.** [art-and-audio.md](art-and-audio.md) explains how I read "pastel, simple, no gradients" against section 9 of the requirements. Please confirm that reading.
4. **Guide character.** I used the placeholder name "Bông". What is the guide's real name and look?
5. **Hosting.** Answered on 2026-11-16: GitHub Pages.
6. **Saving on one device only.** Is that acceptable for the MVP (see the limits in section 2)?

## 6. Left for Phase 2

Everything in the Phase 2 column of the requirements: the other five areas, area final levels, shop, inventory, daily check-in, lucky spin, leaderboard, achievements, coins, lesson videos and quizzes, library search and filters, full character customisation, controls tutorial. The code leaves room for these but builds none of them.

## 7. Risks

| Risk | Effect | What I plan to do |
| --- | --- | --- |
| Draft medical content reaches players | Players learn something wrong | Lessons stay visibly marked as drafts until reviewed; M6 gates release |
| Generated images drift in style or show something wrong for the lesson | The game looks inconsistent, or a picture contradicts the text | One shared style prompt; I look at every image before using it; the reviewer should check pictures as well as text |
| The 10 USD budget runs out | Missing scenes | Each image costs about 0.02 USD and the whole set so far cost 0.36 USD; spend is tracked in art/spend.json and art-and-audio.md |
| The public demo is mistaken for a finished first-aid course | Someone relies on unreviewed content | Every lesson says it is an unreviewed draft and that the game does not replace a course; share the link only for demos until M6 is done |
| A mini-game teaches a wrong habit, for example a wrong rhythm | Breaks a core requirement | No rhythm-based first-aid mini-games in the MVP; reviewer checks each mechanic, not just the text |
