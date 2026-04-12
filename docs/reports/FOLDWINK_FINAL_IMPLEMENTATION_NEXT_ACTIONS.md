# Foldwink Final Implementation — Next Actions

Top 12 next actions. Ordered. Concrete. No explanations.

1. Rewrite `index.html:14` and `:20` — remove all "anchor" references, rewrite as `"One Foldwink Tab Wink per medium puzzle. 2–5 minutes, daily."`
2. Rewrite `public/og.svg:24` — replace the "One anchor per medium puzzle" line with `"Foldwink Tabs reveal the categories"`
3. Rewrite `docs/PUZZLE_SCHEMA.md` — drop `AnchorTwist` / `Twist` / `twist` field; replace the medium example with a puzzle that has `revealHint` on every group; update the fairness checklist §6
4. Rename `CLAUDE.md` — replace every "Cluster Twist" with "Foldwink" and refresh the opening paragraphs to describe Foldwink Tabs + Wink
5. Add `0.3.2` and `0.3.3` sections to `docs/RELEASE_NOTES.md` covering the visual polish pass, the Phase 2 content expansion (73 → 98 puzzles), and the 0.3.3 closed-beta prep
6. Delete the duplicate cells in `StatsScreen.tsx` — remove `Unique` (:56) and `Win Rate` (:57), keep the 4 distinct cells only
7. Replace the inline guards in `store.ts:winkTab` (:293-297) with a call to `canWinkGroup` from `foldwinkTabs.ts`
8. Fix `FoldwinkTabs.tsx` — preserve the ✦ mark on a solved-winked tab (add `winked || solved` check)
9. Drop `dailyPlayedDate` from the store; derive it via selector from `todayDailyRecord?.date ?? null`
10. Extend `.gitignore` to cover `.tsbuildinfo-node/`, `tsconfig*.tsbuildinfo`, `audit-results/`, `*.zip`; delete `audit-results/`, `foldwink-audit-results.zip`, `README_START_HERE.md`, `FOLDWINK_MASTER_MEGA_PROMPT.md` from repo root
11. Rename `scripts/validate-puzzles.ts:2` header comment to "Foldwink puzzle validator"; delete the dead `editorialNotes?: string` field at `:29`
12. Run `npm run preview` and perform the full `docs/reports/FOLDWINK_MANUAL_QA_CHECKLIST.md` pass in a real browser on at least one phone-sized and one desktop-sized viewport before sending a single closed-beta invite
