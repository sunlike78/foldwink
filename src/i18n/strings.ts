export type Lang = "en" | "de" | "ru";

export const SUPPORTED_LANGS: Lang[] = ["en", "de", "ru"];

export interface Strings {
  menu: {
    subtitle: string;
    playDaily: string;
    replayDaily: string;
    easy: string;
    medium: string;
    mediumLocked: string;
    masterChallenge: string;
    masterLocked: string;
    masterSoon: string;
    stats: string;
    poolSize: (n: number) => string;
    emptyPool: string;
    emptyPoolDetail: string;
    iphoneTip: string;
    iphoneTipBody: string;
    languageAria: string;
  };
  game: {
    submit: string;
    clear: string;
    shuffle: string;
    quitToMenu: string;
    quitConfirm: string;
    oneAway: string;
    noActiveGame: string;
    backToMenu: string;
    mistakesLabel: string;
    mistakesAria: (used: number, max: number) => string;
    selectedAria: (n: number, max: number) => string;
  };
  difficulty: {
    easy: string;
    medium: string;
    hard: string;
  };
  mode: {
    daily: string;
    standard: string;
    replay: string;
  };
  tabs: {
    label: string;
    solvedCount: (n: number, total: number) => string;
    winkReady: string;
    winkUsed: string;
    winkShort: string;
    winkConfirm: string;
    solvedAria: (name: string) => string;
    winkedAria: (name: string) => string;
    clickAria: string;
    concealedAria: string;
    tabsHintAria: string;
  };
  result: {
    noResult: string;
    backToMenu: string;
    grade: string;
    newBest: (n: number) => string;
    closeOne: string;
    missedMsg: string;
    nextDaily: string;
    tryFresh: string;
    nextPuzzle: string;
    showStats: string;
    subtitleDaily: (date: string) => string;
    subtitleStandard: (n: number) => string;
  };
  resultSummary: {
    solved: string;
    outOfMistakes: string;
    cleared: string;
    closeCall: string;
    time: string;
    mistakes: string;
    streak: string;
  };
  stats: {
    subtitle: string;
    solved: string;
    played: string;
    winRate: string;
    wins: string;
    losses: string;
    streak: string;
    best: string;
    depth: string;
    flawless: string;
    avgMiss: string;
    medWinRate: string;
    winks: string;
    dailyHistory: string;
    emptyRecord: string;
    emptyRecordDetail: string;
    backToMenu: string;
  };
  daily: {
    label: string;
    solved: string;
    missed: string;
    nextDailyIn: string;
    noHistoryYet: string;
    solvedShort: string;
    failedShort: string;
  };
  share: {
    shareResult: string;
    preparing: string;
    copied: string;
    savedImage: string;
    unavailable: string;
    shareTextSolvedLine: (time: string, mistakes: number) => string;
    shareTextOutLine: (mistakes: number) => string;
    shareTextFooter: string;
  };
  readiness: {
    almostThere: string;
    moreEasyWins: (n: number) => string;
    warmingUp: string;
    mediumUnlocksAt: (current: number, target: number) => string;
    mediumReady: string;
    tabsFeelNatural: string;
    recommended: string;
    goodNextStep: string;
    mediumUnlocked: string;
    tryWhenReady: string;
    toughMediums: string;
    masterChallenge: string;
    masterLocked: string;
    hardComingSoon: string;
    moreMediumWins: (n: number) => string;
    youAreReady: string;
    slowerRevealsNoWink: string;
    toughStretch: string;
  };
  settings: {
    soundOn: string;
    soundOff: string;
    hapticsOn: string;
    hapticsOff: string;
  };
  about: {
    link: string;
    title: string;
    close: string;
    closeAria: string;
    bylineBy: string;
    bylineAfter: string;
    privacy: string;
    privacyBody: string;
    support: string;
    supportBody: string;
    clearEventLog: string;
    eventLogCleared: string;
    resetAll: string;
    resetArmed: string;
    resetAria: string;
  };
  onboarding: {
    howToPlay: string;
    tabsHint: string;
    rulePick: string;
    ruleEasy: string;
    ruleEasyBody: string;
    ruleMedium: string;
    ruleMediumBody: string;
    wink: string;
    ruleMaster: string;
    ruleMasterBody: string;
    gotIt: string;
    menuLink: string;
  };
}

export const strings: Record<Lang, Strings> = {
  en: {
    menu: {
      subtitle: "Find 4 hidden groups of 4 · 2–5 minutes",
      playDaily: "Play today's puzzle",
      replayDaily: "Replay daily",
      easy: "Easy puzzle",
      medium: "Medium puzzle",
      mediumLocked: "Medium — locked",
      masterChallenge: "Master Challenge",
      masterLocked: "Master Challenge — locked",
      masterSoon: "Master Challenge — soon",
      stats: "Stats",
      poolSize: (n) => `${n} puzzles`,
      emptyPool: "Empty pool",
      emptyPoolDetail:
        "No puzzles are bundled in this build. Drop JSON files into puzzles/pool/ and rebuild.",
      iphoneTip: "✦ iPhone tip",
      iphoneTipBody:
        "Tap Safari's Share button, then Add to Home Screen for a cleaner full-screen play.",
      languageAria: "Language",
    },
    game: {
      submit: "Submit",
      clear: "Clear",
      shuffle: "Shuffle",
      quitToMenu: "Quit to menu",
      quitConfirm: "Tap again to quit",
      oneAway: "One away",
      noActiveGame: "No active game.",
      backToMenu: "Back to menu",
      mistakesLabel: "Mistakes",
      mistakesAria: (u, m) => `Mistakes used ${u} of ${m}`,
      selectedAria: (n, m) => `Selected ${n} of ${m}`,
    },
    difficulty: {
      easy: "Easy",
      medium: "Medium",
      hard: "Master",
    },
    mode: {
      daily: "Daily",
      standard: "Standard",
      replay: "replay",
    },
    tabs: {
      label: "Foldwink Tabs",
      solvedCount: (n, t) => `${n}/${t} solved`,
      winkReady: "✦ wink ready",
      winkUsed: "✦ wink used",
      winkShort: "✦ wink",
      winkConfirm: "tap to confirm",
      solvedAria: (name) => `Solved category: ${name}`,
      winkedAria: (name) => `Winked category: ${name}`,
      clickAria: "Wink this tab to reveal the full category",
      concealedAria: "Concealed category preview",
      tabsHintAria: "Tabs hint the hidden categories",
    },
    result: {
      noResult: "No result.",
      backToMenu: "Back to menu",
      grade: "Grade",
      newBest: (n) => `✦ New best streak ${n}`,
      closeOne: "Close one",
      missedMsg: "Every good solver misses a puzzle.",
      nextDaily: "A new daily lands tomorrow.",
      tryFresh: "Try a fresh one — the pattern won't catch you twice.",
      nextPuzzle: "Next puzzle",
      showStats: "Stats",
      subtitleDaily: (d) => `Daily · ${d}`,
      subtitleStandard: (n) => `Standard · #${String(n).padStart(3, "0")}`,
    },
    resultSummary: {
      solved: "Solved",
      outOfMistakes: "Out of mistakes",
      cleared: "Foldwink · cleared",
      closeCall: "Foldwink · close call",
      time: "Time",
      mistakes: "Mistakes",
      streak: "Streak",
    },
    stats: {
      subtitle: "Your Foldwink record",
      solved: "Solved",
      played: "Played",
      winRate: "Win %",
      wins: "Wins",
      losses: "Losses",
      streak: "Streak",
      best: "Best",
      depth: "Depth",
      flawless: "Flawless",
      avgMiss: "Avg miss",
      medWinRate: "Med W%",
      winks: "Winks",
      dailyHistory: "Daily history",
      emptyRecord: "Empty record",
      emptyRecordDetail: "No puzzles played yet. Start with today's daily from the menu.",
      backToMenu: "Back to menu",
    },
    daily: {
      label: "Daily",
      solved: "solved",
      missed: "missed",
      nextDailyIn: "Next daily in",
      noHistoryYet: "No daily history yet. Solve today's puzzle to start.",
      solvedShort: "Solved",
      failedShort: "Failed",
    },
    share: {
      shareResult: "Share result",
      preparing: "Preparing…",
      copied: "Copied!",
      savedImage: "Saved image",
      unavailable: "Share unavailable",
      shareTextSolvedLine: (t, m) => `Solved in ${t} · ${m}/4 mistakes`,
      shareTextOutLine: (m) => `Out of mistakes · ${m}/4`,
      shareTextFooter: "neural-void.com/foldwink",
    },
    readiness: {
      almostThere: "Almost there",
      moreEasyWins: (n) => `${n} more easy ${n === 1 ? "win" : "wins"} unlocks Medium`,
      warmingUp: "Warming up",
      mediumUnlocksAt: (c, t) => `Medium unlocks at ${t} easy wins (${c}/${t})`,
      mediumReady: "Medium-ready",
      tabsFeelNatural: "Foldwink Tabs will feel natural",
      recommended: "Recommended",
      goodNextStep: "A Medium puzzle is a good next step",
      mediumUnlocked: "Medium unlocked",
      tryWhenReady: "Try one when ready",
      toughMediums: "Two tough mediums in a row — try a few more Easy puzzles first.",
      masterChallenge: "Master Challenge",
      masterLocked: "Master Challenge — locked",
      hardComingSoon: "Hard puzzles coming soon",
      moreMediumWins: (n) => `${n} more Medium ${n === 1 ? "win" : "wins"} to unlock`,
      youAreReady: "You're ready",
      slowerRevealsNoWink: "Slower reveals, no Wink",
      toughStretch: "Tough stretch — try a Medium to rebuild momentum.",
    },
    settings: {
      soundOn: "Sound on",
      soundOff: "Sound off",
      hapticsOn: "Haptics on",
      hapticsOff: "Haptics off",
    },
    about: {
      link: "About · Privacy",
      title: "About Foldwink",
      close: "close",
      closeAria: "Close about footer",
      bylineBy: "A small daily grouping puzzle by",
      bylineAfter:
        ". 16 cards, 4 hidden groups, 4 mistakes. Medium puzzles reveal their categories one letter at a time — tap once to Wink.",
      privacy: "Privacy",
      privacyBody:
        "No accounts, no tracking, no network. Your stats, streaks, sound preference, and an optional local-only event counter live in your browser's localStorage and never leave your device. Clearing your site data wipes everything.",
      support: "Support",
      supportBody: "Bug reports and feedback:",
      clearEventLog: "Clear local event log",
      eventLogCleared: "Local event log cleared",
      resetAll: "Reset all local data",
      resetArmed: "Tap again to reset all data — this clears stats, streak, progress",
      resetAria: "Reset all local Foldwink data",
    },
    onboarding: {
      howToPlay: "How to play",
      tabsHint: "Tabs hint the 4 hidden categories",
      rulePick: "Pick 4 cards that share a category. 4 mistakes and you're out.",
      ruleEasy: "Easy",
      ruleEasyBody: "— 16 cards, 4 groups, no tabs.",
      ruleMedium: "Medium",
      ruleMediumBody: "— tabs reveal letters as you solve. One free",
      wink: "✦ Wink",
      ruleMaster: "Master",
      ruleMasterBody: "— slower reveals, no Wink.",
      gotIt: "Got it",
      menuLink: "How to play",
    },
  },

  de: {
    menu: {
      subtitle: "Finde 4 versteckte Gruppen · 2–5 Minuten",
      playDaily: "Heutiges Rätsel spielen",
      replayDaily: "Tagesrätsel wiederholen",
      easy: "Leichtes Rätsel",
      medium: "Mittelschweres Rätsel",
      mediumLocked: "Mittel — gesperrt",
      masterChallenge: "Meister-Herausforderung",
      masterLocked: "Meister — gesperrt",
      masterSoon: "Meister — bald verfügbar",
      stats: "Statistik",
      poolSize: (n) => `${n} Rätsel`,
      emptyPool: "Kein Rätsel-Pool",
      emptyPoolDetail:
        "Keine Rätsel im Build. Lege JSON-Dateien in puzzles/pool/ ab und baue neu.",
      iphoneTip: "✦ iPhone-Tipp",
      iphoneTipBody:
        "Tippe in Safari auf Teilen und dann „Zum Home-Bildschirm“ für Vollbildspiel ohne Leiste.",
      languageAria: "Sprache",
    },
    game: {
      submit: "Bestätigen",
      clear: "Auswahl löschen",
      shuffle: "Mischen",
      quitToMenu: "Zum Menü",
      quitConfirm: "Nochmal tippen zum Beenden",
      oneAway: "Eins daneben",
      noActiveGame: "Kein aktives Spiel.",
      backToMenu: "Zurück zum Menü",
      mistakesLabel: "Fehler",
      mistakesAria: (u, m) => `${u} von ${m} Fehlern`,
      selectedAria: (n, m) => `${n} von ${m} ausgewählt`,
    },
    difficulty: {
      easy: "Leicht",
      medium: "Mittel",
      hard: "Meister",
    },
    mode: {
      daily: "Tagesrätsel",
      standard: "Standard",
      replay: "Wiederholung",
    },
    tabs: {
      label: "Foldwink Tabs",
      solvedCount: (n, t) => `${n}/${t} gelöst`,
      winkReady: "✦ Wink bereit",
      winkUsed: "✦ Wink verwendet",
      winkShort: "✦ Wink",
      winkConfirm: "tippen zum Bestätigen",
      solvedAria: (name) => `Gelöste Kategorie: ${name}`,
      winkedAria: (name) => `Verwinkte Kategorie: ${name}`,
      clickAria: "Tab antippen, um die Kategorie zu enthüllen",
      concealedAria: "Verborgene Kategorie",
      tabsHintAria: "Tabs geben Hinweise auf die Kategorien",
    },
    result: {
      noResult: "Kein Ergebnis.",
      backToMenu: "Zurück zum Menü",
      grade: "Bewertung",
      newBest: (n) => `✦ Neue Beststreak: ${n}`,
      closeOne: "Knapp daneben",
      missedMsg: "Jedem guten Spieler entgeht mal ein Rätsel.",
      nextDaily: "Morgen gibt es ein neues Tagesrätsel.",
      tryFresh: "Versuch ein neues — das Muster erwischt dich kein zweites Mal.",
      nextPuzzle: "Nächstes Rätsel",
      showStats: "Statistik",
      subtitleDaily: (d) => `Tagesrätsel · ${d}`,
      subtitleStandard: (n) => `Standard · #${String(n).padStart(3, "0")}`,
    },
    resultSummary: {
      solved: "Gelöst",
      outOfMistakes: "Keine Versuche mehr",
      cleared: "Foldwink · gelöst",
      closeCall: "Foldwink · knapp daneben",
      time: "Zeit",
      mistakes: "Fehler",
      streak: "Streak",
    },
    stats: {
      subtitle: "Deine Foldwink-Bilanz",
      solved: "Gelöst",
      played: "Gespielt",
      winRate: "Siege %",
      wins: "Siege",
      losses: "Verluste",
      streak: "Streak",
      best: "Beste",
      depth: "Tiefe",
      flawless: "Makellos",
      avgMiss: "Ø Fehler",
      medWinRate: "Mittel S%",
      winks: "Winks",
      dailyHistory: "Tagesrätsel-Verlauf",
      emptyRecord: "Noch leer",
      emptyRecordDetail:
        "Noch keine Rätsel gespielt. Starte mit dem heutigen Tagesrätsel aus dem Menü.",
      backToMenu: "Zurück zum Menü",
    },
    daily: {
      label: "Tagesrätsel",
      solved: "gelöst",
      missed: "verpasst",
      nextDailyIn: "Nächstes Tagesrätsel in",
      noHistoryYet:
        "Noch kein Verlauf. Löse das heutige Tagesrätsel, um zu starten.",
      solvedShort: "Gelöst",
      failedShort: "Verpasst",
    },
    share: {
      shareResult: "Ergebnis teilen",
      preparing: "Wird vorbereitet…",
      copied: "Kopiert!",
      savedImage: "Bild gespeichert",
      unavailable: "Teilen nicht verfügbar",
      shareTextSolvedLine: (t, m) => `Gelöst in ${t} · ${m}/4 Fehler`,
      shareTextOutLine: (m) => `Keine Versuche mehr · ${m}/4`,
      shareTextFooter: "neural-void.com/foldwink",
    },
    readiness: {
      almostThere: "Fast geschafft",
      moreEasyWins: (n) =>
        `Noch ${n} leichte${n === 1 ? "r Sieg" : " Siege"} bis Mittel freigeschaltet`,
      warmingUp: "Aufwärmen",
      mediumUnlocksAt: (c, t) => `Mittel ab ${t} leichten Siegen (${c}/${t})`,
      mediumReady: "Bereit für Mittel",
      tabsFeelNatural: "Foldwink Tabs werden sich vertraut anfühlen",
      recommended: "Empfohlen",
      goodNextStep: "Ein Mittel-Rätsel wäre der nächste Schritt",
      mediumUnlocked: "Mittel freigeschaltet",
      tryWhenReady: "Probier es, wenn du bereit bist",
      toughMediums:
        "Zwei zähe Mittel-Rätsel in Folge — spiel zuerst ein paar Leichte.",
      masterChallenge: "Meister-Herausforderung",
      masterLocked: "Meister — gesperrt",
      hardComingSoon: "Meister-Rätsel kommen bald",
      moreMediumWins: (n) =>
        `Noch ${n} Mittel-${n === 1 ? "Sieg" : "Siege"} bis zur Freischaltung`,
      youAreReady: "Du bist bereit",
      slowerRevealsNoWink: "Langsamere Hinweise, kein Wink",
      toughStretch:
        "Harte Phase — spiel ein Mittel-Rätsel, um Momentum zurückzugewinnen.",
    },
    settings: {
      soundOn: "Ton an",
      soundOff: "Ton aus",
      hapticsOn: "Vibration an",
      hapticsOff: "Vibration aus",
    },
    about: {
      link: "Über · Datenschutz",
      title: "Über Foldwink",
      close: "schließen",
      closeAria: "Über-Bereich schließen",
      bylineBy: "Ein kleines tägliches Gruppen-Rätsel von",
      bylineAfter:
        ". 16 Karten, 4 versteckte Gruppen, 4 Fehler. Mittel-Rätsel enthüllen Kategorien Buchstabe für Buchstabe — einmal antippen für Wink.",
      privacy: "Datenschutz",
      privacyBody:
        "Keine Konten, kein Tracking, keine Netzwerkanfragen. Deine Statistik, Streaks, Toneinstellungen und ein optionaler lokaler Ereigniszähler liegen nur im localStorage deines Browsers und verlassen dein Gerät nicht. Browser-Daten löschen entfernt alles.",
      support: "Support",
      supportBody: "Fehler und Feedback:",
      clearEventLog: "Lokalen Ereigniszähler löschen",
      eventLogCleared: "Ereigniszähler gelöscht",
      resetAll: "Alle lokalen Daten zurücksetzen",
      resetArmed: "Nochmal tippen zum Zurücksetzen — löscht Statistik, Streak, Fortschritt",
      resetAria: "Alle lokalen Foldwink-Daten zurücksetzen",
    },
    onboarding: {
      howToPlay: "So wird gespielt",
      tabsHint: "Tabs geben Hinweise auf die 4 versteckten Kategorien",
      rulePick: "Wähle 4 Karten mit gemeinsamer Kategorie. Nach 4 Fehlern ist Schluss.",
      ruleEasy: "Leicht",
      ruleEasyBody: "— 16 Karten, 4 Gruppen, keine Tabs.",
      ruleMedium: "Mittel",
      ruleMediumBody: "— Tabs enthüllen Buchstaben mit jedem Treffer. Ein kostenloser",
      wink: "✦ Wink",
      ruleMaster: "Meister",
      ruleMasterBody: "— langsamere Hinweise, kein Wink.",
      gotIt: "Verstanden",
      menuLink: "Spielregeln",
    },
  },

  ru: {
    menu: {
      subtitle: "Найди 4 скрытые группы · 2–5 минут",
      playDaily: "Играть сегодняшний пазл",
      replayDaily: "Повторить дневной",
      easy: "Лёгкий пазл",
      medium: "Средний пазл",
      mediumLocked: "Средний — заблокирован",
      masterChallenge: "Мастер-испытание",
      masterLocked: "Мастер — заблокирован",
      masterSoon: "Мастер — скоро",
      stats: "Статистика",
      poolSize: (n) => `${n} пазлов`,
      emptyPool: "Пул пуст",
      emptyPoolDetail:
        "В этой сборке нет пазлов. Добавь JSON-файлы в puzzles/pool/ и пересобери.",
      iphoneTip: "✦ Совет для iPhone",
      iphoneTipBody:
        "Нажми в Safari «Поделиться» и «На экран „Домой“» — будет чистый полноэкранный режим.",
      languageAria: "Язык",
    },
    game: {
      submit: "Подтвердить",
      clear: "Снять выбор",
      shuffle: "Перемешать",
      quitToMenu: "В меню",
      quitConfirm: "Нажми ещё раз, чтобы выйти",
      oneAway: "Одна мимо",
      noActiveGame: "Нет активной игры.",
      backToMenu: "В меню",
      mistakesLabel: "Ошибки",
      mistakesAria: (u, m) => `Использовано ошибок: ${u} из ${m}`,
      selectedAria: (n, m) => `Выбрано ${n} из ${m}`,
    },
    difficulty: {
      easy: "Лёгкий",
      medium: "Средний",
      hard: "Мастер",
    },
    mode: {
      daily: "Дневной",
      standard: "Стандарт",
      replay: "повтор",
    },
    tabs: {
      label: "Foldwink Tabs",
      solvedCount: (n, t) => `${n}/${t} решено`,
      winkReady: "✦ wink готов",
      winkUsed: "✦ wink использован",
      winkShort: "✦ wink",
      winkConfirm: "подтверди",
      solvedAria: (name) => `Решённая категория: ${name}`,
      winkedAria: (name) => `Подмигнутая категория: ${name}`,
      clickAria: "Нажми на вкладку, чтобы раскрыть категорию",
      concealedAria: "Скрытая категория",
      tabsHintAria: "Вкладки подсказывают скрытые категории",
    },
    result: {
      noResult: "Нет результата.",
      backToMenu: "В меню",
      grade: "Оценка",
      newBest: (n) => `✦ Новый рекорд серии: ${n}`,
      closeOne: "Почти!",
      missedMsg: "Даже опытные игроки иногда ошибаются.",
      nextDaily: "Новый дневной пазл появится завтра.",
      tryFresh: "Попробуй следующий — закономерность тебя не поймает дважды.",
      nextPuzzle: "Следующий пазл",
      showStats: "Статистика",
      subtitleDaily: (d) => `Дневной · ${d}`,
      subtitleStandard: (n) => `Стандарт · #${String(n).padStart(3, "0")}`,
    },
    resultSummary: {
      solved: "Решено",
      outOfMistakes: "Ошибки закончились",
      cleared: "Foldwink · пройдено",
      closeCall: "Foldwink · совсем рядом",
      time: "Время",
      mistakes: "Ошибки",
      streak: "Серия",
    },
    stats: {
      subtitle: "Твой рекорд Foldwink",
      solved: "Решено",
      played: "Сыграно",
      winRate: "% побед",
      wins: "Победы",
      losses: "Поражения",
      streak: "Серия",
      best: "Рекорд",
      depth: "Глубина",
      flawless: "Идеально",
      avgMiss: "Ср. ошибки",
      medWinRate: "% Средние",
      winks: "Winks",
      dailyHistory: "История дневных",
      emptyRecord: "Записей нет",
      emptyRecordDetail: "Пока не сыграно ни одного пазла. Начни с сегодняшнего дневного.",
      backToMenu: "В меню",
    },
    daily: {
      label: "Дневной",
      solved: "решено",
      missed: "пропущено",
      nextDailyIn: "Следующий дневной через",
      noHistoryYet: "История пуста. Реши сегодняшний пазл, чтобы начать.",
      solvedShort: "Решено",
      failedShort: "Провал",
    },
    share: {
      shareResult: "Поделиться",
      preparing: "Готовлю…",
      copied: "Скопировано!",
      savedImage: "Картинка сохранена",
      unavailable: "Поделиться недоступно",
      shareTextSolvedLine: (t, m) => `Решено за ${t} · ${m}/4 ошибок`,
      shareTextOutLine: (m) => `Ошибки закончились · ${m}/4`,
      shareTextFooter: "neural-void.com/foldwink",
    },
    readiness: {
      almostThere: "Почти",
      moreEasyWins: (n) =>
        `Ещё ${n} ${n === 1 ? "победа" : n < 5 ? "победы" : "побед"} на лёгком → средний`,
      warmingUp: "Разминка",
      mediumUnlocksAt: (c, t) => `Средний откроется после ${t} побед на лёгком (${c}/${t})`,
      mediumReady: "Готов к среднему",
      tabsFeelNatural: "Foldwink Tabs будут интуитивны",
      recommended: "Рекомендуем",
      goodNextStep: "Средний пазл — хороший следующий шаг",
      mediumUnlocked: "Средний открыт",
      tryWhenReady: "Попробуй, когда будешь готов",
      toughMediums:
        "Два тяжёлых средних подряд — попробуй сначала пару лёгких.",
      masterChallenge: "Мастер-испытание",
      masterLocked: "Мастер — заблокирован",
      hardComingSoon: "Мастер-пазлы скоро",
      moreMediumWins: (n) =>
        `Ещё ${n} ${n === 1 ? "победа" : n < 5 ? "победы" : "побед"} на среднем → разблокировка`,
      youAreReady: "Ты готов",
      slowerRevealsNoWink: "Медленные подсказки, без Wink",
      toughStretch:
        "Тяжёлая полоса — сыграй средний пазл, чтобы вернуть ритм.",
    },
    settings: {
      soundOn: "Звук вкл.",
      soundOff: "Звук выкл.",
      hapticsOn: "Вибро вкл.",
      hapticsOff: "Вибро выкл.",
    },
    about: {
      link: "О проекте · Приватность",
      title: "О Foldwink",
      close: "закрыть",
      closeAria: "Закрыть блок «О проекте»",
      bylineBy: "Маленькая ежедневная головоломка от",
      bylineAfter:
        ". 16 карточек, 4 скрытые группы, 4 ошибки. В средних пазлах категории раскрываются по букве — нажми один раз для Wink.",
      privacy: "Приватность",
      privacyBody:
        "Нет аккаунтов, трекинга и сети. Статистика, серии, настройки звука и опциональный локальный счётчик событий живут только в localStorage и не покидают устройство. Очистка данных сайта удалит всё.",
      support: "Поддержка",
      supportBody: "Баги и фидбек:",
      clearEventLog: "Очистить локальный лог событий",
      eventLogCleared: "Лог событий очищен",
      resetAll: "Сбросить все локальные данные",
      resetArmed: "Нажми ещё раз, чтобы сбросить всё — статистику, серию, прогресс",
      resetAria: "Сбросить все локальные данные Foldwink",
    },
    onboarding: {
      howToPlay: "Как играть",
      tabsHint: "Вкладки подсказывают 4 скрытые категории",
      rulePick: "Выбери 4 карточки одной категории. 4 ошибки — и ты выбываешь.",
      ruleEasy: "Лёгкий",
      ruleEasyBody: "— 16 карточек, 4 группы, без вкладок.",
      ruleMedium: "Средний",
      ruleMediumBody: "— вкладки открывают буквы по мере решения. Один бесплатный",
      wink: "✦ Wink",
      ruleMaster: "Мастер",
      ruleMasterBody: "— подсказки медленнее, Wink недоступен.",
      gotIt: "Понятно",
      menuLink: "Правила игры",
    },
  },
};
