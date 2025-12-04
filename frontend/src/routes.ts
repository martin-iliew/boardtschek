export const PARAMS = {
  GAME_ID: "gameId",
  QUERY: "query",
} as const;

export const ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/signup",
  LOGOUT: "/auth/logout",

  HOME: "/",
  SETTINGS: "/settings",
  SETTINGS_RENTS: "/settings/rents",

  GAMES: "/games",
  ADD_GAME: "/games/add",

  GAME_DETAILS: `/game/:${PARAMS.GAME_ID}`,
  EDIT_GAME: `/game/:${PARAMS.GAME_ID}/edit`,
  SEARCH: `/search/:${PARAMS.QUERY}`,

  RENT: "/rent",

  UNAUTHORIZED: "/unauthorized",
} as const;

const inject = (
  template: string,
  params: Record<string, string>
) => {
  return template.replace(/:([A-Za-z0-9_]+)/g, (_, key) => {
    if (!(key in params)) {
      throw new Error(`Missing route param: ${key}`);
    }
    return params[key];
  });
};

export const ROUTE_BUILDERS = {
  gameDetails: (gameId: string) =>
    inject(ROUTES.GAME_DETAILS, { [PARAMS.GAME_ID]: gameId }),

  editGame: (gameId: string) =>
    inject(ROUTES.EDIT_GAME, { [PARAMS.GAME_ID]: gameId }),

  search: (query: string) =>
    inject(ROUTES.SEARCH, { [PARAMS.QUERY]: encodeURIComponent(query) }),
};
