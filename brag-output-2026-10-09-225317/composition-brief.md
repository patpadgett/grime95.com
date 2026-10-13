# Hyperframes Composition Brief: grime95!

## Objective
Create a short, deadpan-institutional launch brag for **grime95!** — a serialized small-town fiction site presented as a 1995 Ponder County sheriff's "booking records inquiry" DOS terminal. The tone is a straight-faced government database that is secretly a comedy series. The comedy lives entirely in the copy; the terminal stays serious.

## Output
- Composition directory: `brag-output-2026-10-09-225317/composition/`
- Rendered video: `brag-output-2026-10-09-225317/brag.mp4`
- Format: landscape (1920x1080 or Hyperframes landscape default)
- Duration: 20.0 seconds

## Source Material
- Project root: `/home/pat/impetus/2_PUBLISHED/grime95.com`
- Primary files read: `index.html`, `script.js`, `styles.css`, `content.json`, `rec/95-12-0007/index.html`
- Product name: **grime95!**
- Tagline / strongest claim: "SMALL-TOWN STORIES FROM SATURDAY, DECEMBER 2, 1995" / "One new booking is filed every day at 12:00 noon Eastern."
- Key UI moment to recreate: the ledger table (BKG NO / NAME / AKA / CHARGE / PRI) with real booking rows; the FIND: live search filtering + yellow `<mark>` highlight; and the record printout — mugshot beside cream linepaper feeding out of a dot-matrix printer with the story text.
- Copy that must appear verbatim (the product's real copy — these ARE the joke):
  - `PONDER CO. SHERIFF'S DEPT.` · `BOOKING RECORDS INQUIRY` · `TERM 03  SAT 12-02-1995`
  - `SMALL-TOWN STORIES FROM SATURDAY, DECEMBER 2, 1995`
  - Ledger header: `BKG NO  NAME  AKA  CHARGE  PRI`
  - `TAMMY JO CARTER — GRAND THEFT CART; VANDALISM; RELEASE OF LIVESTOCK`
  - `PEAVEY, HARLAN — RECEIVING STOLEN PROPERTY (ONE PROSTHETIC LEG)`
  - `MARCUS TILLERY — ASSAULT WITH A FOWL; DISTURBING THE PEACE`
  - Printout prose (Tammy Jo Carter record, verbatim): "Tammy Jo Carter sat in the holding room, her sweater pristine despite the chaos she'd caused." / "You stole Billy Ray's nacho cart and drove it into the gazebo?" / "It was blocking the bingo hall. The ladies were restless."
  - `ALL PERSONS AND EVENTS ARE FICTION.`
  - `ONE NEW BOOKING FILED EVERY DAY AT 12:00 NOON EASTERN.`

## Creative Direction
- Tone preset: **yc-parody** (deadpan-institutional variant)
- Direction: a 1995 government database access terminal that has been secretly serializing a comedy series. Zero wink; the system believes it is a county records system.
- Interpretation: austere, mechanical, official. Steady procedural pacing. Crisp snap-in motion (no springs/overshoot) — rows and characters land like a real terminal. Uppercase VGA mono everywhere except the printout prose (Courier Prime, mixed case) — the one warm human moment. Humor comes only from the charges and copy, never from motion or a joke about the copy.
- Angle: the ledger is the product and the charges are the punchline; FIND proves it's live; the printout is the emotional payoff (the "story" behind the absurd charge).
- Hook: terminal boots — black screen, a status line types, the BIOS-blue field floods in, the ASCII GRIME95! banner assembles. Signals "old government system" instantly.
- Outro / punchline: printout settles, then the dry footer lands: `ALL PERSONS AND EVENTS ARE FICTION.` → GRIME95! lockup + `ONE NEW BOOKING FILED EVERY DAY AT 12:00 NOON EASTERN.` The disclaimer as the final button is the joke.
- Avoid:
  - Generic SaaS language
  - Bouncy/marketing energy or winking at the camera
  - Spring/overshoot motion — keep it mechanical
  - Abstract filler — every frame is terminal UI

## Visual Identity (exact values from styles.css)
- Background (terminal field): `#0000aa` (BIOS blue)
- Ledger / panels: `#000000` black, header bar `#aaaaaa` grey, text `#ffffff` / `#aaaaaa`
- Accents (functional only): cyan `#00aaaa`, yellow `#ffff55` (the FIND `<mark>` highlight), light green `#55ff55`
- Printout paper: `#f3f0e6` cream, tractor bar `#d5e6d3` green, ink `#1c1a17` — the one warm intrusion, earned as "paper coming out of the printer"
- Display font: **IBM VGA 8x16 bitmap** (site preloads `assets/fonts/vga/IBMVGA8x16.woff2`; if unavailable, a crisp monospace like `Courier New`/`VT323`-style is the acceptable fallback — keep the bitmap-terminal feel). All ledger/terminal text uppercase.
- Body font (printout prose only): `Courier Prime` (fallback `Courier New`)
- Scanline CRT overlay: subtle repeating scanlines over the blue field (site has a `.crt` overlay).
- Visual references: the `<pre>` ASCII banner spelling GRIME95!, the black ledger table with grey header, the FIND field with blinking caret, the mugshot canvas + cream linepaper printout with green tractor-feed bar.

## Storyboard (creative contract — full detail in brag-plan.md)
1. **BOOT** — 0.0–2.0 (2.0s) — black screen, status line types, BIOS-blue field floods in.
2. **THE LEDGER** — 2.0–8.0 (6.0s) — ASCII GRIME95! banner assembles + tagline; ledger header + rows fill top-to-bottom; three killer charge rows readable; cursor settles on one.
3. **FIND** — 8.0–11.5 (3.5s) — type a term (e.g. `COW`) into FIND:, rows filter live, matched term highlights yellow, status updates.
4. **THE PRINTOUT** — 11.5–17.0 (5.5s) — ENTER opens the record: mugshot left, cream linepaper feeds out right, Tammy Jo Carter prose prints line by line.
5. **OUTRO** — 17.0–20.0 (3.0s) — `ALL PERSONS AND EVENTS ARE FICTION.` types in → GRIME95! lockup + the noon-Eastern line. Music fades, single dry logo hit.

Scene sum = 20.0s. Reading floor: charge lines ~3–4s, tagline ~0.8s settled, printout lines ~1s each then hold, footer ~1.2s settled.

## Audio
- Audio role: restrained institutional bed with dry mechanical accents. Music LOW throughout — this is a database terminal, not a launch event.
- Audio arc: quiet boot → steady low bed under the ledger → bed ducks under the printout → fade under the outro.
- Music: pick the most restrained/understated of the bundled `happy-beats-business-moves-*` tracks at composition time (avoid the most upbeat ones — the tone is deadpan, not cheerful). Copy the chosen file into `composition/assets/music/`.
- Music treatment: low volume, gentle fade-in from the boot, duck to ~0.5 under the printout, fade out over the final 1s.
- Music cue guidance: read the chosen track's cue preset from `<skill-dir>/assets/music/cues/` if a JSON/MD preset exists, else detect cues at composition (any track supports beat sync — see references/audio.md). Lock 1–3 strong cues: cursor settle (~7.5s), printout paper feed start (~11.5s), final lockup (~17.5s) — shift reveals within ±0.15s. Snap sequential small events (ledger rows, FIND keystrokes, printout lines) to consecutive beats within ±0.10s; if beats are <0.6s apart and the items are readable text, use every other beat or hold the set.
- Audio-reactive treatment: subtle only — let the scanline glow or ledger cursor breathe very slightly with the music's low end. No equalizer/waveform visuals, no musical-note graphics, no particles, no strobing.
- Audio-coupled moments:
  - FIND keystrokes — keypress SFX per character, snapped to the beat grid.
  - Ledger rows filling — soft row-snap clicks on the beat grid.
  - Printout paper feed — the payoff; printer thunk + line-feed ticks, paper start locks to a strong cue.
  - Final lockup — one dry announcement/logo hit over the faded music.
- SFX selection guidance: mechanical/terminal sounds — keypresses, switch/click on row select, printer thunk + line-feed ticks, one dry logo hit. Restraint — the edit is copy-driven, not effects-driven. Prefer lower high-frequency-risk files for repeated/polished moments (see `assets/sfx/sfx-analysis.md`). Fire SFX at the same timestamp as the visual.
- Exact SFX choice: Hyperframes chooses filenames, timestamps, density, and volume after the animation exists; copy selected SFX into `composition/assets/`.

## Hyperframes Instructions
Load the Hyperframes domain skills — `hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-cli`. /brag is its own workflow: do NOT enter the `hyperframes` entry-point intent interview or route into its generic promo/launch-video workflow. Prefer native Hyperframes conventions over anything in /brag.

Requirements:
- Show at least one real UI/copy/visual element from the source project (the ledger, the FIND interaction, the printout).
- Keep all text readable in the final render (charge lines, tagline, prose, footer all hold long enough).
- Keep the video within 20 seconds.
- Include the planned low music bed + mechanical SFX layer (audio is enabled).
- Treat /brag audio notes as guidance; choose exact SFX after the animation exists.
- Treat music cue metadata as optional timing hints; ignore cues that hurt readability or pacing. Use only 1–3 strong cue locks.
- Consider the audio-reactive workflow for a subtle low-end glow/scanline breathe; skip if extraction is unavailable (document it).
- Use local assets for audio/media (copy music + chosen SFX into `composition/assets/`).
- Run `npx hyperframes check` before render — brag's single gate (fix all errors, including WCAG contrast).
- Keep creation and rendering local.

## Grounding (factual claims on screen)
Every name, charge, tagline, and prose line above is quoted verbatim from the project (`index.html`, `content.json`, `rec/95-12-0007/`). The FIND term (`COW`) is a plausible search against real record data (Sal Bianchi, "RUNNING A BOOK (ON THE COW)"). No invented product claims — only framing/connective text is invented, and it asserts nothing about the product.
