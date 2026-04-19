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
    iphoneTipShare: string;
    iphoneTipAdd: string;
  };
  game: {
    submit: string;
    clear: string;
    quitToMenu: string;
    noActiveGame: string;
    backToMenu: string;
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
      iphoneTipShare: "Share",
      iphoneTipAdd: "Add to Home Screen",
    },
    game: {
      submit: "Submit",
      clear: "Clear",
      quitToMenu: "Quit to menu",
      noActiveGame: "No active game.",
      backToMenu: "Back to menu",
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
      iphoneTipShare: "Teilen",
      iphoneTipAdd: "Zum Home-Bildschirm hinzufügen",
    },
    game: {
      submit: "Bestätigen",
      clear: "Auswahl löschen",
      quitToMenu: "Zum Menü",
      noActiveGame: "Kein aktives Spiel.",
      backToMenu: "Zurück zum Menü",
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
      iphoneTipShare: "Поделиться",
      iphoneTipAdd: "На экран «Домой»",
    },
    game: {
      submit: "Подтвердить",
      clear: "Снять выбор",
      quitToMenu: "В меню",
      noActiveGame: "Нет активной игры.",
      backToMenu: "В меню",
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
    },
  },
};
