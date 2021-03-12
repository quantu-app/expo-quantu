export const HOME_SCREEN = "Home",
  DECKS_SCREEN = "Decks",
  DECK_EDIT_SCREEN = "Edit Deck",
  QUESTION_EDIT_SCREEN = "Edit Question",
  DEFAULT_SCREEN = HOME_SCREEN;

export type ParamList = {
  [HOME_SCREEN]: Record<string, unknown>;
  [DECKS_SCREEN]: Record<string, unknown>;
  [DECK_EDIT_SCREEN]: {
    deckId: string;
  };
  [QUESTION_EDIT_SCREEN]: {
    deckId: string;
    questionId: string;
  };
};

export const linking = {
  prefixes: ["https://quantu.app", "quantu://"],
  config: {
    screens: {
      [HOME_SCREEN]: "",
      [DECKS_SCREEN]: "/decks",
      [DECK_EDIT_SCREEN]: "/decks/:deckId/edit",
      [QUESTION_EDIT_SCREEN]: "/decks/:deckId/questions/:questionId/edit",
    },
  },
};
