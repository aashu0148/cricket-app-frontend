export const espnOrigin = "https://espncricinfo.com";

export const applicationRoutes = {
  home: "/",
  landing: "/",
  auth: "/auth",
  tournaments: "/tournaments",
  profile: "/profile",
  adminTournament: "/admin/tournament",
  scoringSystem: "/admin/scoringSystem",
  editScoringSystem: (scoringId = "") => `/admin/editScoringSystem/${scoringId || ":scoringId"}`,

  // function routes
  leagues: (tid = "") => `/tournaments/${tid || ":tournamentId"}/leagues`,
  league: (tournamentId = "", leagueId = "") =>
    `/tournaments/${tournamentId || ":tournamentId"}/leagues/${
      leagueId || ":leagueId"
    }`,
  draftRound: (tournamentId = "", leagueId = "") =>
    `/tournaments/${tournamentId || ":tournamentId"}/leagues/${
      leagueId || ":leagueId"
    }/draft-round`,
};

const commonColors = {
  red: "#fa3f35",
  green: "#33be2c",
  secondary: "#e2458b",
  primaryGradient: `linear-gradient(
  90deg,
  #e2458b 0%,
  #e2458b 0%,
  #ff914d 100%
)`,
  primary: "#11c9bb",
  primary2: "#7bc911",
  primary2_100: "#f6ffe9",
  primary2_200: "#f0ffdc",
  primary_100: "#effffe",
  primary_200: "#dafffd",
  primary_300: "#9afffa",
};

export const colors = {
  ...commonColors,
  black2: "#2d323a",
  gray: "#718096",
  bluishWhite: "#f1f8ff",
  white1: "#fafafa",
  white2: "#f0f0f3",
  lightPrimary: "#7088eb",

  heading: "#040406",
  title: "#040406",
  label: "#718096",
  desc: "#383b3e",
  button: "#fefefe",
  bg: "#fefefe",
  "bg-100": "#fafafa",
  "bg-200": "#f3f0f3",
  "bg-300": "#bcbcbc",
};
