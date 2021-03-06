export const HOME_SCREEN = "Home",
  DECKS_SCREEN = "Decks",
  DEFAULT_SCREEN = HOME_SCREEN;

export type ParamList = {
  [HOME_SCREEN]: Record<string, unknown>;
  [DECKS_SCREEN]: Record<string, unknown>;
};

export const linking = {
  prefixes: ["https://quantu.app", "quantu://"],
  config: {
    screens: {
      [HOME_SCREEN]: "",
      [DECKS_SCREEN]: "/decks",
    },
  },
};
