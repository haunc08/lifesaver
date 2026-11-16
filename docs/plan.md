# Lifesaver — MVP plan

Status: 2026-11-16. The MVP is built (your word on 2026-11-16: "that's the MVP done"); section 8 is the plan for what came next, richer mini-games. Requirements live in [high-level-req.md](../high-level-req.md); this plan covers the MVP column of its section 10. Art and sound have their own plan in [art-and-audio.md](art-and-audio.md). Current progress is in [status.md](status.md).

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
| Sound | Web Audio for effects, one audio element for the background, MP3 files. The background is the town tune outside the areas and a recording of the place inside each area | Works on phone browsers, which only allow sound after the first tap. A sound per area was your instruction: it fits better than more music |
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
| Clock | Runs only in the assess, choose and act phases, and is not shown anywhere else (your instruction: a clock that stands still confuses). Every round has its own clock, which starts afresh: 60 seconds to assess, 120 to pick the steps, 60 to put them in order, 90 for each mini-game, 24 per card for a quick-decision run, and 30 plus 25 per question for a phone call (your instruction: generous, and reset each round). Opening the hint or pause stops it |
| Skipping | Nothing can be skipped: the town intro and each level's story are read line by line, also on a replay (your instruction) |
| Assessment | Right first time: 20 points. Right second time: 10. Wrong twice: the level ends as a recoverable mistake |
| Unsafe option | Blocked with an explanation and never carried out; costs 8 of the 15 safety points. A second unsafe choice in the same run ends the level as an unsafe failure |
| Irrelevant option | Rejected with an explanation; lowers the solution score |
| Observing | Each clue is marked in the level data as essential or not. All clues look the same on screen; the player can move on once every essential one has been opened, however many others were looked at (your instruction) |
| Wrong answers | Every unsafe or irrelevant option, decoy and "should not" card matches a line in that lesson's "do not" list, so the result never marks something wrong that the lesson does not warn about. No option is a weaker twin of a right one: the earlier "partial" options are gone (your instruction) |
| Choosing | Two steps (your instruction of 2026-11-16, which replaces "no confirm, no message"). Step one: the player taps every right step, in any order. A pick is final, there is no undo and nothing to confirm; a wrong option is refused with its reason; the step ends by itself when every right step is picked. Step two: the picked steps appear as a list, starting in the order the options were listed (never the answer), and the player drags them into the order they would do them, then presses "Thực hiện". The game then says whether the order was right. If it was not, the list is rearranged into the right order, and each step the player had elsewhere is marked with where they put it and why it belongs where it is. The action starts when the player presses "Tiếp tục". Scene safety and calling for help are among the right steps of every level |
| Order | Carrying out the steps in the wrong order costs 5 safety points and makes the result a partial success; it never blocks the action. The review after "Thực hiện" and the result screen both show the right order |
| Time points | Compares all the time used with the sum of the rounds' limits: full 10 points for using up to half, falling to 0 at the limit |
| Passing | Requires all mandatory steps, a completed action and no unsafe failure. Stars at 60, 75 and 90 points only count on a pass |
| Rewards | 50 XP on the first clear and 25 XP the first time 3 stars are reached; replays give nothing more (replay rules are Phase 2). A player level is every 100 XP |
| After a level | "Next" starts the next level of the same area. After an area's last level it opens the new area's level list instead of starting its first level (your instruction) |
| Unlocking | A level opens when the one before it is cleared; an area opens when every level of the area before it is cleared. Tapping a locked area or level explains this and offers to open it straight away, so any level can be shown to someone (your instruction). There is no "unlock everything" switch |
| Home | The home screen is the town map: a marker per area, the player's name and level above, the library and "play the next level" below. There is no separate map screen (your instruction) |
| Library | A lesson is added when its level is finished with any result. One core safety lesson is open from the start |
| Mini-game accuracy | The first slip in a mini-game is free (a decoy tapped, a wrong drop, letting go of a hold, leaving a path, turning the wrong way, a wrong number or reply). After that each slip lowers the action score |
| Scan for hazards | A hazard the player found is a right answer, so it turns mint with a tick; a harmless spot that was tapped turns grey with a cross. Red is not used on a right answer (your instruction: it read as a mistake) |
| Tap the targets | The numbered things include at least one that must not be done; tapping it is refused with the reason (your instruction) |
| Drag and place | The item's picture follows the finger, riding a little above it so it stays visible; the slot it would land in lights up, and letting go near a slot drops the item into the nearest one. Tapping an item and then a slot also works. An item that was placed, or a decoy that was tried and refused, leaves the tray (your instruction) |
| Item pictures | Every item that is dragged or held has its own picture (your instruction) |
| Hold | Letting go early loses a quarter of the progress. The hold lasts a few seconds of game time, and the screen states the real-life duration so the short hold teaches nothing wrong |
| Quick decision | Each card has its own short timer; running out counts as a wrong answer. At least 60% of cards must be right, otherwise the level ends as a recoverable mistake |
| Follow a path | The player holds a tool (a bandage roll, a card, a ring) and moves it along a dotted path on a close-up picture. The tool follows the finger only along the path, so cutting across a zigzag leaves it behind; a finger that goes far from the path lets go of the tool, which is a slip, and the tool waits where it stopped. A path can be marked gentle: then moving faster than a set speed is also a slip |
| Rub | The player moves a tool back and forth over each marked place until its ring is full. Only movement over the place counts; there is no way to fail it |
| Turn | The player turns a dial by moving a finger round its centre. Only the right direction makes progress; the wrong direction gives a little and is then refused with the reason, which is a slip |
| Phone call | The player dials the emergency number themselves: the instruction names the service, not the number. A wrong number is explained and can be tried again; the second wrong number gives the answer away. Then the dispatcher asks three to five questions, each with three replies of which one helps. An unhelpful reply is explained, crossed out and costs accuracy. The call ends when the dispatcher says the player may hang up |
| Chained mini-games | The action score is the average of the steps; failing one step ends the level as a recoverable mistake |

## 3. Levels

Twelve levels, 2–3 per area. Titles and themes are proposals. All twelve are built as drafts and playable.

| # | Area | Title | Theme | Main mechanic |
| --- | --- | --- | --- | --- |
| 1 | School | Tiết bốn oi ả | Fainting | Tap the targets |
| 2 | School | Giờ tự học ở thư viện | Seizure | Drag and place: clear the space, protect the head |
| 3 | School | Trận bóng chiều thứ sáu | Sprain | Drag and place, then follow a path: wrap the ankle with an elastic bandage |
| 4 | Dormitory | Đĩa trái cây đêm khuya | Cut | Hold steady pressure, then follow a path: wrap the finger |
| 5 | Dormitory | Mùi lạ trong bếp chung | Gas leak | Scan for hazards, turn the gas valve shut, phone call to 114 |
| 6 | Streets | Ngã tư giờ tan tầm | Scene safety at a traffic accident | Scan for hazards, quick decision, phone call to 115 |
| 7 | Streets | Cú ngã ở trạm xe buýt | Bleeding | Hold, drag and place, then follow a path: wrap the forearm |
| 8 | Food district | Miếng bánh vội vàng | Choking | Quick decision; needs the most care from the reviewer |
| 9 | Food district | Ấm nước sau quầy | Burn | Hold under running water, then follow a gentle path: slide the ring off |
| 10 | Park | Chạy bộ giữa trưa | Heat illness | Drag and place, then rub: cool with a wet towel |
| 11 | Park | Vị khách không mời | Insect sting | Follow a path: scrape the stinger off; rub: wash; tap the targets |
| 12 | Park | Buổi dã ngoại cuối tuần | Sports injury | Mixed |

Nine mini-game mechanics are built: tap the targets, scan the scene, hold, drag and place, quick decision, and since the MVP follow a path, rub, turn and phone call (section 8). A level chains up to three of them.

### Medical content

I write level and lesson text as drafts from general first-aid knowledge. I am not a qualified reviewer, and the requirements say each lesson must name its source, reviewer and review date. Until a lesson has all three, the game labels it "Bản nháp: nội dung chưa được chuyên gia thẩm định". The MVP should not go to real players with draft lessons.

## 4. Milestones

| # | Milestone | Done when | State |
| --- | --- | --- | --- |
| M0 | Setup and walking skeleton | Project runs; all MVP screens exist with placeholder art; one level is playable through all six phases; progress saves; tests pass | Done |
| M1 | Mini-game set and level feel | The four remaining mechanics exist; feedback has motion; each mechanic has guidance, tolerance and retry | Done |
| M2 | All 12 levels as drafts | Every level is playable with placeholder art; an automated check enforces the content rules (for example exactly one right assessment answer, a mandatory safety step and call-for-help step) | Done; all content is unreviewed draft |
| M3 | Art | A sample (player, guide with six expressions, one scene) is approved; then logo, loading screen, characters, scenes, map and icons replace all placeholders | Scenes, characters, town map and area pictures are in; the logo is still drawn in code. Waiting on your verdict |
| M4 | Sound | Sound effects and music play; the two settings switches control them | Done; nobody has listened to the result yet (see status.md) |
| M5 | Polish | Screen transitions, result animation, empty and locked states reviewed, works on small phones, loads fast on mobile data | Done in the browser test at 320 × 568 and 360 × 640; not yet tried on a real phone |
| M6 | Review and playtest | Every lesson has a source, reviewer and date; a few people from the target group have played it; fixes are in | Needs a reviewer |
| M7 | Release | Deployed to a public address | A demo build is published on GitHub Pages; a release to real players waits for M6 |
| M8 | Richer mini-games | Four new mechanics exist and are used in the levels they fit (section 8) | Done on 2026-11-16 |

M0 to M5 and M8 were built on 2026-11-16. What remains is M6, which needs people: a medical reviewer and playtesters.

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
| A mini-game teaches a wrong habit, for example a wrong rhythm | Breaks a core requirement | No rhythm-based first-aid mini-games in the MVP; every gesture mini-game states what the gesture stands for in real life; reviewer checks each mechanic, not just the text |
| A gesture mini-game is fiddly under a real finger | Players get stuck on the action | Wide tolerances, the first slip is free, the tool waits where it stopped. Tested with a simulated mouse only, so it needs a try on real phones |

## 8. Richer mini-games (after the MVP)

You asked on 2026-11-16 for mini-games with more involved and more interesting interaction, used in the rounds where they fit. The five MVP mechanics were all taps, one hold and one drag; this adds four that ask for a real gesture or a real decision. Rules are in the table in section 2.

### What was added and where

| Mechanic | What the player does | Used in |
| --- | --- | --- |
| Follow a path | Holds a tool and moves it along a dotted path on a close-up picture | Wrap the sprained ankle with an elastic bandage (level 3, added on your request), wrap the cut finger (4), wrap the forearm over the gauze (7), slide the ring off a scalded hand, slowly (9), scrape the stinger off sideways with a card (11) |
| Rub | Moves a tool back and forth over marked places | Cool forehead, neck and arms with a wet towel (10), wash the sting with soap and water (11) |
| Turn | Turns a dial round its centre, in the right direction | Close the gas cylinder valve, clockwise (5) |
| Phone call | Dials the emergency number, then answers the dispatcher | Call 114 from outside after a gas leak (5), call 115 at a traffic accident (6) |

Eight of the twelve levels changed. The first two school levels are unchanged on purpose: they are the first levels a player meets and stay simple. The third school level gained the ankle wrap at your request on 2026-11-16; its lesson already said an elastic bandage may be used. Its old "hold the cold pack" step was removed the same day with your agreement, because the step before it already places the cold pack; the real-life duration of cooling is now stated under the wrap. Choking (8) is unchanged too, see below.

No level asks for the same thing twice in an old mini-game and a new one (checked on 2026-11-16 at your request). Where a new mini-game took over a task, the old version of that task had already been removed: the bandage slot in level 7's drag and place, the towel in level 10's, and the "call 115" card in level 6's quick decision.

### Choices I made

- **Close-up pictures.** A gesture needs room, and the people in a scene are small. Each gesture mini-game is played on its own close-up (a forearm, a hand), as the requirements say for the act phase: "the view moves to the spot that needs handling". What changes is drawn in code on top: the bandage as it unrolls, the stinger, the ring.
- **No technique is reduced to a swipe.** The requirements forbid turning a complex medical technique into one swipe. So the gestures stand for things that are simple in real life too (wrapping a bandage, scraping a stinger sideways, closing a valve, taking a ring off), and each states its real-life version under the picture. Back blows and abdominal thrusts stay as decision cards; I did not make them a gesture.
- **The number is not given.** In the phone call the instruction says which service to call, not its number, so the player has to know 113, 114 and 115. The hint gives it, and so does the second wrong attempt.
- **A wrong reply never ends the call.** It is explained and crossed out, and the question stays, because the point is to learn what a dispatcher needs: where, what happened, how the person is, and not hanging up first.
- **Rubbing cannot be failed.** It is a calm step between harder ones; the clock is its only pressure.
- **Lessons gained "do not" lines** for the new wrong choices: vague or false reports to a dispatcher, hanging up first, taking an injured person to hospital by motorbike, turning the valve the opening way, pulling a ring off a scalded hand.

### Not built, as candidates for later

- Two things at once (the requirements' "advanced" group): keep pressure on a wound with one thumb while answering the dispatcher with the other hand. It needs two fingers on the screen at once, which I could not test here.
- Recovery position as a series of guided moves. It needs a figure whose limbs can be drawn in several positions, which one generated picture cannot give.
- Draw a safe way out of a room or across a road, avoiding marked dangers.
- A gesture for the first two school levels, once the simple versions have been played by real players.
