/**
 * Generates a comprehensive manual QA Excel workbook for Foldwink.
 *
 * Usage: node scripts/generate-qa-excel.mjs
 * Output: docs/reports/FOLDWINK_MANUAL_QA.xlsx
 */

import ExcelJS from "exceljs";
import { join } from "path";

const OUT = join(process.cwd(), "docs/reports/FOLDWINK_MANUAL_QA.xlsx");

// ─── Color palette ───
const DARK_BG = "FF0F1115";
const SURFACE = "FF181B22";
const ACCENT = "FF7CC4FF";
const TEXT = "FFE8EAF0";
const MUTED = "FF8A8F9A";
const HEADER_BG = "FF22262F";
const SECTION_BG = "FF1E2230";
const PASS_BG = "FF1A3320";
const FAIL_BG = "FF331A1A";
const WARN_BG = "FF332E1A";

// ─── Test data ───
const sections = [
  {
    name: "DESKTOP BROWSER (Chrome / Firefox / Edge)",
    tests: [
      {
        id: "D-01",
        task: "App loads without console errors",
        action: "Open app in desktop browser (1280x800+), open DevTools Console",
        expected: "No errors in console, app renders with dark theme",
      },
      {
        id: "D-02",
        task: "Onboarding modal appears on first visit",
        action: "Clear localStorage, reload page",
        expected: "Modal with BrandMark, rules, Tabs demo, 'Got it' button",
      },
      {
        id: "D-03",
        task: "Onboarding explains Easy / Medium / Hard + Tabs + Wink",
        action: "Read onboarding content",
        expected: "3 difficulty tiers mentioned, Tabs + Wink explained, visual demo present",
      },
      {
        id: "D-04",
        task: "'Got it' dismisses onboarding, not shown on reload",
        action: "Click 'Got it', reload page",
        expected: "Onboarding gone, does not reappear",
      },
      {
        id: "D-05",
        task: "Menu shows all buttons: Daily, Easy, Medium, Master Challenge, Stats",
        action: "Look at menu after onboarding",
        expected:
          "All 5 buttons visible, Medium locked until 5 wins, Master locked until 3 medium wins",
      },
      {
        id: "D-06",
        task: "Easy puzzle starts and plays to completion",
        action: "Click 'Easy puzzle', play through (win or lose)",
        expected: "16 cards, select 4 + submit, groups lock in, result screen at end",
      },
      {
        id: "D-07",
        task: "Timer ticks during play",
        action: "Watch timer in header during game",
        expected: "Timer increments every second (0:00, 0:01, ...)",
      },
      {
        id: "D-08",
        task: "Mistake dots update on wrong guess",
        action: "Submit an incorrect group of 4",
        expected: "One dot fills/changes, mistake count increases",
      },
      {
        id: "D-09",
        task: "Grid shakes briefly on wrong guess",
        action: "Submit incorrect group, watch grid",
        expected: "Short horizontal shake animation",
      },
      {
        id: "D-10",
        task: "Solved cards show colour + shape marker",
        action: "Get a correct group",
        expected: "Cards lock with tinted background + shape marker (one of: ● ◆ ▲ ■)",
      },
      {
        id: "D-11",
        task: "Result screen shows grade + time + mistakes + groups",
        action: "Complete a game, check result screen",
        expected:
          "Grade card (flawless/clean/steady/clutch), time, mistakes count, all 4 groups revealed",
      },
      {
        id: "D-12",
        task: "Share button produces output",
        action: "Click 'Share result' on result screen",
        expected:
          "Clipboard notification, download dialog, or native share — any fallback is acceptable",
      },
      {
        id: "D-13",
        task: "Stats screen shows meaningful data after 2+ games",
        action: "Play 2+ games, open Stats",
        expected:
          "Played count, Win %, Wins/Losses, Streak, Depth section (flawless, avg mistakes, medium %)",
      },
      {
        id: "D-14",
        task: "Daily archive shows entry after solving today's daily",
        action: "Solve daily puzzle, go to Stats",
        expected: "Daily History section shows today's date + result",
      },
      {
        id: "D-15",
        task: "Sound plays after first card tap (not before)",
        action: "Load app, tap a card",
        expected: "No sound on page load. Soft tap sound on first card selection",
      },
      {
        id: "D-16",
        task: "Sound mute toggle works and persists",
        action: "Click sound toggle, reload",
        expected: "Mute state persists across reload",
      },
      {
        id: "D-17",
        task: "Reload mid-game restores session",
        action: "Start game, select 2 cards, reload page",
        expected: "Game screen restored with same puzzle",
      },
      {
        id: "D-18",
        task: "Arrow keys navigate between cards",
        action: "Focus a card, press arrow keys",
        expected: "Focus moves through the 4x4 grid",
      },
      {
        id: "D-19",
        task: "Tab/Enter/Space work for select and submit",
        action: "Tab to a card, press Enter/Space",
        expected: "Card toggles selection; Tab to Submit + Enter submits",
      },
      {
        id: "D-20",
        task: "About footer opens with Neural Void info",
        action: "Click 'About' at bottom of menu",
        expected: "Shows Neural Void, email, privacy note, 'Clear local data' button",
      },
      {
        id: "D-21",
        task: "No clipped text or horizontal overflow at 1280px+",
        action: "Check all screens at 1280px+ width",
        expected: "No text clipping, no horizontal scrollbar",
      },
    ],
  },
  {
    name: "MOBILE BROWSER (iPhone Safari / Android Chrome)",
    tests: [
      {
        id: "M-01",
        task: "App loads in portrait orientation",
        action: "Open app on phone in portrait",
        expected: "Full render, dark theme, no crash",
      },
      {
        id: "M-02",
        task: "Onboarding 'Got it' button reachable",
        action: "Clear data, open on phone (especially small phone)",
        expected: "'Got it' visible or reachable by scrolling inside modal",
      },
      {
        id: "M-03",
        task: "Cards large enough to tap without misfire",
        action: "Play an easy game, tap cards",
        expected: "Cards are at least ~44px in smallest dimension, taps register correctly",
      },
      {
        id: "M-04",
        task: "Sound plays after first tap (iOS AudioContext resume)",
        action: "Open on iPhone Safari, tap a card",
        expected: "Sound resumes from suspended state and plays",
      },
      {
        id: "M-05",
        task: "Tabs readable on small screen (Medium)",
        action: "Unlock Medium (5 easy wins), start Medium puzzle",
        expected: "Foldwink Tabs visible above grid, text readable",
      },
      {
        id: "M-06",
        task: "Timer visible in header",
        action: "Start a game, check header",
        expected: "Timer and mistake dots both visible without overlap",
      },
      {
        id: "M-07",
        task: "Share button works",
        action: "Complete a game, tap Share",
        expected: "Native share sheet, clipboard copy, or download — any fallback",
      },
      {
        id: "M-08",
        task: "No horizontal scroll",
        action: "Check all screens",
        expected: "No sideways scrolling on menu, game, result, or stats",
      },
      {
        id: "M-09",
        task: "Menu and result scrollable if content overflows",
        action: "Check menu and result screens",
        expected: "Vertical scroll works when content exceeds viewport",
      },
      {
        id: "M-10",
        task: "About footer opens and is readable",
        action: "Tap 'About' on menu",
        expected: "Footer content readable, email not clipped",
      },
    ],
  },
  {
    name: "PROGRESSION SYSTEM",
    tests: [
      {
        id: "P-01",
        task: "Fresh state: Medium shows 'Medium — locked'",
        action: "Clear all data, check menu",
        expected: "Medium button disabled, label says 'Medium — locked'",
      },
      {
        id: "P-02",
        task: "After 3 easy wins: nudge message appears",
        action: "Win 3 easy puzzles, check menu",
        expected: "Text near Medium: 'Almost there... 2 more easy wins unlocks Medium'",
      },
      {
        id: "P-03",
        task: "After 5 easy wins: Medium button enables",
        action: "Win 5 easy puzzles, check menu",
        expected: "Medium button active, can click to start Medium game",
      },
      {
        id: "P-04",
        task: "Medium readiness label shows correct level",
        action: "Check after 5+ easy wins with varying stats",
        expected:
          "Shows 'unlocked-weak' / 'recommended' / 'strong' based on win rate + mistakes",
      },
      {
        id: "P-05",
        task: "Medium puzzle has Foldwink Tabs",
        action: "Start a Medium puzzle",
        expected: "Row of 4 Tabs above grid, each showing masked hint (e.g. 'R····')",
      },
      {
        id: "P-06",
        task: "Tabs reveal one letter per correct solve",
        action: "Solve groups correctly in Medium",
        expected: "After each solve, unsolved tabs reveal one more letter",
      },
      {
        id: "P-07",
        task: "Wink works: tap an unsolved tab to reveal full category",
        action: "Start Medium, tap an unsolved tab",
        expected: "Tab shows full category label in accent colour, '✦ wink used' indicator",
      },
      {
        id: "P-08",
        task: "Only one Wink per puzzle",
        action: "Try tapping a second unsolved tab after using Wink",
        expected: "Second tab does NOT reveal — Wink already spent",
      },
      {
        id: "P-09",
        task: "After 2 consecutive Medium losses: fallback hint",
        action: "Lose 2 Medium puzzles in a row",
        expected: "Text: 'Two tough mediums in a row — try a few more Easy puzzles first'",
      },
      {
        id: "P-10",
        task: "Medium never re-locks after fallback",
        action: "After fallback hint, check Medium button",
        expected: "Still enabled — fallback is advisory only",
      },
      {
        id: "P-11",
        task: "After 3 medium wins: Master Challenge button enables",
        action: "Win 3 Medium puzzles",
        expected: "Master Challenge button active (if 20 hard puzzles exist — they do)",
      },
      {
        id: "P-12",
        task: "Hard puzzle: no Wink affordance",
        action: "Start a Master Challenge puzzle",
        expected: "Tabs visible but NO '✦ wink ready' indicator, no wink action",
      },
      {
        id: "P-13",
        task: "Hard puzzle: Tabs reveal at half-speed",
        action: "Solve groups in Hard, watch tabs",
        expected: "Tabs reveal fewer letters per stage than Medium (half-speed formula)",
      },
      {
        id: "P-14",
        task: "Hard fallback after 2 consecutive losses",
        action: "Lose 2 Hard puzzles in a row",
        expected: "Gentle nudge back toward Medium",
      },
    ],
  },
  {
    name: "SOUND QA (use scripts/preview-sounds.html)",
    tests: [
      {
        id: "S-01",
        task: "select cue",
        action: "Click 'select' button in preview, or tap a card in-game",
        expected: "Soft paper/card feel, short, not harsh or bright",
      },
      {
        id: "S-02",
        task: "deselect cue",
        action: "Click 'deselect' button, or deselect a card",
        expected: "Slightly duller than select, subtle difference",
      },
      {
        id: "S-03",
        task: "submit cue",
        action: "Click 'submit' button, or tap Submit in-game",
        expected: "Warm wood knock, not bright or clicky",
      },
      {
        id: "S-04",
        task: "wrong cue",
        action: "Click 'wrong' button, or submit incorrect group",
        expected: "Two muted knocks, NOT a harsh buzzer",
      },
      {
        id: "S-05",
        task: "correct cue",
        action: "Click 'correct' button, or solve a group",
        expected: "Three low settles (bone-on-wood), NOT a chime or fanfare",
      },
      {
        id: "S-06",
        task: "tabReveal cue",
        action: "Click 'tabReveal' button, or solve a group in Medium",
        expected: "Barely audible paper flip, very subtle",
      },
      {
        id: "S-07",
        task: "wink cue",
        action: "Click 'wink' button, or Wink a tab in Medium",
        expected: "Warm mid tone (280/210 Hz), NOT sparkly or bright",
      },
      {
        id: "S-08",
        task: "win cue",
        action: "Click 'win' button, or win a game",
        expected: "Four quiet settles, NOT a triumphant fanfare",
      },
      {
        id: "S-09",
        task: "loss cue",
        action: "Click 'loss' button, or lose a game",
        expected: "Low thud, somber but NOT punishing or harsh",
      },
      {
        id: "S-10",
        task: "Volume level feels right at default (0.42)",
        action: "Play a full game with default volume",
        expected: "Sounds are present but unobtrusive, not too loud or too quiet",
      },
      {
        id: "S-11",
        task: "Repetition tolerance — 5 easy puzzles in a row",
        action: "Play 5 easy puzzles consecutively",
        expected: "Sound does NOT become annoying or fatiguing after repeated exposure",
      },
      {
        id: "S-12",
        task: "Speakers vs headphones",
        action: "Listen to all cues on speakers, then headphones",
        expected: "No harsh frequencies, clipping, or unexpected behavior on either",
      },
    ],
  },
  {
    name: "SHARE CARD QA (use scripts/preview-share-cards.html)",
    tests: [
      {
        id: "SC-01",
        task: "Wordmark 'Foldwink' is centred and readable",
        action: "Open share card preview, inspect each card",
        expected: "Large 'Foldwink' text centred at top, clear font",
      },
      {
        id: "SC-02",
        task: "'BY NEURAL VOID' sublabel visible",
        action: "Check under wordmark",
        expected: "Smaller 'BY NEURAL VOID' text visible below wordmark",
      },
      {
        id: "SC-03",
        task: "Subtitle correct (Daily / Standard / Master)",
        action: "Check each card's subtitle line",
        expected: "Daily shows date, Standard shows #NNN, Master shows Master Challenge",
      },
      {
        id: "SC-04",
        task: "Result headline correct (Solved / Close call)",
        action: "Compare win and loss cards",
        expected: "Win cards show 'Solved', loss cards show 'Close call'",
      },
      {
        id: "SC-05",
        task: "Status line correct (time, mistakes, Wink/Hard)",
        action: "Check status row under headline",
        expected: "Time · Mistakes · Wink/No Wink (medium) or Hard (hard)",
      },
      {
        id: "SC-06",
        task: "Solved grid colours match tints",
        action: "Check the 4x4 grid area",
        expected: "Solved rows are yellow/green/pink/purple, unsolved are dark",
      },
      {
        id: "SC-07",
        task: "Footer reads 'neural-void.com/foldwink'",
        action: "Check bottom of each card",
        expected: "URL text centred at card bottom",
      },
      {
        id: "SC-08",
        task: "No text overlap or clipping on any card",
        action: "Inspect all 5 preview cards",
        expected: "All text clear, no collisions, proper spacing",
      },
      {
        id: "SC-09",
        task: "Card downloadable as PNG",
        action: "Click 'Download all as PNG'",
        expected: "5 PNG files download, each 1080x1080, clear quality",
      },
      {
        id: "SC-10",
        task: "In-game share produces same quality",
        action: "Win a game, click Share result",
        expected: "Copied/downloaded card matches preview quality",
      },
    ],
  },
  {
    name: "ITCH.IO SPECIFIC",
    tests: [
      {
        id: "I-01",
        task: "Zipped dist/ loads in itch.io draft",
        action:
          "Upload dist/foldwink-itch.zip to itch.io, set HTML/click-to-launch, open draft",
        expected: "Game loads inside itch.io player window",
      },
      {
        id: "I-02",
        task: "Game fills the launch window without clipping",
        action: "Check game layout inside itch.io player",
        expected: "No clipping, proper responsive fit",
      },
      {
        id: "I-03",
        task: "Sound resumes after first click",
        action: "Click inside itch.io player, tap a card",
        expected: "Sound plays after first user gesture",
      },
      {
        id: "I-04",
        task: "localStorage persists between sessions",
        action: "Play a game, close tab, reopen itch.io page",
        expected: "Stats and progress preserved",
      },
      {
        id: "I-05",
        task: "No broken asset paths",
        action: "Open DevTools Network tab in itch.io player",
        expected: "No 404s — favicon, manifest, CSS, JS all load",
      },
      {
        id: "I-06",
        task: "Share fallback works in iframe",
        action: "Win a game, click Share in itch.io player",
        expected: "Clipboard copy or download works (native share may be blocked by iframe)",
      },
    ],
  },
  {
    name: "VISUAL / AESTHETIC (human judgment only)",
    tests: [
      {
        id: "V-01",
        task: "Overall dark theme feels cohesive",
        action: "Browse all screens",
        expected: "Consistent dark palette, nothing jarring or out of place",
      },
      {
        id: "V-02",
        task: "Typography hierarchy is clear",
        action: "Check headings, body, labels across screens",
        expected: "Clear visual hierarchy: headings > body > labels > muted",
      },
      {
        id: "V-03",
        task: "Brand mark (2x2 tiles) looks intentional",
        action: "Check menu and stats screens",
        expected: "Small coloured tiles motif feels like a brand element, not placeholder",
      },
      {
        id: "V-04",
        task: "Accent colour (blue) used consistently",
        action: "Check buttons, links, Wink chip, accent bars",
        expected: "Same #7CC4FF accent across all surfaces",
      },
      {
        id: "V-05",
        task: "Solved group colours are distinguishable",
        action: "Complete a puzzle, check all 4 group colours",
        expected:
          "Yellow, green, pink, purple — all distinguishable from each other and from background",
      },
      {
        id: "V-06",
        task: "Animations feel subtle, not distracting",
        action: "Play through a game, watch for motion",
        expected: "Card press, shake, tab reveal, result pop — all brief and subtle",
      },
      {
        id: "V-07",
        task: "Menu screen looks inviting, not cluttered",
        action: "Check menu on desktop and mobile",
        expected: "Clear call to action, not too many elements competing",
      },
      {
        id: "V-08",
        task: "Result screen feels satisfying (win) or fair (loss)",
        action: "Win and lose a game, check result screens",
        expected:
          "Win: positive grade + streak. Loss: 'Close one' + encouragement, not punishing",
      },
    ],
  },
  {
    name: "EDGE CASES / REGRESSION",
    tests: [
      {
        id: "E-01",
        task: "Daily replay shows '· replay' and doesn't count to stats",
        action: "Solve daily, play again",
        expected: "Header shows '· replay', stats unchanged after replay",
      },
      {
        id: "E-02",
        task: "Standard wraps at end of pool",
        action: "Play through all puzzles in a tier (or set cursor near end)",
        expected: "After last puzzle, wraps to start — no crash",
      },
      {
        id: "E-03",
        task: "Quit to menu mid-game drops attempt silently",
        action: "Start game, click 'Quit to menu'",
        expected: "Returns to menu, no stats change, no error",
      },
      {
        id: "E-04",
        task: "Clear local data works",
        action: "Click 'About' → 'Clear local data'",
        expected: "Stats reset, progress reset, onboarding reappears on next load",
      },
      {
        id: "E-05",
        task: "Long item names don't break layout",
        action: "Play puzzles with longer card text",
        expected: "Text fits or wraps gracefully inside cards",
      },
      {
        id: "E-06",
        task: "Multiple rapid card taps don't break selection",
        action: "Tap 6+ cards very quickly",
        expected: "Only 4 selected (max), no duplicates, no crash",
      },
      {
        id: "E-07",
        task: "Double-tap Submit doesn't double-count",
        action: "Select 4 cards, rapidly tap Submit twice",
        expected: "Only one submission processed",
      },
      {
        id: "E-08",
        task: "Back/forward browser buttons don't break state",
        action: "Use browser back/forward during game or on result",
        expected: "App stays functional, no white screen",
      },
    ],
  },
];

async function generate() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Foldwink QA";
  wb.created = new Date();

  // ─── Summary sheet ───
  const summary = wb.addWorksheet("Summary", {
    properties: { tabColor: { argb: ACCENT } },
  });
  summary.columns = [
    { header: "Section", key: "section", width: 45 },
    { header: "Total Tests", key: "total", width: 14 },
    { header: "Pass", key: "pass", width: 10 },
    { header: "Fail", key: "fail", width: 10 },
    { header: "Skip", key: "skip", width: 10 },
    { header: "Notes", key: "notes", width: 50 },
  ];
  styleHeader(summary, 1);

  let totalTests = 0;
  for (const s of sections) {
    const row = summary.addRow({
      section: s.name,
      total: s.tests.length,
      pass: "",
      fail: "",
      skip: "",
      notes: "",
    });
    styleDataRow(row);
    totalTests += s.tests.length;
  }
  const totalRow = summary.addRow({
    section: "TOTAL",
    total: totalTests,
    pass: "",
    fail: "",
    skip: "",
    notes: "",
  });
  totalRow.font = { bold: true, color: { argb: TEXT }, size: 11 };
  totalRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: SECTION_BG } };

  summary.addRow({});
  const metaRows = [
    ["Tester name:", ""],
    ["Date:", ""],
    ["Device (desktop):", ""],
    ["Device (mobile):", ""],
    ["Browser:", ""],
    ["App version:", "0.6.1"],
    ["App URL:", ""],
    ["Overall verdict:", "READY / NOT READY"],
  ];
  for (const [label, val] of metaRows) {
    const r = summary.addRow({ section: label, total: val });
    r.getCell(1).font = { bold: true, color: { argb: MUTED }, size: 10 };
    r.getCell(2).font = { color: { argb: TEXT }, size: 10 };
  }

  // ─── Test sheets ───
  for (const s of sections) {
    const cleanName = s.name.replace(/[*?:\\/\[\]]/g, "-");
    const shortName = cleanName.length > 31 ? cleanName.substring(0, 28) + "..." : cleanName;
    const ws = wb.addWorksheet(shortName, {
      properties: { tabColor: { argb: HEADER_BG } },
    });

    ws.columns = [
      { header: "ID", key: "id", width: 8 },
      { header: "Test", key: "task", width: 42 },
      { header: "Action / How to Test", key: "action", width: 50 },
      { header: "Expected Result", key: "expected", width: 50 },
      { header: "Status\n(PASS/FAIL/SKIP)", key: "status", width: 18 },
      { header: "Your Notes / Actual Result", key: "result", width: 55 },
      { header: "Screenshot?", key: "screenshot", width: 14 },
    ];

    styleHeader(ws, 1);
    ws.getRow(1).height = 30;

    for (const t of s.tests) {
      const row = ws.addRow({
        id: t.id,
        task: t.task,
        action: t.action,
        expected: t.expected,
        status: "",
        result: "",
        screenshot: "",
      });
      styleDataRow(row);
      row.height = 36;

      // Wrap text in action and expected columns
      row.getCell(2).alignment = { wrapText: true, vertical: "top" };
      row.getCell(3).alignment = { wrapText: true, vertical: "top" };
      row.getCell(4).alignment = { wrapText: true, vertical: "top" };
      row.getCell(6).alignment = { wrapText: true, vertical: "top" };

      // Status column — dropdown validation
      row.getCell(5).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: ['"PASS,FAIL,SKIP"'],
      };
      row.getCell(5).alignment = { horizontal: "center", vertical: "middle" };

      // Empty result column — highlight for input
      row.getCell(6).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1A1D24" },
      };
      row.getCell(6).border = {
        left: { style: "thin", color: { argb: ACCENT } },
      };
    }

    // Conditional formatting note at bottom
    ws.addRow({});
    const noteRow = ws.addRow({
      id: "",
      task: "Fill Status column with PASS / FAIL / SKIP. Write observations in 'Your Notes' column.",
      action: "",
      expected: "",
      status: "",
      result: "",
    });
    noteRow.getCell(2).font = { italic: true, color: { argb: MUTED }, size: 9 };
  }

  await wb.xlsx.writeFile(OUT);
  console.log(`Generated: ${OUT}`);
  console.log(`Total: ${sections.length} sections, ${totalTests} tests`);
}

function styleHeader(ws, rowNum) {
  const row = ws.getRow(rowNum);
  row.font = { bold: true, color: { argb: ACCENT }, size: 11 };
  row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER_BG } };
  row.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  row.height = 24;
}

function styleDataRow(row) {
  row.font = { color: { argb: TEXT }, size: 10 };
  row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: SURFACE } };
  for (let i = 1; i <= row.cellCount; i++) {
    row.getCell(i).border = {
      bottom: { style: "thin", color: { argb: HEADER_BG } },
    };
  }
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
