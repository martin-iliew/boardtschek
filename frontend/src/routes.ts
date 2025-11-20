export const ROUTES = {
  ROOT: "/",

  LOGIN: "/auth/log-in",
  REGISTER: "/auth/create-account",
  LOGOUT: "/auth/log-out",

  HOME: "/home",
  SETTINGS: "/settings",
  SETTINGS_RENTS: "/settings/rents",

  GAMES: "/games",
  ADD_GAME: "/add-game",
  EDIT_GAME: "/edit-game/:id",
  GAME_DETAILS: "/game/:id",
  SEARCH: "/search/:query",

  EDIT_GAME_BUILD: (id: string | number) => `/edit-game/${id}`,
  GAME_DETAILS_BUILD: (id: string | number) => `/game/${id}`,
  SEARCH_BUILD: (query: string) => `/search/${encodeURIComponent(query)}`,
};
