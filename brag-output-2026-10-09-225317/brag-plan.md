# Brag Plan: grime95!

Ponder County booking records inquiry terminal — serialized small-town fiction.

## The 9-question rubric

**1. What is the app?**
A static site that presents serialized small-town fiction as a DOS-style "booking records inquiry" terminal: a searchable ledger of one Saturday's worth of arrests (Sat 12-02-1995), each row opening into a printout of the story. One new booking files every day at noon Eastern.

**2. Funniest / most impressive claim**
The charges. They're absurdly specific and bureaucratically dry:
- TAMMY JO CARTER — GRAND THEFT CART; VANDALISM; RELEASE OF LIVESTOCK
- PEAVEY, HARLAN — RECEIVING STOLEN PROPERTY (ONE PROSTHETIC LEG)
- BIANCHI, SAL — RUNNING A BOOK (ON THE COW)
- MARCUS TILLERY — ASSAULT WITH A FOWL; DISTURBING THE PEACE
- PETTIS, JORDAN — INTERFERING WITH A JAILER (HAIRCUT, UNSOLICITED, ON DWIGHT)
- DANNER, FLOYD — AGGRESSIVE LOITERING; UNAUTHORIZED SANDWICH DISTRIBUTION

The site's own framing: "Stay tuned in for more stories about small-town USA where kettle corn, cow manure, Garth Brooks, and Nirvana led to Tilt-A-Whirl fights and late-night lockups. Snapshots of life before Y2K." And the disclaimer footer: ALL PERSONS AND EVENTS ARE FICTION.

**3. Visual hook**
The terminal itself. `--blue: #0000aa` (MS-DOS BIOS blue) background, IBM VGA bitmap font, a `<pre>` ASCII banner spelling GRIME95!, a black ledger table with grey header bar, and a scanline CRT overlay. Plus the LINEPAINT contrast: the record printout is cream paper (`--paper: #f3f0e6`) with a green perforated tractor-feed bar (`--bar: #d5e6d3`) — the story physically printing out of the terminal. Accent palette: cyan `#00aaaa`, yellow `#ffff55`, light green `#55ff55`.

**4. What to show from the actual UI**
- The ledger table with real rows (names + charges) — the strongest video content.
- The FIND: search field (type a term, rows filter, matches highlight in yellow `<mark>`).
- The record printout: mugshot + the cream linepaper with the story text feeding out of a dot-matrix printer.
- The ASCII GRIME95! banner.

**5. Shortest satisfying video**
20 seconds. The concept needs: terminal boots (2s), ledger + a couple of killer charges land (6s), FIND interaction demonstrates it's live/functional (3s), one record prints its story — the payoff (5s), outro (2s). Anything shorter and the charges don't get read; the charges ARE the product.

**6. Tone**
- Preset: `yc-parody`
- Direction: **a 1995 government database access terminal that has been secretly serializing a comedy series for 313 episodes.** The joke is deadpan institutional seriousness applied to charges like "ASSAULT WITH A FOWL."
- Interpretation: austere, mechanical, official. No winking at the camera, no bouncy marketing energy. The comedy comes entirely from the copy — the terminal stays straight-faced. Pacing is steady and procedural. Typography stays locked to the VGA mono grid. Motion is crisp and functional, like a real terminal: rows and characters snap into place rather than spring around.

**7. Audio**
- Role: restrained institutional bed with mechanical accents. A low, steady bed that supports the "this is a serious government system" framing, with dry mechanical SFX (keypresses, a switch, a printer) landing on the real interactions.
- Music: `happy-beats-business-moves-vol-9` is too upbeat/cheerful for deadpan-institutional. Pick the most restrained/understated of the bundled tracks at composition time (Hyperframes chooses). Music sits LOW — it's a database terminal, not a launch event. Consider a bed that ducks under the printout moment.
- SFX: keypress/type ticks on the FIND typing, a click/switch on row select, a printer thunk + line-feed ticks as the story prints out, a single dry "announcement" hit on the final GRIME95 lockup. Restraint — this edit is copy-driven, not effects-driven.
- Audio-reactive: subtle. Let the scanline glow or the ledger cursor breathe very slightly with the music's low end. Nothing that looks like an equalizer.

**8. Share caption**
"A sheriff's booking terminal that turns out to be a comedy show. grime95! files one new small-town arrest every day at noon Eastern — 'grand theft cart,' 'assault with a fowl,' the whole beautiful county. All persons and events are fiction."

**9. User flow worth showing**
- entry: the ledger of the day's arrests loads
- key action: type into FIND — the live search filters rows and highlights the match
- result: open a record — the mugshot and the story print out on linepaper

That's a real working flow (this site has live search, sort, and a lineup view), so the video shows the product actually functioning, not just marketing.

---

## Tone notes (yc-parody, deadpan-institutional variant)

- Voice: official, procedural, zero wink. The terminal believes it is a county records system.
- Type: IBM VGA 8x16 bitmap glyphs. Everything uppercase in the ledger. `Courier Prime` for the printout prose (the only place mixed-case appears).
- Pacing: crisp, mechanical reveals — rows and characters snap in on a steady grid, no overshoot/spring. The terminal is fast but legible.
- Humor source: the copy only. Never a joke about the copy.
- Color discipline: BIOS blue + black ledger + grey, with cyan/yellow/lightgreen used as functional terminal accents (highlight, cursor, status). Cream linepaper is the one warm intrusion — it earns its contrast because it's the "paper coming out of the printer" payoff.

## Hook (first 2 seconds)

The terminal boots: a black screen, a fast command line / status flicker, then the blue BIOS field snaps on and the ASCII GRIME95! banner assembles character-by-character (or the tagline types out). Immediately signals "old government system," and the ASCII logo is the brand.

## Punchline / outro (final 2-3s)

The printout finishes feeding, and the dry institutional footer lands: "ALL PERSONS AND EVENTS ARE FICTION." then the GRIME95! lockup and "ONE NEW BOOKING FILED EVERY DAY AT 12:00 NOON EASTERN." The disclaimer as the final button is the joke — the site's seriousness is the punchline.

---

## Storyboard (total: 20.0s)

All timings in seconds. Landscape 1920x1080 (or Hyperframes default landscape).

**Scene 1 — BOOT (0.0 – 2.0, 2.0s)**
- Black screen. A cursor blinks, a status line types: `PONDER CO. SHERIFF'S DEPT. — BOOKING RECORDS INQUIRY`. The blue field floods in.
- Transition: hard snap to terminal (no fade — mechanical).
- SFX: a couple of keypresses; a low power-on thunk as the blue field appears.

**Scene 2 — THE LEDGER (2.0 – 8.0, 6.0s)**
- The GRIME95! ASCII banner assembles (2.0 – 3.0), tagline under it: `SMALL-TOWN STORIES FROM SATURDAY, DECEMBER 2, 1995`.
- The ledger table builds in — header bar (BKG NO / NAME / AKA / CHARGE / PRI), then rows fill top to bottom. Highlight 3 rows with their full charge lines readable (the killer charges): TAMMY JO CARTER / GRAND THEFT CART; VANDALISM; RELEASE OF LIVESTOCK · PEAVEY, HARLAN / RECEIVING STOLEN PROPERTY (ONE PROSTHETIC LEG) · MARCUS TILLERY / ASSAULT WITH A FOWL; DISTURBING THE PEACE.
- The cursor row settles on one. Rows hold long enough to read (~0.3s/word for the charge lines).
- SFX: row-snap clicks as rows fill; a soft switch on cursor settle.
- beat-grid: rows may tick in on consecutive beats; the cursor settle locks to a strong cue.

**Scene 3 — FIND (8.0 – 11.5, 3.5s)**
- The FIND: field. A search term types out (e.g. `COW`), rows filter live, and the matched term highlights in yellow `<mark>` on the surviving rows. Demonstrates the search is real.
- Status line updates: e.g. `2 RECORDS MATCH`.
- SFX: keypress ticks per character; a switch click on the filtered result.
- beat-grid: keystrokes land on the beat grid.

**Scene 4 — THE PRINTOUT (11.5 – 17.0, 5.5s)** — the payoff
- ENTER opens the selected record. The screen splits: mugshot on the left, and on the right a dot-matrix printer begins feeding cream linepaper with the green tractor bar.
- The story prints out line by line (Courier Prime). Use real Tammy Jo Carter copy (verbatim from the record):
  > "Tammy Jo Carter sat in the holding room, her sweater pristine despite the chaos she'd caused."
  > "You stole Billy Ray's nacho cart and drove it into the gazebo?"
  > "It was blocking the bingo hall. The ladies were restless."
- The linepaper + prose is the one warm, human moment — everything else is blue/black/grey.
- SFX: printer thunk as paper starts, line-feed ticks as each line prints. Final line lands on a strong cue.
- beat-locked: the paper starting to feed locks to a strong cue (the payoff).

**Scene 5 — OUTRO (17.0 – 20.0, 3.0s)**
- Printout settles. The dry footer types in: `ALL PERSONS AND EVENTS ARE FICTION.` then the GRIME95! lockup + `ONE NEW BOOKING FILED EVERY DAY AT 12:00 NOON EASTERN.`
- Music ducks/fades. A single dry logo hit on the lockup.
- Hold the lockup clean for the last beat.
- beat-locked: the disclaimer line / final lockup lands on a strong cue.

### Scene duration sum
2.0 + 6.0 + 3.5 + 5.5 + 3.0 = **20.0s** ✓ (within 15–25s)

## Reading-time floor check
- Charge lines (~10-14 words) hold ~3–4s within the ledger build. ✓
- Tagline (9 words) ~0.8s settled. ✓
- Printout prose shown 3 lines; each line ~0.9–1.2s as it prints, then holds together. ✓
- Footer + CTA (~10 words) ~1.2s settled. ✓

## Music cue guidance
- Cue source: choose the most restrained bundled track at composition time; read its cue preset from `<skill-dir>/assets/music/cues/` if a JSON/MD preset exists for the chosen track, otherwise detect cues at composition (any track supports beat sync — see references/audio.md).
- Lock 1–3 strong cues: (a) cursor settle in the ledger, (b) the printout paper starting to feed (the payoff), (c) the final lockup. Shift each reveal start within ±0.15s of its cue.
- Use the beat grid for sequential small events: ledger rows filling, FIND keystrokes, printout lines. Snap within ±0.10s. If beats are <0.6s apart and the items are readable text, snap to every other beat or hold the set — don't outrun reading.
- Music sits low throughout (institutional bed), ducks under the printout, fades under the outro.
