# Lifesaver — MVP plan

Status: draft for review, 2026-11-16. Requirements live in [high-level-req.md](../high-level-req.md); this plan covers the MVP column of its section 10. Art and sound have their own plan in [art-and-audio.md](art-and-audio.md). Current progress is in [status.md](status.md).

## 1. What the MVP is

A Vietnamese-language web game for phone screens. A new player opens it, names their character, plays 12 levels across five areas (School, Dormitory, Streets, Food district, Park), sees a score and rewards after each, can re-read each lesson in a library, and finds their progress saved on the next visit.

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
| Art production | Drawn as SVG in code, starting with a sample for your approval | The flat style suits it, it is free, and every image stays consistent; AI generation is the fallback |
| Animation | Motion (installed, not used yet) | For clue zooms, screen transitions and result effects |
| Saved progress | Browser localStorage, versioned | Meets "progress still there on the next visit" on the same device and browser |
| Tests | Vitest for game rules, Playwright for one full playthrough | Rules and scoring are where bugs would hurt most |

### Limits that follow from these choices

- Progress does not follow the player to another device or browser, and clearing browser data erases it. Fixing that needs accounts and a server, which I have left for Phase 2 along with the leaderboard.
- The game needs a connection to load. Offline play is possible later as an installable web app.

### Game rules I filled in

The requirements give the shape of the rules; these are the specifics I chose so the engine could be built. All live in [src/game/](../src/game/) and are easy to change.

| Rule | Decision |
| --- | --- |
| Player character | One fixed character; creation only asks for a name (your instruction on 2026-11-16; the requirements table still says "a small set of looks") |
| Clock | Runs only in the assess, choose and act phases. Intro and observe are untimed so there is time to read. Opening the hint or pause stops it |
| Assessment | Right first time: 20 points. Right second time: 10. Wrong twice: the level ends as a recoverable mistake |
| Unsafe option | Blocked with an explanation and never carried out; costs 8 of the 15 safety points. A second unsafe choice in the same run ends the level as an unsafe failure |
| Irrelevant option | Rejected with an explanation; lowers the solution score |
| Partial option | Accepted; counts as half of the step it replaces and makes the result a partial success |
| Mandatory steps | Each level marks some steps as mandatory, always including scene safety and calling for help. Confirming a plan without them ends the level as a recoverable mistake |
| Order | Doing the right steps in the wrong order costs 5 safety points |
| Time points | Full 10 points for using up to half the clock, falling to 0 at the limit |
| Passing | Requires all mandatory steps, a completed action and no unsafe failure. Stars at 60, 75 and 90 points only count on a pass |
| Rewards | 50 XP on the first clear and 25 XP the first time 3 stars are reached; replays give nothing more (replay rules are Phase 2). A player level is every 100 XP |
| Unlocking | A level opens when the one before it is cleared; an area opens when every level of the area before it is cleared |
| Library | A lesson is added when its level is finished with any result. One core safety lesson is open from the start |

## 3. Levels

Twelve levels, 2–3 per area. Titles and themes are proposals. Only the first is built.

| # | Area | Title | Theme | Main mechanic |
| --- | --- | --- | --- | --- |
| 1 | School | Tiết bốn oi ả | Fainting | Tap the targets (built) |
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

The MVP therefore needs five mini-game mechanics: tap the targets (built), scan the scene, hold, drag and place, and quick decision. Rotate, swipe and multi-tasking are Phase 2.

### Medical content

I write level and lesson text as drafts from general first-aid knowledge. I am not a qualified reviewer, and the requirements say each lesson must name its source, reviewer and review date. Until a lesson has all three, the game labels it "Bản nháp: nội dung chưa được chuyên gia thẩm định". The MVP should not go to real players with draft lessons.

## 4. Milestones

| # | Milestone | Done when | State |
| --- | --- | --- | --- |
| M0 | Setup and walking skeleton | Project runs; all MVP screens exist with placeholder art; one level is playable through all six phases; progress saves; tests pass | Done |
| M1 | Mini-game set and level feel | The four remaining mechanics exist; clues zoom; feedback has motion; each mechanic has guidance, tolerance and retry | Next |
| M2 | All 12 levels as drafts | Every level is playable with placeholder art; an automated check enforces the content rules (for example exactly one right assessment answer, a mandatory safety step and call-for-help step) | |
| M3 | Art | A sample (player, guide with six expressions, one scene) is approved; then logo, loading screen, characters, scenes, map and icons replace all placeholders | Sample can start now; the rest waits on your verdict |
| M4 | Sound | Sound effects and music play; the two settings switches control them | |
| M5 | Polish | Screen transitions, result animation, empty and locked states reviewed, works on small phones, loads fast on mobile data | |
| M6 | Review and playtest | Every lesson has a source, reviewer and date; a few people from the target group have played it; fixes are in | Needs a reviewer |
| M7 | Release | Deployed to a public address | Needs a hosting choice |

The M3 sample comes first, before M1, because your verdict on it decides how the rest of the art is made. After that, art runs alongside M1 and M2.

## 5. Questions for you

1. **Medical reviewer.** Who will review the first-aid content, and which reference should lessons cite (for example Vietnam Red Cross or Ministry of Health material)?
2. **Original logo and loading screen.** The requirements say all visuals must match them. Do these exist as image files? If so, please put them in the project; I have only the one style reference image.
3. **Art direction.** [art-and-audio.md](art-and-audio.md) explains how I read "pastel, simple, no gradients" against section 9 of the requirements. Please confirm that reading.
4. **Guide character.** I used the placeholder name "Bông". What is the guide's real name and look?
5. **Hosting.** Any preference? Cloudflare Pages, Netlify, Vercel and GitHub Pages all have free tiers that fit a static site.
6. **Saving on one device only.** Is that acceptable for the MVP (see the limits in section 2)?

## 6. Left for Phase 2

Everything in the Phase 2 column of the requirements: the other five areas, area final levels, shop, inventory, daily check-in, lucky spin, leaderboard, achievements, coins, lesson videos and quizzes, library search and filters, full character customisation, controls tutorial. The code leaves room for these but builds none of them.

## 7. Risks

| Risk | Effect | What I plan to do |
| --- | --- | --- |
| Draft medical content reaches players | Players learn something wrong | Lessons stay visibly marked as drafts until reviewed; M6 gates release |
| Art drawn in code looks too plain | The game feels cheap | Judge a small sample first; fall back to AI-generated images within the budget |
| The 10 USD budget runs out, if the fallback is used | Missing scenes | Test with three images first; track spend in art-and-audio.md |
| A mini-game teaches a wrong habit, for example a wrong rhythm | Breaks a core requirement | No rhythm-based first-aid mini-games in the MVP; reviewer checks each mechanic, not just the text |
