# Lifesaver — High-Level Requirements

## 1. App overview

Lifesaver is a mobile game that teaches first-aid skills through everyday situations. The player takes the role of a student exploring a fictional town, runs into incidents, and learns by observing signs, reasoning, choosing a response, performing it by hand and reading the explanation.

| Item | Requirement |
| --- | --- |
| Genre | Educational game with a casual mini-game pace |
| Target players | Students aged 18–25, extending to young adults |
| Platform | Web, played on a phone screen |
| Language | Vietnamese |
| Play mode | Single player |

The game must be fun, easy to pick up and easy to retry, like a casual game. It must not turn first aid into reckless action, and must not lead players to believe they are now qualified to give first aid in real life.

The game takes its inspiration from short mini-games with simple rules and fast retries, in the style of Dumb Ways to Die.

## 2. Experience pillars

Every feature and every level must serve at least one of the six pillars below.

| Pillar | What the player does |
| --- | --- |
| Observe | Looks at the scene and spots clues |
| Think | Assesses the situation from evidence |
| Decide | Chooses an action, safety first |
| Act | Performs intuitive touch interactions |
| Learn | Understands why something was right or wrong, and can review it |
| Explore | Unlocks new areas, meets characters, follows the story |

## 3. Gameplay loop

Each session follows one loop: lobby → map → level → result → reward → next level unlocked. Inside a level the player sees the scene in first person and goes through six phases in order.

1. **Intro.** A short setup and dialogue bring the player into the scene. After the first playthrough, the player can skip it.
2. **Observe.** Clues appear automatically or when the player taps them; the view zooms to the clue with motion, sound and a caption. A single clue must never be enough for a certain conclusion.
3. **Assess.** The game asks "What is happening?" with 3–4 plausible answers. The player gets at most two attempts.
4. **Choose a solution.** The player picks an action, which may be a sequence of actions in the right order.
5. **Act.** The view moves to the spot that needs handling; the player completes a guided touch mini-game.
6. **Consequence and result.** The situation plays out according to the chosen actions, then the game sums up.

### Assessment rules

- A correct first answer moves the player on.
- A wrong first answer costs time or points and allows a second attempt.
- A wrong second answer fails that branch; the game explains why and offers a retry.
- A level may ask for an assessment at the level of "suspected" rather than "confirmed".

### Solution rules

- Every option belongs to one of four types: correct, partially correct, unsafe, irrelevant.
- An unsafe option must be blocked with clear feedback and must never lead to passing the level.
- Checking scene safety and calling for professional help always take priority.

### Result rules

- A level ends in one of five states: success, partial success, recoverable mistake, unsafe failure, time-out.
- The result screen must show the score, stars, rewards, which steps were right, what went wrong and why, and the signs that mean help should be called.
- From the result screen the player can go to the lesson, the video, a replay or the next level.

### Pacing

- A level usually lasts 1–3 minutes; the final level of an area is longer.
- The observe phase gives enough time to read; only some action mini-games are timed.
- The in-game clock is a gameplay challenge and does not represent real medical time limits.

### Hints

In every phase of a level, the player always has a hint button that shows the correct way to proceed.

## 4. Mini-game system

The game uses a set of reusable mini-games; each level has one main mechanic and at most two secondary ones.

| Group | Mini-game types |
| --- | --- |
| Observation | Spot the clue, scan the scene for safety |
| Reasoning | Quick decision, match the signs, put steps in order |
| Action | Tap the target, hold, swipe, rotate, drag and place |
| Advanced | Handle several tasks at once |

- Every interaction must have guidance, instant feedback, reasonable tolerance and the option to retry.
- Every interaction must reflect the learning goal of its level.
- The game must not reduce a complex medical technique to a single swipe and then treat the player as having practised it.
- The rhythm of a mini-game must not implicitly teach a wrong medical rhythm.

## 5. World and content

The game takes place in a fictional town of 10 areas with 5–8 levels each, about 60–70 levels in total. The player is a student who has just moved in and joined the volunteer first-aid club.

### Story and tone

- One continuous story links the areas, with recurring side characters.
- The tone is fun and a little cheeky in everyday scenes; once someone is hurt, the situation is treated seriously and the victim is never mocked.
- Side characters include classmates, club friends, security guards, canteen staff, teachers and townspeople.
- A guide character accompanies the player through tutorials, hints, results and the knowledge library.
- Student characters do not carry medical-staff titles.

### Structure of an area

- A story intro and 2–3 familiar side characters.
- 3–6 small levels, one situation each.
- A combined final level and a knowledge recap.
- New areas unlock through level progress; coins cannot be used to skip safety content.

### Area list

| # | Area | Settings | Situation themes |
| --- | --- | --- | --- |
| 1 | School | Classroom, library, sports field, stairs, canteen | Fainting, seizure, choking, sprain |
| 2 | Dormitory | Bedroom, shared kitchen, bathroom, balcony | Burns, cuts, electricity, gas |
| 3 | Streets | Intersection, bus stop, pavement | Traffic accident, bleeding, scene safety |
| 4 | Food district | Café, bakery, kitchen | Burns, choking, sharp-object wounds |
| 5 | Park | Jogging, picnic | Heat illness, sports injury, insects |
| 6 | Countryside | Fields, orchards | Allergy, animals, dehydration |
| 7 | Mountain | Hiking, camping | Falls, hypothermia, calling for rescue |
| 8 | Riverside | River dock, bridge, lakeside | Recognising drowning risk, calling for rescue, helping from a safe position |
| 9 | Festival | Crowded event | Multiple victims, prioritising help |
| 10 | Town centre | Mixed | Final challenge |

## 6. Progression and rewards

Players progress through levels, experience points, coins, stars, achievements and an inventory; rewards are cosmetic only and never buy an advantage.

### Scoring

Each level is scored out of 100 points.

| Component | Points |
| --- | --- |
| Action | 30 |
| Solution choice | 25 |
| Assessment | 20 |
| Safety and order | 15 |
| Time | 10 |

- 1, 2 and 3 stars are awarded at 60, 75 and 90 points.
- Passing requires completing the mandatory objectives with no critical safety mistake; a high total score cannot make up for one.

### Rewards

- The first clear of a level gives experience points and coins; 3 stars gives a bonus.
- Replays still give rewards, but reduced or capped.
- Each reward can be claimed only once.

### Lobby features

- **Shop** sells cosmetic items only: hair, outfits, accessories, frames, emotes. It does not sell answers or level-clearing advantages.
- **Daily check-in** gives a reward per day.
- **Lucky spin** gives coins and items and never uses real money.
- **Leaderboard** compares players' results.
- **Achievements** record the player's milestones.

## 7. Knowledge library

Every level played leaves a lesson in the library, where the player can review it at any time.

- Players filter lessons by area or topic, search for situations and see their learning history.
- Each lesson contains: signs to recognise, handling principles, what not to do, when to call for help, a 30–90 second video, a 3–5 question quiz and a button to replay the related level.
- Core emergency-safety knowledge is open from the start; detailed knowledge unlocks with levels.
- Each lesson states its reference source, reviewer and review date.

## 8. Screens and user flow

The game has five groups of screens, with the lobby as the hub that leads everywhere.

| Group | Screens |
| --- | --- |
| Opening | Loading screen, town intro, character creation, controls tutorial |
| Navigation | Lobby, world map, level select within an area |
| In level | Intro, observe, assess, choose solution, mini-game, consequence, result |
| Review | Knowledge library, lesson detail with video and quiz |
| Utilities | Shop, inventory, daily check-in, lucky spin, leaderboard, profile and achievements, settings, help |

### First launch

1. Loading screen.
2. Town intro (skippable).
3. Create a character and choose a name.
4. Controls tutorial (can be replayed from settings).
5. Lobby, then map, then the first level, already unlocked.
6. Result; the lesson is saved to the library automatically.

### Lobby

- The top shows the avatar, name, level, experience bar, coins and the settings button.
- The centre shows the player's character, a large play button and a pointer to the next level.
- From the lobby the player can reach the library, shop, leaderboard, daily check-in, lucky spin, inventory, profile and achievements.
- Every entry must have a clear state when it is empty or locked.

### In level

The player always sees the clock, progress, the hint button and the pause button.

### Settings

The player can turn background music and sound effects on or off, and replay the controls tutorial.

## 9. Visual requirements

Lifesaver uses bright, friendly 2D cartoon graphics, and every visual in the game must be consistent with the original logo and loading screen.

Style reference: [example of style and colours](https://drive.google.com/file/d/1xcrSzl5L93zpOIqxKYj3z3SZWHcVxKEU/view?usp=sharing).

### Logo

- The display name is "Lifesaver": "Life" in blue, "saver" in red.
- Thick, round 3D bubble lettering with a white outline and a dark-blue shadow.
- Medical crosses on both sides, a siren on top, a heartbeat line and a medical badge below, light rays around.
- The name, the colour of each part of the lettering and the logo layout stay unchanged.

### Loading screen

- Blue sky with light rays and round white clouds.
- A hospital at centre-right, an ambulance at bottom right, a medical helicopter at top right.
- A blond chibi character in medical clothing running on the left, carrying a first-aid bag.
- Medicine, cross, medical-bag and heartbeat icons; the text "Đang tải…" at the bottom.
- The loading effect may animate but must not shift the layout.

### Art style

- Chibi characters: large head, small body, round limbs, big eyes, strong expressions.
- Simplified environments built from rounded shapes, with fresh colours, bright lighting and soft shadows for light depth.
- The world map is seen from a high diagonal angle; inside a level the view is first person and moves between fixed viewpoints rather than roaming freely.
- The interface uses rounded cards and buttons; icons are sticker-style with a white outline.
- No realistic, horror or dark styles, and no thin-line office-style icons mixed in.

### Player character

- The character is a student and is not required to wear medical clothing.
- The wardrobe includes hoodies, T-shirts, shirts, jeans, khakis, wide-leg trousers, simple skirts, sneakers, backpacks, tote bags, glasses, hats, club shirts and outdoor wear.
- Players can customise name, hairstyle, hair colour, skin tone, top, bottom and accessories.
- The full character appears in the lobby, profile and cutscenes; inside a level only the hands or the object being handled are shown.
- Outfits do not affect gameplay results.

### Side characters

Side characters have at least six expressions: neutral, happy, worried, in pain, surprised, relieved.

### Situation imagery

- No gore or severe injuries are shown, even when the player fails.
- Victims are portrayed respectfully and in an age-appropriate way.

## 10. Development phases

Development is split into two phases: the MVP delivers five areas with 2–3 levels each, enough to prove the core loop across varied situations, and Phase 2 adds the rest of the world and the lobby features. Sections 1–9 describe the full game; this section says which parts belong to which phase.

### MVP goal

A new player can open the game, create a character, play through five areas of 2–3 levels each, see results and rewards, review the lessons, and find their progress still there on the next visit.

### Scope by phase

| Feature | MVP | Phase 2 |
| --- | --- | --- |
| Loading screen and logo | Matches the reference | — |
| Onboarding | Short town intro | Full story intro, controls tutorial |
| Character | Name and a small set of looks to pick from | Full customisation and wardrobe |
| Lobby | Header, character, play button, link to the library and settings | Shop, inventory, daily check-in, lucky spin, leaderboard, profile and achievements |
| World | Five areas: School, Dormitory, Streets, Food district, Park; world map across them | The other five areas |
| Levels | 2–3 levels per area, 10–15 in total | Remaining levels of the first five areas, each area's final level, and the levels of the other areas |
| Level phases | All six phases, with the hint button in every phase | — |
| Mini-games | A core set of mechanics, varied across levels | The remaining mini-game types |
| Scoring and results | Score out of 100, stars, full result screen | — |
| Rewards | Experience points, stars, level and area unlock | Coins, replay limits, bonus rules |
| Knowledge library | One lesson per level with signs, principles, what not to do and when to call for help; replay button | Videos, quizzes, search, filters, history |
| Story and characters | The guide character and the side characters needed by the MVP levels | Continuous story, recurring characters across areas |
| Settings | Music and sound effects on or off | Replay tutorial |
| Saved progress | Progress, rewards and character kept between visits | — |

